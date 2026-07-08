import { apiSlice } from "../api/apiSlice";
import { setUser } from "../auth/authSlice";

export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // get users from api with typescript
    getUsers: builder.query<any, void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),

    // get user by id
    getUserById: builder.query<any, string>({
      query: (id) => `/get-user-by-customer-id/${id}`,
      providesTags: ["User"],
    }),

    /* ────────── admin user/bot details by mongodb id ────────── */
    getAdminUserDetails: builder.query<any, string>({
      query: (id) => `/admin/users/${id}`,
      providesTags: ["User"],
    }),

    //admin login
    adminLogin: builder.mutation<any, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: "/admin/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(setUser(result.data));
        } catch (error) {
          error as any;
        }
      },
    }),

    // admin dashboard data
    getAdmindashboardData: builder.query<any, any>({
      query: () => ({
        url: "/admin-dashboarg-data",
        method: "GET",
      }),
    }),

    // deposit from admin
    depositFromAdmin: builder.mutation<
      any,
      { customer_id: string; amount: number }
    >({
      query: ({ customer_id, amount }) => ({
        url: "/deposit-from-admin",
        method: "POST",
        body: { customer_id, amount },
      }),
    }),

    // generate password reset code
    generatePasswordResetCode: builder.mutation<any, string>({
      query: (customerId) => ({
        url: `/admin/generate-password-reset-code/${customerId}`,
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── update bot/user name ────────── */
    updateAdminUserName: builder.mutation<any, { id: string; name: string }>({
      query: ({ id, name }) => ({
        url: `/admin/users/${id}/name`,
        method: "PATCH",
        body: { name },
      }),
      invalidatesTags: ["User", "Users"],
    }),

    /* ────────── update bot/user balance ────────── */
    updateAdminUserBalance: builder.mutation<
      any,
      { id: string; amount: number; type: "add" | "deduct"; note?: string }
    >({
      query: ({ id, amount, type, note }) => ({
        url: `/admin/users/${id}/balance`,
        method: "PATCH",
        body: { amount, type, note },
      }),
      invalidatesTags: ["User", "Users"],
    }),

    /* ────────── admin transactions list ────────── */
    getAdminTransactions: builder.query<any, any>({
      query: (params) => ({
        url: "/admin/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["Transactions"],
    }),

    /* ────────── admin transaction details ────────── */
    getAdminTransactionById: builder.query<any, string>({
      query: (id) => `/admin/transactions/${id}`,
      providesTags: ["Transactions"],
    }),

    /* ────────── admin transaction delete ────────── */
    deleteAdminTransactions: builder.mutation<
      any,
      { transactionIds: string[] }
    >({
      query: (body) => ({
        url: "/admin/transactions",
        method: "DELETE",
        body,
      }),
      invalidatesTags: ["Transactions", "User"],
    }),

    // block user
    blockUser: builder.mutation<any, any>({
      query: (body) => ({
        url: `/block_user`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useAdminLoginMutation,
  useGetAdmindashboardDataQuery,
  useDepositFromAdminMutation,
  useGeneratePasswordResetCodeMutation,
  useGetAdminUserDetailsQuery,
  useUpdateAdminUserNameMutation,
  useUpdateAdminUserBalanceMutation,
  useGetAdminTransactionsQuery,
  useGetAdminTransactionByIdQuery,
  useDeleteAdminTransactionsMutation,
  useBlockUserMutation,
} = adminApi;
