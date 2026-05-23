"use client";

import type {} from "@mui/x-data-grid/themeAugmentation";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "react";
import { useAppTheme } from "@/components/theme/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useAppTheme();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: resolvedTheme,
          background:
            resolvedTheme === "dark"
              ? { default: "#0B0D12", paper: "#11151D" }
              : { default: "#F4F7FB", paper: "#FFFFFF" },
          text:
            resolvedTheme === "dark"
              ? { primary: "#E6EAF2", secondary: "rgba(230,234,242,0.68)" }
              : { primary: "#0F172A", secondary: "rgba(15,23,42,0.68)" },
          divider:
            resolvedTheme === "dark"
              ? "rgba(255,255,255,0.08)"
              : "rgba(15,23,42,0.10)",
        },
        components: {
          MuiDataGrid: {
            styleOverrides: {
              root: {
                backgroundColor:
                  resolvedTheme === "dark" ? "#11151D" : "#FFFFFF",
                border: `1px solid ${resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)"}`,
                borderRadius: 16,
              },
              columnHeaders: {
                backgroundColor:
                  resolvedTheme === "dark"
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(15,23,42,0.04)",
                color:
                  resolvedTheme === "dark"
                    ? "rgba(255,255,255,0.85)"
                    : "rgba(15,23,42,0.85)",
                borderBottom: `1px solid ${resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)"}`,
              },
              cell: {
                borderColor:
                  resolvedTheme === "dark"
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(15,23,42,0.08)",
                color: resolvedTheme === "dark" ? "#E6EAF2" : "#0F172A",
                fontSize: "13px",
              },
              footerContainer: {
                borderTop: `1px solid ${resolvedTheme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.10)"}`,
                color:
                  resolvedTheme === "dark"
                    ? "rgba(255,255,255,0.75)"
                    : "rgba(15,23,42,0.75)",
                backgroundColor:
                  resolvedTheme === "dark"
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(15,23,42,0.02)",
              },
              row: {
                "&:hover": {
                  backgroundColor:
                    resolvedTheme === "dark"
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(15,23,42,0.03)",
                },
              },
              virtualScrollerContent: {
                backgroundColor:
                  resolvedTheme === "dark" ? "#11151D" : "#FFFFFF",
              },
            },
          },
        },
      }),
    [resolvedTheme]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
