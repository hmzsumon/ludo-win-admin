/* ════════════════════════════════════════════════════════════════
   AdminUserDetailsPage
   — component based smart user details + সব management actions
   ════════════════════════════════════════════════════════════════ */
"use client";

/* ────────── imports ────────── */
import UserDangerZone from "@/components/admin/user-details/UserDangerZone";
import UserDetailsActions from "@/components/admin/user-details/UserDetailsActions";
import UserDetailsHeader from "@/components/admin/user-details/UserDetailsHeader";
import UserDetailsInfoSections from "@/components/admin/user-details/UserDetailsInfoSections";
import {
  BalanceModal,
  EmailModal,
  PermanentCloseModal,
} from "@/components/admin/user-details/UserDetailsModals";
import UserDetailsStats from "@/components/admin/user-details/UserDetailsStats";
import UserSupportPanel from "@/components/admin/user-details/UserSupportPanel";
import UserWalletSummary from "@/components/admin/user-details/UserWalletSummary";
import {
  useAdminPermanentCloseMutation,
  useAdminToggleActiveMutation,
  useAdminToggleWithdrawBlockMutation,
  useAdminUpdateBalanceMutation,
  useAdminUpdateEmailMutation,
  useGetUserByIdQuery,
} from "@/redux/features/admin/adminUsersApi";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

/* ════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════ */
export default function AdminUserDetailsPage() {
  /* ────────── params/router ────────── */
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();

  /* ────────── data ────────── */
  const { data, isLoading, isFetching, refetch } = useGetUserByIdQuery({ id });
  const user = data?.user;
  const wallet = data?.wallet;

  /* ────────── mutations ────────── */
  const [updateBalance, { isLoading: balanceLoading }] =
    useAdminUpdateBalanceMutation();
  const [updateEmail, { isLoading: emailLoading }] =
    useAdminUpdateEmailMutation();
  const [toggleActive, { isLoading: activeLoading }] =
    useAdminToggleActiveMutation();
  const [toggleWithdraw, { isLoading: withdrawLoading }] =
    useAdminToggleWithdrawBlockMutation();
  const [permanentClose, { isLoading: closeLoading }] =
    useAdminPermanentCloseMutation();

  /* ────────── modal state ────────── */
  const [balanceModal, setBalanceModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  /* ────────── form state ────────── */
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<"add" | "deduct">("add");
  const [balanceNote, setBalanceNote] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [closeReason, setCloseReason] = useState("");

  /* ────────── toast state ────────── */
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* ────────── balance handler ────────── */
  const handleBalanceUpdate = async () => {
    const amt = parseFloat(balanceAmount);
    if (!amt || amt <= 0) return showToast("Valid amount দিন", "error");
    try {
      const res = await updateBalance({
        id,
        amount: amt,
        type: balanceType,
        note: balanceNote,
      }).unwrap();
      showToast(res.message);
      setBalanceModal(false);
      setBalanceAmount("");
      setBalanceNote("");
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Failed", "error");
    }
  };

  /* ────────── email handler ────────── */
  const handleEmailUpdate = async () => {
    if (!newEmail.includes("@")) return showToast("Valid email দিন", "error");
    try {
      const res = await updateEmail({ id, email: newEmail }).unwrap();
      showToast(res.message);
      setEmailModal(false);
      setNewEmail("");
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Failed", "error");
    }
  };

  /* ────────── active toggle handler ────────── */
  const handleToggleActive = async () => {
    try {
      const res = await toggleActive({ id }).unwrap();
      showToast(res.message);
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Failed", "error");
    }
  };

  /* ────────── withdraw toggle handler ────────── */
  const handleToggleWithdraw = async () => {
    try {
      const res = await toggleWithdraw({ id }).unwrap();
      showToast(res.message);
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Failed", "error");
    }
  };

  /* ────────── permanent close handler ────────── */
  const handlePermanentClose = async () => {
    try {
      const res = await permanentClose({ id, reason: closeReason }).unwrap();
      showToast(res.message);
      setCloseModal(false);
      refetch();
    } catch (e: any) {
      showToast(e?.data?.message ?? "Failed", "error");
    }
  };

  /* ────────── loading ────────── */
  if (isLoading || isFetching) {
    return (
      <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
        <div className="mx-auto max-w-7xl py-6 animate-pulse space-y-4">
          <div className="h-8 w-72 rounded-xl bg-[rgb(var(--app-surface-3))]/70" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-20 rounded-2xl bg-[rgb(var(--app-surface-2))]/70"
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-[rgb(var(--app-surface-2))]/70" />
        </div>
      </main>
    );
  }

  /* ────────── not found ────────── */
  if (!user) {
    return (
      <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
        <div className="mx-auto max-w-7xl p-6">
          <button
            onClick={() => router.back()}
            className="text-sm text-teal-300 hover:underline"
          >
            ← Go Back
          </button>
          <div className="mt-6 rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-8 text-center text-[rgb(var(--app-text-muted))]">
            User not found.
          </div>
        </div>
      </main>
    );
  }

  /* ────────── render ────────── */
  return (
    <main className="min-h-screen bg-transparent text-[rgb(var(--app-text))]">
      {/* ────────── Toast ────────── */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-[100] rounded-xl border px-4 py-3 text-sm font-medium shadow-xl transition-all ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
              : "border-rose-500/30 bg-rose-500/15 text-rose-300"
          }`}
        >
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      <div className="mx-auto max-w-7xl py-6 space-y-6">
        {/* ════════════════════════════════════
            HEADER
            ════════════════════════════════════ */}
        <UserDetailsHeader user={user} onBack={() => router.back()} />

        {/* ════════════════════════════════════
            KEY STATS
            ════════════════════════════════════ */}
        <UserDetailsStats user={user} wallet={wallet} />

        {/* ════════════════════════════════════
            ACTION CARDS ROW
            ════════════════════════════════════ */}
        <UserDetailsActions
          user={user}
          activeLoading={activeLoading}
          withdrawLoading={withdrawLoading}
          onOpenBalance={() => setBalanceModal(true)}
          onOpenEmail={() => {
            setNewEmail(user.email ?? "");
            setEmailModal(true);
          }}
          onToggleActive={handleToggleActive}
          onToggleWithdraw={handleToggleWithdraw}
        />

        {/* ════════════════════════════════════
            USER INFO + SECURITY CARD
            ════════════════════════════════════ */}
        <UserDetailsInfoSections user={user} />

        {/* ════════════════════════════════════
            WALLET SUMMARY
            ════════════════════════════════════ */}
        <UserWalletSummary wallet={wallet} />

        <UserSupportPanel user={user} onDone={refetch} />

        {/* ════════════════════════════════════
            DANGER ZONE
            ════════════════════════════════════ */}
        <UserDangerZone user={user} onOpenClose={() => setCloseModal(true)} />
      </div>

      {/* ════════════════════════════════════
          MODALS
          ════════════════════════════════════ */}
      <BalanceModal
        open={balanceModal}
        user={user}
        balanceAmount={balanceAmount}
        balanceType={balanceType}
        balanceNote={balanceNote}
        balanceLoading={balanceLoading}
        onClose={() => setBalanceModal(false)}
        onAmountChange={setBalanceAmount}
        onTypeChange={setBalanceType}
        onNoteChange={setBalanceNote}
        onConfirm={handleBalanceUpdate}
      />

      <EmailModal
        open={emailModal}
        user={user}
        newEmail={newEmail}
        emailLoading={emailLoading}
        onClose={() => setEmailModal(false)}
        onEmailChange={setNewEmail}
        onConfirm={handleEmailUpdate}
      />

      <PermanentCloseModal
        open={closeModal}
        closeReason={closeReason}
        closeLoading={closeLoading}
        onClose={() => setCloseModal(false)}
        onReasonChange={setCloseReason}
        onConfirm={handlePermanentClose}
      />
    </main>
  );
}
