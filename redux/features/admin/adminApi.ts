/* ──────────  adminApi.ts  ──────────
   Admin panel এর সব API endpoint এখানে।
   Smart SystemStats dashboard/overview response type add করা হয়েছে।
────────────────────────────────────── */

import { saveAccessToken } from "@/utils/authToken";
import { apiSlice } from "../api/apiSlice";
import { setUser } from "../auth/authSlice";

/* ──────────  Reusable Period Type  ────────── */
export interface IPeriodStats {
  total: number;
  today: number;
  thisMonth: number;
  lastMonth: number;
}

/* ──────────  Financial Period Type  ────────── */
export interface IFinancialPeriodItem {
  income: number;
  cost: number;
  netProfit: number;
  status: "profit" | "loss" | "break_even" | string;
}

export interface IFinancialPeriodStats {
  total: IFinancialPeriodItem;
  today: IFinancialPeriodItem;
  thisMonth: IFinancialPeriodItem;
  lastMonth: IFinancialPeriodItem;
}

/* ──────────  Maintenance Response Type  ────────── */
export interface IMaintenanceStatus {
  maintenanceMode: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
  maintenanceGif: string;
}

/* ──────────  Response Types  ────────── */
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

/* ──────────  Smart Dashboard Response Type  ────────── */
export interface IDashboardData {
  users: {
    count: IPeriodStats;
    active: IPeriodStats;
    loggedIn: number;
  };

  agents: {
    count: IPeriodStats;
    loggedIn: number;
    currentBalance: number;
    commission: IPeriodStats;
    depositCommission: IPeriodStats;
    withdrawCommission: IPeriodStats;
    topUp: IPeriodStats;
  };

  finance: {
    deposits: {
      amount: IPeriodStats;
      count: IPeriodStats;
      pendingAmount: number;
      pendingCount: number;
    };
    agentDeposits: {
      amount: IPeriodStats;
    };
    withdrawals: {
      amount: IPeriodStats;
      count: IPeriodStats;
      charge: IPeriodStats;
      pendingAmount: number;
      pendingCount: number;
    };
  };

  games: {
    count: IPeriodStats;
    feeCollected: IPeriodStats;
  };

  bots: {
    gamesPlayed: IPeriodStats;
    gamesWon: IPeriodStats;
    gamesLost: IPeriodStats;
    wonAmount: IPeriodStats;
    lostAmount: IPeriodStats;
    netPnL: IPeriodStats;
  };

  bonuses: {
    total: IPeriodStats;
    deposit: IPeriodStats;
    referral: IPeriodStats;
    daily: IPeriodStats;
    spin: IPeriodStats;
    manual: IPeriodStats;
    vipCashback: IPeriodStats;
    welcome: IPeriodStats;
  };

  financials: IFinancialPeriodStats;

  incomeBreakdown: {
    gameFee: IPeriodStats;
    botWin: IPeriodStats;
  };

  costBreakdown: {
    agentCommission: IPeriodStats;
    agentDepositCommission: IPeriodStats;
    agentWithdrawCommission: IPeriodStats;
    botLoss: IPeriodStats;
    bonuses: {
      total: IPeriodStats;
      deposit: IPeriodStats;
      referral: IPeriodStats;
      daily: IPeriodStats;
      spin: IPeriodStats;
      manual: IPeriodStats;
      vipCashback: IPeriodStats;
      welcome: IPeriodStats;
    };
  };
}

/* ──────────  Total Overview Response Type  ────────── */
export interface IOverviewData {
  companyInfo: {
    companyName: string;
    shortName?: string;
    email?: string;
    phone?: string;
    website?: string;
    currency: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country: string;
    about?: string;
    logo: {
      main: string;
      icon: string;
    };
  };

  raw?: any;

  formatted: {
    users: {
      count: IPeriodStats;
      active: IPeriodStats;
      loggedIn: number;
    };

    agents: {
      count: IPeriodStats;
      loggedIn: number;
      currentBalance: number;
      commission: IPeriodStats;
      depositCommission: IPeriodStats;
      withdrawCommission: IPeriodStats;

      // ✅ এইটাই missing ছিল
      topUp: IPeriodStats;
    };

    deposits: {
      amount: IPeriodStats;
      count: IPeriodStats;
      pendingAmount: number;
      pendingCount: number;
    };

    withdrawals: {
      amount: IPeriodStats;
      count: IPeriodStats;
      charge: IPeriodStats;
      pendingAmount: number;
      pendingCount: number;
    };

    matches: {
      count: IPeriodStats;
      feeCollected: IPeriodStats;
    };

    bots: {
      gamesPlayed: IPeriodStats;
      gamesWon: IPeriodStats;
      gamesLost: IPeriodStats;
      wonAmount: IPeriodStats;
      lostAmount: IPeriodStats;
    };

    bonuses: {
      total: IPeriodStats;
      deposit: IPeriodStats;
      referral: IPeriodStats;
      daily: IPeriodStats;
      spin: IPeriodStats;
      manual: IPeriodStats;
      vipCashback: IPeriodStats;
      welcome: IPeriodStats;
    };

    financials: IFinancialPeriodStats;
    isProfitEnabled: boolean;
  };
}

/* ──────────  Admin API Slice  ────────── */
export const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    /* ──────────  Admin Login  ────────── */
    loginAdmin: builder.mutation<IUser, any>({
      query: (body) => ({
        url: "/admin/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          saveAccessToken(result?.data?.token || null);
          dispatch(setUser(result.data));
        } catch (error) {
          console.log(error);
        }
      },
    }),

    /* ──────────  Get All Users  ────────── */
    getUsers: builder.query<any, void>({
      query: () => "/admin/users",
      providesTags: ["Users"],
    }),

    /* ──────────  Get Admin Dashboard  ────────── */
    getAdminDashboard: builder.query<
      { success: boolean; dashboardData: IDashboardData },
      void
    >({
      query: () => "/admin/dashboard-summary",
      providesTags: ["Dashboard"],
    }),

    /* ──────────  Get Total Overview  ────────── */
    getTotalOverview: builder.query<
      { success: boolean; overview: IOverviewData },
      void
    >({
      query: () => "/admin/total-overview",
      providesTags: ["Dashboard"],
    }),

    /* ──────────  Get Maintenance Status  ────────── */
    getMaintenanceStatus: builder.query<
      { success: boolean; maintenance: IMaintenanceStatus },
      void
    >({
      query: () => "/admin/maintenance",
      providesTags: ["Maintenance"],
    }),

    /* ──────────  Update Maintenance Status  ────────── */
    updateMaintenanceStatus: builder.mutation<
      { success: boolean; message: string; maintenance: IMaintenanceStatus },
      Partial<IMaintenanceStatus>
    >({
      query: (body) => ({
        url: "/admin/maintenance",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Maintenance"],
    }),
  }),
});

/* ──────────  Exports  ────────── */
export const {
  useLoginAdminMutation,
  useGetUsersQuery,
  useGetAdminDashboardQuery,
  useGetTotalOverviewQuery,
  useGetMaintenanceStatusQuery,
  useUpdateMaintenanceStatusMutation,
} = adminApi;
