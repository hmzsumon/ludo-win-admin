/* ────────── imports ────────── */
import { apiSlice } from "../api/apiSlice";

/* ────────── types ────────── */
/* ────────── row types ────────── */
export type AdminUserRow = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  customerId: string;
  country?: string;
  role: string;
  rank?: string;
  generationRewardTier?: string;
  vipTier?: string;
  text_password?: string;

  /* ────────── status & flags ────────── */
  is_active: boolean;
  is_bot?: boolean;
  is_block?: boolean;
  is_withdraw_block?: boolean;
  email_verified?: boolean;
  two_factor_enabled?: boolean;
  kyc_verified?: boolean;
  kyc_request?: boolean;
  kyc_step?: number;
  is_active_aiTrade?: boolean;

  /* ────────── permanent close ────────── */
  is_permanent_closed?: boolean;
  permanent_closed_at?: string;
  permanent_close_reason?: string;

  /* ────────── balances ────────── */
  m_balance?: number;
  demo_balance?: number;
  bet_volume?: number;
  w_balance?: number;
  d_balance?: number;
  last_m_balance?: number;
  s_bonus?: number;
  diamond_balance?: number;
  bonus_diamonds?: number;

  /* ────────── relations ────────── */
  sponsorId?: string;
  sponsorName?: string;
  agentId?: string;
  agentName?: string;
  parents?: string[];
  generationRewardLevels?: any[];

  /* ────────── timestamps ────────── */
  activeAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type UsersResponse = {
  success: boolean;
  users: AdminUserRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    role?: string;
    is_active?: string;
    is_bot?: string;
  };
};

/* ────────── wallet type ────────── */
export type AdminUserWallet = {
  userId: string;
  customerId: string;
  totalReceive: number;
  totalSend: number;
  totalDeposit: number;
  totalWithdraw: number;
  totalPay: number;
  totalWine: number;
  todayWine: number;
  totalEarning: number;
  todayEarning: number;
  thisMonthEarning: number;
  totalCommission: number;
  levelEarning: number;
  totalSponsorBonus: number;
  generationEarning: number;
  totalDepositBonus: number;
  totalGameBonus: number;
  totalReferralBonus: number;
  rankEarning: number;
  totalAiTradeProfit: number;
  totalAiTradeCommission: number;
  totalLiveTradeProfit: number;
  totalLiveTradeCommission: number;
  totalTransferToTrade: number;
  totalTransferToWallet: number;
  totalAiTradeBalance: number;
  totalLiveTradeBalance: number;
  createdAt: string;
  updatedAt: string;
};

/* ────────── details response ────────── */
export type UserDetailsResponse = {
  success: boolean;
  user: AdminUserRow;
  wallet: AdminUserWallet | null;
};

/* ────────── types for transactions ────────── */
export type AdminTransactionRow = {
  _id: string;
  userId: string;
  customerId: string;
  unique_id: string;
  amount: number;
  transactionType: string;
  purpose?: string;
  description?: string;
  isCashIn: boolean;
  isCashOut: boolean;
  previous_m_balance?: number;
  current_m_balance?: number;
  createdAt: string;
  updatedAt: string;
};

export type UserTransactionsResponse = {
  success: boolean;
  transactions: AdminTransactionRow[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
    sortBy: string;
    sortOrder: "asc" | "desc";
    search?: string;
    transactionType?: string;
    isCashIn?: string;
    isCashOut?: string;
  };
};

/* ────────── API ────────── */
export const adminUsersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<
      UsersResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        role?: string;
        is_active?: "true" | "false";
        is_bot?: "true" | "false";
      }
    >({
      query: (q) => {
        const params = new URLSearchParams();
        if (q.page) params.set("page", String(q.page));
        if (q.limit) params.set("limit", String(q.limit));
        if (q.search) params.set("search", q.search);
        if (q.sortBy) params.set("sortBy", q.sortBy);
        if (q.sortOrder) params.set("sortOrder", q.sortOrder);
        if (q.role) params.set("role", q.role);
        if (q.is_active) params.set("is_active", q.is_active);
        if (q.is_bot) params.set("is_bot", q.is_bot);
        const qs = params.toString();
        return { url: `/admin/users${qs ? `?${qs}` : ""}` };
      },
      providesTags: ["Users"],
    }),

    /* ────────── details endpoint ────────── */
    getUserById: builder.query<UserDetailsResponse, { id: string }>({
      query: ({ id }) => ({ url: `/admin/users/${id}` }),
      providesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── transactions endpoint ────────── */
    getUserTransactions: builder.query<
      UserTransactionsResponse,
      {
        id: string;
        page?: number;
        limit?: number;
        search?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        transactionType?: string;
        isCashIn?: "true" | "false";
        isCashOut?: "true" | "false";
      }
    >({
      query: ({ id, ...q }) => {
        const params = new URLSearchParams();
        if (q.page) params.set("page", String(q.page));
        if (q.limit) params.set("limit", String(q.limit));
        if (q.search) params.set("search", q.search);
        if (q.sortBy) params.set("sortBy", q.sortBy);
        if (q.sortOrder) params.set("sortOrder", q.sortOrder);
        if (q.transactionType) params.set("transactionType", q.transactionType);
        if (q.isCashIn) params.set("isCashIn", q.isCashIn);
        if (q.isCashOut) params.set("isCashOut", q.isCashOut);
        const qs = params.toString();
        return { url: `/admin/users/${id}/transactions${qs ? `?${qs}` : ""}` };
      },
      providesTags: (_r, _e, { id }) => [{ type: "Transactions", id }],
    }),

    /* ────────── balance update ────────── */
    adminUpdateBalance: builder.mutation<
      {
        success: boolean;
        message: string;
        previous_balance: number;
        new_balance: number;
      },
      { id: string; amount: number; type: "add" | "deduct"; note?: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/users/${id}/balance`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── email change ────────── */
    adminUpdateEmail: builder.mutation<
      { success: boolean; message: string },
      { id: string; email: string }
    >({
      query: ({ id, email }) => ({
        url: `/admin/users/${id}/email`,
        method: "PATCH",
        body: { email },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── active toggle ────────── */
    adminToggleActive: builder.mutation<
      { success: boolean; is_active: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/admin/users/${id}/toggle-active`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── withdraw block toggle ────────── */
    adminToggleWithdrawBlock: builder.mutation<
      { success: boolean; is_withdraw_block: boolean; message: string },
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/admin/users/${id}/toggle-withdraw-block`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── permanent close ────────── */
    adminPermanentClose: builder.mutation<
      { success: boolean; message: string },
      { id: string; reason?: string }
    >({
      query: ({ id, reason }) => ({
        url: `/admin/users/${id}/permanent-close`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Users", id }],
    }),

    /* ────────── delete transactions ────────── */
    adminDeleteTransactions: builder.mutation<
      { success: boolean; deletedCount: number; message: string },
      { id: string; transactionIds: string[] }
    >({
      query: ({ id, transactionIds }) => ({
        url: `/admin/users/${id}/transactions`,
        method: "DELETE",
        body: { transactionIds },
      }),
      invalidatesTags: (_r, _e, { id }) => [{ type: "Transactions", id }],
    }),

    adminUpdateName: builder.mutation<
      { success: boolean; message: string; user: any },
      { id: string; name: string }
    >({
      query: ({ id, name }) => ({
        url: `/admin/users/${id}/name`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["User", "Users"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useGetUserTransactionsQuery,
  useAdminUpdateBalanceMutation,
  useAdminUpdateEmailMutation,
  useAdminToggleActiveMutation,
  useAdminToggleWithdrawBlockMutation,
  useAdminPermanentCloseMutation,
  useAdminDeleteTransactionsMutation,
  useAdminUpdateNameMutation,
} = adminUsersApi;
