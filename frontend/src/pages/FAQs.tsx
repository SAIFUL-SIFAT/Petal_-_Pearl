import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How long does shipping take?",
            answer: "Standard shipping within Dhaka typically takes 2-3 business days. Outside Dhaka, it takes 3-5 business days. Delivery times may vary during festival seasons or sales."
        },
        {
            question: "What are your payment methods?",
            answer: "We accept bKash, Nagad, Mastercard, Visa, and Cash on Delivery (available for orders within specific regions)."
        },
        {
            question: "Can I cancel my order?",
            answer: "You can cancel your order within 12 hours of placing it, as long as it hasn't been shipped. Please contact our customer support team immediately for cancellations."
        },
        {
            question: "Do you offer international shipping?",
            answer: "Currently, we only ship within Bangladesh. We are working on expanding our services to international customers soon!"
        },
        {
            question: "How do I care for my handmade ornaments?",
            answer: "We recommend storing your ornaments in the provided box when not in use. Avoid contact with water, perfume, or hairspray to maintain their brilliance."
        },
        {
            question: "Are there any hidden charges?",
            answer: "No, there are no hidden charges. The total price shown at checkout includes the product price and shipping fees. Any applicable taxes are also included."
        }
    ];

    return (
        <PageLayout>
            <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="font-serif text-4xl mb-4 text-accent">Frequently Asked Questions</h1>
                    <p className="text-foreground/70">
                        Have a question? We've gathered the most common inquiries here. If you can't find what you're looking for, feel free to contact us.
                    </p>
                </motion.div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="border border-secondary/30 rounded-xl overflow-hidden">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-secondary/10 transition-colors"
                            >
                                <span className="font-serif text-lg text-accent">{faq.question}</span>
                                {openIndex === index ? <ChevronUp size={20} className="text-accent" /> : <ChevronDown size={20} className="text-foreground/50" />}
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 text-foreground/70 leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center bg-accent/10 p-10 rounded-2xl">
                    <h2 className="font-serif text-2xl mb-3 text-accent">Still have questions?</h2>
                    <p className="text-foreground/70 mb-6">
                        If you didn't find the answer you were looking for, reach out to our team.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a href="mailto:petalpearl.bd@gmail.com" className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-gold-light transition-colors">
                            Email Support
                        </a>
                        <a href="tel:+8801758761248" className="px-6 py-3 border border-accent text-accent rounded-lg font-medium hover:bg-accent/10 transition-colors">
                            Call Us
                        </a>
                    </div>
                </div>
            </main>
        </PageLayout>
    );
};

export default FAQs;
