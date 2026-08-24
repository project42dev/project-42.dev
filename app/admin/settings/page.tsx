"use client";

import React, { useState } from "react";

interface ThemeOption {
  id: string;
  name: string;
  tagline: string;
  palette: string[];
  font: string;
}

const BUILT_IN_THEMES: ThemeOption[] = [
  { id: "00-default", name: "Classic Project 42 (Default)", tagline: "Clean modern slate interface.", palette: ["#111827", "#38bdf8", "#f6f3eb", "#0b1225"], font: "Inter" },
  { id: "01-cosmic-answer", name: "Cosmic Answer", tagline: "Deep space indigo, orbital aperture, starlight gold.", palette: ["#080d2a", "#754cff", "#39d8ff", "#ffca68"], font: "Outfit" },
  { id: "02-learning-portal", name: "Learning Portal", tagline: "Warm cream, step architecture, terracotta & teal.", palette: ["#fbf7ef", "#ea580c", "#ff5630", "#0d9488"], font: "Inter" },
  { id: "03-model-constellation", name: "Model Constellation", tagline: "Obsidian node mesh with electric cyan crosslinks.", palette: ["#080c14", "#58e4c2", "#8d64ff", "#4a6fff"], font: "Space Grotesk" },
  { id: "04-field-signal", name: "Field Signal (Production Master)", tagline: "Forest green, navigational beacon, signal amber.", palette: ["#071f1a", "#f6edd9", "#ff9b19", "#4bd9d0"], font: "Space Grotesk" },
  { id: "05-open-orbit", name: "Open Orbit", tagline: "Clean slate, open review loop, cobalt & green.", palette: ["#f4f7ff", "#2054f6", "#65c943", "#f1258e"], font: "Outfit" },
  { id: "06-galactic-guide", name: "The Galactic Guide", tagline: "Retro golden datapad, Hitchhiker Don't Panic styling.", palette: ["#090d16", "#f59e0b", "#10b981", "#fef3c7"], font: "Bricolage Grotesque" },
];

export default function AdminSettingsPage() {
  const [activeTheme, setActiveTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("p42_theme") || "04-field-signal";
    }
    return "04-field-signal";
  });
  const [activeLayout, setActiveLayout] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("p42_layout") || "website";
    }
    return "website";
  });
  const [approvedDomains, setApprovedDomains] = useState("turnerpublishing.com\nmit.edu\nanthropic-partner.org");
  const [savedStatus, setSavedStatus] = useState("");

  const handleSave = () => {
    localStorage.setItem("p42_theme", activeTheme);
    localStorage.setItem("p42_layout", activeLayout);
    document.documentElement.setAttribute("data-theme", activeTheme);
    setSavedStatus("✓ Settings & Theme configuration saved successfully!");
    setTimeout(() => setSavedStatus(""), 4000);
  };

  return (
    <main>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>Settings & Configuration</h1>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: "4px 0 0" }}>Configure platform appearance, theme selection, approved domains, and security policies.</p>
        </div>

        <a
          href="https://github.com/project42dev/project42-gallery"
          target="_blank"
          rel="noreferrer"
          style={{ background: "rgba(56, 189, 248, 0.15)", color: "#38bdf8", border: "1px solid rgba(56, 189, 248, 0.3)", padding: "8px 18px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
        >
          Theme Gallery ↗
        </a>
      </div>

      {savedStatus && (
        <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid #10b981", color: "#10b981", padding: "12px 18px", borderRadius: "10px", marginBottom: "24px", fontWeight: 700, fontSize: "13.5px" }}>
          {savedStatus}
        </div>
      )}

      {/* 1. APPEARANCE & THEMES */}
      <section style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "24px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "16px" }}>1. Active Visual Theme (7 Installed)</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px", marginBottom: "24px" }}>
          {BUILT_IN_THEMES.map(t => (
            <div
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              style={{
                background: activeTheme === t.id ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.02)",
                border: activeTheme === t.id ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "12px",
                padding: "16px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "14.5px", color: activeTheme === t.id ? "#38bdf8" : "#ffffff" }}>{t.name}</strong>
                {activeTheme === t.id && <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: "11px" }}>✓ Active</span>}
              </div>
              <p style={{ fontSize: "12.5px", color: "#94a3b8", margin: 0 }}>{t.tagline}</p>
              <div style={{ display: "flex", gap: "6px", marginTop: "auto" }}>
                {t.palette.map((c, i) => (
                  <span key={i} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.2)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <h3 style={{ fontSize: "15px", fontWeight: 800, marginBottom: "12px" }}>Default Site Layout</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px" }}>
          {[
            { id: "website", name: "Full Production Site", desc: "Hero, academy routes, and provider matrix." },
            { id: "poster", name: "Poster & Design System", desc: "Brand poster showcase and badge boards." },
            { id: "editorial", name: "Centered Editorial", desc: "Clean minimalist code terminal view." }
          ].map(l => (
            <div
              key={l.id}
              onClick={() => setActiveLayout(l.id)}
              style={{
                background: activeLayout === l.id ? "rgba(56, 189, 248, 0.12)" : "rgba(255, 255, 255, 0.02)",
                border: activeLayout === l.id ? "2px solid #38bdf8" : "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "10px",
                padding: "14px",
                cursor: "pointer"
              }}
            >
              <strong style={{ fontSize: "13.5px", display: "block", color: activeLayout === l.id ? "#38bdf8" : "#ffffff", marginBottom: "4px" }}>{l.name}</strong>
              <span style={{ fontSize: "12px", color: "#94a3b8" }}>{l.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. APPROVED DOMAINS & REGISTRATION POLICIES */}
      <section style={{ background: "rgba(255, 255, 255, 0.02)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "14px", padding: "24px", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: 800, marginBottom: "8px" }}>2. Approved Email Domain Allowlist</h2>
        <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "14px" }}>
          Learners registering with emails matching these domains bypass manual approval and gain instant access. (One domain per line).
        </p>

        <textarea
          rows={4}
          value={approvedDomains}
          onChange={e => setApprovedDomains(e.target.value)}
          style={{
            width: "100%",
            background: "rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            color: "#ffffff",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "13px",
            fontFamily: "monospace",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
      </section>

      {/* SAVE BUTTON */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={handleSave}
          style={{
            background: "#38bdf8",
            color: "#070b12",
            border: "none",
            padding: "12px 36px",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 800,
            cursor: "pointer"
          }}
        >
          Save All Settings
        </button>
      </div>
    </main>
  );
}
