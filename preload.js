// ============================================================
//  🪨 Pebble Pal — Preload Script (secure bridge)
// ============================================================
// This file runs in a sandboxed context. We don't expose any
// Node APIs to the renderer — the game is pure browser JS and
// uses localStorage for persistence, so no bridge is needed.
// This file exists as a placeholder for future features
// (e.g. file-based saves, native notifications).

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("pebblePal", {
  platform: process.platform,
  version: "1.0.0",
  onReset: (cb) => ipcRenderer.on("reset-game", cb),
});
