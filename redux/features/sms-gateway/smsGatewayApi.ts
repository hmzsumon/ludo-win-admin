import { apiSlice } from "../api/apiSlice";

export type GatewayStatus = "online" | "offline" | "disabled";
export type SmsStatus = "pending" | "processing" | "sent" | "failed" | "cancelled";

export type SmsGatewayDevice = {
  _id: string;
  name: string;
  deviceUid: string;
  deviceModel?: string;
  status: GatewayStatus;
  selectedSimSubscriptionId?: number | null;
  selectedSimLabel?: string;
  batteryLevel?: number;
  networkType?: string;
  appVersion?: string;
  lastSeenAt?: string;
  sentToday: number;
  failedToday: number;
  totalSent?: number;
  totalFailed?: number;
  createdAt: string;
  updatedAt: string;
};

export type SmsGatewayMessage = {
  _id: string;
  phone: string;
  message: string;
  purpose: "otp" | "notification" | "transaction" | "other";
  status: SmsStatus;
  priority: number;
  attempts: number;
  maxAttempts: number;
  availableAt: string;
  processedBy?: Pick<SmsGatewayDevice, "_id" | "name" | "deviceModel"> | string;
  lockedBy?: Pick<SmsGatewayDevice, "_id" | "name" | "deviceModel"> | string;
  sentAt?: string;
  failedAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
};

export type GatewayOverview = {
  devices: { total: number; online: number; offline: number; disabled: number };
  messages: { pending: number; processing: number; sentToday: number; failedToday: number };
};

export const smsGatewayApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getSmsGatewayOverview: builder.query<{ success: boolean; data: GatewayOverview }, void>({
      query: () => "/admin/sms-gateways/overview",
      providesTags: ["SmsGateways"],
    }),
    getSmsGateways: builder.query<
      { success: boolean; data: SmsGatewayDevice[]; pagination: { total: number; page: number; limit: number; totalPages: number } },
      { page?: number; limit?: number; search?: string; status?: string }
    >({
      query: (params) => ({ url: "/admin/sms-gateways", params }),
      providesTags: ["SmsGateways"],
    }),
    getSmsGatewayDetails: builder.query<
      { success: boolean; data: { device: SmsGatewayDevice; stats: Record<string, number>; recentMessages: SmsGatewayMessage[] } },
      string
    >({
      query: (id) => `/admin/sms-gateways/${id}`,
      providesTags: (_r, _e, id) => [{ type: "SmsGateways", id }],
    }),
    getSmsGatewayMessages: builder.query<
      { success: boolean; data: SmsGatewayMessage[]; pagination: { total: number; page: number; limit: number; totalPages: number } },
      { page?: number; limit?: number; search?: string; status?: string; purpose?: string; deviceId?: string }
    >({
      query: (params) => ({ url: "/admin/sms-gateways/messages", params }),
      providesTags: ["SmsGatewayMessages"],
    }),
    updateSmsGatewayStatus: builder.mutation<
      { success: boolean; message: string; data: SmsGatewayDevice },
      { id: string; status: "offline" | "disabled" }
    >({
      query: ({ id, status }) => ({
        url: `/admin/sms-gateways/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (_r, _e, arg) => ["SmsGateways", { type: "SmsGateways", id: arg.id }],
    }),
    retrySmsGatewayMessage: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/admin/sms-gateways/messages/${id}/retry`, method: "POST" }),
      invalidatesTags: ["SmsGatewayMessages", "SmsGateways"],
    }),
  }),
});

export const {
  useGetSmsGatewayOverviewQuery,
  useGetSmsGatewaysQuery,
  useGetSmsGatewayDetailsQuery,
  useGetSmsGatewayMessagesQuery,
  useUpdateSmsGatewayStatusMutation,
  useRetrySmsGatewayMessageMutation,
} = smsGatewayApi;
