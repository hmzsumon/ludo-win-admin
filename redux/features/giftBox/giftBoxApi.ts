/* redux/features/giftBox/giftBoxApi.ts */

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export interface IGiftBoxTier {
  amount: number;
  probabilityPercent: number;
  isJackpot: boolean;
  isActive: boolean;
}

export interface IGiftBoxConfig {
  _id: string;
  enabled: boolean;
  tiers: IGiftBoxTier[];
  dailyBudgetLimit: number;
  jackpotDailyLimit: number;
  turnoverMultiplier: number;
  createdAt: string;
  updatedAt: string;
}

export interface GiftBoxConfigResponse {
  success: boolean;
  config: IGiftBoxConfig;
}

export interface UpdateGiftBoxConfigPayload {
  enabled?: boolean;
  tiers?: IGiftBoxTier[];
  dailyBudgetLimit?: number;
  jackpotDailyLimit?: number;
  turnoverMultiplier?: number;
}

export interface GiftBoxStatsResponse {
  success: boolean;
  stats: {
    todayKey: string;
    todaySpend: number;
    dailyBudgetLimit: number;
    remainingBudget: number | null;
    todayJackpotCount: number;
    jackpotDailyLimit: number;
    claimsToday: number;
  };
}

/* ────────── API ────────── */
export const giftBoxApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* GET /gift-box/admin/config */
    getGiftBoxConfig: builder.query<GiftBoxConfigResponse, void>({
      query: () => "/gift-box/admin/config",
      providesTags: ["GiftBoxConfig"],
    }),

    /* PATCH /gift-box/admin/config */
    updateGiftBoxConfig: builder.mutation<
      GiftBoxConfigResponse,
      UpdateGiftBoxConfigPayload
    >({
      query: (body) => ({
        url: "/gift-box/admin/config",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["GiftBoxConfig"],
    }),

    /* GET /gift-box/admin/config/stats */
    getGiftBoxStats: builder.query<GiftBoxStatsResponse, void>({
      query: () => "/gift-box/admin/config/stats",
      providesTags: ["GiftBoxConfig"],
    }),
  }),
});

export const {
  useGetGiftBoxConfigQuery,
  useUpdateGiftBoxConfigMutation,
  useGetGiftBoxStatsQuery,
} = giftBoxApi;
