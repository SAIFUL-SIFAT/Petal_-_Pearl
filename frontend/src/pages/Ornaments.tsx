import { motion } from 'framer-motion';
import ProductGrid from '@/components/ProductGrid';
import { ornamentProducts } from '@/data/products';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/use-cart';

const Ornaments = () => {
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
                            Our Ornament Collection
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                            Discover our exquisite range of handcrafted jewelry, from timeless pearl drops to majestic bridal sets.
                        </p>
                    </motion.div>

                    <ProductGrid
                        title="All Ornaments"
                        subtitle="Sparkle with elegance"
                        products={ornamentProducts}
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
