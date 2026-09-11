import { apiSlice } from "../api/apiSlice";

/* ────────── 🎁 Bonus Management API ────────── */
export type BonusType = "welcome" | "deposit" | "daily" | "sponsor" | "referral" | "vipCashback";
export type BonusRule = { enabled: boolean; turnoverMultiplier: number };
export const bonusManagementApi = apiSlice.enhanceEndpoints({ addTagTypes: ["BonusManagement"] }).injectEndpoints({
  endpoints: (builder) => ({
    getBonusManagement: builder.query<{ success: boolean; rules: Record<BonusType, BonusRule> }, void>({
      query: () => "/admin/bonus-management",
      providesTags: ["BonusManagement"],
    }),
    updateBonusManagement: builder.mutation<{ success: boolean; rule: BonusRule }, { type: BonusType; rule: BonusRule }>({
      query: ({ type, rule }) => ({ url: `/admin/bonus-management/${type}`, method: "PATCH", body: rule }),
      invalidatesTags: ["BonusManagement"],
    }),
  }),
});
export const { useGetBonusManagementQuery, useUpdateBonusManagementMutation } = bonusManagementApi;
