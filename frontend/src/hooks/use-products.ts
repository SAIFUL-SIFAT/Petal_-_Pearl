import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/services';
import { Product } from '@/components/ProductCard';

export const useProducts = (params: any = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const response = await productApi.getAll(params);
            return response.data as Product[];
        },
        // Refresh stock every 30 seconds for "on the fly" updates
        refetchInterval: 30000,
        staleTime: 10000,
    });
};
