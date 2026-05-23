/* ────────── imports ────────── */
import { removeAccessToken, saveAccessToken } from "@/utils/authToken";
import { apiSlice } from "../api/apiSlice";
import { loadUser, logoutUser, setUser } from "./authSlice";

/* ────────── user response type ────────── */
export interface IUser {
  user: any;
  token: string;
  success: boolean;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

/* ────────── auth api ────────── */
export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ────────── get users ────────── */
    getUsers: builder.query<any, void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    /* ────────── get verify code for register ────────── */
    getVerifyCodeForRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/get-verify-code-for-register",
        method: "POST",
        body,
      }),
    }),

    /* ────────── verify code for registration ────────── */
    verifyCodeForRegister: builder.mutation<any, any>({
      query: (body) => ({
        url: "/verify-code-for-register",
        method: "POST",
        body,
      }),
    }),

    /* ────────── register user ────────── */
    registerUser: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),

    /* ────────── verify email ────────── */
    verifyEmail: builder.mutation<
      { success: boolean; message: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── login user ────────── */
    loginUser: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;

          /* ────────── persist access token for socket auth ────────── */
          saveAccessToken(result?.data?.token || null);

          /* ────────── sync redux auth state ────────── */
          dispatch(setUser(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    /* ────────── load user ────────── */
    loadUser: builder.query<any, void>({
      query: () => ({
        url: "/load-user",
        method: "GET",
      }),
      providesTags: [{ type: "User" as const, id: "ME" }],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(loadUser(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    /* ────────── logout user ────────── */
    logoutUser: builder.mutation<any, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          /* ────────── clear persisted token ────────── */
          removeAccessToken();

          /* ────────── clear redux auth state ────────── */
          dispatch(logoutUser());
        } catch (error) {
          console.log(error);
        }
      },
    }),

    /* ────────── resend verification email ────────── */
    resendVerificationEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/resend-email-verification",
        method: "POST",
        body,
      }),
    }),

    /* ────────── check user by email ────────── */
    checkUserByEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/check-user-by-email",
        method: "POST",
        body,
      }),
    }),

    /* ────────── verify code for change email ────────── */
    verifyCodeForChangeEmail: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/verify-code-for-change-email",
        method: "POST",
        body,
      }),
    }),

    /* ────────── find user by email or username ────────── */
    findUserByEmailOrUsername: builder.mutation<any, any>({
      query: (emailOrUserName) => ({
        url: `/find-user-by-email-username?emailOrUsername=${emailOrUserName}`,
        method: "PUT",
      }),
    }),

    /* ────────── check email exist or not ────────── */
    checkEmailExistOrNot: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-email-exist`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── my address ────────── */
    myAddress: builder.query<any, any>({
      query: () => ({
        url: `/my-address`,
        method: "GET",
      }),
    }),

    /* ────────── security verify ────────── */
    securityVerify: builder.mutation<any, any>({
      query: (body) => ({
        url: `/security-verify`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── reset password ────────── */
    resetPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/reset-password`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── my wallet ────────── */
    myWallet: builder.query<any, any>({
      query: () => ({
        url: `/my-wallet`,
        method: "GET",
      }),
    }),

    /* ────────── get dashboard data ────────── */
    getDashboard: builder.query<any, any>({
      query: () => ({
        url: `/dashboard-data`,
        method: "GET",
      }),
    }),

    /* ────────── security verify 2 ────────── */
    securityVerify2: builder.mutation<any, any>({
      query: (body) => ({
        url: `/security-verification`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── update mobile number ────────── */
    updateMobileNumber: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-mobile`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── update address ────────── */
    updateAddress: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-address`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── check old password ────────── */
    checkOldPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-old-password`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── check old pin ────────── */
    checkOldPin: builder.mutation<any, any>({
      query: (body) => ({
        url: `/check-old-pass-code`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── update pin ────────── */
    updatePin: builder.mutation<any, any>({
      query: (body) => ({
        url: `/update-pass-code`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── send new pin email ────────── */
    sendNewPinEmail: builder.mutation<any, any>({
      query: (body) => ({
        url: `/send-pass-code`,
        method: "POST",
        body,
      }),
    }),

    /* ────────── check user by custom id ────────── */
    checkUserByCustomId: builder.query<any, any>({
      query: (id) => ({
        url: `/check-user-by-customer-id/${id}`,
        method: "GET",
      }),
    }),

    /* ────────── add user payment method ────────── */
    addUserPaymentMethod: builder.mutation<any, any>({
      query: (body) => ({
        url: `/add-user-payment-method`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── get user payment methods ────────── */
    getUserPaymentMethods: builder.query<any, any>({
      query: () => ({
        url: `/get-user-payment-methods`,
        method: "GET",
      }),
    }),

    /* ────────── verify otp for forgot password ────────── */
    verifyOtpForForgotPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/get-verify-otp-for-forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── set security pin ────────── */
    setSecurityPin: builder.mutation<any, { newPin: string; oldPin?: string }>({
      query: (body) => ({
        url: "/security-pin",
        method: "PUT",
        body,
      }),
    }),

    /* ────────── change email ────────── */
    changeEmail: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/account/email",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── change phone ────────── */
    changePhone: builder.mutation<{ message: string }, { phone: string }>({
      query: (body) => ({
        url: "/account/phone",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    /* ────────── change password ────────── */
    changePassword: builder.mutation<
      any,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/change-password",
        method: "PUT",
        body,
      }),
    }),

    /* ────────── send reset code ────────── */
    sendResetCode: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: "/resend-verification-email",
        method: "POST",
        body,
      }),
    }),

    /* ────────── verify reset code ────────── */
    verifyResetCode: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/verify-otp-for-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── reset forgot password ────────── */
    resetForgotPassword: builder.mutation<
      { message: string },
      { email: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/reset-forgot-password",
        method: "POST",
        body,
      }),
    }),

    /* ────────── end ────────── */
  }),
});

/* ────────── exports ────────── */
export const {
  useGetVerifyCodeForRegisterMutation,
  useVerifyCodeForRegisterMutation,
  useGetUsersQuery,
  useRegisterUserMutation,
  useVerifyEmailMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useResendVerificationEmailMutation,
  useCheckUserByEmailMutation,
  useLoadUserQuery,
  useChangeEmailMutation,
  useVerifyCodeForChangeEmailMutation,
  useFindUserByEmailOrUsernameMutation,
  useCheckEmailExistOrNotMutation,
  useMyAddressQuery,
  useSecurityVerifyMutation,
  useResetPasswordMutation,
  useMyWalletQuery,
  useGetDashboardQuery,
  useSecurityVerify2Mutation,
  useUpdateMobileNumberMutation,
  useUpdateAddressMutation,
  useCheckOldPasswordMutation,
  useCheckOldPinMutation,
  useUpdatePinMutation,
  useSendNewPinEmailMutation,
  useLazyCheckUserByCustomIdQuery,
  useAddUserPaymentMethodMutation,
  useGetUserPaymentMethodsQuery,
  useVerifyOtpForForgotPasswordMutation,
  useSetSecurityPinMutation,
  useChangePhoneMutation,
  useChangePasswordMutation,
  useSendResetCodeMutation,
  useVerifyResetCodeMutation,
  useResetForgotPasswordMutation,
} = authApi;
