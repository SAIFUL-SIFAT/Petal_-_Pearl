import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag } from 'lucide-react';
import { Product } from './ProductCard';

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    onAddToCart: (product: Product) => void;
}

const QuickViewModal = ({ isOpen, onClose, product, onAddToCart }: QuickViewModalProps) => {
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-4xl bg-card rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row z-[101]"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white backdrop-blur-md transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="w-full md:w-1/2 aspect-square md:aspect-auto relative bg-muted">
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="w-full md:w-1/2 p-6 md:p-8 md:overflow-y-auto max-h-[60vh] md:max-h-[80vh] flex flex-col">
                            <h2 className="text-sm font-medium tracking-widest text-[#BFA045] uppercase mb-2">
                                {product.category}
                            </h2>
                            <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-2xl font-semibold text-accent">৳{product.price.toLocaleString()}</span>
                                {product.originalPrice && (
                                    <span className="text-lg text-muted-foreground line-through">
                                        ৳{product.originalPrice.toLocaleString()}
                                    </span>
                                )}
                            </div>

                            <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                                Experience luxury with our {product.name}. meticulously crafted to bring out your inner elegance. Perfect for special occasions or adding a touch of sophistication to your daily wear.
                            </p>

                            <button
                                onClick={() => {
                                    onAddToCart(product);
                                    onClose();
                                }}
                                className="w-full bg-accent text-accent-foreground py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-[#a68b3d] transition-colors flex items-center justify-center gap-2 mb-4"
                            >
                                <ShoppingBag size={20} />
                                Add to Cart
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default QuickViewModal;
