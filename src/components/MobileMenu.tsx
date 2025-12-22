import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Instagram, Facebook, Phone, Mail } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { name: 'Home', href: '#' },
  { name: 'Three-Piece Suites', href: '#collections' },
  { name: 'Ornaments', href: '#ornaments' },
  { name: 'New Arrivals', href: '#' },
  { name: 'Sale', href: '#' },
  { name: 'About Us', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClose();
  };

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

          {/* Menu Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 h-full w-full sm:w-80 bg-[#032218] z-[101] shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#449c80]">
              <div>
                <h2 className="font-serif text-xl text-foreground">Menu</h2>
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

            {/* Navigation Links */}
            <nav className="flex-1 p-6">
              <ul className="space-y-1">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <button
                      onClick={() => handleNavClick(item.href)}
                      className="w-full flex items-center justify-between py-4 text-foreground hover:text-accent transition-colors group border-b border-[#449c80]"
                    >
                      <span className="font-serif text-lg">{item.name}</span>
                      <ChevronRight
                        size={18}
                        className="text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all"
                      />
                    </button>
                  </motion.li>
                ))}
              </ul>
            </nav>

            {/* Footer */}
            <div className="p-6 border-t border-[#449c80]">
              <p className="text-sm text-muted-foreground mb-4">Follow Us</p>
              <div className="flex gap-4">
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Instagram size={20} />
                </motion.a>
                <motion.a
                  whileHover={{ scale: 1.1, y: -2 }}
                  href="#"
                  className="p-2 bg-muted rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <Facebook size={20} />
                </motion.a>
              </div>

              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>+880 1XXX-XXXXXX</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>hello@petalandpearl.com</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
