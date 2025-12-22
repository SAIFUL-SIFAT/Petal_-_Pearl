import { motion } from 'framer-motion';
import { Truck, Shield, RefreshCw, Gift } from 'lucide-react';

const features = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'On orders above ৳5,000',
  },
  {
    icon: Shield,
    title: 'Authentic Quality',
    description: 'Handcrafted with care',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '7-day return policy',
  },
  {
    icon: Gift,
    title: 'Gift Wrapping',
    description: 'Premium packaging',
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-16 bg-muted/50 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent/10 text-accent mb-4"
              >
                <feature.icon size={24} />
              </motion.div>
              <h3 className="font-serif text-foreground mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
