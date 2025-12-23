import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ProductGrid from '@/components/ProductGrid';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/use-cart';
import { productApi } from '@/api/services';

const Ornaments = () => {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productApi.getAll('ornament');
                setProducts(res.data);
            } catch (error) {
                console.error('Failed to fetch ornaments:', error);
            }
        };
        fetchProducts();
    }, []);

    return (
        <PageLayout>
            <div className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4">
                            Our Ornament Collection
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover our exquisite range of handcrafted jewelry, from timeless pearl drops to majestic bridal sets.
                        </p>
                    </motion.div>

                    <ProductGrid
                        title="All Ornaments"
                        subtitle="Sparkle with elegance"
                        products={products}
                        type="ornament"
                        onAddToCart={addToCart}
                        showViewAll={false}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default Ornaments;
