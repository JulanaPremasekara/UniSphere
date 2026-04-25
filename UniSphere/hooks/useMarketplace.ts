import { useCallback, useState } from 'react';
import apiClient from '../app/services/api';

export const useMarketplace = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Added /api prefix to match backend routes
      const response = await apiClient.get('/api/marketplace'); 
      setProducts(response.data);
    } catch (err) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    try {
      // Added /api prefix
      const response = await apiClient.get(`/api/marketplace/${id}`);
      setProduct(response.data);
    } catch (err) {
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  }, []);

  const createProduct = async (data: any) => {
    return await apiClient.post('/api/marketplace', data);
  };

  const updateProduct = async (id: string, data: any) => {
    return await apiClient.put(`/api/marketplace/${id}`, data);
  };

  const deleteProduct = async (id: string) => {
    return await apiClient.delete(`/api/marketplace/${id}`);
  };

  return {
    products,
    product,
    loading,
    error,
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct
  };
};