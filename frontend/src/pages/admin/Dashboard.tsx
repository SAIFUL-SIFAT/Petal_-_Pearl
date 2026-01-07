import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Package, DollarSign, ArrowUpRight, ArrowDownRight, ShoppingBag } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '@/api/axios';

const StatCard = ({ title, value, icon, trend, trendValue }: any) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-[#032218] p-6 rounded-2xl border border-[#449c80]/20 shadow-xl"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-accent/10 rounded-xl text-accent">
                {icon}
            </div>
            <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'
                }`}>
                {trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {trendValue}
            </div>
        </div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
    </motion.div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        users: 0,
        sales: 0,
        orders: 0,
        earnings: 0,
        chartData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch dashboard stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Skeleton loader if needed, but for now simple loading text or default structure
    if (loading) {
        return (
            <AdminLayout>
                <div className="flex h-[80vh] items-center justify-center text-accent animate-pulse">
                    Loading Dashboard...
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-8 sm:mb-10">
                <h1 className="font-serif text-2xl sm:text-4xl font-bold mb-2">System Overview</h1>
                <p className="text-muted-foreground text-sm sm:text-base">Welcome back, here's what's happening with Petal & Pearl today.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
                <StatCard
                    title="Total Revenue"
                    value={`৳${(stats.earnings || 0).toLocaleString()}`}
                    icon={<DollarSign size={24} />}
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Active Users"
                    value={(stats.users || 0).toLocaleString()}
                    icon={<Users size={24} />}
                    trend="up"
                    trendValue="+5.2%"
                />
                <StatCard
                    title="Total Orders"
                    value={(stats.orders || 0).toLocaleString()}
                    icon={<Package size={24} />}
                    trend="up"
                    trendValue="+2.4%"
                />
                <StatCard
                    title="Total Products"
                    value={(stats.products || 0).toLocaleString()}
                    icon={<ShoppingBag size={24} />} // Changed icon for variety
                    trend="up"
                    trendValue="+8.1%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-[#032218] p-8 rounded-2xl border border-[#449c80]/20 shadow-xl">
                    <h3 className="font-serif text-2xl mb-6">Revenue Overview</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats.chartData}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#449c80" opacity={0.1} vertical={false} />
                                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `৳${value}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#02140f', borderColor: '#449c80', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#d4af37' }}
                                />
                                <Area type="monotone" dataKey="sales" stroke="#d4af37" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Info / Other Charts Placeholder */}
                <div className="bg-[#032218] p-8 rounded-2xl border border-[#449c80]/20 shadow-xl">
                    <h3 className="font-serif text-2xl mb-6">Performance</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Target Sales</span>
                                <span className="font-bold text-accent">85%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[85%] rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Server Load</span>
                                <span className="font-bold text-green-400">24%</span>
                            </div>
                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-green-400 w-[24%] rounded-full" />
                            </div>
                        </div>
                        <div className="mt-8 pt-8 border-t border-[#449c80]/10">
                            <p className="text-sm text-muted-foreground">
                                Detailed reports for product performance and user retention will be available in the next update.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
