/* redux/features/agentApplication/agentApplicationApi.ts */

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export type AgentApplicationType = "e-wallet" | "cash";
export type AgentApplicationStatus = "pending" | "approved" | "rejected";

export interface IAgentApplication {
  _id: string;
  userId: string;
  customerId: string;
  agentType: AgentApplicationType;
  fullName: string;
  phone: string;
  whatsapp?: string;
  telegram?: string;
  address?: string;
  note?: string;
  status: AgentApplicationStatus;
  adminNote?: string;
  reviewedByAdminId?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AgentApplicationListResponse {
  success: boolean;
  data: IAgentApplication[];
}

/* ────────── API ────────── */
export const agentApplicationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* GET /agent-application/admin/list?status=pending */
    adminGetAgentApplications: builder.query<
      AgentApplicationListResponse,
      { status?: AgentApplicationStatus }
    >({
      query: ({ status = "pending" }) => ({
        url: "/agent-application/admin/list",
        method: "GET",
        params: { status },
      }),
      providesTags: ["AgentApplication"],
    }),

    /* POST /agent-application/admin/:id/approve */
    adminApproveAgentApplication: builder.mutation<
      { success: boolean; message: string },
      { id: string; adminNote?: string }
    >({
      query: ({ id, adminNote }) => ({
        url: `/agent-application/admin/${id}/approve`,
        method: "POST",
        body: { adminNote },
      }),
      invalidatesTags: ["AgentApplication"],
    }),

    /* POST /agent-application/admin/:id/reject */
    adminRejectAgentApplication: builder.mutation<
      { success: boolean; message: string },
      { id: string; adminNote?: string }
    >({
      query: ({ id, adminNote }) => ({
        url: `/agent-application/admin/${id}/reject`,
        method: "POST",
        body: { adminNote },
      }),
      invalidatesTags: ["AgentApplication"],
    }),
  }),
});

export const {
  useAdminGetAgentApplicationsQuery,
  useAdminApproveAgentApplicationMutation,
  useAdminRejectAgentApplicationMutation,
} = agentApplicationApi;
