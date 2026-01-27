import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Trash2, X, ArrowLeft, ChevronDown } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import PageLayout from '@/components/PageLayout';
import FilterSidebar from '@/components/FilterSidebar';
import { useCart } from '@/hooks/use-cart';
import { productApi } from '@/api/services';
import { Link } from 'react-router-dom';
import { useProducts } from '@/hooks/use-products';

const Ornaments = () => {
    const { addToCart } = useCart();
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
    const categoryMenuRef = useRef<HTMLDivElement>(null);
    const [filterMetadata, setFilterMetadata] = useState({
        materials: [],
        occasions: [],
        colors: [],
        categories: []
    });
    const [activeFilters, setActiveFilters] = useState<any>({
        material: null,
        occasion: null,
        color: null,
        category: null,
        minPrice: null,
        maxPrice: null,
        inStock: false,
        sortBy: 'date',
        sortOrder: 'DESC' as 'ASC' | 'DESC'
    });

    const { data: products = [], isLoading } = useProducts({
        type: 'ornament',
        ...activeFilters
    });

    /*
    REMOVED LOCAL STATE AND CUSTOM FETCH IN FAVOR OF USEPRODUCTS HOOK
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    */

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target as Node)) {
                setIsCategoryMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const res = await productApi.getFilterMetadata();
                setFilterMetadata(res.data);
            } catch (error) {
                console.error('Failed to fetch filter metadata:', error);
            }
        };
        fetchMetadata();
    }, []);

    /*
    const fetchProducts = async () => {
        // ...
    };

    useEffect(() => {
        fetchProducts();
    }, [activeFilters]);
    */

    const handleFilterChange = (key: string | Record<string, any>, value?: any) => {
        if (typeof key === 'object') {
            setActiveFilters(prev => ({ ...prev, ...key }));
        } else {
            setActiveFilters(prev => ({ ...prev, [key]: value }));
        }
    };

    const resetFilters = () => {
        setActiveFilters({
            material: null,
            occasion: null,
            color: null,
            category: null,
            minPrice: null,
            maxPrice: null,
            inStock: false,
            sortBy: 'date',
            sortOrder: 'DESC'
        });
    };

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== null).length;

    return (
        <PageLayout showFooter={false}>
            <div className="pt-32 pb-20 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Return to Home Link */}
                    <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 group">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>


                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4 leading-tight">
                                Timeless <span className="text-gold italic">Ornaments</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Discover our exquisite range of jewelry.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {/* Category Dropdown Filter */}
                            <div className="relative" ref={categoryMenuRef}>
                                <button
                                    onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-gold/30 text-gold hover:border-gold bg-[#14120a] transition-all duration-300 group"
                                >
                                    <Filter size={16} className="group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                                        {activeFilters.category || 'All'}
                                    </span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${isCategoryMenuOpen ? 'rotate-180' : ''}`}
                                    />
                                </button>

                                <AnimatePresence>
                                    {isCategoryMenuOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl border border-gold/20 bg-[#1c190e] backdrop-blur-md z-50 overflow-hidden"
                                        >
                                            <div className="py-1">
                                                {['All', 'Ring', 'Hair clips', 'Hair bands', 'Jewellery set'].map((cat) => (
                                                    <button
                                                        key={cat}
                                                        onClick={() => {
                                                            handleFilterChange('category', cat === 'All' ? null : cat);
                                                            setIsCategoryMenuOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${(cat === 'All' && !activeFilters.category) || activeFilters.category === cat
                                                            ? 'bg-gold text-primary'
                                                            : 'text-cream hover:bg-gold/10'
                                                            }`}
                                                    >
                                                        {cat}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="p-2 sm:p-3 text-muted-foreground hover:text-destructive transition-colors border border-border rounded-xl"
                                    title="Reset Filters"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-3 bg-[#14120a] border border-gold/20 px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-muted transition-all group"
                            >
                                <div className="relative">
                                    <SlidersHorizontal size={20} className="text-gold" />
                                </div>
                                <span className="hidden sm:inline text-sm font-bold uppercase tracking-widest text-gold text-shadow-sm">Filters</span>
                            </button>
                        </div>
                    </div>

                    {/* Active Filter Chips */}
                    <AnimatePresence>
                        {activeFilterCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex flex-wrap gap-2 mb-8"
                            >
                                {Object.entries(activeFilters).map(([key, value]) => {
                                    if (!value) return null;

                                    if (key === 'sortBy' && value === 'date' && activeFilters.sortOrder === 'DESC') return null;
                                    if (key === 'sortOrder') return null;

                                    const displayValue = value as string;
                                    const displayKey = key;

                                    if (key === 'inStock') {
                                        // ... existing logic handled by displayValue variable
                                    }

                                    return (
                                        <span key={key} className="flex items-center gap-2 bg-gold/10 border border-gold/20 px-4 py-1.5 rounded-full text-xs text-gold font-medium">
                                            <span className="capitalize text-[10px] opacity-60 mr-1">{displayKey}:</span>
                                            {key === 'inStock' ? 'In Stock' :
                                                key === 'minPrice' ? `৳${value}` :
                                                    key === 'maxPrice' ? `৳${value}` :
                                                        key === 'sortBy' ? (
                                                            `${(value as string).charAt(0).toUpperCase() + (value as string).slice(1)} (${activeFilters.sortOrder === 'ASC' ?
                                                                (value === 'price' ? 'Low to High' : value === 'name' ? 'A-Z' : 'Oldest First') :
                                                                (value === 'price' ? 'High to Low' : value === 'name' ? 'Z-A' : 'Newest First')
                                                            })`
                                                        ) : value as React.ReactNode}
                                            <button
                                                onClick={() => {
                                                    if (key === 'sortBy') {
                                                        handleFilterChange({ sortBy: 'date', sortOrder: 'DESC' });
                                                    } else {
                                                        handleFilterChange(key, key === 'inStock' ? false : null);
                                                    }
                                                }}
                                                className="hover:text-foreground"
                                            >
                                                <X size={14} />
                                            </button>
                                        </span>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Premium Card Background Container */}
                    <div className="bg-card/30 backdrop-blur-md border border-accent/20 rounded-[40px] p-8 md:p-16 overflow-hidden relative shadow-2xl">
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px]"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-25deg]">
                            <svg width="600" height="600" viewBox="0 0 100 100">
                                <path d="M50 5 L95 50 L50 95 L5 50 Z" fill="currentColor"></path>
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="relative z-10">
                            {products.length > 0 || isLoading ? (
                                <ProductGrid
                                    title=""
                                    products={products}
                                    type="ornament"
                                    onAddToCart={addToCart}
                                    showViewAll={false}
                                    transparent={true}
                                    isLoading={isLoading}
                                />
                            ) : (
                                <div className="text-center py-20 border-2 border-dashed border-gold/20 rounded-3xl">
                                    <Filter size={48} className="mx-auto text-gold mb-4 opacity-20" />
                                    <h3 className="text-2xl font-serif text-cream mb-2">No ornaments found</h3>
                                    <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                                    <button onClick={resetFilters} className="mt-6 text-gold font-bold uppercase tracking-widest text-sm hover:underline">
                                        Clear all filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FilterSidebar
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                metadata={filterMetadata}
                activeFilters={activeFilters}
                onFilterChange={handleFilterChange}
                onReset={resetFilters}
            />
        </PageLayout>
    );
};

export default Ornaments;
