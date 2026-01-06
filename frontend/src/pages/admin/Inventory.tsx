import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    Search,
    Package,
    AlertTriangle,
    TrendingDown,
    TrendingUp,
    Plus,
    Minus,
    RefreshCw
} from 'lucide-react';
import { productApi } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Inventory = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const response = await productApi.getAll({});
            setProducts(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch inventory",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const handleUpdateStock = async (id: number, newStock: number) => {
        if (newStock < 0) return;

        try {
            await productApi.update(id, { stock: newStock });
            setProducts(products.map(p => p.id === id ? { ...p, stock: newStock } : p));
            toast({
                title: "Stock Updated",
                description: "Inventory has been updated successfully.",
            });
        } catch (error) {
            toast({
                title: "Update Failed",
                description: "Could not update stock levels.",
                variant: "destructive"
            });
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const stats = {
        totalProducts: products.length,
        lowStock: products.filter(p => (p.stock || 0) <= 5 && (p.stock || 0) > 0).length,
        outOfStock: products.filter(p => (p.stock || 0) === 0).length,
        totalItems: products.reduce((sum, p) => sum + (p.stock || 0), 0)
    };

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="font-serif text-3xl font-bold mb-2">Inventory Management</h1>
                <p className="text-muted-foreground">Monitor and adjust stock levels across your entire catalog.</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-[#032218] p-6 rounded-2xl border border-[#449c80]/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                            <Package size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Products</p>
                            <p className="text-2xl font-bold">{stats.totalProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#032218] p-6 rounded-2xl border border-[#449c80]/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-400">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Low Stock</p>
                            <p className="text-2xl font-bold">{stats.lowStock}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#032218] p-6 rounded-2xl border border-[#449c80]/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500/10 rounded-xl text-red-400">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Out of Stock</p>
                            <p className="text-2xl font-bold text-red-400">{stats.outOfStock}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-[#032218] p-6 rounded-2xl border border-[#449c80]/20 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent/10 rounded-xl text-accent">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Inventory</p>
                            <p className="text-2xl font-bold">{stats.totalItems}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search & Actions */}
            <div className="bg-[#032218] p-4 rounded-2xl border border-[#449c80]/20 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#02140f] border border-[#449c80]/20 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                    />
                </div>
                <button
                    onClick={fetchInventory}
                    className="p-3 bg-accent/10 text-accent hover:bg-accent rounded-xl transition-all hover:text-accent-foreground"
                >
                    <RefreshCw size={24} />
                </button>
            </div>

            {/* Inventory Table */}
            <div className="bg-[#032218] rounded-2xl border border-[#449c80]/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#02140f] border-b border-[#449c80]/20">
                                <th className="p-4 sm:p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                                <th className="p-4 sm:p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
                                <th className="p-4 sm:p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Stock</th>
                                <th className="p-4 sm:p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">Quick Adjust</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#449c80]/10">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="p-6 h-20 bg-[#449c80]/5" />
                                    </tr>
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-[#449c80]/5 transition-colors">
                                        <td className="p-4 sm:p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-accent/20 overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground">ID: #{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4 sm:p-6">
                                            <span className="capitalize bg-white/5 px-3 py-1 rounded-full text-xs font-medium">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="p-4 sm:p-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' :
                                                    product.stock > 0 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.4)]' :
                                                        'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                                                    }`} />
                                                <span className={`text-xl font-mono font-bold ${product.stock === 0 ? 'text-red-400' : 'text-foreground'
                                                    }`}>
                                                    {product.stock || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="p-4 sm:p-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleUpdateStock(product.id, (product.stock || 0) - 1)}
                                                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors border border-red-500/20"
                                                    disabled={product.stock <= 0}
                                                >
                                                    <Minus size={18} />
                                                </button>
                                                <div className="w-12 text-center font-bold">
                                                    {product.stock || 0}
                                                </div>
                                                <button
                                                    onClick={() => handleUpdateStock(product.id, (product.stock || 0) + 1)}
                                                    className="p-2 hover:bg-green-500/10 text-green-400 rounded-lg transition-colors border border-green-500/20"
                                                >
                                                    <Plus size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="p-20 text-center">
                                        <p className="text-muted-foreground">No inventory items found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Inventory;
