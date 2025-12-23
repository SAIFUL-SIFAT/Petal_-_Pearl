import React from 'react';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    CreditCard,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
        { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-[#02140f] flex text-foreground font-sans">
            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                className="bg-[#032218] border-r border-[#449c80]/20 flex flex-col fixed h-full z-50 transition-all duration-300"
            >
                {/* Sidebar Header */}
                <div className="p-6 flex items-center justify-between border-b border-[#449c80]/10">
                    {isSidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col"
                        >
                            <span className="font-serif text-xl font-bold tracking-wider text-accent">ADMIN PANEL</span>
                            <span className="text-[10px] tracking-[0.2em] text-accent/60 uppercase">Petal & Pearl</span>
                        </motion.div>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-[#449c80]/10 rounded-lg text-accent transition-colors"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 py-8 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                        ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                                        : 'text-muted-foreground hover:bg-[#449c80]/10 hover:text-accent'
                                    }`}
                            >
                                <span className={isActive ? 'text-accent-foreground' : 'group-hover:scale-110 transition-transform'}>
                                    {item.icon}
                                </span>
                                {isSidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="font-medium"
                                    >
                                        {item.name}
                                    </motion.span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Profile/Logout */}
                <div className="p-4 border-t border-[#449c80]/10">
                    {isSidebarOpen && (
                        <div className="mb-4 px-4 py-3 bg-[#449c80]/5 rounded-xl border border-[#449c80]/10">
                            <p className="text-xs text-accent/60 uppercase tracking-tighter">Logged in as</p>
                            <p className="font-medium truncate">{user?.name}</p>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {isSidebarOpen && <span className="font-medium">Logout System</span>}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main
                className="flex-1 transition-all duration-300 overflow-hidden"
                style={{ marginLeft: isSidebarOpen ? '280px' : '80px' }}
            >
                <div className="p-8 md:p-12 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
