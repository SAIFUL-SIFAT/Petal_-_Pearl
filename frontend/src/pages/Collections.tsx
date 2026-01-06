import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SlidersHorizontal, Trash2, X } from 'lucide-react';
import ProductGrid from '@/components/ProductGrid';
import PageLayout from '@/components/PageLayout';
import FilterSidebar from '@/components/FilterSidebar';
import { useCart } from '@/hooks/use-cart';
import { productApi } from '@/api/services';

const Collections = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [filterMetadata, setFilterMetadata] = useState({
        materials: [],
        occasions: [],
        colors: [],
        categories: []
    });
    const [activeFilters, setActiveFilters] = useState({
        material: null,
        occasion: null,
        color: null,
        category: null
    });

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

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const params = {
                type: 'clothing',
                ...activeFilters
            };
            const res = await productApi.getAll(params);
            setProducts(res.data);
        } catch (error) {
            console.error('Failed to fetch collections:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [activeFilters]);

    const handleFilterChange = (key: string, value: string | null) => {
        setActiveFilters(prev => ({ ...prev, [key]: value }));
    };

    const resetFilters = () => {
        setActiveFilters({
            material: null,
            occasion: null,
            color: null,
            category: null
        });
    };

    const activeFilterCount = Object.values(activeFilters).filter(v => v !== null).length;

    return (
        <PageLayout>
            <div className="pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="max-w-2xl"
                        >
                            <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4 leading-tight">
                                Seasonal <span className="text-accent italic">Collections</span>
                            </h1>
                            <p className="text-muted-foreground text-lg">
                                Explore our curated selection of premium fabrics and traditional designs.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center gap-3"
                        >
                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="p-3 text-muted-foreground hover:text-destructive transition-colors border border-border rounded-xl"
                                    title="Reset Filters"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                            <button
                                onClick={() => setIsFilterOpen(true)}
                                className="flex items-center gap-3 bg-card border border-border px-6 py-3 rounded-xl hover:bg-muted transition-all group"
                            >
                                <div className="relative">
                                    <SlidersHorizontal size={20} className="text-accent" />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </div>
                                <span className="text-sm font-bold uppercase tracking-widest">Filters</span>
                            </button>
                        </motion.div>
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
                                {Object.entries(activeFilters).map(([key, value]) => value && (
                                    <span key={key} className="flex items-center gap-2 bg-accent/10 border border-accent/20 px-4 py-1.5 rounded-full text-xs text-accent font-medium">
                                        <span className="capitalize text-[10px] opacity-60 mr-1">{key}:</span> {value}
                                        <button onClick={() => handleFilterChange(key, null)} className="hover:text-foreground">
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-[3/4] bg-muted animate-pulse rounded-2xl" />
                            ))}
                        </div>
                    ) : products.length > 0 ? (
                        <ProductGrid
                            title=""
                            products={products}
                            type="clothing"
                            onAddToCart={addToCart}
                            showViewAll={false}
                        />
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed border-border rounded-3xl">
                            <Filter size={48} className="mx-auto text-muted-foreground mb-4 opacity-20" />
                            <h3 className="text-2xl font-serif mb-2">No items found</h3>
                            <p className="text-muted-foreground">Try adjusting your filters or search criteria.</p>
                            <button onClick={resetFilters} className="mt-6 text-accent font-bold uppercase tracking-widest text-sm hover:underline">
                                Clear all filters
                            </button>
                        </div>
                    )}
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

export default Collections;
