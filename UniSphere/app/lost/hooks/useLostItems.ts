import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getLostItemById,
  getAllLostItems,
  createLostItem,
  deleteLostItem,
  updateLostItem,
} from "../services/itemApi";

/* =========================
   🔹 QUERY: GET ONE ITEM
========================= */
export const useLostItemDetailQuery = (itemId: string) => {
  return useQuery({
    queryKey: ["lostItem", itemId],
    queryFn: () => getLostItemById(itemId),
    enabled: !!itemId,
  });
};

/* =========================
   🔹 QUERY: GET ALL ITEMS
========================= */
export const useLostItemsListQuery = () => {
  return useQuery({
    queryKey: ["lostItems"],
    queryFn: getAllLostItems,
  });
};

/* =========================
   🔹 MUTATION: CREATE ITEM
========================= */
export const useCreateLostItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLostItem,

    onSuccess: () => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["lostItems"] });
    },
  });
};

/* =========================
   🔹 MUTATION: DELETE ITEM
========================= */
export const useDeleteLostItemMutation = (navigation?: any) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => deleteLostItem(itemId),

    onSuccess: (_, deletedItemId) => {
      // refresh list
      queryClient.invalidateQueries({ queryKey: ["lostItems"] });

      // remove detail cache
      queryClient.removeQueries({ queryKey: ["lostItem", deletedItemId] });

      if (navigation) {
        navigation.goBack();
      }
    },
  });
};

/* =========================
   🔹 MUTATION: UPDATE ITEM
========================= */
export const useUpdateLostItemMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      itemData,
    }: {
      itemId: string;
      itemData: any;
    }) => updateLostItem(itemId, itemData),

    onSuccess: (_, variables) => {
      // refresh detail
      queryClient.invalidateQueries({
        queryKey: ["lostItem", variables.itemId],
      });

      // refresh list
      queryClient.invalidateQueries({ queryKey: ["lostItems"] });
    },
  });
};