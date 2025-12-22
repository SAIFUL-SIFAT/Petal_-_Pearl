import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Product } from './ProductCard';

export interface CartItem extends Product {
  quantity: number;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}: CartSidebarProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = subtotal > 5000 ? 0 : 120;
  const total = subtotal + shippingFee;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[420px] bg-[#032218] z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#449c80]">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-accent" size={24} />
                <h3 className="text-2xl font-serif text-foreground">Your Bag</h3>
                <span className="text-sm text-muted-foreground">({items.length} items)</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X size={24} />
              </motion.button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center"
                >
                  <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-4">
                    <ShoppingBag className="text-muted-foreground" size={40} />
                  </div>
                  <p className="text-muted-foreground text-lg mb-2">Your bag is empty</p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Explore our collection and add something beautiful!
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="btn-luxury bg-[#614b15] text-white border-white hover:bg-[#795e1a]"
                  >
                    Continue Shopping
                  </motion.button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0 }}
                        className="flex gap-4 bg-card p-4 rounded-lg"
                        style={{ boxShadow: 'var(--shadow-soft)' }}
                      >
                        <div className="w-20 h-24 rounded-md overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">
                              {item.category}
                            </p>
                            <h4 className="font-serif text-foreground line-clamp-1">{item.name}</h4>
                            <p className="text-accent font-semibold">৳ {item.price.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 border border-[#449c80] rounded-full">
                              <button
                                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                className="p-1.5 hover:bg-muted rounded-full transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                className="p-1.5 hover:bg-muted rounded-full transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onRemoveItem(item.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#449c80] p-6 space-y-4 bg-card">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>৳ {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className={shippingFee === 0 ? 'text-accent' : ''}>
                      {shippingFee === 0 ? 'Free' : `৳ ${shippingFee}`}
                    </span>
                  </div>
                  {shippingFee > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Free shipping on orders above ৳5,000
                    </p>
                  )}
                  <div className="flex justify-between font-semibold text-lg pt-2 border-t border-[#449c80]">
                    <span>Total</span>
                    <span className="text-accent">৳ {total.toLocaleString()}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCheckout}
                  className="w-full btn-luxury bg-primary text-primary-foreground hover:bg-secondary"
                >
                  Proceed to Checkout
                </motion.button>
                <button
                  onClick={onClose}
                  className="w-full btn-luxury bg-[#614b15] text-white border-white hover:bg-[#795e1a]"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
