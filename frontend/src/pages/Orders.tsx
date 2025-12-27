import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, MapPin, Calendar, CreditCard, Eye, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { orderApi } from '@/api/services';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface Order {
    id: number;
    items: OrderItem[];
    totalAmount: number;
    status: string;
    shippingAddress: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod: string;
    createdAt: string;
}

const Orders = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { toast } = useToast();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await orderApi.getByUser(user.id);
                setOrders(response.data);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load orders",
                    variant: "destructive",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user, navigate, toast]);

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            processing: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
            cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
        };
        return colors[status] || colors.pending;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-accent animate-pulse text-xl">Loading orders...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Back to Home
                </button>

                <div className="mb-8">
                    <h1 className="font-serif text-4xl mb-2">My Orders</h1>
                    <p className="text-muted-foreground">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-card p-12 rounded-2xl border border-border text-center">
                        <Package className="mx-auto mb-4 text-muted-foreground" size={64} />
                        <h2 className="text-2xl font-serif mb-2">No orders yet</h2>
                        <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                        <button
                            onClick={() => navigate('/')}
                            className="btn-luxury bg-accent text-accent-foreground"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-card p-6 rounded-2xl border border-border"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <div>
                                        <h3 className="text-xl font-serif mb-1">Order #{order.id}</h3>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar size={16} />
                                            {formatDate(order.createdAt)}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                        <button
                                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                                            className="flex items-center gap-2 text-accent hover:text-accent/80 transition-colors"
                                        >
                                            <Eye size={18} />
                                            {selectedOrder?.id === order.id ? 'Hide' : 'View'} Details
                                        </button>
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                    {order.items.slice(0, 4).map((item, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                    {order.items.length > 4 && (
                                        <div className="flex items-center justify-center text-muted-foreground text-sm">
                                            +{order.items.length - 4} more
                                        </div>
                                    )}
                                </div>

                                {/* Expanded Details */}
                                {selectedOrder?.id === order.id && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="border-t border-border pt-6 space-y-4"
                                    >
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <MapPin size={18} className="text-accent" />
                                                    Shipping Address
                                                </h4>
                                                <p className="text-sm text-muted-foreground whitespace-pre-line">
                                                    {order.shippingAddress}
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                    <CreditCard size={18} className="text-accent" />
                                                    Payment Method
                                                </h4>
                                                <p className="text-sm text-muted-foreground capitalize">
                                                    {order.paymentMethod.replace(/_/g, ' ')}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="font-semibold mb-3">All Items</h4>
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex gap-4 bg-background p-3 rounded-lg">
                                                        <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium">{item.name}</p>
                                                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                                                            <p className="text-sm text-accent font-semibold">৳{(item.price * item.quantity).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Total */}
                                <div className="flex justify-between items-center pt-4 border-t border-border">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="text-2xl font-bold text-accent">৳{order.totalAmount.toLocaleString()}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Orders;
