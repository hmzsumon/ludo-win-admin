import Navbar from "@/components/public/Navbar";
import React from "react";

const PublicLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="app-shell min-h-screen">
      <Navbar />
      <div>{children}</div>
    </main>
  );
};

export default PublicLayout;
