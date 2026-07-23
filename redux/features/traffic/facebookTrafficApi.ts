import { apiSlice } from "@/redux/features/api/apiSlice";

export type TrafficFilters = {
  from: string;
  to: string;
  source?: "facebook" | "instagram" | "meta";
};

export type BreakdownRow = {
  _id: Record<string, string>;
  sessions: number;
  pageViews: number;
  clicks: number;
  arrivals: number;
  registered: number;
  verified: number;
};

export type FacebookTrafficSummary = {
  range: { from: string; to: string };
  totals: {
    sessions: number;
    pageViews: number;
    uniqueVisitors: number;
    clicks: number;
    arrivals: number;
    registered: number;
    verified: number;
    registrationRate: number;
  };
  timeSeries: Array<{
    date: string;
    sessions: number;
    pageViews: number;
    clicks: number;
    arrivals: number;
    registered: number;
  }>;
  campaigns: BreakdownRow[];
  sources: BreakdownRow[];
  devices: BreakdownRow[];
  browsers: BreakdownRow[];
};

export type FacebookTrafficVisitor = {
  _id: string;
  visitorId: string;
  sessionId: string;
  source: string;
  medium: string;
  campaignId: string;
  campaignName: string;
  adSetId: string;
  adSetName: string;
  adId: string;
  adName: string;
  placement: string;
  browser: string;
  operatingSystem: string;
  deviceType: string;
  countryCode: string;
  city: string;
  pageViews: number;
  ctaClicks: number;
  mainSiteArrivals: number;
  lastCtaLocation: string;
  firstSeenAt: string;
  lastSeenAt: string;
  registeredAt?: string | null;
  verifiedAt?: string | null;
  registeredUser?: {
    _id: string;
    name: string;
    customerId: string;
    phone: string;
  } | null;
};

type SummaryResponse = {
  success: boolean;
  data: FacebookTrafficSummary;
};

type VisitorsResponse = {
  success: boolean;
  data: FacebookTrafficVisitor[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    from: string;
    to: string;
  };
};

export const facebookTrafficApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFacebookTrafficSummary: builder.query<SummaryResponse, TrafficFilters>({
      query: (params) => ({
        url: "/admin/facebook-traffic",
        params,
      }),
      providesTags: ["FacebookTraffic"],
    }),
    getFacebookTrafficVisitors: builder.query<
      VisitorsResponse,
      TrafficFilters & { page: number; limit: number; search?: string }
    >({
      query: (params) => ({
        url: "/admin/facebook-traffic/visitors",
        params,
      }),
      providesTags: ["FacebookTraffic"],
    }),
  }),
});

export const {
  useGetFacebookTrafficSummaryQuery,
  useGetFacebookTrafficVisitorsQuery,
} = facebookTrafficApi;
