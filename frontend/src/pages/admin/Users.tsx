import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
    UserPlus,
    Search,
    Edit2,
    Trash2,
    User,
    Mail,
    Phone,
    X,
    Check,
    AlertCircle
} from 'lucide-react';
import { userApi } from '@/api/services';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminUsers = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'user'
    });

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAll();
            setUsers(response.data);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch users",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                password: '', // Don't show password
                role: user.role
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                phone: '',
                password: '',
                role: 'user'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingUser) {
                // Remove password from payload if it's empty during edit
                const payload = { ...formData };
                if (!payload.password) delete payload.password;

                await userApi.update(editingUser.id, payload);
                toast({ title: "Updated", description: "User updated successfully" });
            } else {
                await userApi.signup(formData);
                toast({ title: "Created", description: "User created successfully" });
            }
            setIsModalOpen(false);
            fetchUsers();
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.response?.data?.message || "Operation failed",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        try {
            await userApi.remove(id);
            toast({ title: "Deleted", description: "User removed successfully" });
            fetchUsers();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive"
            });
        }
    };

    const filteredUsers = users.filter(user =>
        user.role !== 'admin' && (
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <AdminLayout>
            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="font-serif text-4xl font-bold mb-2">User Management</h1>
                    <p className="text-muted-foreground">Manage accounts, roles, and access credentials.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:bg-gold transition-all shadow-lg shadow-accent/20"
                >
                    <UserPlus size={20} />
                    Add New User
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-[#032218] p-4 rounded-2xl border border-[#449c80]/20 mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#02140f] border border-[#449c80]/20 rounded-xl py-3 pl-12 pr-4 focus:border-accent outline-none transition-all"
                    />
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#032218] rounded-2xl border border-[#449c80]/20 overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-[#02140f] border-b border-[#449c80]/20">
                                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">User</th>
                                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Contact</th>
                                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Role</th>
                                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
                                <th className="p-6 text-sm font-semibold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#449c80]/10">
                            {loading ? (
                                [1, 2, 3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="p-6 bg-[#449c80]/5 h-16" />
                                    </tr>
                                ))
                            ) : filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-[#449c80]/5 transition-colors group">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-foreground">{user.name}</p>
                                                    <p className="text-xs text-muted-foreground lowercase">ID: #{user.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Mail size={14} className="text-accent/60" />
                                                    <span>{user.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Phone size={14} className="text-accent/60" />
                                                    <span>{user.phone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent/10 text-accent border border-accent/20`}>
                                                <User size={12} />
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-6 text-sm text-muted-foreground">
                                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleOpenModal(user)}
                                                    className="p-2 hover:bg-accent/10 text-accent rounded-lg transition-colors border border-transparent hover:border-accent/20"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(user.id)}
                                                    className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-colors border border-transparent hover:border-red-500/20"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-muted-foreground">
                                            <AlertCircle size={48} className="opacity-20" />
                                            <p>No users found matching your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-[#032218] rounded-3xl border border-[#449c80]/30 shadow-2xl z-[61] overflow-hidden"
                        >
                            <div className="p-8 border-b border-[#449c80]/20 flex justify-between items-center bg-[#02140f]">
                                <h2 className="font-serif text-2xl font-bold">
                                    {editingUser ? 'Edit User' : 'Create New User'}
                                </h2>
                                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                                    <X size={24} className="text-muted-foreground" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-accent">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-[#02140f] border border-[#449c80]/30 rounded-xl py-3 px-4 outline-none focus:border-accent transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-accent">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-[#02140f] border border-[#449c80]/30 rounded-xl py-3 px-4 outline-none focus:border-accent transition-all"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold uppercase tracking-widest text-accent">Phone</label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-[#02140f] border border-[#449c80]/30 rounded-xl py-3 px-4 outline-none focus:border-accent transition-all"
                                            placeholder="017XXX..."
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-accent">
                                        {editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="w-full bg-[#02140f] border border-[#449c80]/30 rounded-xl py-3 px-4 outline-none focus:border-accent transition-all"
                                    />
                                </div>


                                <div className="pt-4 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="flex-1 py-4 border border-[#449c80]/30 rounded-xl font-bold hover:bg-[#449c80]/10 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 py-4 bg-accent text-accent-foreground rounded-xl font-bold hover:bg-gold transition-all shadow-lg shadow-accent/20"
                                    >
                                        {editingUser ? 'Save Changes' : 'Create Account'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </AdminLayout>
    );
};

export default AdminUsers;
