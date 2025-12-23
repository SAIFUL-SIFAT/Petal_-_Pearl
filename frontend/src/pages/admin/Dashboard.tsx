import React from 'react';
import AdminLayout from '@/components/AdminLayout';
import { motion } from 'framer-motion';
import {
    TrendingUp,
    Users,
    Package,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

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
    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="font-serif text-4xl font-bold mb-2">System Overview</h1>
                <p className="text-muted-foreground">Welcome back, here's what's happening with Petal & Pearl today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                <StatCard
                    title="Total Revenue"
                    value="৳458,200"
                    icon={<DollarSign size={24} />}
                    trend="up"
                    trendValue="+12.5%"
                />
                <StatCard
                    title="Active Users"
                    value="1,240"
                    icon={<Users size={24} />}
                    trend="up"
                    trendValue="+5.2%"
                />
                <StatCard
                    title="Pending Orders"
                    value="48"
                    icon={<Package size={24} />}
                    trend="down"
                    trendValue="-2.4%"
                />
                <StatCard
                    title="Avg. Order Value"
                    value="৳9,540"
                    icon={<TrendingUp size={24} />}
                    trend="up"
                    trendValue="+8.1%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Orders Placeholder */}
                <div className="bg-[#032218] p-8 rounded-2xl border border-[#449c80]/20 shadow-xl">
                    <h3 className="font-serif text-2xl mb-6">Recent Sales</h3>
                    <div className="space-y-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center justify-between border-b border-[#449c80]/10 pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold">
                                        {String.fromCharCode(64 + i)}
                                    </div>
                                    <div>
                                        <p className="font-medium">Customer {i}</p>
                                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                                    </div>
                                </div>
                                <p className="font-bold text-accent">+৳12,500</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Growth Chart Placeholder */}
                <div className="bg-[#032218] p-8 rounded-2xl border border-border/50 flex flex-col items-center justify-center text-center">
                    <div className="p-4 bg-accent/5 rounded-full mb-4">
                        <TrendingUp size={48} className="text-accent/40" />
                    </div>
                    <h3 className="font-serif text-2xl mb-2 text-foreground/80">Growth Analytics</h3>
                    <p className="text-muted-foreground max-w-xs">Interactive charts and deeper insights will appear here as more data is collected.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
