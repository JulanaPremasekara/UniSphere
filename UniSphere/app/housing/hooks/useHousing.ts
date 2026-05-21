import { useQuery } from "@tanstack/react-query";
import apiClient from "@/services/api";

export interface Housing {
  id: string;
  title: string;
  location: string;
  rentPrice: number;
  roomType: string;
  images?: string[];
  isMine: boolean;
}

const formatHousing = (h: any, currentUserId?: string): Housing => ({
  id: typeof h._id === "string" ? h._id : typeof h.id === "string" ? h.id : "",
  title: h.title,
  location: h.address,
  rentPrice: h.rentPrice,
  roomType: h.roomType,
  images: h.images || [],
  isMine: currentUserId ? h.postedBy === currentUserId : false,
});

const fetchHousings = async (): Promise<Housing[]> => {
  const [userRes, housingsRes] = await Promise.all([
    apiClient.get("/users/me").catch(() => ({ data: { user: null } })),
    apiClient.get("/housing"),
  ]);

  const currentUserId =
    userRes.data.user?._id || userRes.data.user?.studentId;

  const fetchedHousings = housingsRes.data.data || [];

  return fetchedHousings.map((h: any) => formatHousing(h, currentUserId));
};

export const useHousing = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["housings"],
    queryFn: fetchHousings,
  });

  return {
    housings: data ?? [],
    loading: isLoading,
    error: error ? (error as any).message : null,
    refreshHousings: refetch,
  };
};
