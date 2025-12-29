import React, { createContext, useContext, useState } from 'react';
import { Product } from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { useCart } from '@/hooks/use-cart';

interface QuickViewContextType {
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const QuickViewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();

    const openQuickView = (product: Product) => {
        setSelectedProduct(product);
    };

    const closeQuickView = () => {
        setSelectedProduct(null);
    };

    return (
        <QuickViewContext.Provider value={{ openQuickView, closeQuickView }}>
            {children}
            <QuickViewModal
                isOpen={!!selectedProduct}
                onClose={closeQuickView}
                product={selectedProduct}
                onAddToCart={addToCart}
            />
        </QuickViewContext.Provider>
    );
};

export const useQuickView = () => {
    const context = useContext(QuickViewContext);
    if (context === undefined) {
        throw new Error('useQuickView must be used within a QuickViewProvider');
    }
    return context;
};
