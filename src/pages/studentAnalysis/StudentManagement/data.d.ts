export type StuTableListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: Date;
  num: string;
};

export type StuTableListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type StuTableListParams = {
  key?: number;
  status?: string;
  name?: string;
  num?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};

export type StuTableListData = {
  list: StuTableListItem[];
  pagination: Partial<StuTableListPagination>;
};
