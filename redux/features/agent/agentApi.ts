import { apiSlice } from "../api/apiSlice";

export const agentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get agents from api with typescript
    getAgents: builder.query<any, void>({
      query: () => "/agents",
    }),

    // get agent by id from api with typescript
    getAgentById: builder.query<any, string>({
      query: (id) => `/agents/${id}`,
    }),

    // agent register
    agentRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agent-register",
        method: "POST",
        body,
      }),
    }),

    // update agent
    updateAgent: builder.mutation<any, any>({
      query: (body) => ({
        url: "/agents",
        method: "PUT",
        body,
      }),
    }),

    // delete agent
    deleteAgent: builder.mutation<any, string>({
      query: (id) => ({
        url: `/agents/${id}`,
        method: "DELETE",
      }),
    }),

    // set agent credit limit
    setAgentCreditLimit: builder.mutation<
      any,
      { id: string; creditLimit: number }
    >({
      query: ({ id, creditLimit }) => ({
        url: `/agents/${id}/credit-limit`,
        method: "PATCH",
        body: { creditLimit },
      }),
    }),

    // get agent ledger
    getAgentLedger: builder.query<any, { id: string; limit?: number }>({
      query: ({ id, limit = 50 }) => `/agents/${id}/ledger?limit=${limit}`,
    }),

    /* ────────── Agent Monitoring (Admin) ────────── */

    // players
    getAgentPlayers: builder.query<
      any,
      { id: string; search?: string; page?: number; limit?: number }
    >({
      query: ({ id, search = "", page = 1, limit = 20 }) =>
        `/agents/${id}/players?search=${encodeURIComponent(search)}&page=${page}&limit=${limit}`,
    }),

    // deposits
    getAgentDeposits: builder.query<
      any,
      { id: string; status?: string; page?: number; limit?: number }
    >({
      query: ({ id, status = "", page = 1, limit = 20 }) =>
        `/agents/${id}/deposits?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`,
    }),

    // withdraws
    getAgentWithdraws: builder.query<
      any,
      { id: string; status?: string; page?: number; limit?: number }
    >({
      query: ({ id, status = "", page = 1, limit = 20 }) =>
        `/agents/${id}/withdraws?status=${encodeURIComponent(status)}&page=${page}&limit=${limit}`,
    }),

    /* ────────── Commission Config (Admin) ────────── */

    // get agent commission config
    getAgentCommissionConfig: builder.query<any, { agentId: string }>({
      query: ({ agentId }) => `/admin/agent/${agentId}/commission-config`,
    }),

    // update agent commission config
    updateAgentCommissionConfig: builder.mutation<
      any,
      {
        agentId: string;
        depositPercent: number;
        withdrawPercent: number;
        isActive: boolean;
        note?: string;
      }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/admin/agent/${agentId}/commission-config`,
        method: "PUT",
        body,
      }),
    }),

    /* ────────── update agent account ────────── */
    updateAgentAccount: builder.mutation<
      any,
      { agentId: string; name?: string; email?: string; password?: string }
    >({
      query: ({ agentId, ...body }) => ({
        url: `/agents/${agentId}/account`,
        method: "PUT",
        body,
      }),
    }),
  }),
});

export const {
  useGetAgentsQuery,
  useGetAgentByIdQuery,
  useAgentRegisterMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,

  useSetAgentCreditLimitMutation,
  useGetAgentLedgerQuery,

  useGetAgentPlayersQuery,
  useGetAgentDepositsQuery,
  useGetAgentWithdrawsQuery,
  useGetAgentCommissionConfigQuery,
  useUpdateAgentCommissionConfigMutation,

  useUpdateAgentAccountMutation,

  useLazyGetAgentByIdQuery,
} = agentApi;
