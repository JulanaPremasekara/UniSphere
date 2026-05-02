import { getTimeAgo } from '@/app/utils/timeAgo';
import apiClient from '../../services/api';

export const getLostItemById = async (itemId: string) => {
  const response = await apiClient.get(`/lost/${itemId}`);
  const item = response.data.data;
  return {
    ...item,
    id: item._id, 
    timeAgo: getTimeAgo(item.createdAt),
  };
}

export const getAllLostItems = async () => {
  const response = await apiClient.get("/lost");
  return response.data.data.map((item: any) => ({
    ...item,
    id: item._id, 
    timeAgo: getTimeAgo(item.createdAt),
  }));
};

export const createLostItem = async (formData: FormData) => {
  const response = await apiClient.post("/lost", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const markItemAsResolved = async (itemId: string) => {
  const response = await apiClient.patch(`/lost/${itemId}/resolve`);
  return response.data;
}

export const deleteLostItem = async (itemId: string) => {
    const response = await apiClient.delete(`/lost/${itemId}`);
    return response.data;
}

export const updateLostItem = async (itemId: string, formData: FormData) => {
    const response = await apiClient.put(`/lost/${itemId}`, formData);
    return response.data;
}