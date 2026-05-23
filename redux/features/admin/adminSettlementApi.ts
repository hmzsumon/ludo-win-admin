import { apiSlice } from "../api/apiSlice";

/* ─────────────────────────────────────────────────────────────
 * Admin Settlement API
 * - Float requests list/approve/reject
 * - Commission settlement
 * - CompanyDue settlement
 * ──────────────────────────────────────────────────────────── */

export const adminSettlementApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Float Requests ────────── */
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

    /* ────────── Commission Settlement ────────── */
    adminSettleAgentCommission: builder.mutation<
      any,
      {
        agentId: string;
        amount: number;
        payoutMethod: "cash" | "balance";
        txnId: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/settle-commission`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── CompanyDue Settlement ────────── */
    adminSettleCompanyDue: builder.mutation<
      any,
      {
        agentId: string;
        amount: number;
        action: "receive_from_agent" | "pay_to_agent";
        txnId: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/settle-company-due`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── Manual Float ────────── */
    adminManualFloat: builder.mutation<
      any,
      {
        agentId: string;
        type: "topup" | "return";
        amount: number;
        txnId: string;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agents/${agentId}/manual-float`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── Search Agents ────────── */
    adminSearchAgents: builder.query<any, { q: string }>({
      query: ({ q }) => ({
        url: `/admin/agents/search?q=${encodeURIComponent(q)}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAdminGetFloatRequestsQuery,
  useAdminApproveFloatRequestMutation,
  useAdminRejectFloatRequestMutation,
  useAdminSettleAgentCommissionMutation,
  useAdminSettleCompanyDueMutation,

  useAdminManualFloatMutation,

  useAdminSearchAgentsQuery,
} = adminSettlementApi;
