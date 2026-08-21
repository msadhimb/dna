export type Comment = {
  id: string | number;
  comment: string;
  arrival_status: "attending" | "not_attending" | "maybe" | string;
  created_at: string;
  guests?: {
    id: string;
    full_name: string;
  };
  [key: string]: unknown;
};

export type CommentsMeta = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

export type GetCommentsParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortDir?: "asc" | "desc";
};

export type GetCommentsResponse = {
  data: {
    comments: Comment[];
  };
  meta: CommentsMeta;
};

export type CommentsListProps = {
  getCommentsData: (params: GetCommentsParams) => Promise<GetCommentsResponse>;
  deleteComment: (id: string) => Promise<any>;
};
