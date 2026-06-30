// Central place to edit menu items
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarDays,
  Download,
  Grid2x2,
  LifeBuoy,
  Megaphone,
  MessageSquare,
  Settings,
  SquareChartGantt,
  SquareGanttChart,
  Upload,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export type NavChild = { label: string; sublabel?: string; href: string };
export type NavItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: "new" | number;
  children?: NavChild[];
  section?: "default" | "bottom";
};

export const NAV_ITEMS: NavItem[] = [
  { key: "dashboard", label: "Dashboard", icon: Grid2x2, href: "/dashboard" },
  {
    key: "total-overview",
    label: "Total Overview",
    icon: SquareChartGantt,
    href: "/total-overview",
  },
  { key: "users", label: "All Users", icon: Users, href: "/users" },
  { key: "bots", label: "All Bots", icon: Bot, href: "/bots" },
  { key: "agents", label: "All Agents", icon: Users, href: "/agents" },

  {
    key: "monthly-reports",
    label: "Monthly Reports",
    icon: CalendarDays,
    href: "/monthly-reports",
  },

  {
    key: "deposits",
    label: "Deposits",
    icon: Download,

    children: [
      { label: "All Deposits", href: "/deposits/all" },
      { label: "Agent Float Requests", href: "/float-requests" },
      {
        label: "Manual Deposits",
        href: "/deposits/manual",
      },
      {
        label: " Agent Manual Deposits",
        href: "/manual-float",
      },
    ],
  },

  {
    key: "withdraw",
    label: "Withdrawals",
    icon: Upload,

    children: [
      { label: "All Withdrawals", href: "/withdrawals/all" },
      {
        label: "Pending Withdrawals",
        href: "/withdrawals/pending",
      },
    ],
  },

  {
    key: "wallet",
    label: "Wallet",
    icon: Wallet,

    children: [
      {
        label: "Payments Methods",
        href: "/deposit-payment-methods",
      },
    ],
  },
  {
    key: "bot-config",
    label: "Bot Config",
    icon: Bot,
    href: "/ludo-bot-config",
  },

  {
    key: "notices",
    label: "User Notices",
    icon: Megaphone,
    href: "/notices",
  },
  {
    key: "agent-notices",
    label: "Agent Notices",
    icon: MessageSquare,
    href: "/agent-notices",
  },
  {
    key: "maintenance",
    label: "Maintenance",
    icon: Wrench,
    href: "/maintenance",
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,

    children: [
      { label: "Profile", href: "/settings/profile" },
      {
        label: "Security",
        href: "/settings/security",
      },
    ],
  },

  {
    key: "chat",
    label: "Live Chat",
    icon: MessageSquare,
    href: "/dashboard/chat",
    section: "bottom",
  },
  {
    key: "support",
    label: "Support",
    icon: LifeBuoy,
    href: "/dashboard/support",
  },
];

export const INVITE_CARD = {
  title: "Invite friends and earn money",
  icon: SquareGanttChart,
  href: "/dashboard/referrals",
};
