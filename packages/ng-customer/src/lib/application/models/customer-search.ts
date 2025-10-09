export interface CustomerFilter {
  search?: string;
  limit?: number;
}

export interface CustomerSearch {
  search?: string;
  pageSize?: number;
  pageIndex?: number;
}
