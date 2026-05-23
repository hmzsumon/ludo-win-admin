/* ────────── imports ────────── */
import { apiSlice } from "../api/apiSlice";

/* ────────── types ────────── */
export type AgentNoticeMode = "all" | "selected";

export type SendAgentNoticeBody = {
  mode: AgentNoticeMode;
  title: string;
  message: string;
  url?: string;
  agentIds?: string[];
};

export type SendAgentNoticeResponse = {
  success: boolean;
  message: string;
  data: {
    mode: AgentNoticeMode;
    sentCount: number;
    batchKey: string;
  };
};

/* ────────── API ────────── */
export const agentNoticeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── admin থেকে all/selected agent notice send ────────── */
    sendAgentNotice: builder.mutation<
      SendAgentNoticeResponse,
      SendAgentNoticeBody
    >({
      query: (body) => ({
        url: "/admin/agent-notices",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useSendAgentNoticeMutation } = agentNoticeApi;
