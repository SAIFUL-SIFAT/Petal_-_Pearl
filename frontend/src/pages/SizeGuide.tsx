import PageLayout from '@/components/PageLayout';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const SizeGuide = () => {
    const clothingSizes = [
        { size: 'S', chest: '34-36"', waist: '28-30"', hip: '36-38"' },
        { size: 'M', chest: '38-40"', waist: '32-34"', hip: '40-42"' },
        { size: 'L', chest: '42-44"', waist: '36-38"', hip: '44-46"' },
        { size: 'XL', chest: '46-48"', waist: '40-42"', hip: '48-50"' },
    ];

    const ringSizes = [
        { size: '5', mm: '49.3 mm', inch: '1.94"' },
        { size: '6', mm: '51.9 mm', inch: '2.04"' },
        { size: '7', mm: '54.4 mm', inch: '2.14"' },
        { size: '8', mm: '57.0 mm', inch: '2.24"' },
        { size: '9', mm: '59.5 mm', inch: '2.34"' },
        { size: '10', mm: '62.1 mm', inch: '2.44"' },
    ];

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
                    className="text-center mb-16"
                >
                    <h1 className="font-serif text-4xl mb-4 text-accent">Size Guide</h1>
                    <p className="text-foreground/70 max-w-2xl mx-auto">
                        Measurement guides for PETAL & PEARL garments and handcrafted ornaments.
                    </p>
                </motion.div>

                {/* Clothing Section */}
                <section className="mb-20">
                    <h2 className="font-serif text-2xl mb-8 border-l-4 border-accent pl-4 text-accent">Clothing Size Chart</h2>
                    <div className="bg-secondary/20 rounded-2xl p-6 md:p-10 mb-10">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-secondary/50">
                                        <th className="py-4 font-serif text-lg">Size</th>
                                        <th className="py-4 font-serif text-lg">Chest</th>
                                        <th className="py-4 font-serif text-lg">Waist</th>
                                        <th className="py-4 font-serif text-lg">Hip</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clothingSizes.map((item) => (
                                        <tr key={item.size} className="border-b border-secondary/20 last:border-0">
                                            <td className="py-4 font-medium">{item.size}</td>
                                            <td className="py-4 text-foreground/70">{item.chest}</td>
                                            <td className="py-4 text-foreground/70">{item.waist}</td>
                                            <td className="py-4 text-foreground/70">{item.hip}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-background border border-secondary/30 p-6 rounded-xl">
                            <h3 className="font-bold mb-2 text-accent">1. Chest</h3>
                            <p className="text-foreground/70 text-sm">Measure around the fullest part of your chest, keeping the tape horizontal.</p>
                        </div>
                        <div className="bg-background border border-secondary/30 p-6 rounded-xl">
                            <h3 className="font-bold mb-2 text-accent">2. Waist</h3>
                            <p className="text-foreground/70 text-sm">Measure around the narrowest part of your waistline.</p>
                        </div>
                        <div className="bg-background border border-secondary/30 p-6 rounded-xl">
                            <h3 className="font-bold mb-2 text-accent">3. Hips</h3>
                            <p className="text-foreground/70 text-sm">Measure around the fullest part of your hips.</p>
                        </div>
                    </div>
                </section>

                {/* Ring Section */}
                <section className="mb-20">
                    <h2 className="font-serif text-2xl mb-8 border-l-4 border-accent pl-4 text-accent">Ring Size Chart</h2>
                    <div className="grid lg:grid-cols-2 gap-10">
                        <div className="bg-secondary/20 rounded-2xl p-6 md:p-10">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-secondary/50">
                                            <th className="py-4 font-serif text-lg">US Size</th>
                                            <th className="py-4 font-serif text-lg">Circumference (mm)</th>
                                            <th className="py-4 font-serif text-lg">Circumference (inch)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ringSizes.map((item) => (
                                            <tr key={item.size} className="border-b border-secondary/20 last:border-0">
                                                <td className="py-4 font-medium">{item.size}</td>
                                                <td className="py-4 text-foreground/70">{item.mm}</td>
                                                <td className="py-4 text-foreground/70">{item.inch}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-8">
                            <div>
                                <h3 className="font-serif text-xl mb-3 text-accent">How to Measure Your Ring Size</h3>
                                <p className="text-foreground/70 text-sm mb-4">
                                    If you don't have a ring to measure, follow these steps:
                                </p>
                                <ul className="space-y-4">
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">1</span>
                                        <p className="text-sm text-foreground/70">Wrap a piece of string or paper around the base of your finger.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">2</span>
                                        <p className="text-sm text-foreground/70">Mark the point where the ends meet with a pen.</p>
                                    </li>
                                    <li className="flex gap-4">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold">3</span>
                                        <p className="text-sm text-foreground/70">Measure the string or paper with a ruler (mm) and compare it to our chart.</p>
                                    </li>
                                </ul>
                            </div>
                            <div className="p-6 bg-accent/5 border border-accent/20 rounded-xl">
                                <p className="text-sm italic text-foreground/80">
                                    <strong>Tip:</strong> Measure your finger at the end of the day when it's likely to be at its largest. Ensure the ring can slide over your knuckle comfortably.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>


            </main>
        </PageLayout>
    );
};

export default SizeGuide;
