import { create } from "zustand";
import clientApi from "@/services/client";
import { CommentsListProps, GetCommentsParams, GetCommentsResponse } from "./type";

const useCommentsList = create<CommentsListProps>(() => ({
  getCommentsData: async (
    params: GetCommentsParams,
  ): Promise<GetCommentsResponse> => {
    const query = new URLSearchParams();

    if (params.page) query.set("page", String(params.page));
    if (params.pageSize) query.set("pageSize", String(params.pageSize));
    if (params.search) query.set("search", params.search);
    if (params.sortBy) query.set("sortBy", params.sortBy);
    if (params.sortDir) query.set("sortDir", params.sortDir);

    const response = await clientApi({
      url: `/comments?${query.toString()}`,
      method: "GET",
    });

    return response;
  },
  deleteComment: async (id: string): Promise<any> => {
    return await clientApi({
      url: `/comments/${id}`,
      method: "DELETE",
    });
  },
}));

export default useCommentsList;
