/* ────────── imports ────────── */
import { apiSlice } from "../api/apiSlice";

/* ────────── types ────────── */
export type UserNoticeMode = "all" | "selected";

export type SendUserNoticeBody = {
  mode: UserNoticeMode;
  title: string;
  message: string;
  url?: string;
  userIds?: string[];
};

export type SendUserNoticeResponse = {
  success: boolean;
  message: string;
  data: {
    mode: UserNoticeMode;
    sentCount: number;
    batchKey: string;
  };
};

/* ────────── API ────────── */
export const userNoticeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── admin থেকে all/selected user notice send ────────── */
    sendUserNotice: builder.mutation<SendUserNoticeResponse, SendUserNoticeBody>({
      query: (body) => ({
        url: "/admin/user-notices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useSendUserNoticeMutation } = userNoticeApi;
