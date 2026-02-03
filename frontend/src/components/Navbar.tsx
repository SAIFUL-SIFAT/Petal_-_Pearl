import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Menu, X, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { productApi } from '@/api/services';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  onAuthClick: () => void;
  onMenuClick: () => void;
}

const Navbar = ({ cartCount, onCartClick, onAuthClick, onMenuClick }: NavbarProps) => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const res = await productApi.getAll({ q: searchQuery });
          setSearchResults(res.data.data.slice(0, 5));
        } catch (error) {
          console.error("Search failed:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled
        ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-border'
        : 'bg-transparent'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Left - Menu */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
            className={`p-2 transition-colors duration-300 ${isScrolled ? 'text-foreground hover:text-accent' : 'text-cream hover:text-gold'
              }`}
          >
            <Menu size={24} />
          </motion.button>

          {/* Center - Logo */}
          <Link to="/">
            <motion.div
              className="flex flex-col items-center cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <h1 className={`font-serif text-xl sm:text-2xl md:text-3xl tracking-[0.1em] sm:tracking-[0.15em] font-semibold transition-colors duration-300 ${isScrolled ? 'text-foreground' : 'text-cream'
                }`}>
                PETAL & PEARL
              </h1>
              <span className={`text-[8px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase transition-colors duration-300 ${isScrolled ? 'text-accent' : 'text-gold-light'
                }`}>
                Elegance Redefined
              </span>
            </motion.div>
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center gap-1 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 transition-colors duration-300 hidden sm:block ${isScrolled ? 'text-foreground hover:text-accent' : 'text-cream hover:text-gold'
                }`}
            >
              <Search size={20} className="sm:w-[22px] sm:h-[22px]" />
            </motion.button>

            {/* Auth / Profile */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <div className="flex items-center gap-2 sm:gap-4">
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard" className="hidden lg:block">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`text-[10px] sm:text-xs uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 border border-accent/30 flex items-center gap-2 transition-all duration-300 rounded-full ${isScrolled ? 'text-accent hover:bg-accent hover:text-accent-foreground' : 'text-cream hover:bg-gold hover:text-black border-gold/30'}`}
                      >
                        <LayoutDashboard size={14} />
                        Admin
                      </motion.button>
                    </Link>
                  )}
                  <Link to="/profile" className="hover:opacity-80 transition-opacity">
                    <span className={`text-sm hidden lg:block ${isScrolled ? 'text-foreground' : 'text-cream'}`}>
                      Hello, <span className="font-semibold text-accent">{user?.name}</span>
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={logout}
                    className="text-[10px] sm:text-xs uppercase tracking-widest px-3 sm:px-4 py-1.5 sm:py-2 border border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300 rounded-full"
                  >
                    Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAuthClick}
                  className={`p-2 transition-colors duration-300 ${isScrolled ? 'text-foreground hover:text-accent' : 'text-cream hover:text-gold'
                    }`}
                >
                  <User size={20} className="sm:w-[22px] sm:h-[22px]" />
                </motion.button>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className={`p-2 relative transition-colors duration-300 ${isScrolled ? 'text-foreground hover:text-accent' : 'text-cream hover:text-gold'
                }`}
            >
              <ShoppingBag size={22} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-[10px] font-semibold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-background border-t border-border overflow-hidden absolute top-20 w-full shadow-2xl"
          >
            <div className="max-w-3xl mx-auto px-4 py-8">
              <div className="relative mb-6">
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for Three-Pieces, Ornaments, Materials..."
                  className="w-full px-6 py-4 pl-14 bg-muted/50 rounded-2xl border border-border focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent/10 font-sans text-base transition-all"
                />
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-accent" size={24} />
                {isSearching && (
                  <div className="absolute right-14 top-1/2 -translate-y-1/2">
                    <div className="animate-spin h-5 w-5 border-2 border-accent border-t-transparent rounded-full" />
                  </div>
                )}
                <button
                  onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Search Results */}
              <div className="space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={result.type === 'ornament' ? '/ornaments' : '/collections'}
                    onClick={() => { setIsSearchOpen(false); setSearchQuery(''); }}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border group-hover:border-accent/30">
                      <img src={result.image} alt={result.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif text-lg text-foreground group-hover:text-accent transition-colors">{result.name}</h4>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="text-accent font-bold">৳{result.price.toLocaleString()}</span>
                        <span className="text-muted-foreground uppercase text-[10px] tracking-widest">{result.category}</span>
                      </div>
                    </div>
                    <div className="text-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      <LayoutDashboard size={20} />
                    </div>
                  </Link>
                ))}

                {searchQuery.length > 2 && searchResults.length === 0 && !isSearching && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground italic">No results found for "{searchQuery}"</p>
                  </div>
                )}

                {searchQuery.length <= 2 && !isSearching && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {['Saree', 'Panjabi', 'Necklace', 'Silk', 'Bridal'].map(tag => (
                      <button
                        key={tag}
                        onClick={() => setSearchQuery(tag)}
                        className="px-4 py-2 bg-muted rounded-full text-xs hover:bg-accent hover:text-accent-foreground transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
