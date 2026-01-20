import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Package,
    Users,
    ShoppingCart,
    CreditCard,
    LogOut,
    Menu,
    X,
    Home,
    Bell
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { notificationApi } from '@/api/services';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(window.innerWidth > 1024);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setIsSidebarOpen(true);
            } else {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Products', path: '/admin/products', icon: <Package size={20} /> },
        { name: 'Inventory', path: '/admin/inventory', icon: <Package size={20} /> },
        { name: 'Users', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Orders & Payments', path: '/admin/orders', icon: <ShoppingCart size={20} /> },
        // { name: 'Payments', path: '/admin/payments', icon: <CreditCard size={20} /> },
        { name: 'Home', path: '/', icon: <Home size={20} /> },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sidebarContent = (
        <>
            {/* Sidebar Header */}
            <div className="p-6 flex items-center justify-between border-b border-[#449c80]/10">
                {(isSidebarOpen || isMobileMenuOpen) ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        <span className="font-serif text-xl font-bold tracking-wider text-accent">ADMIN PANEL</span>
                        <span className="text-[10px] tracking-[0.2em] text-accent/60 uppercase">Petal & Pearl</span>
                    </motion.div>
                ) : (
                    <div className="w-full flex justify-center">
                        <span className="font-serif text-xl font-bold text-accent">A</span>
                    </div>
                )}
                <button
                    onClick={() => isMobileMenuOpen ? setIsMobileMenuOpen(false) : setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 hover:bg-[#449c80]/10 rounded-lg text-accent transition-colors hidden lg:block"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-[#449c80]/10 rounded-lg text-accent transition-colors lg:hidden"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${isActive
                                ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/20'
                                : 'text-muted-foreground hover:bg-[#449c80]/10 hover:text-accent'
                                }`}
                        >
                            <span className={isActive ? 'text-accent-foreground' : 'group-hover:scale-110 transition-transform'}>
                                {item.icon}
                            </span>
                            {(isSidebarOpen || isMobileMenuOpen) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="font-medium whitespace-nowrap"
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
                {(isSidebarOpen || isMobileMenuOpen) && (
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
                    {(isSidebarOpen || isMobileMenuOpen) && <span className="font-medium">Logout System</span>}
                </button>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#02140f] flex flex-col lg:flex-row text-foreground font-sans">
            {/* Mobile Header */}
            <header className="lg:hidden h-16 bg-[#032218] border-b border-[#449c80]/20 flex items-center justify-between px-6 sticky top-0 z-[60]">
                <div className="flex flex-col">
                    <span className="font-serif text-lg font-bold tracking-wider text-accent">ADMIN</span>
                    <span className="text-[8px] tracking-[0.2em] text-accent/60 uppercase">Petal & Pearl</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 hover:bg-[#449c80]/10 rounded-lg text-accent transition-colors"
                >
                    <Menu size={24} />
                </button>
            </header>

            {/* Desktop Sidebar */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? '280px' : '80px' }}
                className="bg-[#032218] border-r border-[#449c80]/20 hidden lg:flex flex-col fixed h-full z-50 transition-all duration-300"
            >
                {sidebarContent}
            </motion.aside>

            {/* Mobile Sidebar/Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 h-full w-[280px] bg-[#032218] z-[101] flex flex-col shadow-2xl lg:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main
                className="flex-1 transition-all duration-300 overflow-x-hidden min-h-0"
                style={{ marginLeft: (window.innerWidth > 1024 && isSidebarOpen) ? '280px' : (window.innerWidth > 1024 ? '80px' : '0') }}
            >
                <div className="p-4 sm:p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
