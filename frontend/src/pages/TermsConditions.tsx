import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <PageLayout>
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-4xl mb-4 text-accent">Terms & Conditions</h1>
                    <p className="text-foreground/70">
                        Please read these terms and conditions carefully before using our services.
                    </p>
                </motion.div>

                <div className="prose prose-invert max-w-none text-foreground/70 leading-relaxed space-y-8">
                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">1. Introduction</h2>
                        <p>
                            Welcome to PETAL & PEARL. By accessing our website and using our services, you agree to comply with and be bound by the following terms and conditions. These terms govern your relationship with us in relation to this website.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">2. Intellectual Property</h2>
                        <p>
                            All content on this website, including but not limited to designs, text, graphics, logos, and images, is the property of PETAL & PEARL and is protected by copyright laws. You may not reproduce, distribute, or use any content without our prior written consent.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">3. Product Accuracy</h2>
                        <p>
                            We strive to display our products as accurately as possible. However, as our items are handcrafted and use natural materials, slight variations in color, texture, and size may occur. We cannot guarantee that your device's display will perfectly reflect the actual product color.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">4. Pricing & Payments</h2>
                        <p>
                            All prices are listed in Bangladeshi Taka (BDT). We reserve the right to change prices without prior notice. Payments must be made through our authorized payment gateways. Your order will only be processed once payment is confirmed.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">5. Privacy Policy</h2>
                        <p>
                            Your privacy is important to us. Our Privacy Policy, which is incorporated into these terms, explains how we collect, use, and protect your personal information. By using our website, you consent to our collection and use of data as described in the Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">6. Limitation of Liability</h2>
                        <p>
                            PETAL & PEARL shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. We do not guarantee that our website will be error-free or uninterrupted.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-accent mb-4">7. Governing Law</h2>
                        <p>
                            These terms and conditions are governed by and construed in accordance with the laws of Bangladesh. Any disputes arising out of or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Bangladesh.
                        </p>
                    </section>
                </div>
            </main>
        </PageLayout>
    );
};

export default TermsConditions;
