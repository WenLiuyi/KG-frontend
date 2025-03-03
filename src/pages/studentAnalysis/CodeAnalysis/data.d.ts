export type CodeListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: Date;
  id: string;
};

export type CodeListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type CodeListData = {
  list: CodeListItem[];
  pagination: Partial<CodeListPagination>;
};

export type CodeListParams = {
  key?: number;
  status?: string;
  name?: string;
  id?: string;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
