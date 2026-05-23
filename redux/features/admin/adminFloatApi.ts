import { apiSlice } from "../api/apiSlice";

/* ─────────────────────────────────────────────────────────────
 * Admin Float API
 * - Admin manual float topup/return
 * ──────────────────────────────────────────────────────────── */

export const adminFloatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // manual float apply (topup/return)
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
  }),
});

export const { useAdminManualFloatMutation } = adminFloatApi;
