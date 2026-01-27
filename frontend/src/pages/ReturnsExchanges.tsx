import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { RefreshCcw, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReturnsExchanges = () => {
    return (
        <PageLayout>
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-4xl mb-4 text-accent">Returns & Exchanges</h1>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        We want you to love your PETAL & PEARL pieces. If you're not entirely satisfied, we're here to help.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    <div className="bg-secondary/20 p-8 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <RefreshCcw size={24} />
                        </div>
                        <h3 className="font-serif text-xl mb-2 text-accent">7-Day Return</h3>
                        <p className="text-foreground/70 text-sm">Return or exchange any item within 7 days of delivery.</p>
                    </div>
                    <div className="bg-secondary/20 p-8 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShieldCheck size={24} />
                        </div>
                        <h3 className="font-serif text-xl mb-2 text-accent">Quality Guarantee</h3>
                        <p className="text-foreground/70 text-sm">Full refund for any items with manufacturing defects.</p>
                    </div>
                    <div className="bg-secondary/20 p-8 rounded-2xl text-center">
                        <div className="w-12 h-12 bg-accent/20 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                            <Truck size={24} />
                        </div>
                        <h3 className="font-serif text-xl mb-2 text-accent">Easy Process</h3>
                        <p className="text-foreground/70 text-sm">Standard courier pickup available for your convenience.</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto prose prose-invert">
                    <section className="mb-10">
                        <h2 className="font-serif text-2xl mb-4 text-accent">Return Conditions</h2>
                        <ul className="list-disc pl-5 space-y-2 text-foreground/70">
                            <li>Items must be unworn, unwashed, and in their original packaging.</li>
                            <li>Original tags must remain attached to the garment.</li>
                            <li>Handcrafted ornaments must be returned in their original protective box.</li>
                            <li>Sale items are eligible for exchange only, unless they have a manufacturing defect.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="font-serif text-2xl mb-4 text-accent">How to Initiate a Return</h2>
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <span className="font-serif text-3xl text-accent/30 italic">01</span>
                                <div>
                                    <h4 className="font-bold text-lg mb-1 text-accent">Contact Us</h4>
                                    <p className="text-foreground/70">Email us at petalpearl.bd@gmail.com with your order number and the reason for return.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-serif text-3xl text-accent/30 italic">02</span>
                                <div>
                                    <h4 className="font-bold text-lg mb-1 text-accent">Authorization</h4>
                                    <p className="text-foreground/70">Our team will review your request and provide a Return Authorization Number within 24-48 hours.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <span className="font-serif text-3xl text-accent/30 italic">03</span>
                                <div>
                                    <h4 className="font-bold text-lg mb-1 text-accent">Shipment</h4>
                                    <p className="text-foreground/70">Pack the items securely. We can arrange a pickup for a nominal fee, or you can ship it back to our warehouse.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="font-serif text-2xl mb-4 text-accent">Refunds</h2>
                        <p className="text-foreground/70">
                            Once we receive and inspect your return, we will process your refund. Refunds will be issued to your original payment method (bKash/Nagad/Bank Transfer) within 5-7 business days.
                        </p>
                    </section>
                </div>
            </main>
        </PageLayout>
    );
};

export default ReturnsExchanges;
