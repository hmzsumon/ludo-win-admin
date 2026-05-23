import CapitaliseLogo from "@/components/branding/CapitaliseLogo";
import GlowBackdrop from "@/components/decor/GlowBackdrop";
import BackgroundFX from "@/components/reagiter-login/BackgroundFX";
import Link from "next/link";
import React from "react";

const RegisterLoginLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <section className="app-shell relative">
        <GlowBackdrop variant="max" />
        <main className="relative min-h-[100dvh] overflow-hidden text-[rgb(var(--app-text))]">
          <BackgroundFX />

          <header className="border-b border-[rgb(var(--app-border))] bg-[rgb(var(--app-bg))]/85 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="flex items-center gap-3">
                <CapitaliseLogo
                  variant="full"
                  size={28}
                  className="text-[rgb(var(--app-text))]"
                  wordmarkClassName="text-[rgb(var(--app-text))]"
                />
              </Link>
              <div className="text-sm text-[rgb(var(--app-text-muted))]">
                <Link href="#">Support</Link>
              </div>
            </div>
          </header>
          <div className="">{children}</div>
        </main>
      </section>
    </div>
  );
};

export default RegisterLoginLayout;
