// ============================================================
//  🪨 Pet Rock — Electron Main Process
// ============================================================
const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

// Keep a global reference to avoid GC closing the window
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1150,
    height: 780,
    minWidth: 800,
    minHeight: 600,
    title: "Pet Rock 🪨",
    backgroundColor: "#1a1a2e",
    show: false, // show after ready-to-show to avoid flash
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.loadFile("index.html");

  // Show window once the page is ready (avoids white flash)
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// ── Application Menu ─────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === "darwin";

  const template = [
    // macOS app menu
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "Game",
      submenu: [
        {
          label: "Reset Rock",
          click: () => {
            dialog
              .showMessageBox(mainWindow, {
                type: "warning",
                buttons: ["Cancel", "Reset"],
                defaultId: 0,
                title: "Reset Pet Rock",
                message: "Are you sure you want to reset your pet rock?",
                detail: "This will erase all progress and start fresh.",
              })
              .then(({ response }) => {
                if (response === 1) {
                  mainWindow.webContents.executeJavaScript(
                    "localStorage.clear(); location.reload();"
                  );
                }
              });
          },
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Help",
      submenu: [
        {
          label: "How to Play",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "How to Play",
              message: "🪨 Pet Rock — How to Play",
              detail:
                "Take care of your pet rock!\n\n" +
                "• Feed — Give your rock minerals to eat\n" +
                "• Play — Rock Paper Scissors mini-game\n" +
                "• Polish — Clean & polish your shiny rock\n" +
                "• Sleep — Put your rock to bed for energy\n" +
                "• Talk — Have a (one-sided) conversation\n" +
                "• Pet — Show some love\n" +
                "• Dress Up — Give it cool accessories\n" +
                "• Music — Dance party!\n\n" +
                "Keep stats up, grow your bond, and click your rock for surprises!",
            });
          },
        },
        {
          label: "About Pet Rock",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "About Pet Rock",
              message: "Pet Rock v1.0.0",
              detail: "A virtual pet rock companion.\nBecause everyone deserves a rock. 🪨",
            });
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// ── App Lifecycle ────────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();
  buildMenu();

  // macOS: re-create window when dock icon is clicked
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed (except macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Security: prevent new window creation from links
app.on("web-contents-created", (event, contents) => {
  contents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
});
