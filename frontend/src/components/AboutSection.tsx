import { motion } from 'framer-motion';

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-lg overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&q=80"
                alt="Artisan crafting traditional Bangladeshi textiles"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative Frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent rounded-lg -z-10" />

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 bg-[#1c1a0e] text-primary p-4 sm:p-6 rounded-lg shadow-xl"
            >
              <p className="text-3xl sm:text-4xl font-serif text-accent mb-1">1+</p>
              <p className="text-xs sm:text-sm text-primary/70">Years of Excellence</p>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:pl-8 mt-12 lg:mt-0"
          >
            <p className="text-accent uppercase tracking-[0.3em] text-sm mb-4 text-center lg:text-left">Our Story</p>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-6 leading-tight text-center lg:text-left">
              Where Tradition Meets
              <span className="block text-accent">Modern Elegance</span>
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-center lg:text-left">
              <p>
                Petal & Pearl was born from a deep appreciation for Bangladesh's rich textile heritage
                and a vision to bring artisanal craftsmanship to the modern woman.
              </p>
              <p>
                Each piece in our collection tells a story—from the intricate Jamdani weaves
                passed down through generations to the delicate pearl ornaments crafted by
                skilled artisans in local workshops.
              </p>
              <p>
                We believe in slow fashion, sustainable practices, and celebrating the
                beauty of handmade creations that carry the soul of their makers.
              </p>
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 mt-8">
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-serif text-accent">100+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Unique Designs</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-serif text-accent">10+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Partner Artisans</p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-2xl sm:text-3xl font-serif text-accent">1k+</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Happy Customers</p>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-luxury border-foreground text-foreground hover:bg-foreground hover:text-background mt-10"
              >
                Learn More About Us
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
