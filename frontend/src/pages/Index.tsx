import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import FeaturesSection from '@/components/FeaturesSection';
import AboutSection from '@/components/AboutSection';
import PageLayout from '@/components/PageLayout';
import { useCart } from '@/hooks/use-cart';
import { productApi } from '@/api/services';
import ProductCarousel from '@/components/ProductCarousel';

const Index = () => {
  const { addToCart } = useCart();
  const [clothing, setClothing] = useState([]);
  const [ornaments, setOrnaments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const [clothingRes, ornamentsRes] = await Promise.all([
          productApi.getAll({ type: 'clothing' }),
          productApi.getAll({ type: 'ornament' }),
        ]);

        if (clothingRes?.data) setClothing(clothingRes.data);
        if (ornamentsRes?.data) setOrnaments(ornamentsRes.data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

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
        products={clothing}
        type="clothing"
        onAddToCart={addToCart}
      />

      {clothing.length > 0 && (
        <ProductCarousel
          title="New Arrivals"
          subtitle="Just In"
          products={clothing}
          type="clothing"
          onAddToCart={addToCart}
        />
      )}

      {/* About Section */}
      <AboutSection />

      {/* Ornaments Section */}
      <ProductGrid
        title="Handcrafted Ornaments"
        subtitle="Timeless Jewelry"
        products={ornaments}
        type="ornament"
        onAddToCart={addToCart}
      />

      {ornaments.length > 0 && (
        <ProductCarousel
          title="Trending Pieces"
          subtitle="Most Loved"
          products={ornaments}
          type="ornament"
          onAddToCart={addToCart}
        />
      )}
    </PageLayout>
  );
};

export default Index;
