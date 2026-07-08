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
import UserWalletSummary from "@/components/admin/user-details/UserWalletSummary";
import {
  useAdminPermanentCloseMutation,
  useAdminToggleActiveMutation,
  useAdminToggleWithdrawBlockMutation,
  useAdminUpdateBalanceMutation,
  useAdminUpdateEmailMutation,
  useAdminUpdateNameMutation,
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
  const [updateName, { isLoading: nameLoading }] = useAdminUpdateNameMutation();
  const [toggleActive, { isLoading: activeLoading }] =
    useAdminToggleActiveMutation();
  const [toggleWithdraw, { isLoading: withdrawLoading }] =
    useAdminToggleWithdrawBlockMutation();
  const [permanentClose, { isLoading: closeLoading }] =
    useAdminPermanentCloseMutation();

  /* ────────── modal state ────────── */
  const [balanceModal, setBalanceModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [nameModal, setNameModal] = useState(false);
  const [closeModal, setCloseModal] = useState(false);

  /* ────────── form state ────────── */
  const [balanceAmount, setBalanceAmount] = useState("");
  const [balanceType, setBalanceType] = useState<"add" | "deduct">("add");
  const [balanceNote, setBalanceNote] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
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

  /* ────────── name handler ────────── */
  const handleNameUpdate = async () => {
    const cleanName = newName.trim();

    if (!cleanName) return showToast("Valid name দিন", "error");
    if (cleanName.length < 2)
      return showToast("Name minimum 2 characters হতে হবে", "error");

    try {
      const res = await updateName({ id, name: cleanName }).unwrap();
      showToast(res.message ?? "Name updated successfully");
      setNameModal(false);
      setNewName("");
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
        <UserDetailsHeader user={user} onBack={() => router.back()} />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              setNewName(user.name ?? "");
              setNameModal(true);
            }}
            className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300 hover:bg-cyan-400/20"
          >
            ✏️ Change Name
          </button>
        </div>

        <UserDetailsStats user={user} wallet={wallet} />

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

        <UserDetailsInfoSections user={user} />

        <UserWalletSummary wallet={wallet} />

        <UserDangerZone user={user} onOpenClose={() => setCloseModal(true)} />
      </div>

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

      {nameModal && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 px-4">
          <div className="w-full max-w-md rounded-2xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface))] p-5 shadow-2xl">
            <h3 className="text-lg font-bold">Change Name</h3>

            <div className="mt-4 space-y-2">
              <label className="text-sm text-[rgb(var(--app-text-muted))]">
                Name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-xl border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))] px-4 py-3 text-sm outline-none focus:border-cyan-400"
                placeholder="Enter name"
              />
            </div>

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setNameModal(false)}
                className="rounded-xl border border-[rgb(var(--app-border))] px-4 py-2 text-sm font-semibold text-[rgb(var(--app-text-muted))] hover:bg-[rgb(var(--app-surface-2))]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleNameUpdate}
                disabled={nameLoading}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {nameLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
