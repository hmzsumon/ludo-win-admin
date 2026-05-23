import { apiSlice } from "../api/apiSlice";

/* ────────── types (align with backend) ────────── */
export type Deposit = {
  _id: string;
  userId?: string;
  orderId?: string;
  name?: string;
  phone?: string;
  email?: string;
  customerId?: string;
  amount: number;
  charge?: number;
  receivedAmount?: number;
  destinationAddress?: string;
  qrCode?: string; // base64
  chain?: string; // e.g. "usdt"
  status: "pending" | "approved" | "rejected";
  isApproved?: boolean;
  isExpired?: boolean;
  confirmations?: number;
  isManual?: boolean;
  callbackUrl?: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
  approvedAt?: string;
  callbackReceivedAt?: string;
  txId?: string;
  sl_no?: number;
};

type ListResponse = {
  deposits: Deposit[];
  total?: number;
};

type SingleResponse = {
  deposit: Deposit;
};

/* ────────── preview response ────────── */
type PreviewRes = {
  ok: boolean;
  user: {
    _id: string;
    name: string;
    email: string;
    customerId: string;
    phone?: string;
    is_active?: boolean;
  };
  amount: number;
  current: {
    m_balance: number;
    d_balance: number;
    totalDeposit: number;
  };
  next: {
    m_balance: number;
    d_balance: number;
    totalDeposit: number;
  };
};

type CreateReq = {
  customerId: string;
  amount: number;
  note?: string;
};

type CreateRes = {
  ok: boolean;
  message: string;
  deposit: any; // চাইলে Deposit টাইপ ইউজ করুন
};

/* ────────── endpoints ────────── */
export const depositApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── GET: all deposits (with optional filters/pagination) ────────── */
    createDepositRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),

    // get my deposits or logged in user deposits
    getMyDeposits: builder.query<any, any>({
      query: () => "/my-deposits",
      providesTags: ["Deposits"],
    }),

    // get single deposit
    getDeposit: builder.query<any, any>({
      query: (id) => `/deposit/${id}`,
      providesTags: ["Deposits"],
    }),

    // get active deposit method
    getActiveDepositMethod: builder.query<any, any>({
      query: () => "/deposit-method/active",
    }),

    // deposit with binance
    depositWithBinance: builder.mutation<any, any>({
      query: (body) => ({
        url: "/binance-payment",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── Get Payment Methods ────────── */
    getPaymentMethods: builder.query<any, any>({
      query: () => "/payment-methods",
    }),

    /* ────────── Create new Deposit with BDT ────────── */
    createDepositWithBDT: builder.mutation<any, any>({
      query: (body) => ({
        url: "/create-new-deposit-bdt",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposits"],
    }),
    /* ────────── Get Single Payment Method By Name ────────── */
    getPaymentMethodByName: builder.query<any, string>({
      query: (methodName) => `/payment-methods/${methodName}`,
    }),

    /* ────────── Get all Deposit for admin ────────── */
    getAllDeposits: builder.query<any, any>({
      query: () => "/admin/all-deposits",
      providesTags: ["Deposits"],
    }),

    /* ────────── GET: all deposits (with optional filters/pagination) ────────── */
    getAllDepositRequests: builder.query<
      ListResponse,
      { status?: string; page?: number; limit?: number } | void
    >({
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.status) params.set("status", args.status);
        if (args?.page) params.set("page", String(args.page));
        if (args?.limit) params.set("limit", String(args.limit));
        const qs = params.toString();
        return {
          url: `/admin/deposits-bdt${qs ? `?${qs}` : ""}`,
          method: "GET",
        };
      },
      providesTags: (res) =>
        res?.deposits
          ? [
              ...res.deposits.map((d) => ({
                type: "Deposit" as const,
                id: d._id,
              })),
              { type: "Deposit" as const, id: "LIST" },
            ]
          : [{ type: "Deposit" as const, id: "LIST" }],
    }),

    /* ────────── GET: single deposit by id ────────── */
    getSingleDepositRequest: builder.query<SingleResponse, string>({
      query: (depositId) => ({
        url: `/admin/deposit/${depositId}`,
        method: "GET",
      }),
      providesTags: (_res, _err, id) => [{ type: "Deposit", id }],
    }),

    /* ────────── admin preview ────────── */
    previewManualDeposit: builder.query<
      PreviewRes,
      { customerId: string; amount: number }
    >({
      query: (q) => ({
        url: `/admin/deposits/preview?customerId=${encodeURIComponent(
          q.customerId,
        )}&amount=${q.amount}`,
        method: "GET",
      }),
    }),

    /* ────────── admin create ────────── */
    createManualDeposit: builder.mutation<CreateRes, CreateReq>({
      query: (body) => ({
        url: `/create/manual/deposit`,
        method: "POST",
        body,
      }),
      // সফল হলে লিস্ট রিফ্রেশ করতে চাইলে:
      invalidatesTags: [{ type: "Deposit", id: "LIST" }],
    }),

    /* ────────── Admin Approve Deposit ────────── */
    approveDepositRequest: builder.mutation<any, string>({
      query: (depositId) => ({
        url: `/admin/deposit/${depositId}/approve`,
        method: "POST",
      }),
      invalidatesTags: (_res, _err, id) => [
        { type: "Deposit", id },
        { type: "Deposit", id: "LIST" },
      ],
    }),

    /* ────────── Admin Deposit Payment Methods ────────── */
    getDepositPaymentMethods: builder.query<any, void>({
      query: () => ({
        url: "/admin/deposit-payment-methods",
        method: "GET",
      }),
      providesTags: ["Deposit"],
    }),

    /* ────────── Create Deposit Payment Method ────────── */
    createDepositPaymentMethod: builder.mutation<any, any>({
      query: (body) => ({
        url: "/admin/deposit-payment-methods",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Deposit"],
    }),

    /* ────────── Update Deposit Payment Method ────────── */
    updateDepositPaymentMethod: builder.mutation<
      any,
      { id: string; body: any }
    >({
      query: ({ id, body }) => ({
        url: `/admin/deposit-payment-methods/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Deposit"],
    }),

    /* ────────── Toggle Deposit Payment Method ────────── */
    toggleDepositPaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/deposit-payment-methods/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Deposit"],
    }),

    /* ────────── Delete Deposit Payment Method ────────── */
    deleteDepositPaymentMethod: builder.mutation<any, string>({
      query: (id) => ({
        url: `/admin/deposit-payment-methods/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Deposit"],
    }),
  }),
});

export const {
  useCreateDepositRequestMutation,
  useGetMyDepositsQuery,
  useGetDepositQuery,
  useGetActiveDepositMethodQuery,
  useDepositWithBinanceMutation,
  useGetPaymentMethodsQuery,
  useCreateDepositWithBDTMutation,
  useGetPaymentMethodByNameQuery,
  useGetAllDepositsQuery,

  useGetAllDepositRequestsQuery,
  useGetSingleDepositRequestQuery,

  usePreviewManualDepositQuery,
  useLazyPreviewManualDepositQuery,
  useCreateManualDepositMutation,
  useApproveDepositRequestMutation,
  useGetDepositPaymentMethodsQuery,
  useCreateDepositPaymentMethodMutation,
  useUpdateDepositPaymentMethodMutation,
  useToggleDepositPaymentMethodMutation,
  useDeleteDepositPaymentMethodMutation,
} = depositApi;
