import { motion } from 'framer-motion';
import ProductGrid from '@/components/ProductGrid';
import { clothingProducts } from '@/data/products';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/use-cart';

const Collections = () => {
    const { addToCart } = useCart();

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
                            Seasonal Collections
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Explore our curated selection of premium fabrics and traditional designs, crafted for the modern woman.
                        </p>
                    </motion.div>

                    <ProductGrid
                        title="Premium Three-Pieces"
                        subtitle="Tradition meets modern style"
                        products={clothingProducts}
                        type="clothing"
                        onAddToCart={addToCart}
                        showViewAll={false}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

export default Collections;
