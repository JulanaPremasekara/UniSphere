import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";

const fetchTutors = async (): Promise<any[]> => {
  const response = await apiClient.get("/tutors");
  return response.data?.data ?? [];
};

export const useTutors = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });

  return {
    tutorList: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshTutors: refetch,
  };
};
