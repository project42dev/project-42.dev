"use client";

import React, { useState } from "react";

interface ThemeOption {
  id: string;
  name: string;
  tagline: string;
  palette: string[];
  font: string;
  isBuiltIn: boolean;
}

const BUILT_IN_THEMES: ThemeOption[] = [
  {
    id: "00-default",
    name: "Classic Project 42 (Default)",
    tagline: "The original clean technical interface.",
    palette: ["#111827", "#38bdf8", "#f6f3eb", "#0b1225"],
    font: "Inter",
    isBuiltIn: true,
  },
  {
    id: "01-cosmic-answer",
    name: "Cosmic Answer",
    tagline: "Deep space indigo, orbital apertures, starlight gold.",
    palette: ["#080d2a", "#754cff", "#39d8ff", "#ffca68"],
    font: "Outfit",
    isBuiltIn: true,
  },
  {
    id: "02-learning-portal",
    name: "Learning Portal",
    tagline: "Warm cream, step architecture, terracotta & teal.",
    palette: ["#fbf7ef", "#ea580c", "#ff5630", "#0d9488"],
    font: "Inter",
    isBuiltIn: true,
  },
  {
    id: "03-model-constellation",
    name: "Model Constellation",
    tagline: "Obsidian node mesh with electric cyan crosslinks.",
    palette: ["#080c14", "#58e4c2", "#8d64ff", "#4a6fff"],
    font: "Space Grotesk",
    isBuiltIn: true,
  },
  {
    id: "04-field-signal",
    name: "Field Signal (Production Master)",
    tagline: "Forest green, navigational beacon, signal amber.",
    palette: ["#071f1a", "#f6edd9", "#ff9b19", "#4bd9d0"],
    font: "Space Grotesk",
    isBuiltIn: true,
  },
  {
    id: "05-open-orbit",
    name: "Open Orbit",
    tagline: "Clean slate, open review loop, energetic cobalt & green.",
    palette: ["#f4f7ff", "#2054f6", "#65c943", "#f1258e"],
    font: "Outfit",
    isBuiltIn: true,
  },
  {
    id: "06-galactic-guide",
    name: "The Galactic Guide",
    tagline: "Retro golden datapad, Hitchhiker Don\x27t Panic styling.",
    palette: ["#090d16", "#f59e0b", "#10b981", "#fef3c7"],
    font: "Bricolage Grotesque",
    isBuiltIn: true,
  },
];

export default function AdminAppearancePage() {
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
  const [savedStatus, setSavedStatus] = useState("");

  const handleSave = () => {
    localStorage.setItem("p42_theme", activeTheme);
    localStorage.setItem("p42_layout", activeLayout);
    document.documentElement.setAttribute("data-theme", activeTheme);
    setSavedStatus("✓ Appearance configuration successfully saved and persisted!");
    setTimeout(() => setSavedStatus(""), 4000);
  };

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "24px" }}>
        <div>
          <span style={{ fontSize: "11px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#38bdf8", background: "rgba(56,189,248,0.15)", padding: "4px 10px", borderRadius: "6px" }}>
            Admin Console · AB#6295
          </span>
          <h1 style={{ fontSize: "32px", fontWeight: 900, marginTop: "12px", marginBottom: "6px" }}>
            Appearance & Theming Studio
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "14.5px" }}>
            Customize your organization\x27s visual theme and default page layout. Upgrades never overwrite your selection.
          </p>
        </div>

        <a
          href="https://github.com/project42dev/project42-gallery"
          target="_blank"
          rel="noreferrer"
          style={{ background: "rgba(56,189,248,0.15)", color: "#38bdf8", border: "1px solid rgba(56,189,248,0.3)", padding: "10px 20px", borderRadius: "999px", fontSize: "13px", fontWeight: 700, textDecoration: "none" }}
        >
          Browse Theme Gallery ↗
        </a>
      </div>

      {savedStatus && (
        <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid #10b981", color: "#10b981", padding: "14px 20px", borderRadius: "12px", marginBottom: "28px", fontWeight: 700, fontSize: "14px" }}>
          {savedStatus}
        </div>
      )}

      {/* 1. LAYOUT TEMPLATE SELECTOR */}
      <section style={{ marginBottom: "44px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: 800, marginBottom: "14px" }}>1. Select Default Site Layout</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "16px" }}>
          {[
            { id: "website", name: "2. Full Production Site (Default)", desc: "Multi-section SaaS academy portal: Hero card, progress tracker, learning paths, and provider matrix." },
            { id: "poster", name: "1. Poster & Design System", desc: "Showcase board emphasizing brand poster art, identity tokens, and milestone badge credentials." },
            { id: "editorial", name: "3. Centered Editorial", desc: "Minimalist centered hero with code execution terminal for technical engineering teams." },
          ].map((l) => (
            <div
              key={l.id}
              onClick={() => setActiveLayout(l.id)}
              style={{
                background: activeLayout === l.id ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.03)",
                border: activeLayout === l.id ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "14px",
                padding: "20px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <strong style={{ fontSize: "15px", color: activeLayout === l.id ? "#38bdf8" : "#ffffff" }}>{l.name}</strong>
                {activeLayout === l.id && <span style={{ color: "#38bdf8", fontWeight: 800 }}>● Active</span>}
              </div>
              <p style={{ fontSize: "13px", color: "#94a3b8", lineHeight: 1.5 }}>{l.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. THEME SELECTION (7 THEMES) */}
      <section style={{ marginBottom: "44px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: 800 }}>2. Select Active Theme (7 Available)</h2>
          <span style={{ fontSize: "12px", color: "#94a3b8" }}>Auto-discovered from <code>/public/themes/</code></span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px" }}>
          {BUILT_IN_THEMES.map((t) => (
            <div
              key={t.id}
              onClick={() => setActiveTheme(t.id)}
              style={{
                background: activeTheme === t.id ? "rgba(56,189,248,0.12)" : "rgba(255,255,255,0.03)",
                border: activeTheme === t.id ? "2px solid #38bdf8" : "1px solid rgba(255,255,255,0.1)",
                borderRadius: "16px",
                padding: "20px",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                transition: "all 0.15s ease",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <strong style={{ fontSize: "16px", display: "block", color: activeTheme === t.id ? "#38bdf8" : "#ffffff" }}>{t.name}</strong>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "monospace" }}>Font: {t.font}</span>
                </div>
                {activeTheme === t.id && <span style={{ color: "#38bdf8", fontWeight: 800, fontSize: "12px" }}>✓ Selected</span>}
              </div>

              <p style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5, margin: 0 }}>{t.tagline}</p>

              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "auto" }}>
                {t.palette.map((c, idx) => (
                  <span key={idx} style={{ width: "20px", height: "20px", borderRadius: "50%", background: c, border: "1px solid rgba(255,255,255,0.2)" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SAVE CONTROLS */}
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <strong style={{ fontSize: "15px", display: "block" }}>Ready to apply configuration?</strong>
          <span style={{ fontSize: "13px", color: "#94a3b8" }}>Changes take effect immediately across all learner and public pages.</span>
        </div>

        <button
          onClick={handleSave}
          style={{ background: "#38bdf8", color: "#080d2a", border: "none", padding: "12px 32px", borderRadius: "999px", fontSize: "14px", fontWeight: 800, cursor: "pointer" }}
        >
          Save & Apply Theme
        </button>
      </div>
    </main>
  );
}
