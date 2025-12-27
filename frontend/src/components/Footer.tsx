import { motion } from 'framer-motion';
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Subscribed!",
      description: "Thank you for joining our newsletter.",
    });
    setEmail('');
  };

  return (
    <footer id="contact" className="bg-background text-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-serif text-2xl sm:text-3xl mb-3">Join Our World</h3>
              <p className="text-foreground/70 max-w-md text-sm sm:text-base">
                Subscribe to receive exclusive offers, new arrivals, and styling tips.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 px-4 py-3 bg-secondary/30 border border-secondary/50 rounded-lg text-foreground placeholder:text-foreground/50 focus:outline-none focus:border-accent transition-colors text-sm sm:text-base"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gold-light transition-colors text-sm sm:text-base"
              >
                Subscribe
                <ArrowRight size={18} />
              </motion.button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-serif text-2xl tracking-wider mb-4">PETAL & PEARL</h2>
            <p className="text-foreground/70 text-sm leading-relaxed mb-6">
              Celebrating the artistry of Bangladeshi craftsmanship through exquisite
              three-piece suites and handcrafted ornaments.
            </p>
            <div className="flex gap-3">
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="p-2.5 bg-secondary/30 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Instagram size={18} />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.1, y: -2 }}
                href="#"
                className="p-2.5 bg-secondary/30 rounded-full hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <Facebook size={18} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg mb-4 text-accent">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/collections" className="text-foreground/70 hover:text-accent transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link to="/ornaments" className="text-foreground/70 hover:text-accent transition-colors">
                  Ornaments
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-foreground/70 hover:text-accent transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/collections" className="text-foreground/70 hover:text-accent transition-colors">
                  Sale
                </Link>
              </li>
              <li>
                <Link to="/" className="text-foreground/70 hover:text-accent transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="font-serif text-lg mb-4 text-accent">Customer Care</h4>
            <ul className="space-y-3 text-sm">
              {['Size Guide', 'Track Order', 'Returns & Exchange', 'FAQs', 'Terms & Conditions'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-foreground/70 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg mb-4 text-accent">Contact Us</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-foreground/70">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>House 45, Road 12, Gulshan-2<br />Dhaka 1212, Bangladesh</span>
              </li>
              <li>
                <a href="tel:+8801XXXXXXXXX" className="flex items-center gap-3 text-foreground/70 hover:text-accent transition-colors">
                  <Phone size={18} />
                  <span>+880 1XXX-XXXXXX</span>
                </a>
              </li>
              <li>
                <a href="mailto:hello@petalandpearl.com" className="flex items-center gap-3 text-foreground/70 hover:text-accent transition-colors">
                  <Mail size={18} />
                  <span>hello@petalandpearl.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-foreground/60">
            <p>© 2025 Petal & Pearl. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-60" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-60" />
              <span className="text-xs bg-secondary/30 px-2 py-1 rounded">bKash</span>
              <span className="text-xs bg-secondary/30 px-2 py-1 rounded">Nagad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
