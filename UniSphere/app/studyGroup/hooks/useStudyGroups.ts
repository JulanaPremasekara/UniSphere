import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";

const fetchStudyGroups = async (): Promise<any[]> => {
  const response = await apiClient.get("/studyGroups");
  const data = response.data.data || response.data;
  return Array.isArray(data) ? data : [];
};

export const useStudyGroups = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["studyGroups"],
    queryFn: fetchStudyGroups,
  });

  return {
    groups: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshGroups: refetch,
  };
};
