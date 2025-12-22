import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import Footer from '@/components/Footer';
import CartSidebar, { CartItem } from '@/components/CartSidebar';
import AuthModal from '@/components/AuthModal';
import MobileMenu from '@/components/MobileMenu';
import { Product } from '@/components/ProductCard';
import { clothingProducts, ornamentProducts } from '@/data/products';

const Index = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const handleAddToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });

    toast({
      title: "Added to bag!",
      description: `${product.name} has been added to your bag.`,
    });

    // Open cart after adding
    setTimeout(() => setIsCartOpen(true), 300);
  }, [toast]);

  const handleUpdateQuantity = useCallback((id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  }, []);

  const handleRemoveItem = useCallback((id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast({
      title: "Item removed",
      description: "The item has been removed from your bag.",
    });
  }, [toast]);

  const handleCheckout = useCallback(() => {
    toast({
      title: "Proceeding to checkout",
      description: "Redirecting to secure checkout...",
    });
    setIsCartOpen(false);
  }, [toast]);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onAuthClick={() => setIsAuthOpen(true)}
        onMenuClick={() => setIsMenuOpen(true)}
      />

      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Features Bar */}
        <FeaturesSection />

        {/* Clothing Section */}
        <ProductGrid
          title="Three-Piece Suites"
          subtitle="Exclusive Collection"
          products={clothingProducts}
          type="clothing"
          onAddToCart={handleAddToCart}
        />

        {/* About Section */}
        <AboutSection />

        {/* Ornaments Section */}
        <ProductGrid
          title="Handcrafted Ornaments"
          subtitle="Timeless Jewelry"
          products={ornamentProducts}
          type="ornament"
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Flying Cart Animation Container */}
      <AnimatePresence>
        {/* This would contain flying product animations */}
      </AnimatePresence>
    </div>
  );
};

export default Index;
