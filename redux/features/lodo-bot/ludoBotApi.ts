/* redux/features/ludo-bot/ludoBotApi.ts */

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export interface ILudoBotConfig {
  _id: string;
  enabled: boolean;
  matchTimeoutSeconds: number;
  activeMode: "easy" | "assist" | "smart";
  /** NEW ▸ Human six chance for Bot-vs-Human only. */
  humanSixChancePercent: number;
  /** NEW ▸ Admin-controlled Play With Friends feature switches. */
  playWithFriendsEnabled: boolean;
  freeFriendsEnabled: boolean;
  wagerFriendsEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LudoBotConfigResponse {
  success: boolean;
  config: ILudoBotConfig;
}

export interface UpdateLudoBotConfigPayload {
  enabled?: boolean;
  matchTimeoutSeconds?: number;
  activeMode?: "easy" | "assist" | "smart";
  humanSixChancePercent?: number;
  playWithFriendsEnabled?: boolean;
  freeFriendsEnabled?: boolean;
  wagerFriendsEnabled?: boolean;
}

/* ────────── API ────────── */
export const ludoBotApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* GET /admin/ludo-bot-config */
    getLudoBotConfig: builder.query<LudoBotConfigResponse, void>({
      query: () => "/admin/ludo-bot-config",
      providesTags: ["LudoBotConfig"],
    }),

    /* PATCH /admin/ludo-bot-config */
    updateLudoBotConfig: builder.mutation<
      LudoBotConfigResponse,
      UpdateLudoBotConfigPayload
    >({
      query: (body) => ({
        url: "/admin/ludo-bot-config",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["LudoBotConfig"],
    }),
  }),
});

export const { useGetLudoBotConfigQuery, useUpdateLudoBotConfigMutation } =
  ludoBotApi;
