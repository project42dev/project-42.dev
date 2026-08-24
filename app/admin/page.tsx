"use client";

import React, { useState } from "react";

interface LearnerAccount {
  id: string;
  email: string;
  domain: string;
  role: "Learner" | "Instructor" | "Admin";
  status: "Active" | "Pending Approval" | "Suspended" | "Pending Deletion";
  registeredAt: string;
  pathsCompleted: number;
}

const MOCK_ACCOUNTS: LearnerAccount[] = [
  { id: "usr_94812", email: "kris@turnerpublishing.com", domain: "turnerpublishing.com", role: "Admin", status: "Active", registeredAt: "2026-08-01", pathsCompleted: 8 },
  { id: "usr_83910", email: "elena.rostova@mit.edu", domain: "mit.edu", role: "Instructor", status: "Active", registeredAt: "2026-08-10", pathsCompleted: 13 },
  { id: "usr_71829", email: "alex.chen@anthropic-partner.org", domain: "anthropic-partner.org", role: "Learner", status: "Pending Approval", registeredAt: "2026-08-22", pathsCompleted: 2 },
  { id: "usr_62914", email: "dev.ops@cloudgrange.net", domain: "cloudgrange.net", role: "Learner", status: "Active", registeredAt: "2026-08-14", pathsCompleted: 5 },
  { id: "usr_51820", email: "sarah.j@legacy-corp.io", domain: "legacy-corp.io", role: "Learner", status: "Pending Deletion", registeredAt: "2026-07-28", pathsCompleted: 1 },
  { id: "usr_40912", email: "unknown.bot@tempmail.co", domain: "tempmail.co", role: "Learner", status: "Suspended", registeredAt: "2026-08-20", pathsCompleted: 0 },
];

export default function AdminAccountsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [accounts, setAccounts] = useState<LearnerAccount[]>(MOCK_ACCOUNTS);

  const filtered = accounts.filter(acc => {
    const matchSearch = acc.email.toLowerCase().includes(searchTerm.toLowerCase()) || acc.domain.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "ALL" || acc.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const updateAccountStatus = (id: string, newStatus: LearnerAccount["status"]) => {
    setAccounts(accounts.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <main>
      {/* ACTION BAR */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Account Management</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Manage learner registrations, domain state enforcements, and deletion workflows.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search email or domain..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "8px 14px",
              borderRadius: "8px",
              fontSize: "13px",
              width: "240px",
              outline: "none"
            }}
          />

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            style={{
              background: "#0b1225",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              color: "#ffffff",
              padding: "8px 12px",
              borderRadius: "8px",
              fontSize: "13px",
              outline: "none"
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Suspended">Suspended</option>
            <option value="Pending Deletion">Pending Deletion</option>
          </select>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "16px", borderRadius: "12px" }}>
          <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", fontWeight: 700 }}>Total Learners</span>
          <strong style={{ display: "block", fontSize: "24px", marginTop: "4px", color: "#ffffff" }}>{accounts.length}</strong>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "16px", borderRadius: "12px" }}>
          <span style={{ fontSize: "12px", color: "#f59e0b", textTransform: "uppercase", fontWeight: 700 }}>Pending Approval</span>
          <strong style={{ display: "block", fontSize: "24px", marginTop: "4px", color: "#f59e0b" }}>
            {accounts.filter(a => a.status === "Pending Approval").length}
          </strong>
        </div>
        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "16px", borderRadius: "12px" }}>
          <span style={{ fontSize: "12px", color: "#ef4444", textTransform: "uppercase", fontWeight: 700 }}>Deletion Queue</span>
          <strong style={{ display: "block", fontSize: "24px", marginTop: "4px", color: "#ef4444" }}>
            {accounts.filter(a => a.status === "Pending Deletion").length}
          </strong>
        </div>
      </div>

      {/* ACCOUNTS TABLE */}
      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13.5px" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th style={{ padding: "12px 18px" }}>Learner / Email</th>
              <th style={{ padding: "12px 18px" }}>Domain</th>
              <th style={{ padding: "12px 18px" }}>Role</th>
              <th style={{ padding: "12px 18px" }}>Status</th>
              <th style={{ padding: "12px 18px" }}>Registered</th>
              <th style={{ padding: "12px 18px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(acc => (
              <tr key={acc.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)", transition: "background 0.15s ease" }}>
                <td style={{ padding: "14px 18px", fontWeight: 600 }}>{acc.email}</td>
                <td style={{ padding: "14px 18px", color: "#cbd5e1" }}>{acc.domain}</td>
                <td style={{ padding: "14px 18px", color: "#94a3b8" }}>{acc.role}</td>
                <td style={{ padding: "14px 18px" }}>
                  <span style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px",
                    background: acc.status === "Active" ? "rgba(16, 185, 129, 0.15)" : acc.status === "Pending Approval" ? "rgba(245, 158, 11, 0.15)" : acc.status === "Suspended" ? "rgba(239, 68, 68, 0.15)" : "rgba(236, 72, 153, 0.15)",
                    color: acc.status === "Active" ? "#10b981" : acc.status === "Pending Approval" ? "#f59e0b" : acc.status === "Suspended" ? "#ef4444" : "#ec4899",
                    border: "1px solid currentColor"
                  }}>
                    {acc.status}
                  </span>
                </td>
                <td style={{ padding: "14px 18px", color: "#94a3b8", fontSize: "12.5px" }}>{acc.registeredAt}</td>
                <td style={{ padding: "14px 18px", textAlign: "right" }}>
                  {acc.status === "Pending Approval" && (
                    <button
                      onClick={() => updateAccountStatus(acc.id, "Active")}
                      style={{ background: "#10b981", color: "#080d2a", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer", marginRight: "6px" }}
                    >
                      Approve
                    </button>
                  )}
                  {acc.status === "Active" && (
                    <button
                      onClick={() => updateAccountStatus(acc.id, "Suspended")}
                      style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                    >
                      Suspend
                    </button>
                  )}
                  {acc.status === "Suspended" && (
                    <button
                      onClick={() => updateAccountStatus(acc.id, "Active")}
                      style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}
                    >
                      Reactivate
                    </button>
                  )}
                  {acc.status === "Pending Deletion" && (
                    <button
                      onClick={() => setAccounts(accounts.filter(a => a.id !== acc.id))}
                      style={{ background: "#ef4444", color: "#ffffff", border: "none", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}
                    >
                      Purge
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
