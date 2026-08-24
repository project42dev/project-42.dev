import React from "react";
import AdminHeader from "./components/AdminHeader";

export const metadata = {
  title: "Admin Console · Project 42",
  description: "Administrative console for learner accounts, audit evidence, and appearance configuration."
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: "#080c14", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      <AdminHeader />
      <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "28px 24px" }}>
        {children}
      </div>
    </div>
  );
}
