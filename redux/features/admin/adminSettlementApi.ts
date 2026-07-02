import { apiSlice } from "../api/apiSlice";

/* ─────────────────────────────────────────────────────────────
 * Admin Settlement API
 * - Agent preview before commission settlement
 * - Commission settlement
 * - Old float/company due endpoints kept for existing imports
 * ──────────────────────────────────────────────────────────── */

export const adminSettlementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Agent List Dropdown ────────── */
    adminGetSettlementAgents: builder.query<any, void>({
      query: () => ({
        url: `/agents`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    /* ────────── Agent Preview ────────── */
    adminGetSettlementAgentPreview: builder.query<any, { agentId: string }>({
      query: ({ agentId }) => ({
        url: `/agents/${encodeURIComponent(agentId)}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    /* ────────── Search Agents ────────── */
    adminSearchAgents: builder.query<any, { q: string }>({
      query: ({ q }) => ({
        url: `/admin/agents/search?q=${encodeURIComponent(q)}`,
        method: "GET",
      }),
      providesTags: ["Admin"],
    }),

    /* ────────── Commission Settlement ────────── */
    adminSettleAgentCommission: builder.mutation<
      any,
      {
        agentId: string;
        amount: number;
        payoutMethod: "cash" | "balance";
        txnId?: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/settle-commission`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    /* ────────── Float Requests (old support) ────────── */
    adminGetFloatRequests: builder.query<
      any,
      { status?: string; type?: string }
    >({
      query: (params) => {
        const qs = new URLSearchParams();
        if (params?.status) qs.set("status", params.status);
        if (params?.type) qs.set("type", params.type);
        return {
          url: `/admin/float-requests?${qs.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["FloatRequests"],
    }),

    adminApproveFloatRequest: builder.mutation<
      any,
      { id: string; adminNote?: string }
    >({
      query: ({ id, adminNote }) => ({
        url: `/admin/float-requests/${id}/approve`,
        method: "POST",
        body: { adminNote: adminNote || "" },
      }),
      invalidatesTags: ["FloatRequests"],
    }),

    adminRejectFloatRequest: builder.mutation<
      any,
      { id: string; adminNote?: string }
    >({
      query: ({ id, adminNote }) => ({
        url: `/admin/float-requests/${id}/reject`,
        method: "POST",
        body: { adminNote: adminNote || "" },
      }),
      invalidatesTags: ["FloatRequests"],
    }),

    /* ────────── CompanyDue Settlement (old support) ────────── */
    adminSettleCompanyDue: builder.mutation<
      any,
      {
        agentId: string;
        amount: number;
        action: "receive_from_agent" | "pay_to_agent";
        txnId?: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/settle-company-due`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    /* ────────── Manual Float (old support) ────────── */
    adminManualFloat: builder.mutation<
      any,
      {
        agentId: string;
        type: "topup" | "return";
        amount: number;
        txnId?: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/manual-float`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useAdminGetSettlementAgentsQuery,
  useLazyAdminGetSettlementAgentPreviewQuery,
  useLazyAdminSearchAgentsQuery,
  useAdminSettleAgentCommissionMutation,

  useAdminGetFloatRequestsQuery,
  useAdminApproveFloatRequestMutation,
  useAdminRejectFloatRequestMutation,
  useAdminSettleCompanyDueMutation,
  useAdminManualFloatMutation,
  useAdminSearchAgentsQuery,
} = adminSettlementApi;
