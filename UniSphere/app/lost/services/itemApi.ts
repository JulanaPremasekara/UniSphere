import apiClient from '../../services/api';

export const getLostItemById = async (itemId: string) => {
    const response = await apiClient.get(`/lost/${itemId}`);
    return response.data;
}

export const getAllLostItems = async () =>{
    const response = await apiClient.get('/lost');
    return response.data;
}

export const createLostItem = async (itemData: any) => {
    const response = await apiClient.post('/lost', itemData);
    return response.data;
}

export const deleteLostItem = async (itemId: string) => {
    const response = await apiClient.delete(`/lost/${itemId}`);
    return response.data;
}

export const updateLostItem = async (itemId: string, itemData: any) => {
    const response = await apiClient.put(`/lost/${itemId}`, itemData);
    return response.data;
}