import { apiSlice } from "../api/apiSlice";

export const notificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── Admin Notifications List ────────── */
    getNotifications: builder.query<any, void>({
      query: () => "/admin/notifications",
      providesTags: ["Notifications"],
    }),

    /* ────────── Admin Notifications Mark Read ────────── */
    updateNotification: builder.mutation<any, string[]>({
      query: (notificationIds) => ({
        url: "/admin/notification/read-many",
        method: "PUT",
        body: { notificationIds },
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const { useGetNotificationsQuery, useUpdateNotificationMutation } =
  notificationApi;
