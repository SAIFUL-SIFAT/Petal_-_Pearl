import React from 'react';
import { motion } from 'framer-motion';
import { X, Filter } from 'lucide-react';

interface FilterSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    metadata: {
        materials: string[];
        occasions: string[];
        colors: string[];
        categories: string[];
    };
    activeFilters: any;
    onFilterChange: (key: string, value: string | null) => void;
    onReset: () => void;
}

const FilterSidebar = ({
    isOpen,
    onClose,
    metadata,
    activeFilters,
    onFilterChange,
    onReset
}: FilterSidebarProps) => {
    const colorMap: { [key: string]: string } = {
        'Red': '#ef4444',
        'Blue': '#3b82f6',
        'Green': '#22c55e',
        'Gold': '#BFA045',
        'Silver': '#C0C0C0',
        'Black': '#000000',
        'White': '#ffffff',
        'Pink': '#ec4899',
        'Purple': '#a855f7',
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: isOpen ? 0 : '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 h-full w-full max-w-xs bg-background z-[70] shadow-2xl border-l border-border p-6 flex flex-col"
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                        <Filter size={20} className="text-accent" />
                        <h2 className="font-serif text-2xl font-bold">Filters</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
                    {/* Categories */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {metadata.categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => onFilterChange('category', activeFilters.category === cat ? null : cat)}
                                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${activeFilters.category === cat
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Material */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Material</h3>
                        <div className="flex flex-wrap gap-2">
                            {metadata.materials.map(material => (
                                <button
                                    key={material}
                                    onClick={() => onFilterChange('material', activeFilters.material === material ? null : material)}
                                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${activeFilters.material === material
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {material}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Occasion */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Occasion</h3>
                        <div className="flex flex-wrap gap-2">
                            {metadata.occasions.map(occasion => (
                                <button
                                    key={occasion}
                                    onClick={() => onFilterChange('occasion', activeFilters.occasion === occasion ? null : occasion)}
                                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${activeFilters.occasion === occasion
                                        ? 'bg-accent text-accent-foreground'
                                        : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    {occasion}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Colors */}
                    <div>
                        <h3 className="text-[10px] uppercase tracking-widest font-bold text-accent mb-4">Color Palette</h3>
                        <div className="flex flex-wrap gap-4">
                            {metadata.colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => onFilterChange('color', activeFilters.color === color ? null : color)}
                                    className="group flex flex-col items-center gap-2"
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${activeFilters.color === color
                                            ? 'border-accent scale-110 shadow-lg shadow-accent/20'
                                            : 'border-white/10 group-hover:border-white/30'
                                            }`}
                                        style={{ backgroundColor: colorMap[color] || '#888' }}
                                    />
                                    <span className="text-[10px] text-muted-foreground">{color}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t border-border mt-auto flex gap-3">
                    <button
                        onClick={onReset}
                        className="flex-1 py-3 border border-border rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#a68b3d] transition-colors"
                    >
                        Show Results
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default FilterSidebar;
