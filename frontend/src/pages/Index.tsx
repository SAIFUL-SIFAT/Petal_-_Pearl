import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import { clothingProducts, ornamentProducts } from '@/data/products';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/use-cart';

const Index = () => {
  const { addToCart } = useCart();

  return (
    <PageLayout>
      {/* Hero Section */}
      <Hero />

      {/* Features Bar */}
      <FeaturesSection />

      {/* Clothing Section */}
      <ProductGrid
        title="Three-Piece Suites"
        subtitle="Exclusive Collection"
        products={clothingProducts}
        type="clothing"
        onAddToCart={addToCart}
      />

      {/* About Section */}
      <AboutSection />

      {/* Ornaments Section */}
      <ProductGrid
        title="Handcrafted Ornaments"
        subtitle="Timeless Jewelry"
        products={ornamentProducts}
        type="ornament"
        onAddToCart={addToCart}
      />
    </PageLayout>
  );
};

export default Index;
