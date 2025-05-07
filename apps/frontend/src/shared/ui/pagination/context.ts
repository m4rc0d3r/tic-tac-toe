import { createContext, useContext } from "react";

type PaginationState = {
  total: number;
  itemsPerPage: number;
  pageCount: number;
  currentPage: number;
  siblingCount: number;
  showEdges: boolean;
  onPageChange?: ((value: number) => void) | undefined;
  onItemsPerPageChange?: ((value: number) => void) | undefined;
};

const DEFAULT_PAGINATION_STATE: PaginationState = {
  total: 0,
  itemsPerPage: 0,
  pageCount: 0,
  currentPage: 1,
  siblingCount: 1,
  showEdges: true,
};

const PaginationContext = createContext<PaginationState>(DEFAULT_PAGINATION_STATE);

const usePagination = () => {
  const context = useContext(PaginationContext);

  if (context === undefined) {
    throw new Error("usePagination must be used within a PaginationContext provider");
  }

  return context;
};

export { DEFAULT_PAGINATION_STATE, PaginationContext, usePagination };
export type { PaginationState };
