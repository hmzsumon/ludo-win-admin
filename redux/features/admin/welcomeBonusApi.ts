import { apiSlice } from "../api/apiSlice";

export type WelcomeBonusStatus =
  | "pending"
  | "granted"
  | "denied"
  | "failed"
  | "untracked";

export type WelcomeBonusDetails = {
  status: WelcomeBonusStatus;
  granted: boolean;
  amount: number;
  reasonCode: string;
  reason: string;
  deviceKey: string;
  source: "registration" | "admin" | "legacy";
  checkedAt?: string | null;
  grantedAt?: string | null;
  grantedByName?: string;
  manualNote?: string;
  attempts?: number;
  canGrantManually: boolean;
  transactionId?: string | null;
};

export type WelcomeBonusRecord = WelcomeBonusDetails & {
  userId: string;
  customerId: string;
  name: string;
  phone?: string;
  email?: string;
  registeredAt: string;
  verified: boolean;
};

export type WelcomeBonusListResponse = {
  success: boolean;
  records: WelcomeBonusRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export type WelcomeBonusSummaryResponse = {
  success: boolean;
  summary: {
    totalUsers: number;
    granted: number;
    denied: number;
    failed: number;
    pending: number;
    manualGranted: number;
    sameDeviceDenied: number;
    untracked: number;
  };
};

export const welcomeBonusApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWelcomeBonusRecords: builder.query<
      WelcomeBonusListResponse,
      {
        page?: number;
        limit?: number;
        search?: string;
        status?: WelcomeBonusStatus | "all";
        reasonCode?: string;
      }
    >({
      query: ({ page = 1, limit = 20, search, status, reasonCode }) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (search) params.set("search", search);
        if (status && status !== "all") params.set("status", status);
        if (reasonCode) params.set("reasonCode", reasonCode);
        return `/admin/welcome-bonuses?${params.toString()}`;
      },
      providesTags: ["WelcomeBonuses"],
    }),

    getWelcomeBonusSummary: builder.query<WelcomeBonusSummaryResponse, void>({
      query: () => "/admin/welcome-bonuses/summary",
      providesTags: ["WelcomeBonuses"],
    }),

    grantWelcomeBonus: builder.mutation<
      {
        success: boolean;
        message: string;
        welcomeBonus: {
          granted: boolean;
          status: string;
          amount: number;
          reason: string;
        };
      },
      { userId: string; note?: string }
    >({
      query: ({ userId, note }) => ({
        url: `/admin/welcome-bonuses/${userId}/grant`,
        method: "POST",
        body: { note },
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        "WelcomeBonuses",
        { type: "Users", id: userId },
      ],
    }),
  }),
});

export const {
  useGetWelcomeBonusRecordsQuery,
  useGetWelcomeBonusSummaryQuery,
  useGrantWelcomeBonusMutation,
} = welcomeBonusApi;
