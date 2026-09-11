import { apiSlice } from "../api/apiSlice";

/* ────────── 🎮 Shared activity response ────────── */
export type GameActivity = {
  id: string;
  game: string;
  occurredAt: string;
  reference?: string;
  status: string;
  bet: number;
  payout: number;
  refund: number;
  net: number | null;
  detail?: string;
  opponent?: string;
  multiplier?: number;
  slot?: number;
  systemIssue?: boolean;
  systemIssueDetails?: string;
};
export type ActivityFilters = { game: string; status: string; from: string; to: string; page: number };
export type GameActivitiesResponse = {
  success: boolean;
  user: { _id: string; name: string; customerId: string };
  games: { id: string; label: string }[];
  statuses: string[];
  activities: GameActivity[];
  summary: { total: number; totalBet: number; totalPayout: number; totalRefund: number; net: number; active: number };
  pagination: { page: number; limit: number; total: number; totalPages: number };
};

export const gameActivitiesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserGameActivities: builder.query<GameActivitiesResponse, ActivityFilters & { id: string }>({
      query: ({ id, ...filters }) => {
        const params = new URLSearchParams({ limit: "20" });
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== "") params.set(key, String(value));
        });
        return `/admin/users/${id}/game-activities?${params}`;
      },
      providesTags: ["User"],
    }),
  }),
});
export const { useGetUserGameActivitiesQuery } = gameActivitiesApi;
