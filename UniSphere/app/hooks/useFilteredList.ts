import { useMemo } from "react";

type UseFilteredListParams<T> = {
  items?: T[];
  searchText: string;
  selectedFilter?: string;
  searchFields?: (keyof T)[];
  filterField?: keyof T;
  customFilter?: (item: T) => boolean;
};

export const useFilteredList = <T>({
  items,
  searchText,
  selectedFilter,
  searchFields = [],
  filterField,
  customFilter,
}: UseFilteredListParams<T>) => {
  return useMemo(() => {
    // 🔥 Ensure items is always an array
    const safeItems: T[] = Array.isArray(items) ? items : [];

    const normalizedSearch = searchText.trim().toLowerCase();

    return safeItems.filter((item) => {
      // 🔍 Search logic
      const matchesSearch =
        !normalizedSearch ||
        searchFields.some((field) => {
          const value = item[field];
          return String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch);
        });

      // 🎯 Filter logic
      const matchesFilter =
        !selectedFilter ||
        selectedFilter === "ALL" ||
        !filterField ||
        String(item[filterField] ?? "").toUpperCase() ===
          selectedFilter.toUpperCase();

      // ⚙️ Custom filter
      const matchesCustomFilter = customFilter
        ? customFilter(item)
        : true;

      return matchesSearch && matchesFilter && matchesCustomFilter;
    });
  }, [
    items,
    searchText,
    selectedFilter,
    searchFields,
    filterField,
    customFilter,
  ]);
};