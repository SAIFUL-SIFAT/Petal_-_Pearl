import AdminLayout from '@/components/AdminLayout';
import { Package } from 'lucide-react';

const Products = () => {
    return (
        <AdminLayout>
            <div className="mb-10">
                <h1 className="font-serif text-4xl font-bold mb-2">Product Management</h1>
                <p className="text-muted-foreground">Manage your boutique's inventory, prices and descriptions.</p>
            </div>
            <div className="bg-[#032218] p-12 rounded-2xl border border-[#449c80]/20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent mb-4">
                    <Package size={32} />
                </div>
                <h2 className="text-xl font-medium mb-2">Inventory Loading...</h2>
                <p className="text-muted-foreground">We're fetching your product catalog. Hang tight!</p>
            </div>
        </AdminLayout>
    );
};

export default Products;
