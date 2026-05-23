"use client";

import { useAgentRegisterMutation } from "@/redux/features/agent/agentApi";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
} from "@mui/material";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CloseIcon from "../game-ui/CloseIcon";

/* ──────────────────────────────────────────────────────────────────────────
 * AgentCreateModal
 * - Dedicated Create Agent Form (Admin)
 * - Validations + Error Toast (400/401/404)
 * - Smart UI: password toggle, loading, reset, clean layout
 * ────────────────────────────────────────────────────────────────────────── */

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: () => void; // refresh agent list after success
};

type ToastState = {
  open: boolean;
  type: "success" | "error" | "warning" | "info";
  message: string;
};

function isEmailValid(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPhoneValid(phone: string) {
  // Bangladesh friendly basic check (customize if needed)
  // Allows: 01XXXXXXXXX or +8801XXXXXXXXX
  const p = phone.replace(/\s+/g, "");
  return /^(?:\+?8801|01)\d{9}$/.test(p);
}

function normalizeApiError(err: any) {
  /* ────────── RTK Query error shape handling ──────────
     - err.status
     - err.data.message
     - err.error
  */
  const status = err?.status;
  const msg =
    err?.data?.message ||
    err?.data?.error ||
    err?.error ||
    err?.message ||
    "Request failed";

  if (status === 401)
    return "401 Unauthorized — Admin login expired. Please login again.";
  if (status === 403)
    return "403 Forbidden — You are not allowed (admin role required).";
  if (status === 404)
    return "404 Not Found — API route missing (/agent-register).";
  if (status === 400) return `400 Bad Request — ${msg}`;
  if (status === 500) return `500 Server Error — ${msg}`;
  return `${status || ""} ${msg}`.trim();
}

export default function AgentCreateModal({ open, onClose, onCreated }: Props) {
  const [agentRegister, { isLoading }] = useAgentRegisterMutation();

  const [showPass, setShowPass] = useState(false);

  const [toast, setToast] = useState<ToastState>({
    open: false,
    type: "info",
    message: "",
  });

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    agentTitle: "",
    password: "",
    status: "active",
    agentType: "e-wallet",
    creditLimit: 0,
    depositPercent: 0,
    withdrawPercent: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ────────── reset form when modal opens/closes ────────── */
  useEffect(() => {
    if (!open) return;
    setErrors({});
    setShowPass(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      agentTitle: "",
      password: "",
      status: "active",
      agentType: "e-wallet",
      creditLimit: 0,
      depositPercent: 0,
      withdrawPercent: 0,
    });
  }, [open]);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length >= 2 &&
      isEmailValid(form.email.trim()) &&
      isPhoneValid(form.phone.trim()) &&
      form.agentTitle.trim().length >= 2 &&
      form.password.trim().length >= 6 &&
      ["e-wallet", "cash"].includes(form.agentType) &&
      Number(form.creditLimit) >= 0 &&
      Number(form.depositPercent) >= 0 &&
      Number(form.depositPercent) <= 100 &&
      Number(form.withdrawPercent) >= 0 &&
      Number(form.withdrawPercent) <= 100
    );
  }, [form]);

  function validate() {
    const e: Record<string, string> = {};

    if (form.name.trim().length < 2) e.name = "Name minimum 2 characters";
    if (!isEmailValid(form.email.trim())) e.email = "Valid email required";
    if (!isPhoneValid(form.phone.trim()))
      e.phone = "Valid phone required (01XXXXXXXXX or +8801XXXXXXXXX)";
    if (form.agentTitle.trim().length < 2 || form.agentTitle.trim().length > 40)
      e.agentTitle = "Unique title required (2 - 40 characters)";
    if (form.password.trim().length < 6)
      e.password = "Password minimum 6 characters";

    if (Number(form.creditLimit) < 0)
      e.creditLimit = "Credit limit cannot be negative";
    if (Number(form.depositPercent) < 0 || Number(form.depositPercent) > 100)
      e.depositPercent = "0 - 100";
    if (Number(form.withdrawPercent) < 0 || Number(form.withdrawPercent) > 100)
      e.withdrawPercent = "0 - 100";

    if (!["e-wallet", "cash"].includes(form.agentType))
      e.agentType = "Agent type required";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const submit = async () => {
    if (!validate()) {
      setToast({
        open: true,
        type: "warning",
        message: "Please fix validation errors.",
      });
      return;
    }

    try {
      await agentRegister({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        agentTitle: form.agentTitle.trim(),
        password: form.password,
        status: form.status,
        agentType: form.agentType,
        creditLimit: Number(form.creditLimit || 0),
        depositPercent: Number(form.depositPercent ?? 10),
        withdrawPercent: Number(form.withdrawPercent ?? 5),
      } as any).unwrap();

      setToast({
        open: true,
        type: "success",
        message: "Agent created successfully ✅",
      });

      onCreated?.();

      // close after success
      onClose();
    } catch (err: any) {
      const msg = normalizeApiError(err);
      setToast({ open: true, type: "error", message: msg });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>Create New Agent</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              Smart create form • validation • error toast
            </div>
          </div>

          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {/* ────────── basic info ────────── */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))}
              error={!!errors.name}
              helperText={errors.name || " "}
              size="small"
              fullWidth
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={(e) =>
                setForm((s) => ({ ...s, phone: e.target.value }))
              }
              error={!!errors.phone}
              helperText={errors.phone || " "}
              size="small"
              fullWidth
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={(e) =>
                setForm((s) => ({ ...s, email: e.target.value }))
              }
              error={!!errors.email}
              helperText={errors.email || " "}
              size="small"
              fullWidth
            />

            <TextField
              label="Unique Agent Title"
              value={form.agentTitle}
              onChange={(e) =>
                setForm((s) => ({ ...s, agentTitle: e.target.value }))
              }
              error={!!errors.agentTitle}
              helperText={
                errors.agentTitle || "Cash dropdown/search এ এই title দেখাবে"
              }
              size="small"
              fullWidth
            />

            <TextField
              label="Password"
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) =>
                setForm((s) => ({ ...s, password: e.target.value }))
              }
              error={!!errors.password}
              helperText={errors.password || "Minimum 6 characters"}
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass((x) => !x)}
                      edge="end"
                      size="small"
                    >
                      {showPass ? <EyeOff /> : <Eye />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>

          {/* ────────── status + type + limit ────────── */}
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextField
              label="Status"
              select
              SelectProps={{ native: true }}
              value={form.status}
              onChange={(e) =>
                setForm((s) => ({ ...s, status: e.target.value }))
              }
              size="small"
              fullWidth
              helperText="active / inactive / blocked"
            >
              <option value="active">active</option>
              <option value="inactive">inactive</option>
              <option value="blocked">blocked</option>
            </TextField>

            <TextField
              label="Agent Type"
              select
              SelectProps={{ native: true }}
              value={form.agentType}
              onChange={(e) =>
                setForm((s) => ({ ...s, agentType: e.target.value }))
              }
              error={!!errors.agentType}
              helperText={errors.agentType || "e-wallet / cash"}
              size="small"
              fullWidth
            >
              <option value="e-wallet">e-wallet</option>
              <option value="cash">cash</option>
            </TextField>

            <TextField
              label="Credit Limit"
              type="number"
              value={form.creditLimit}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  creditLimit: Number(e.target.value || 0),
                }))
              }
              error={!!errors.creditLimit}
              helperText={errors.creditLimit || "0 or higher"}
              size="small"
              fullWidth
            />
          </div>

          {/* ────────── commission quick config (optional) ────────── */}
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextField
              label="Deposit Commission %"
              type="number"
              value={form.depositPercent}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  depositPercent: Number(e.target.value || 0),
                }))
              }
              error={!!errors.depositPercent}
              helperText={errors.depositPercent || "0 - 100"}
              size="small"
              fullWidth
            />

            <TextField
              label="Withdraw Commission %"
              type="number"
              value={form.withdrawPercent}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  withdrawPercent: Number(e.target.value || 0),
                }))
              }
              error={!!errors.withdrawPercent}
              helperText={errors.withdrawPercent || "0 - 100"}
              size="small"
              fullWidth
            />
          </div>

          {/* ────────── hint ────────── */}
          <div className="mt-2 rounded-lg border border-[rgb(var(--app-border))] bg-[rgb(var(--app-surface-2))]/70 p-3 text-xs text-[rgb(var(--app-text-muted))]">
            <b>Tip:</b> Agent title unique হবে। User cash withdraw করলে এই title
            smart dropdown/search এ দেখাবে। 404 এলে API তে{" "}
            <code>/agent-register</code> route নেই।
          </div>
        </DialogContent>

        <DialogActions sx={{ gap: 1, padding: 2 }}>
          <Button onClick={onClose} variant="outlined" disabled={isLoading}>
            Cancel
          </Button>

          <Button
            onClick={submit}
            variant="contained"
            disabled={isLoading || !canSubmit}
            sx={{ fontWeight: 700 }}
          >
            {isLoading ? "Creating..." : "Create Agent"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ────────── Toast (Snackbar) ────────── */}
      <Snackbar
        open={toast.open}
        autoHideDuration={5000}
        onClose={() => setToast((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToast((s) => ({ ...s, open: false }))}
          severity={toast.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}
