import { apiSlice } from "@/redux/features/api/apiSlice";

export type AppAnalyticsSummary = {
  range: { from: string; to: string };
  downloads: {
    totalRequests: number;
    uniqueDownloaders: number;
    today: number;
  };
  installations: {
    total: number;
    today: number;
    linkedToUsers: number;
    conversionRate: number;
  };
  activity: {
    onlineNow: number;
    today: number;
    last7Days: number;
    last30Days: number;
    onlineWindowSeconds: number;
  };
  trend: Array<{ date: string; installs: number; downloads: number }>;
  versions: Array<{
    _id: { appVersion: string; versionCode: number };
    installations: number;
    active30Days: number;
  }>;
  devices: Array<{
    _id: { manufacturer: string; model: string };
    installations: number;
    lastSeenAt: string;
  }>;
  sources: Array<{ _id: string; installations: number }>;
};

export type AppInstallationRow = {
  _id: string;
  displayId: string;
  source: "android-twa" | "legacy-standalone" | "pwa";
  packageName: string;
  appVersion: string;
  versionCode: number;
  deviceManufacturer: string;
  deviceModel: string;
  androidVersion: string;
  androidSdk: number;
  browser: string;
  operatingSystem: string;
  screenWidth: number;
  screenHeight: number;
  timezone: string;
  countryCode: string;
  city: string;
  firstOpenedAt: string;
  lastOpenedAt: string;
  lastSeenAt: string;
  openCount: number;
  heartbeatCount: number;
  linkedUserCount: number;
  isOnline: boolean;
  activityStatus: "online" | "active" | "inactive";
  lastUser?: {
    _id: string;
    name: string;
    customerId: string;
    phone: string;
  } | null;
};

export type AppAnalyticsFilters = {
  from: string;
  to: string;
};

export type AppInstallationFilters = {
  page: number;
  limit: number;
  search?: string;
  status?: "online" | "active7d" | "active30d" | "inactive";
  source?: "android-twa" | "legacy-standalone" | "pwa";
  version?: string;
};

type SummaryResponse = { success: boolean; data: AppAnalyticsSummary };
type InstallationsResponse = {
  success: boolean;
  data: AppInstallationRow[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export const appAnalyticsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAppAnalyticsSummary: builder.query<SummaryResponse, AppAnalyticsFilters>({
      query: (params) => ({ url: "/admin/app-analytics/summary", params }),
      providesTags: ["AppAnalytics"],
    }),
    getAppInstallations: builder.query<
      InstallationsResponse,
      AppInstallationFilters
    >({
      query: (params) => ({
        url: "/admin/app-analytics/installations",
        params,
      }),
      providesTags: ["AppAnalytics"],
    }),
  }),
});

export const {
  useGetAppAnalyticsSummaryQuery,
  useGetAppInstallationsQuery,
} = appAnalyticsApi;
