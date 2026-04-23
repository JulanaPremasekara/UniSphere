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
  items = [],
  searchText,
  selectedFilter,
  searchFields = [],
  filterField,
  customFilter,
}: UseFilteredListParams<T>) => {
  return useMemo(() => {
    return items.filter((item) => {
      const normalizedSearch = searchText.trim().toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        searchFields.some((field) => {
          const value = item[field];

          return String(value ?? "")
            .toLowerCase()
            .includes(normalizedSearch);
        });

      const matchesFilter =
        !selectedFilter ||
        selectedFilter === "ALL" ||
        !filterField ||
        String(item[filterField] ?? "").toUpperCase() ===
          selectedFilter.toUpperCase();

      const matchesCustomFilter = customFilter ? customFilter(item) : true;

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