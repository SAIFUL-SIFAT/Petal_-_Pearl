import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, MapPin, User, Mail, Phone, CreditCard, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import api from '@/api/axios';

const Checkout = () => {
    const navigate = useNavigate();
    const { items, clearCart } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '',
        shippingAddress: '',
        paymentMethod: 'cash_on_delivery',
    });

    const [isProcessing, setIsProcessing] = useState(false);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 5000 ? 0 : 120;
    const total = subtotal + shippingFee;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            const orderData = {
                ...formData,
                items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                userId: user?.id || 1,
            };

            await api.post('/orders', orderData);

            toast({
                title: "Order Placed Successfully!",
                description: "Thank you for your purchase. We'll send you a confirmation email shortly.",
            });

            clearCart();
            navigate('/');
        } catch (error: any) {
            toast({
                title: "Order Failed",
                description: error.response?.data?.message || "Something went wrong. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="mx-auto mb-4 text-muted-foreground" size={64} />
                    <h2 className="text-2xl font-serif mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-6">Add some items to proceed to checkout</p>
                    <button
                        onClick={() => navigate('/')}
                        className="btn-luxury bg-accent text-accent-foreground"
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back
                </button>

                <h1 className="font-serif text-4xl mb-8">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Information */}
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                                    <User size={24} className="text-accent" />
                                    Customer Information
                                </h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="customerName"
                                            value={formData.customerName}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-accent outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="customerEmail"
                                            value={formData.customerEmail}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-accent outline-none transition-all"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="customerPhone"
                                            value={formData.customerPhone}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-accent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                                    <MapPin size={24} className="text-accent" />
                                    Shipping Address
                                </h2>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    required
                                    rows={4}
                                    placeholder="Enter your complete shipping address"
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-accent outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Payment Method */}
                            <div className="bg-card p-6 rounded-2xl border border-border">
                                <h2 className="font-serif text-2xl mb-4 flex items-center gap-2">
                                    <CreditCard size={24} className="text-accent" />
                                    Payment Method
                                </h2>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleInputChange}
                                    className="w-full bg-background border border-border rounded-xl py-3 px-4 focus:border-accent outline-none transition-all"
                                >
                                    <option value="cash_on_delivery">Cash on Delivery</option>
                                    <option value="bkash">bKash</option>
                                    <option value="nagad">Nagad</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={isProcessing}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full btn-luxury bg-accent text-accent-foreground py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                            </motion.button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-card p-6 rounded-2xl border border-border sticky top-24">
                            <h2 className="font-serif text-2xl mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6">
                                {items.map((item) => (
                                    <div key={item.id} className="flex gap-3">
                                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            <p className="text-sm text-accent font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2 border-t border-border pt-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>৳{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Shipping</span>
                                    <span className={shippingFee === 0 ? 'text-accent' : ''}>
                                        {shippingFee === 0 ? 'Free' : `৳${shippingFee}`}
                                    </span>
                                </div>
                                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                                    <span>Total</span>
                                    <span className="text-accent">৳{total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
