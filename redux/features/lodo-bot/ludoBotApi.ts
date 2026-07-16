/* redux/features/ludo-bot/ludoBotApi.ts */

import { apiSlice } from "../api/apiSlice";

/* ────────── Types ────────── */
export interface ILudoBotConfig {
  _id: string;
  enabled: boolean;
  matchTimeoutSeconds: number;
  activeMode: "easy" | "assist" | "smart";
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
