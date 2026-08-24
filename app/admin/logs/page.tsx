"use client";

import React, { useState } from "react";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
  severity: "INFO" | "WARN" | "SECURITY";
  correlationId: string;
}

const MOCK_LOGS: AuditLogEntry[] = [
  { id: "log_001", timestamp: "2026-08-24 01:14:02", actor: "kris@turnerpublishing.com", action: "theme.apply", target: "04-field-signal", severity: "INFO", correlationId: "req_f8821a58" },
  { id: "log_002", timestamp: "2026-08-24 01:10:15", actor: "system.scheduler", action: "domain_policy.sync", target: "approved_domains.json", severity: "INFO", correlationId: "req_91823901" },
  { id: "log_003", timestamp: "2026-08-24 00:55:18", actor: "unknown_client", action: "auth.rate_limit_exceeded", target: "api/auth/register", severity: "SECURITY", correlationId: "req_33918204" },
  { id: "log_004", timestamp: "2026-08-23 23:45:00", actor: "elena.rostova@mit.edu", action: "transcript.sign", target: "usr_83910/path_03", severity: "INFO", correlationId: "req_77281923" },
  { id: "log_005", timestamp: "2026-08-23 22:12:44", actor: "sarah.j@legacy-corp.io", action: "account.request_deletion", target: "usr_51820", severity: "WARN", correlationId: "req_11928374" },
];

export default function AdminLogsPage() {
  const [filterSeverity, setFilterSeverity] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = MOCK_LOGS.filter(l => {
    const matchSearch = l.action.toLowerCase().includes(search.toLowerCase()) || l.actor.toLowerCase().includes(search.toLowerCase()) || l.target.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = filterSeverity === "ALL" || l.severity === filterSeverity;
    return matchSearch && matchSeverity;
  });

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Audit & Evidence Logs</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Immutable cryptographic execution trace and administrative event logs.</p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Search action or actor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
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
            value={filterSeverity}
            onChange={e => setFilterSeverity(e.target.value)}
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
            <option value="ALL">All Severities</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="SECURITY">SECURITY</option>
          </select>
        </div>
      </div>

      <div style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px", fontFamily: "JetBrains Mono, monospace" }}>
          <thead>
            <tr style={{ background: "rgba(255, 255, 255, 0.04)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94a3b8", fontSize: "11px", textTransform: "uppercase" }}>
              <th style={{ padding: "12px 18px" }}>Timestamp (UTC)</th>
              <th style={{ padding: "12px 18px" }}>Severity</th>
              <th style={{ padding: "12px 18px" }}>Action</th>
              <th style={{ padding: "12px 18px" }}>Actor</th>
              <th style={{ padding: "12px 18px" }}>Target</th>
              <th style={{ padding: "12px 18px" }}>Correlation ID</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(l => (
              <tr key={l.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                <td style={{ padding: "12px 18px", color: "#94a3b8" }}>{l.timestamp}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    background: l.severity === "INFO" ? "rgba(56, 189, 248, 0.15)" : l.severity === "WARN" ? "rgba(245, 158, 11, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    color: l.severity === "INFO" ? "#38bdf8" : l.severity === "WARN" ? "#f59e0b" : "#ef4444"
                  }}>
                    {l.severity}
                  </span>
                </td>
                <td style={{ padding: "12px 18px", color: "#ffffff", fontWeight: 700 }}>{l.action}</td>
                <td style={{ padding: "12px 18px", color: "#cbd5e1" }}>{l.actor}</td>
                <td style={{ padding: "12px 18px", color: "#38bdf8" }}>{l.target}</td>
                <td style={{ padding: "12px 18px", color: "#64748b", fontSize: "12px" }}>{l.correlationId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
