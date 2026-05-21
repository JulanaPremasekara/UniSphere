import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";

const fetchMarketplaceItems = async (): Promise<any[]> => {
  const response = await apiClient.get("/api/marketplace");
  const data = response.data.data || response.data;
  return Array.isArray(data) ? data : [];
};

export const useMarketplace = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["marketplace"],
    queryFn: fetchMarketplaceItems,
  });

  return {
    products: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshProducts: refetch,
  };
};
