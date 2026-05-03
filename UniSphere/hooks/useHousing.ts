import { useState, useEffect, useCallback, useRef } from "react";
import apiClient from "../app/services/api";

export interface Housing {
  id: string;
  title: string;
  location: string;
  rentPrice: number;
  roomType: string;
  images?: string[];
  isMine: boolean;
}

export const useHousing = () => {
  const [housings, setHousings] = useState<Housing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialMount = useRef(true);

  const formatHousing = (h: any, currentUserId?: string): Housing => ({
    id: typeof h._id === 'string' ? h._id : typeof h.id === 'string' ? h.id : '',
    title: h.title,
    location: h.address,
    rentPrice: h.rentPrice,
    roomType: h.roomType,
    images: h.images || [],
    isMine: currentUserId ? h.postedBy === currentUserId : false,
  });

  const fetchHousings = useCallback(async () => {
    try {
      if (isInitialMount.current) {
        setLoading(true);
      }

      const [userRes, housingsRes] = await Promise.all([
        apiClient.get("/users/me").catch(() => ({ data: { user: null } })),
        apiClient.get("/housing"),
      ]);

      const currentUserId =
        userRes.data.user?._id || userRes.data.user?.studentId;

      const fetchedHousings = housingsRes.data.data || [];

      const processedHousings = fetchedHousings.map((h: any) =>
        formatHousing(h, currentUserId)
      );

      setHousings(processedHousings);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch housings");
      if (isInitialMount.current) {
        setHousings([]);
      }
    } finally {
      if (isInitialMount.current) {
        setLoading(false);
        isInitialMount.current = false;
      }
    }
  }, []);

  useEffect(() => {
    fetchHousings();
  }, [fetchHousings]);

  return {
    housings,
    loading,
    error,
    refreshHousings: fetchHousings,
  };
};
