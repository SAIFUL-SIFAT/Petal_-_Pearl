import { useQuery } from '@tanstack/react-query';
import { productApi } from '@/api/services';
import { Product } from '@/components/ProductCard';

export const useProducts = (params: any = {}) => {
    return useQuery({
        queryKey: ['products', params],
        queryFn: async () => {
            const response = await productApi.getAll(params);
            return response.data;
        },
        // Refresh stock every 60 seconds (reduced from 30s)
        refetchInterval: 60000,
        staleTime: 30000, // Data stays fresh for 30s
    });
};
