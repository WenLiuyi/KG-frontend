export type fileListItem = {
  key: number;
  fileId: string;
  fileName: string;
  status: string;
  updatedAt: Date;
};

export type fileListPagination = {
  total: number;
  pageSize: number;
  current: number;
};

export type fileListData = {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
};

export type fileListParams = {
  status?: string;
  fileId?: string;
  fileName?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
