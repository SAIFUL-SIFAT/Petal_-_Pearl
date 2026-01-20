import { useState } from 'react';
import Navbar from './Navbar';
import MobileMenu from './MobileMenu';
import AuthModal from './AuthModal';
import CartSidebar from './CartSidebar';
import Footer from './Footer';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/hooks/use-cart';

interface PageLayoutProps {
    children: React.ReactNode;
    showFooter?: boolean;
}

const PageLayout = ({ children, showFooter = true }: PageLayoutProps) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showGuestInAuth, setShowGuestInAuth] = useState(false);
    const { isAuthenticated } = useAuth();
    const {
        cartItems,
        cartCount,
        isCartOpen,
        setIsCartOpen,
        updateQuantity,
        removeItem,
        handleCheckout
    } = useCart();

    const handleCheckoutClick = () => {
        if (!isAuthenticated) {
            setShowGuestInAuth(true);
            setIsAuthOpen(true);
            return;
        }
        handleCheckout();
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar
                cartCount={cartCount}
                onCartClick={() => setIsCartOpen(true)}
                onAuthClick={() => setIsAuthOpen(true)}
                onMenuClick={() => setIsMenuOpen(true)}
            />

            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => {
                    setIsAuthOpen(false);
                    setShowGuestInAuth(false);
                }}
                showGuestOption={showGuestInAuth}
                onContinueAsGuest={handleCheckout}
            />

            <CartSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                items={cartItems}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onCheckout={handleCheckoutClick}
            />

            <main>{children}</main>

            {showFooter && <Footer />}
        </div>
    );
};

export default PageLayout;
