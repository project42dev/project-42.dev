"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminHeader() {
  const pathname = usePathname();

  const isAccounts = pathname === "/admin" || pathname === "/admin/accounts";
  const isLogs = pathname === "/admin/logs";
  const isSettings = pathname === "/admin/settings" || pathname === "/admin/appearance";

  return (
    <header style={{
      background: "#070b12",
      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      backdropFilter: "blur(12px)"
    }}>
      <div style={{
        maxWidth: "1300px",
        margin: "0 auto",
        padding: "0 24px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        {/* BRAND & CONSOLE BADGE */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link href="/admin" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "#ffffff" }}>
            <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true" style={{ borderRadius: "6px" }}>
              <rect width="64" height="64" rx="13" fill="#0b1225" />
              <path d="M7 36 23 9h10v26h6v10h-6v10H22V45H7v-9Zm15-1V25l-6 10h6Z" fill="#38bdf8" />
              <path d="M36 21c0-8 5-13 14-13 8 0 14 5 14 13 0 6-3 10-9 14l-7 5h16v10H35V39l13-10c4-3 5-5 5-8 0-3-1-5-4-5s-4 2-4 6h-9Z" fill="#f8fafc" />
            </svg>
            <span style={{ fontWeight: 800, fontSize: "15px", letterSpacing: "-0.02em" }}>Project 42</span>
          </Link>
          <span style={{
            fontSize: "11px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "3px 8px",
            borderRadius: "4px",
            background: "rgba(56, 189, 248, 0.15)",
            color: "#38bdf8",
            border: "1px solid rgba(56, 189, 248, 0.25)",
            fontFamily: "monospace"
          }}>
            Admin Console
          </span>
        </div>

        {/* ADMIN VIEW TABS */}
        <nav style={{ display: "flex", gap: "6px" }}>
          <Link
            href="/admin"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s ease",
              background: isAccounts ? "rgba(255, 255, 255, 0.08)" : "transparent",
              color: isAccounts ? "#38bdf8" : "#94a3b8",
              borderBottom: isAccounts ? "2px solid #38bdf8" : "2px solid transparent"
            }}
          >
            Accounts
          </Link>
          <Link
            href="/admin/logs"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s ease",
              background: isLogs ? "rgba(255, 255, 255, 0.08)" : "transparent",
              color: isLogs ? "#38bdf8" : "#94a3b8",
              borderBottom: isLogs ? "2px solid #38bdf8" : "2px solid transparent"
            }}
          >
            Audit Logs
          </Link>
          <Link
            href="/admin/settings"
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "13.5px",
              fontWeight: 700,
              textDecoration: "none",
              transition: "all 0.15s ease",
              background: isSettings ? "rgba(255, 255, 255, 0.08)" : "transparent",
              color: isSettings ? "#38bdf8" : "#94a3b8",
              borderBottom: isSettings ? "2px solid #38bdf8" : "2px solid transparent"
            }}
          >
            Settings & Themes
          </Link>
        </nav>

        {/* ADMIN PROFILE / EXIT */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="https://learn.project-42.dev"
            style={{
              fontSize: "12.5px",
              color: "#94a3b8",
              textDecoration: "none",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: "6px",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            }}
          >
            Exit to Academy ↗
          </a>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #38bdf8, #818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: "13px",
            color: "#070b12",
            cursor: "pointer"
          }}>
            A
          </div>
        </div>
      </div>
    </header>
  );
}
