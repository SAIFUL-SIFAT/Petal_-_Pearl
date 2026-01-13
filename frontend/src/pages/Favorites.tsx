import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/hooks/use-cart';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';
import MobileMenu from '@/components/MobileMenu';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const Favorites = () => {
    const { wishlist } = useWishlist();
    const { addToCart, items, cartCount, updateQuantity, removeItem, handleCheckout } = useCart();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
            <Navbar
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onAuthClick={() => { }}
                onMenuClick={() => setIsMobileMenuOpen(true)}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={items}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckout}
            />
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <main className="pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto min-h-[60vh]">
                {/* Return to Home Link */}
                <Link to="/">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 mb-8 px-4 py-3 bg-[#1a3a2e] text-[#a8c5b8] hover:bg-[#234438] transition-colors rounded-lg cursor-pointer"
                    >
                        <ArrowLeft size={18} />
                        <span className="text-sm font-medium">Return to Home</span>
                    </motion.div>
                </Link>

                <div className="flex flex-col items-center mb-12">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-accent uppercase tracking-[0.2em] text-sm mb-4"
                    >
                        Your Curated Collection
                    </motion.span>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="font-serif text-4xl md:text-5xl text-center"
                    >
                        Favorites
                    </motion.h1>
                </div>

                {wishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-muted-foreground text-lg mb-6">Your wishlist is currently empty.</p>
                        <a href="/" className="bg-accent text-accent-foreground px-8 py-3 rounded-full uppercase tracking-wider text-sm font-semibold hover:bg-white hover:text-black transition-colors">
                            Start Shopping
                        </a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlist.map((product, index) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                index={index}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}
            </main>
            {/* 
            <Footer /> */}
        </div>
    );
};

export default Favorites;
