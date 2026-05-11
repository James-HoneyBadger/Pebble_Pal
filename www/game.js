// ============================================================
//  🪨 PEBBLE PAL GAME — Enhanced Edition
// ============================================================
(() => {
  "use strict";

  // ── State ──────────────────────────────────────────────────
  const state = {
    name: "Rocky",
    age: 0,
    stats: { happiness: 80, fullness: 70, energy: 100, cleanliness: 90, bond: 10 },
    xp: 0,
    level: 1,
    accessory: "none",
    skin: "granite",
    eyeStyle: "normal",
    background: "default",
    isSleeping: false,
    actionCooldown: false,
    totalInteractions: 0,
    totalFeeds: 0,
    totalPlays: 0,
    totalPets: 0,
    totalCleans: 0,
    totalWalks: 0,
    totalMusics: 0,
    totalTalks: 0,
    rpsWins: 0,
    rpsPlayed: 0,
    skinsUnlocked: ["granite", "marble"],
    eyesUnlocked: ["normal", "big"],
    accessoriesUnlocked: ["none", "hat", "bow"],
    backgroundsUnlocked: ["default"],
    achievementsUnlocked: [],
    stickersCollected: [],
    journalEntries: [],
    lastSaved: Date.now(),
    lastCustomizeXP: 0,
    createdAt: Date.now(),
    // Streak tracking
    streak: 0,
    lastVisitDay: null,
    // Daily event tracking
    lastEventDay: null,
    // Settings
    sfxOn: true,
    ambientOn: false,
    particlesOn: true,
    // Evolution
    evolutionStage: 0,
    // Tutorial / onboarding
    tutorialSeen: false,
    // Daily challenges
    dailyChallenges: [],
    challengeLastRefresh: null,
    challengesCompleted: 0,
    // Extra tracking
    highestSkipCount: 0,
    highestStackCount: 0,
    totalRockStacks: 0,
    // Seasonal
    seasonalEventSeen: {},
  };

  // ── DOM ────────────────────────────────────────────────────
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const dom = {
    nameLabel: $("#name-label"), renameBtn: $("#rename-btn"),
    settingsBtn: $("#settings-btn"),
    ageDisplay: $("#age"), levelDisplay: $("#level"),
    xpBar: $("#xp-bar"), xpText: $("#xp-text"),
    streakDisplay: $("#streak-days"),
    rock: $("#rock"), rockBody: $("#rock-body"), face: $("#face"), mouth: $("#mouth"),
    accessoryDisplay: $("#accessory-display"), faceAccessory: $("#face-accessory"),
    leftEye: $(".left-eye"), rightEye: $(".right-eye"),
    leftPupil: $(".left-eye .pupil"), rightPupil: $(".right-eye .pupil"),
    blushL: $("#blush-left"), blushR: $("#blush-right"),
    thoughtBubble: $("#thought-bubble"), thoughtText: $("#thought-text"),
    moodIndicator: $("#mood-indicator"), particles: $("#particles"),
    envLayer: $("#env-layer"), rockStage: $("#rock-stage"),
    messages: $("#messages"),
    foodPicker: $("#food-picker"), foodOptions: $("#food-options"),
    skinOptions: $("#skin-options"), eyeOptions: $("#eye-options"),
    accOptions: $("#accessory-options"), bgOptions: $("#bg-options"),
    achievementsList: $("#achievements-list"), trophyCount: $("#trophy-count"),
    stickersList: $("#stickers-list"), stickerCount: $("#sticker-count"),
    minigameModal: $("#minigame-modal"), rpsChoices: $("#rps-choices"),
    rpsResult: $("#rps-result"), rpsYou: $("#rps-you"), rpsRock: $("#rps-rock"),
    rpsOutcome: $("#rps-outcome"), rpsAgain: $("#rps-again"), rpsClose: $("#rps-close"),
    gameContainer: $("#game-container"),
    achievementToast: $("#achievement-toast"), toastIcon: $("#toast-icon"),
    toastDesc: $("#toast-desc"),
    levelupOverlay: $("#levelup-overlay"), levelupNumber: $("#levelup-number"),
    eventToast: $("#event-toast"), eventIcon: $("#event-icon"), eventDesc: $("#event-desc"),
    // Stone skip
    stoneskipModal: $("#stoneskip-modal"), stoneskipTap: $("#stoneskip-tap"),
    stoneskipStatus: $("#stoneskip-status"), stoneskipCount: $("#skip-count"),
    stoneskipResult: $("#stoneskip-result"), stoneskipOutcome: $("#stoneskip-outcome"),
    stoneskipAgain: $("#stoneskip-again"), stoneskipClose: $("#stoneskip-close"),
    stoneskipCursor: $("#stoneskip-cursor"), stoneskipTarget: $("#stoneskip-target"),
    // Gem match
    gemmatchModal: $("#gemmatch-modal"), gemmatchGrid: $("#gemmatch-grid"),
    gemmatchStatus: $("#gemmatch-status"), gemmatchClose: $("#gemmatch-close"),
    // Quake
    quakeModal: $("#quake-modal"), quakeStart: $("#quake-start"),
    quakeStatus: $("#quake-status"), quakeBar: $("#quake-bar"),
    quakeResult: $("#quake-result"), quakeOutcome: $("#quake-outcome"),
    quakeAgain: $("#quake-again"), quakeClose: $("#quake-close"),
    quakeRockIcon: $("#quake-rock-icon"),
    // Rock Stack
    stackModal: $("#rockstack-modal"), stackTap: $("#stack-tap"),
    stackStatus: $("#stack-status"), stackCount: $("#stack-count"),
    stackLives: $("#stack-lives"), stackResult: $("#stack-result"),
    stackOutcome: $("#stack-outcome"), stackAgain: $("#stack-again"),
    stackClose: $("#stack-close"), stackCursor: $("#stack-cursor"),
    stackTarget: $("#stack-target"),
    // Daily challenges
    challengeList: $("#challenge-list"),
    // Journal
    journalModal: $("#journal-modal"), journalEntries: $("#journal-entries"),
    journalClose: $("#journal-close"),
    // Settings
    settingsModal: $("#settings-modal"), settingsClose: $("#settings-close"),
    toggleSfx: $("#toggle-sfx"), toggleAmbient: $("#toggle-ambient"),
    toggleParticles: $("#toggle-particles"),
    exportCardBtn: $("#export-card-btn"), openJournalBtn: $("#open-journal-btn"),
    resetSaveBtn: $("#reset-save-btn"),
    exportCanvas: $("#export-canvas"),
    streakToast: $("#streak-toast"), streakText: $("#streak-text"),
    // Game picker
    gamePicker: $("#game-picker"), rpsGame: $("#rps-game"),
    minigameBack: $("#minigame-back"), minigameRockName: $("#minigame-rock-name"),
    minigameTitle: $("#minigame-title"), minigameDesc: $("#minigame-desc"),
    evolutionBadge: $("#evolution-badge"),
  };

  const statBars = {}, statVals = {};
  for (const k of Object.keys(state.stats)) {
    statBars[k] = $(`#${k}-bar`); statVals[k] = $(`#${k}-val`);
  }

  // ── Data: Skins ────────────────────────────────────────────
  const SKINS = {
    granite:  { label: "Granite",       color: "#8d8d8d", hi: "#a8a8a8", sh: "#5a5a5a", unlock: null },
    marble:   { label: "Marble",        color: "#d4cfc9", hi: "#eae6e0", sh: "#b0a99e", unlock: null },
    obsidian: { label: "Obsidian",      color: "#2a2a2a", hi: "#444",    sh: "#111",    unlock: { level: 3 } },
    jade:     { label: "Jade",          color: "#4a9e6e", hi: "#6bc48e", sh: "#2d7048", unlock: { level: 5 } },
    rose:     { label: "Rose Quartz",   color: "#d4889e", hi: "#eaafc0", sh: "#b06080", unlock: { level: 7 } },
    lava:     { label: "Lava Rock",     color: "#5a2a0a", hi: "#8b3a0a", sh: "#3a1a05", unlock: { level: 10 } },
    gold:     { label: "Gold",          color: "#c9a836", hi: "#e8d060", sh: "#9a7a10", unlock: { level: 14 } },
    crystal:  { label: "Crystal",       color: "#8ec8e8", hi: "#c0e8ff", sh: "#5a9aba", unlock: { level: 18 } },
    void:     { label: "Void Stone",    color: "#1a0a2e", hi: "#3a1a5e", sh: "#0a0018", unlock: { level: 22 } },
    rainbow:  { label: "Rainbow",       color: "#ff6b6b", hi: "#ffd93d", sh: "#6bcb77", unlock: { level: 25 } },
    aurora:   { label: "Aurora",        color: "#7fb3d3", hi: "#a8d8ea", sh: "#4a7fa0", unlock: { level: 30 } },
    nebula:   { label: "Nebula",        color: "#6d4b8e", hi: "#9b59b6", sh: "#4a2d6e", unlock: { level: 35 } },
    ancient:  { label: "Ancient Stone", color: "#a08060", hi: "#c8a882", sh: "#7a5a45", unlock: { level: 40 } },
    prism:    { label: "Prism",         color: "#5bc8af", hi: "#7fdbca", sh: "#3a9a85", unlock: { level: 45 } },
    galaxy:   { label: "Galaxy Stone",  color: "#1e1e3f", hi: "#6c6cff", sh: "#0a0a2a", unlock: { level: 50 } },
  };

  // ── Data: Eye Styles ───────────────────────────────────────
  const EYE_STYLES = {
    normal:  { label: "Normal",   css: "",             unlock: null },
    big:     { label: "Big",      css: "eyes-big",     unlock: null },
    anime:   { label: "Anime",    css: "eyes-anime",   unlock: { level: 4 } },
    sleepy:  { label: "Sleepy",   css: "eyes-sleepy",  unlock: { level: 6 } },
    cyclops: { label: "Cyclops",  css: "eyes-cyclops", unlock: { level: 9 } },
    star:    { label: "Star",     css: "eyes-star",    unlock: { level: 12 } },
    heart:   { label: "Heart",    css: "eyes-heart",   unlock: { level: 15 } },
    sparkle: { label: "Sparkle",  css: "eyes-sparkle", unlock: { level: 20 } },
    diamond: { label: "Diamond",  css: "eyes-diamond", unlock: { level: 25 } },
  };

  // ── Data: Accessories (SVG) ────────────────────────────────
  const ACCESSORIES = {
    none:  { label: "None", target: "head", svg: "", unlock: null },
    hat:   { label: "Top Hat", target: "head", unlock: null,
      svg: `<svg viewBox="0 0 80 60" width="80" height="60"><rect x="5" y="38" width="70" height="10" rx="5" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/><rect x="18" y="6" width="44" height="34" rx="6" fill="#1a1a2e" stroke="#333" stroke-width="1.5"/><rect x="22" y="32" width="36" height="6" rx="2" fill="#e94560"/></svg>` },
    crown: { label: "Crown", target: "head", unlock: { level: 3 },
      svg: `<svg viewBox="0 0 80 55" width="80" height="55"><polygon points="8,45 16,15 28,32 40,5 52,32 64,15 72,45" fill="#ffd93d" stroke="#d4a017" stroke-width="2" stroke-linejoin="round"/><rect x="8" y="42" width="64" height="10" rx="3" fill="#ffd93d" stroke="#d4a017" stroke-width="1.5"/><circle cx="20" cy="47" r="3" fill="#e94560"/><circle cx="40" cy="47" r="3" fill="#4d96ff"/><circle cx="60" cy="47" r="3" fill="#6bcb77"/><circle cx="40" cy="8" r="3" fill="#e94560"/></svg>` },
    bow:   { label: "Bow", target: "head", unlock: null,
      svg: `<svg viewBox="0 0 60 45" width="60" height="45"><ellipse cx="18" cy="22" rx="16" ry="12" fill="#ff6b9d" stroke="#d4477a" stroke-width="1.5"/><ellipse cx="42" cy="22" rx="16" ry="12" fill="#ff6b9d" stroke="#d4477a" stroke-width="1.5"/><circle cx="30" cy="22" r="6" fill="#e94560" stroke="#c03050" stroke-width="1.5"/></svg>` },
    glasses: { label: "Shades", target: "face", unlock: { level: 2 },
      svg: `<svg viewBox="0 0 80 35" width="80" height="35"><rect x="4" y="6" width="30" height="22" rx="4" fill="#222" fill-opacity="0.7" stroke="#444" stroke-width="2.5"/><rect x="46" y="6" width="30" height="22" rx="4" fill="#222" fill-opacity="0.7" stroke="#444" stroke-width="2.5"/><line x1="34" y1="14" x2="46" y2="14" stroke="#444" stroke-width="2.5" stroke-linecap="round"/><line x1="4" y1="14" x2="-2" y2="11" stroke="#444" stroke-width="2.5" stroke-linecap="round"/><line x1="76" y1="14" x2="82" y2="11" stroke="#444" stroke-width="2.5" stroke-linecap="round"/></svg>` },
    flower: { label: "Flower", target: "head", unlock: { level: 4 },
      svg: `<svg viewBox="0 0 50 50" width="50" height="50"><ellipse cx="25" cy="12" rx="9" ry="10" fill="#ffb7d5"/><ellipse cx="14" cy="22" rx="9" ry="10" fill="#ffb7d5" transform="rotate(-30 14 22)"/><ellipse cx="36" cy="22" rx="9" ry="10" fill="#ffb7d5" transform="rotate(30 36 22)"/><ellipse cx="17" cy="34" rx="9" ry="10" fill="#ffb7d5" transform="rotate(-65 17 34)"/><ellipse cx="33" cy="34" rx="9" ry="10" fill="#ffb7d5" transform="rotate(65 33 34)"/><circle cx="25" cy="25" r="7" fill="#ffd93d" stroke="#d4a017" stroke-width="1"/></svg>` },
    party: { label: "Party Hat", target: "head", unlock: { level: 6 },
      svg: `<svg viewBox="0 0 70 70" width="70" height="70"><polygon points="35,2 58,62 12,62" fill="#e94560" stroke="#c03050" stroke-width="1.5"/><circle cx="35" cy="4" r="5" fill="#ffd93d"/><line x1="20" y1="30" x2="50" y2="30" stroke="#ffd93d" stroke-width="2" stroke-dasharray="4 3"/><line x1="18" y1="45" x2="52" y2="45" stroke="#4d96ff" stroke-width="2" stroke-dasharray="4 3"/><rect x="10" y="58" width="50" height="6" rx="3" fill="#e94560" stroke="#c03050" stroke-width="1"/></svg>` },
    headband: { label: "Headband", target: "head", unlock: { level: 5 },
      svg: `<svg viewBox="0 0 90 20" width="90" height="20"><rect x="2" y="4" width="86" height="12" rx="6" fill="#e94560"/><rect x="2" y="4" width="86" height="6" rx="3" fill="rgba(255,255,255,.15)"/></svg>` },
    monocle: { label: "Monocle", target: "face", unlock: { level: 8 },
      svg: `<svg viewBox="0 0 35 40" width="35" height="40"><circle cx="16" cy="16" r="13" fill="none" stroke="#d4a017" stroke-width="2.5"/><circle cx="16" cy="16" r="11" fill="rgba(200,200,255,.08)"/><line x1="16" y1="29" x2="14" y2="40" stroke="#d4a017" stroke-width="1.5"/></svg>` },
    halo: { label: "Halo", target: "head", unlock: { level: 10 },
      svg: `<svg viewBox="0 0 80 30" width="80" height="30"><ellipse cx="40" cy="15" rx="35" ry="12" fill="none" stroke="#ffd93d" stroke-width="3"/><ellipse cx="40" cy="15" rx="35" ry="12" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/></svg>` },
    chef: { label: "Chef Hat", target: "head", unlock: { level: 12 },
      svg: `<svg viewBox="0 0 80 65" width="80" height="65"><ellipse cx="40" cy="22" rx="30" ry="20" fill="white" stroke="#ddd" stroke-width="1.5"/><ellipse cx="20" cy="28" rx="14" ry="14" fill="white" stroke="#ddd" stroke-width="1"/><ellipse cx="60" cy="28" rx="14" ry="14" fill="white" stroke="#ddd" stroke-width="1"/><rect x="12" y="42" width="56" height="14" rx="3" fill="white" stroke="#ddd" stroke-width="1.5"/></svg>` },
    mustache: { label: "Mustache", target: "face", unlock: { level: 15 },
      svg: `<svg viewBox="0 0 50 20" width="50" height="20"><path d="M 25 4 Q 18 2 10 8 Q 4 14 2 10 Q 6 16 14 12 Q 20 8 25 10 Q 30 8 36 12 Q 44 16 48 10 Q 46 14 40 8 Q 32 2 25 4 Z" fill="#3a2a1a" stroke="#2a1a0a" stroke-width="0.5"/></svg>` },
    headphones: { label: "Headphones", target: "head", unlock: { level: 8 },
      svg: `<svg viewBox="0 0 100 50" width="100" height="50"><path d="M 15 40 Q 15 10 50 10 Q 85 10 85 40" fill="none" stroke="#444" stroke-width="5" stroke-linecap="round"/><rect x="5" y="32" width="16" height="20" rx="5" fill="#333" stroke="#555" stroke-width="1.5"/><rect x="79" y="32" width="16" height="20" rx="5" fill="#333" stroke="#555" stroke-width="1.5"/><rect x="7" y="35" width="12" height="6" rx="2" fill="#e94560"/><rect x="81" y="35" width="12" height="6" rx="2" fill="#e94560"/></svg>` },
    wizard: { label: "Wizard Hat", target: "head", unlock: { level: 20 },
      svg: `<svg viewBox="0 0 80 80" width="80" height="80"><polygon points="40,2 65,70 15,70" fill="#2a1a5e" stroke="#4a2a8e" stroke-width="1.5"/><rect x="8" y="66" width="64" height="10" rx="5" fill="#2a1a5e" stroke="#4a2a8e" stroke-width="1.5"/><circle cx="42" cy="15" r="4" fill="#ffd93d"/><circle cx="30" cy="35" r="3" fill="#ffd93d" opacity=".7"/><circle cx="48" cy="50" r="2.5" fill="#ffd93d" opacity=".5"/></svg>` },
    butterfly: { label: "Butterfly", target: "head", unlock: { level: 25 },
      svg: `<svg viewBox="0 0 80 55" width="80" height="55"><ellipse cx="20" cy="22" rx="18" ry="11" fill="#ff9de2" stroke="#d47eba" stroke-width="1"/><ellipse cx="60" cy="22" rx="18" ry="11" fill="#ff9de2" stroke="#d47eba" stroke-width="1"/><ellipse cx="18" cy="32" rx="10" ry="7" fill="#ffc4f0" opacity=".8"/><ellipse cx="62" cy="32" rx="10" ry="7" fill="#ffc4f0" opacity=".8"/><ellipse cx="40" cy="24" rx="4" ry="15" fill="#444"/><line x1="37" y1="10" x2="28" y2="2" stroke="#666" stroke-width="1.5" stroke-linecap="round"/><line x1="43" y1="10" x2="52" y2="2" stroke="#666" stroke-width="1.5" stroke-linecap="round"/></svg>` },
    scarf: { label: "Scarf", target: "head", unlock: { level: 28 },
      svg: `<svg viewBox="0 0 110 28" width="110" height="28"><path d="M8 14 Q30 4 55 14 Q80 4 102 14 Q80 24 55 14 Q30 24 8 14Z" fill="#e94560" stroke="#c03050" stroke-width="1"/><rect x="38" y="3" width="8" height="24" rx="3" fill="#e94560" stroke="#c03050" stroke-width="1"/><line x1="10" y1="14" x2="100" y2="14" stroke="rgba(255,255,255,.2)" stroke-width="1.5" stroke-dasharray="6 4"/></svg>` },
    pirate: { label: "Pirate Hat", target: "head", unlock: { level: 32 },
      svg: `<svg viewBox="0 0 80 65" width="80" height="65"><rect x="6" y="44" width="68" height="10" rx="5" fill="#111" stroke="#333" stroke-width="1.5"/><polygon points="40,2 68,46 12,46" fill="#111" stroke="#333" stroke-width="1.5"/><rect x="18" y="42" width="44" height="6" rx="2" fill="#e8d060"/><circle cx="40" cy="30" r="8" fill="white" opacity=".9"/><line x1="34" y1="24" x2="46" y2="36" stroke="#333" stroke-width="2" stroke-linecap="round"/><line x1="46" y1="24" x2="34" y2="36" stroke="#333" stroke-width="2" stroke-linecap="round"/></svg>` },
    helmet: { label: "Space Helmet", target: "head", unlock: { level: 38 },
      svg: `<svg viewBox="0 0 90 80" width="90" height="80"><ellipse cx="45" cy="42" rx="38" ry="38" fill="rgba(120,200,255,.15)" stroke="#8ac" stroke-width="3"/><ellipse cx="38" cy="34" rx="16" ry="12" fill="rgba(150,220,255,.45)" stroke="#6af" stroke-width="1.5"/><rect x="16" y="72" width="58" height="8" rx="4" fill="#888" stroke="#aaa" stroke-width="1.5"/><circle cx="68" cy="30" r="5" fill="#e94560" opacity=".8"/></svg>` },
    bowtie: { label: "Bowtie", target: "face", unlock: { level: 42 },
      svg: `<svg viewBox="0 0 52 26" width="52" height="26"><polygon points="5,2 25,13 5,24" fill="#e94560" stroke="#c03050" stroke-width="1.5"/><polygon points="47,2 27,13 47,24" fill="#e94560" stroke="#c03050" stroke-width="1.5"/><circle cx="26" cy="13" r="5" fill="#ffd93d" stroke="#d4a017" stroke-width="1.5"/></svg>` },
  };

  // ── Data: Backgrounds ──────────────────────────────────────
  const BACKGROUNDS = {
    default:    { label: "Default", css: "", unlock: null },
    park:       { label: "Park", css: "env-park", unlock: { level: 2 } },
    beach:      { label: "Beach", css: "env-beach", unlock: { level: 5 } },
    space:      { label: "Space", css: "env-space", unlock: { level: 8 } },
    underwater: { label: "Underwater", css: "env-underwater", unlock: { level: 11 } },
    cozy:       { label: "Cozy Room", css: "env-cozy", unlock: { level: 14 } },
    volcano:    { label: "Volcano", css: "env-volcano", unlock: { level: 18 } },
    snow:       { label: "Snowfield",   css: "env-snow",    unlock: { level: 22 } },
    arctic:     { label: "Arctic Tundra", css: "env-arctic", unlock: { level: 28 } },
    jungle:     { label: "Jungle",       css: "env-jungle",  unlock: { level: 33 } },
    castle:     { label: "Castle",       css: "env-castle",  unlock: { level: 38 } },
    nebula_bg:  { label: "Nebula",       css: "env-nebula",  unlock: { level: 43 } },
    dream:      { label: "Dream World",  css: "env-dream",   unlock: { level: 48 } },
  };

  // ── Data: Foods ────────────────────────────────────────────
  const FOODS = {
    pebbles:    { label: "🪨 Pebbles",       fullness: 15, happiness: 3,  energy: 0,  msg: "Basic but tasty pebbles!" },
    gravel:     { label: "🫘 Gravel",         fullness: 20, happiness: 5,  energy: 0,  msg: "Crunchy gravel — a classic!" },
    quartz:     { label: "💎 Quartz Flakes",  fullness: 12, happiness: 10, energy: 5,  msg: "Mmm, fancy quartz crystals!" },
    limestone:  { label: "🧱 Limestone",      fullness: 25, happiness: 4,  energy: 0,  msg: "Hearty limestone — filling!" },
    geode:      { label: "🔮 Geode Slice",    fullness: 10, happiness: 15, energy: 10, msg: "Ooh a geode! So sparkly inside!" },
    lava_cake:  { label: "🍰 Lava Cake",      fullness: 20, happiness: 20, energy: 5,  msg: "Lava cake?! Best. Day. Ever!", unlock: { level: 6 } },
    diamond:    { label: "💠 Diamond Dust",   fullness: 8,  happiness: 25, energy: 15, msg: "Diamond dust! I feel EXPENSIVE!", unlock: { level: 12 } },
    stardust:    { label: "⭐ Stardust",        fullness: 15, happiness: 30, energy: 20, msg: "Stardust... I can taste the cosmos!",     unlock: { level: 18 } },
    crystal_shard:{ label: "🔮 Crystal Shard",  fullness: 20, happiness: 38, energy: 28, msg: "Ooh! I can taste the power of crystals!",   unlock: { level: 25 } },
    moonstone:   { label: "🌙 Moonstone",       fullness: 25, happiness: 44, energy: 32, msg: "Moonstone! I feel beautifully lunar!",       unlock: { level: 32 } },
    comet:       { label: "☄️ Comet Crumble",   fullness: 30, happiness: 48, energy: 38, msg: "COMET CRUMBLE! I'm basically a shooting star!", unlock: { level: 40 } },
    void_cookie: { label: "🌌 Void Cookie",     fullness: 35, happiness: 55, energy: 45, msg: "The void... it's delicious?! I transcend!",  unlock: { level: 48 } },
  };

  // ── Data: Stickers ─────────────────────────────────────────
  const STICKERS = [
    { id: "s_rps_win",    icon: "✌️",  name: "Champ",        desc: "Win at RPS",              how: "Win RPS" },
    { id: "s_skip_5",     icon: "🌊",  name: "Skipper",      desc: "Skip 5+ times",           how: "Stone Skip 5+" },
    { id: "s_skip_10",    icon: "🏄",  name: "Pro Skipper",  desc: "Skip 10+ times",          how: "Stone Skip 10+" },
    { id: "s_gems",       icon: "💎",  name: "Gem Collector",desc: "Win Gem Match",           how: "Win Gem Match" },
    { id: "s_gems_fast",  icon: "⚡",  name: "Speed Matcher",desc: "Win Gem Match quickly",   how: "Gem Match <30s" },
    { id: "s_quake",      icon: "🌋",  name: "Survivor",     desc: "Survive the earthquake",  how: "Win Earthquake" },
    { id: "s_event_rain", icon: "🌧️",  name: "Rainy Day",    desc: "Experienced a rain event",how: "Daily event" },
    { id: "s_event_sun",  icon: "☀️",  name: "Sunny Day",    desc: "Had a sunny day event",   how: "Daily event" },
    { id: "s_streak3",    icon: "🔥",  name: "On Fire",      desc: "3-day visit streak",      how: "3-day streak" },
    { id: "s_streak7",    icon: "🏆",  name: "Dedicated",    desc: "7-day visit streak",      how: "7-day streak" },
    { id: "s_evolution1", icon: "🪨",  name: "Growing Up",   desc: "Rock evolved once",       how: "Reach level 10" },
    { id: "s_evolution2", icon: "⛰️",  name: "Boulder",      desc: "Rock evolved to boulder", how: "Reach level 20" },
    { id: "s_evolution3", icon: "💎",  name: "Crystal Form", desc: "Rock reached crystal form",how: "Reach level 30" },
    { id: "s_journal5",   icon: "📖",  name: "Storyteller",  desc: "Rock has 5 journal entries",how: "5 journal entries" },
    { id: "s_card",       icon: "📸",  name: "Famous Rock",  desc: "Exported a rock card",    how: "Export Card" },
    { id: "s_rockstack",  icon: "🗼",  name: "Rock Stacker",  desc: "Stack rocks successfully",  how: "Rock Stack game" },
    { id: "s_challenge",  icon: "📋",  name: "Challenger",    desc: "Complete a daily challenge",how: "Daily challenge" },
    { id: "s_challenge7", icon: "🌟",  name: "Challenge Champ",desc: "Complete 7 challenges",    how: "7 challenges total" },
    { id: "s_seasonal",   icon: "🎃",  name: "Season Lover",  desc: "Saw a seasonal event",      how: "Seasonal event" },
    { id: "s_level30",    icon: "💎",  name: "Diamond Rock",  desc: "Reached level 30",          how: "Level 30" },
    { id: "s_level50",    icon: "🌌",  name: "Galaxy Brain",  desc: "Reached level 50",          how: "Level 50" },
  ];

  // ── Data: Daily Events ─────────────────────────────────────
  const DAILY_EVENTS = [
    { id: "rain",      icon: "🌧️", name: "Rainy Day",        desc: "Everything is washed clean!",      effects: { cleanliness: 20, happiness: -5 },  sticker: "s_event_rain" },
    { id: "sunny",     icon: "☀️", name: "Sunny Day",         desc: "The warmth makes Rocky feel great!", effects: { happiness: 15, energy: 10 },       sticker: "s_event_sun" },
    { id: "wind",      icon: "💨", name: "Windy Gust",        desc: "Rocky got a bit dusty...",          effects: { cleanliness: -15, happiness: 5 },   sticker: null },
    { id: "meteor",    icon: "☄️", name: "Meteor Shower!",    desc: "Rocky spotted a meteor! +XP!",      effects: { happiness: 20 }, xp: 20,            sticker: null },
    { id: "geologist", icon: "🧑‍🔬","name": "Geologist Visit", desc: "A scientist admired Rocky! +bond",  effects: { bond: 10, happiness: 10 },         sticker: null },
    { id: "earthday",  icon: "🌍", name: "Earth Day!",        desc: "Rocky feels one with the earth!",   effects: { happiness: 25, bond: 5 }, xp: 10,   sticker: null },
    { id: "cave",      icon: "🦇", name: "Cave Discovery",    desc: "Found a cool cave nearby!",         effects: { happiness: 10, energy: 15 },        sticker: null },
    { id: "earthquake_minor", icon: "📳", name: "Tiny Tremor", desc: "Just a little shake! -energy",    effects: { energy: -10, happiness: -5 },       sticker: null },
    { id: "gem_found", icon: "💎", name: "Found a Gem!",      desc: "A shiny gem was nearby!",           effects: { happiness: 20, fullness: 5 }, xp: 15, sticker: null },
    { id: "friend",    icon: "🪨", name: "Rocky's Friend",   desc: "Another rock visited!",              effects: { happiness: 15, bond: 8 },            sticker: null },
    { id: "fossil",    icon: "🦴", name: "Fossil Found!",    desc: "A fossil was unearthed nearby!",      effects: { happiness: 18 }, xp: 12,               sticker: null },
    { id: "crystal_v", icon: "🔮", name: "Crystal Vein",    desc: "Found a crystal vein!",               effects: { energy: 20, happiness: 12 }, xp: 8,     sticker: null },
    { id: "rainbow_d", icon: "🌈", name: "Rainbow Day",     desc: "A beautiful rainbow appeared!",       effects: { happiness: 22, bond: 6 }, xp: 8,        sticker: null },
    { id: "eclipse",   icon: "🌑", name: "Solar Eclipse!",  desc: "Darkness fell and passed!",           effects: { happiness: 10, energy: -8 }, xp: 15,    sticker: null },
  ];

  // ── Data: Evolution Stages ─────────────────────────────────
  const EVOLUTION_STAGES = [
    { level: 0,  name: "Pebble",         size: [140, 120], radius: "50% 50% 55% 45%/60% 55% 45% 40%" },
    { level: 10, name: "Rock",           size: [155, 132], radius: "48% 52% 50% 50%/55% 50% 50% 45%" },
    { level: 20, name: "Boulder",        size: [170, 148], radius: "45% 55% 52% 48%/50% 52% 48% 50%" },
    { level: 30, name: "Crystal Formation", size: [160, 155], radius: "38% 62% 45% 55%/42% 55% 45% 58%" },
  ];

  // ── Data: Achievements ─────────────────────────────────────
  const ACHIEVEMENTS = [
    { id: "first_feed",    icon: "🍪", name: "First Bite",        desc: "Feed for the first time",        check: () => state.totalFeeds >= 1 },
    { id: "feed_10",       icon: "🪨", name: "Mineral Lover",     desc: "Feed 10 times",                  check: () => state.totalFeeds >= 10 },
    { id: "feed_50",       icon: "⛏️", name: "Quarry Chef",       desc: "Feed 50 times",                  check: () => state.totalFeeds >= 50 },
    { id: "first_pet",     icon: "🤚", name: "First Touch",       desc: "Pet for the first time",         check: () => state.totalPets >= 1 },
    { id: "pet_50",        icon: "💕", name: "Pet Whisperer",     desc: "Pet 50 times",                   check: () => state.totalPets >= 50 },
    { id: "first_play",    icon: "🎾", name: "Playtime!",         desc: "Play a game",                    check: () => state.totalPlays >= 1 },
    { id: "rps_win_5",     icon: "✌️", name: "RPS Champ",         desc: "Win Rock Paper Scissors 5 times",check: () => state.rpsWins >= 5 },
    { id: "first_walk",    icon: "🏃", name: "First Steps",       desc: "Go for a walk",                  check: () => state.totalWalks >= 1 },
    { id: "walk_20",       icon: "🗺️", name: "Explorer",          desc: "Walk 20 times",                  check: () => state.totalWalks >= 20 },
    { id: "polish_10",     icon: "✨", name: "Shine Bright",      desc: "Polish 10 times",                check: () => state.totalCleans >= 10 },
    { id: "music_10",      icon: "🎵", name: "DJ Rock",           desc: "Play music 10 times",            check: () => state.totalMusics >= 10 },
    { id: "talk_20",       icon: "💬", name: "Chatterbox",        desc: "Talk 20 times",                  check: () => state.totalTalks >= 20 },
    { id: "bond_50",       icon: "❤️", name: "Best Friends",      desc: "Reach 50 bond",                  check: () => state.stats.bond >= 50 },
    { id: "bond_max",      icon: "💖", name: "Soulmates",         desc: "Max out bond to 100",            check: () => state.stats.bond >= 100 },
    { id: "level_5",       icon: "⬆️", name: "Rising Star",       desc: "Reach level 5",                  check: () => state.level >= 5 },
    { id: "level_10",      icon: "🌟", name: "Veteran",           desc: "Reach level 10",                 check: () => state.level >= 10 },
    { id: "level_20",      icon: "👑", name: "Legendary",         desc: "Reach level 20",                 check: () => state.level >= 20 },
    { id: "interactions_100", icon: "💯", name: "Centurion",      desc: "100 total interactions",         check: () => state.totalInteractions >= 100 },
    { id: "age_7",         icon: "🎂", name: "One Week",          desc: "Rock is 7 days old",             check: () => state.age >= 7 },
    { id: "age_30",        icon: "🏆", name: "One Month",         desc: "Rock is 30 days old",            check: () => state.age >= 30 },
    { id: "streak_3",      icon: "🔥", name: "On a Roll",         desc: "3-day visit streak",             check: () => state.streak >= 3 },
    { id: "streak_7",      icon: "🌈", name: "Week Streak",       desc: "7-day visit streak",             check: () => state.streak >= 7 },
    { id: "evolution_1",   icon: "⬆️", name: "Growing Up",        desc: "Rock evolved for the first time",check: () => state.evolutionStage >= 1 },
    { id: "stickers_5",    icon: "🌟", name: "Collector",         desc: "Collect 5 stickers",             check: () => state.stickersCollected.length >= 5 },
    { id: "journal_5",     icon: "📖", name: "Memoirs",           desc: "Rock has 5 journal entries",     check: () => state.journalEntries.length >= 5 },
    { id: "level_30",      icon: "💎", name: "Diamond Tier",      desc: "Reach level 30",                check: () => state.level >= 30 },
    { id: "level_50",      icon: "🌌", name: "Galaxy Tier",       desc: "Reach level 50",                check: () => state.level >= 50 },
    { id: "feed_100",      icon: "🍽️", name: "Master Chef",       desc: "Feed 100 times",                check: () => state.totalFeeds >= 100 },
    { id: "pet_100",       icon: "💖", name: "Rock Whisperer",    desc: "Pet 100 times",                 check: () => state.totalPets >= 100 },
    { id: "play_50",       icon: "🎮", name: "Game Master",       desc: "Play 50 mini-games",            check: () => state.totalPlays >= 50 },
    { id: "walk_50",       icon: "🌍", name: "World Walker",      desc: "Walk 50 times",                 check: () => state.totalWalks >= 50 },
    { id: "interactions_500", icon: "🌟", name: "Superfan",       desc: "500 total interactions",        check: () => state.totalInteractions >= 500 },
    { id: "age_100",       icon: "🎊", name: "Centenarian",       desc: "Rock is 100 days old",          check: () => state.age >= 100 },
    { id: "challenge_7",   icon: "📋", name: "Challenge Fanatic", desc: "Complete 7 daily challenges",   check: () => (state.challengesCompleted || 0) >= 7 },
    { id: "rock_stack",    icon: "🗼", name: "Rock Stacker",      desc: "Play the Rock Stack game",      check: () => (state.totalRockStacks || 0) >= 1 },
    { id: "all_skins",     icon: "🎨", name: "Fashionista",       desc: "Unlock 8+ skins",               check: () => state.skinsUnlocked.length >= 8 },
    { id: "streak_14",     icon: "🏆", name: "2-Week Warrior",    desc: "14-day visit streak",           check: () => state.streak >= 14 },
  ];

  // ── Data: Dialogue ─────────────────────────────────────────
  const dialogue = {
    feed: [
      "Mmm... delicious gravel!", "*cronch cronch* Tasty minerals!",
      "This limestone is exquisite!", "Is this organic free-range sand? Nice!",
      "Needs more sediment... but still good!", "*happy munching sounds*",
      "Ah yes, my favorite — quartz flakes!",
    ],
    play: [
      "Whee! ...I didn't move, but I had fun!", "That was a great game of 'sit still'!",
      "I won! I always win at not moving!", "EXTREME SITTING!",
      "Let's play hide and seek! ...I'll just stay here.",
    ],
    clean: [
      "Ooh, a spa day! I feel so polished!", "Shiny! I can almost see my reflection!",
      "Is this what luxury feels like?", "I'm gleaming like a diamond! ...well, a rock.",
      "I feel like a brand new pebble!",
    ],
    sleep: [
      "Zzzz... *dreams of being a mountain*", "Good night! Don't let the gemstones bite!",
      "Nap time...", "Finally, my 23.5-hour beauty sleep!",
      "Dream mode: activated.", "Zzzz... *dreams of rolling downhill*",
    ],
    talk: [
      "...", "...... (I'm a great listener though!)", "*supportive silence*",
      "You know what I think? ... ... ...",
      "That's deep. Not as deep as my mineral deposits, but deep.",
      "I have strong opinions. I just keep them... stone cold.",
      "Tell me more! (I literally can't stop you.)",
      "Fun fact: I've been around for millions of years. I've seen things.",
    ],
    pet: [
      "Ooh, that's nice! Right on my granite!", "*purrs geologically*",
      "Yes, pet the rock. The rock approves.",
      "I'm blushing! ...mineralogically speaking.",
      "This is the best! My surface is tingling!",
    ],
    music: [
      "This rocks! Get it?", "I'd dance if I could! *vibrates imperceptibly*",
      "This is my jam! *sits perfectly still*",
      "We will, we will ROCK you!",
      "I'm moshing! ...internally.",
    ],
    exercise: [
      "I went for a walk! ...you carried me, but still!",
      "Fresh air! I can feel the erosion!", "What a workout! I rolled 2 inches!",
      "Nature walk! I saw a pebble — might be a cousin.",
      "I'm basically a fitness rock now.",
    ],
    bored: [
      "I'm just sitting here... like always...", "Is anyone there? Not that I care...",
      "I wonder what it's like to have legs...", "Day 4,380,000,000: still a rock.",
    ],
    hungry: ["Could use some mineral supplements...", "My tummy is rumbling! (I don't have a tummy.)", "Is it snack time yet?"],
    tired: ["yawwwn... if I could yawn...", "Getting sleepy over here...", "My sedimentary layers need rest..."],
    dirty: ["I'm getting a bit mossy...", "Could use a good scrub!", "I'm starting to look like a garden rock..."],
    sad: ["I'm feeling a bit crumbled today...", "Nobody wants to play with a rock...", "I'm eroding on the inside..."],
    highBond: [
      "You're my favorite human!", "We're like two pebbles in a pod!",
      "Best friends forever — literally, I last forever.",
      "I'd move mountains for you! ...if I could move.",
    ],
    gettingHungry: ["I could go for a snack...", "Getting a bit peckish over here..."],
    gettingTired: ["Starting to feel a bit sleepy...", "Could use a little rest..."],
    gettingDirty: ["Getting a tiny bit dusty...", "A quick polish would be nice..."],
    gettingBored: ["Not much going on around here...", "A little activity would be nice..."],
  };

  const moodEmojis = {
    ecstatic: "🤩 Ecstatic!", happy: "😊 Happy", content: "🙂 Content",
    okay: "😐 Okay", sad: "😢 Sad", miserable: "😭 Miserable", sleeping: "😴 Sleeping",
  };

  // ── Helpers ────────────────────────────────────────────────
  const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const ts = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const esc = (s) => { const d = document.createElement("span"); d.textContent = s; return d.innerHTML; };

  function xpForLevel(lv) { return 30 + lv * 20; }

  // ── Logging ────────────────────────────────────────────────
  function log(text, type = "system-msg") {
    const el = document.createElement("div");
    el.className = `message ${type}`;
    const time = document.createElement("span");
    time.className = "timestamp";
    time.textContent = ts();
    el.appendChild(time);
    el.appendChild(document.createTextNode(text));
    dom.messages.prepend(el);
    while (dom.messages.children.length > 60) dom.messages.lastChild.remove();
  }

  // ── XP & Leveling ─────────────────────────────────────────
  function addXP(amount) {
    state.xp += amount;
    const needed = xpForLevel(state.level);
    if (state.xp >= needed) {
      state.xp -= needed;
      state.level++;
      dom.levelDisplay.textContent = state.level;
      log(`🎉 LEVEL UP! You are now level ${state.level}!`, "xp-msg");
      showThought(`Level ${state.level}! I'm evolving! ...sort of!`, 4000);
      showLevelUp();
      SFX.levelup();
      checkUnlocks();
      checkEvolution();
      addJournalEntry(`Reached level ${state.level}!`);
    }
    updateXPBar();
  }

  function updateXPBar() {
    const needed = xpForLevel(state.level);
    const pct = Math.min(100, (state.xp / needed) * 100);
    dom.xpBar.style.width = pct + "%";
    dom.xpText.textContent = `${Math.floor(state.xp)} / ${needed} XP`;
  }

  function showLevelUp() {
    dom.levelupNumber.textContent = `Level ${state.level}`;
    dom.levelupOverlay.classList.remove("hidden");
    setTimeout(() => dom.levelupOverlay.classList.add("hidden"), 2200);
    flashScreen("rgba(255,215,0,0.28)");
    spawnBurst(["⭐","✨","🌟","💫"], 14);
    animateRock("anim-celebrate", 750);
  }

  function grantCustomizeXP() {
    const now = Date.now();
    if (now - state.lastCustomizeXP > 5000) { state.lastCustomizeXP = now; addXP(1); }
  }

  // ── Check Unlocks ──────────────────────────────────────────
  function checkUnlocks() {
    let newUnlocks = [];
    for (const [id, skin] of Object.entries(SKINS)) {
      if (skin.unlock && skin.unlock.level <= state.level && !state.skinsUnlocked.includes(id)) {
        state.skinsUnlocked.push(id);
        newUnlocks.push(`Skin: ${skin.label}`);
      }
    }
    for (const [id, eye] of Object.entries(EYE_STYLES)) {
      if (eye.unlock && eye.unlock.level <= state.level && !state.eyesUnlocked.includes(id)) {
        state.eyesUnlocked.push(id);
        newUnlocks.push(`Eyes: ${eye.label}`);
      }
    }
    for (const [id, acc] of Object.entries(ACCESSORIES)) {
      if (acc.unlock && acc.unlock.level <= state.level && !state.accessoriesUnlocked.includes(id)) {
        state.accessoriesUnlocked.push(id);
        newUnlocks.push(`Accessory: ${acc.label}`);
      }
    }
    for (const [id, bg] of Object.entries(BACKGROUNDS)) {
      if (bg.unlock && bg.unlock.level <= state.level && !state.backgroundsUnlocked.includes(id)) {
        state.backgroundsUnlocked.push(id);
        newUnlocks.push(`Scene: ${bg.label}`);
      }
    }
    if (newUnlocks.length) {
      log(`🔓 New unlocks: ${newUnlocks.join(", ")}`, "xp-msg");
      renderPickers();
    }
  }

  // ── Achievements ───────────────────────────────────────────
  function checkAchievements() {
    for (const ach of ACHIEVEMENTS) {
      if (!state.achievementsUnlocked.includes(ach.id) && ach.check()) {
        state.achievementsUnlocked.push(ach.id);
        log(`🏆 Achievement: ${ach.name} — ${ach.desc}`, "achieve-msg");
        showAchievementToast(ach);
        SFX.achieve();
        flashScreen("rgba(255,200,50,0.28)");
        spawnBurst(["🏆","⭐","✨"], 8);
        addXP(15);
      }
    }
    renderAchievements();
  }

  function showAchievementToast(ach) {
    dom.toastIcon.textContent = ach.icon;
    dom.toastDesc.textContent = ach.name;
    dom.achievementToast.classList.remove("hidden");
    setTimeout(() => dom.achievementToast.classList.add("hidden"), 3500);
  }

  let _lastAchCount = -1;
  function renderAchievements() {
    if (state.achievementsUnlocked.length === _lastAchCount) return;
    _lastAchCount = state.achievementsUnlocked.length;
    dom.achievementsList.innerHTML = "";
    for (const ach of ACHIEVEMENTS) {
      const d = document.createElement("div");
      const unlocked = state.achievementsUnlocked.includes(ach.id);
      d.className = `trophy ${unlocked ? "unlocked" : "locked"}`;
      d.textContent = ach.icon;
      d.dataset.tip = unlocked ? ach.name : "???";
      dom.achievementsList.appendChild(d);
    }
    dom.trophyCount.textContent = `${state.achievementsUnlocked.length}/${ACHIEVEMENTS.length}`;
  }

  // ── Update UI ──────────────────────────────────────────────
  function updateStats() {
    for (const [k, v] of Object.entries(state.stats)) {
      const c = clamp(v); state.stats[k] = c;
      statBars[k].style.width = c + "%";
      statVals[k].textContent = Math.round(c);
      statBars[k].classList.toggle("low", c < 25);
      const bar = statBars[k].parentElement;
      if (bar) bar.setAttribute("aria-valuenow", Math.round(c));
    }
  }

  function updateMood() {
    const { happiness: h, fullness: f, energy: e } = state.stats;
    const avg = (h + f + e) / 3;
    let mood;
    if (state.isSleeping) mood = "sleeping";
    else if (avg > 85) mood = "ecstatic";
    else if (avg > 65) mood = "happy";
    else if (avg > 45) mood = "content";
    else if (avg > 30) mood = "okay";
    else if (avg > 15) mood = "sad";
    else mood = "miserable";
    dom.moodIndicator.textContent = moodEmojis[mood];
    return mood;
  }

  function updateFace() {
    const mood = updateMood();
    // Keep eye style class, clear face states
    const eyeClass = EYE_STYLES[state.eyeStyle]?.css || "";
    dom.rockBody.className = eyeClass;
    if (state.isSleeping) { dom.rockBody.classList.add("face-sleeping"); return; }
    switch (mood) {
      case "ecstatic": dom.rockBody.classList.add("face-excited"); break;
      case "happy": dom.rockBody.classList.add("face-happy"); break;
      case "sad": case "miserable": dom.rockBody.classList.add("face-sad"); break;
      default: dom.rockBody.classList.add("face-happy");
    }
    const showBlush = state.stats.bond > 60;
    dom.blushL.classList.toggle("hidden", !showBlush);
    dom.blushR.classList.toggle("hidden", !showBlush);
  }

  function updateSkin() {
    const s = SKINS[state.skin] || SKINS.granite;
    document.documentElement.style.setProperty("--rock-color", s.color);
    document.documentElement.style.setProperty("--rock-highlight", s.hi);
    document.documentElement.style.setProperty("--rock-shadow", s.sh);
    if (state.skin === "rainbow") {
      dom.rockBody.style.background = "";
      dom.rockBody.classList.add("rainbow-skin");
    } else {
      dom.rockBody.classList.remove("rainbow-skin");
      dom.rockBody.style.background = `radial-gradient(ellipse at 35% 30%, ${s.hi}, ${s.color} 50%, ${s.sh})`;
    }
  }

  function updateAccessory() {
    const acc = ACCESSORIES[state.accessory] || ACCESSORIES.none;
    dom.accessoryDisplay.className = "hidden"; dom.accessoryDisplay.innerHTML = "";
    dom.faceAccessory.className = "hidden"; dom.faceAccessory.innerHTML = "";
    if (state.accessory !== "none" && acc.svg) {
      if (acc.target === "face") {
        dom.faceAccessory.innerHTML = acc.svg;
        dom.faceAccessory.className = `acc-${state.accessory}`;
      } else {
        dom.accessoryDisplay.innerHTML = acc.svg;
        dom.accessoryDisplay.className = `acc-${state.accessory}`;
      }
    }
  }

  let _bubbleInterval = null, _snowInterval = null;
  function clearBgIntervals() { clearInterval(_bubbleInterval); clearInterval(_snowInterval); _bubbleInterval = _snowInterval = null; }

  function updateBackground() {
    const bg = BACKGROUNDS[state.background] || BACKGROUNDS.default;
    clearBgIntervals();
    // Remove old env classes
    dom.rockStage.className.split(" ").filter(c => c.startsWith("env-")).forEach(c => dom.rockStage.classList.remove(c));
    dom.envLayer.innerHTML = "";
    if (bg.css) {
      dom.rockStage.classList.add(bg.css);
      // Add dynamic elements for certain bgs
      if (state.background === "space") spawnStars();
      if (state.background === "underwater") spawnBubbles();
      if (state.background === "snow") spawnSnowflakes();
    }
  }

  function spawnStars() {
    for (let i = 0; i < 30; i++) {
      const s = document.createElement("div");
      s.className = "star";
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      s.style.animationDelay = Math.random() * 2 + "s";
      s.style.width = (1 + Math.random() * 2) + "px";
      s.style.height = s.style.width;
      dom.envLayer.appendChild(s);
    }
  }

  function spawnBubbles() {
    _bubbleInterval = setInterval(() => {
      if (state.background !== "underwater") return;
      const b = document.createElement("div");
      b.className = "bubble";
      b.style.left = Math.random() * 100 + "%";
      b.style.bottom = "0";
      b.style.width = (4 + Math.random() * 8) + "px";
      b.style.height = b.style.width;
      b.style.animationDuration = (3 + Math.random() * 4) + "s";
      dom.envLayer.appendChild(b);
      setTimeout(() => b.remove(), 7000);
    }, 1500);
  }

  function spawnSnowflakes() {
    _snowInterval = setInterval(() => {
      if (state.background !== "snow") return;
      const s = document.createElement("div");
      s.className = "snowflake";
      s.textContent = pick(["❄", "❅", "❆", "·"]);
      s.style.left = Math.random() * 100 + "%";
      s.style.top = "-20px";
      s.style.animationDuration = (4 + Math.random() * 6) + "s";
      s.style.fontSize = (.5 + Math.random() * .8) + "rem";
      dom.envLayer.appendChild(s);
      setTimeout(() => s.remove(), 10000);
    }, 600);
  }

  // ── Render Picker Grids ────────────────────────────────────
  function renderPickers() {
    renderSkinPicker();
    renderEyePicker();
    renderAccPicker();
    renderBgPicker();
    renderFoodPicker();
  }

  function renderSkinPicker() {
    dom.skinOptions.innerHTML = "";
    for (const [id, skin] of Object.entries(SKINS)) {
      const unlocked = state.skinsUnlocked.includes(id);
      const btn = document.createElement("button");
      btn.className = `picker-btn${state.skin === id ? " active" : ""}${!unlocked ? " locked" : ""}`;
      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.background = skin.color;
      btn.appendChild(swatch);
      btn.appendChild(document.createTextNode(skin.label));
      if (!unlocked) { const lock = document.createElement("span"); lock.className = "lock-icon"; lock.textContent = `🔒 Lv${skin.unlock?.level || "?"}`; btn.appendChild(lock); }
      btn.onclick = () => {
        if (!unlocked) { showThought(`Unlock at level ${skin.unlock?.level}!`); return; }
        state.skin = id; updateSkin(); renderSkinPicker();
        showThought(id === "granite" ? "Back to basics!" : `Ooh, ${skin.label}! Fancy!`);
        log(`Changed skin to ${skin.label}`, "action-msg"); grantCustomizeXP();
      };
      dom.skinOptions.appendChild(btn);
    }
  }

  function renderEyePicker() {
    dom.eyeOptions.innerHTML = "";
    for (const [id, eye] of Object.entries(EYE_STYLES)) {
      const unlocked = state.eyesUnlocked.includes(id);
      const btn = document.createElement("button");
      btn.className = `picker-btn${state.eyeStyle === id ? " active" : ""}${!unlocked ? " locked" : ""}`;
      btn.textContent = eye.label + (!unlocked ? ` 🔒 Lv${eye.unlock?.level || "?"}` : "");
      btn.onclick = () => {
        if (!unlocked) { showThought(`Unlock at level ${eye.unlock?.level}!`); return; }
        state.eyeStyle = id; updateFace(); renderEyePicker();
        showThought(`New eyes! I can see... exactly the same!`);
        log(`Changed eyes to ${eye.label}`, "action-msg"); grantCustomizeXP();
      };
      dom.eyeOptions.appendChild(btn);
    }
  }

  function renderAccPicker() {
    dom.accOptions.innerHTML = "";
    for (const [id, acc] of Object.entries(ACCESSORIES)) {
      const unlocked = state.accessoriesUnlocked.includes(id);
      const btn = document.createElement("button");
      btn.className = `picker-btn${state.accessory === id ? " active" : ""}${!unlocked ? " locked" : ""}`;
      btn.textContent = acc.label + (!unlocked ? ` 🔒 Lv${acc.unlock?.level || "?"}` : "");
      btn.onclick = () => {
        if (!unlocked) { showThought(`Unlock at level ${acc.unlock?.level}!`); return; }
        state.accessory = id; updateAccessory(); renderAccPicker();
        if (id !== "none") {
          showThought("Looking good!"); log(`Equipped ${acc.label}`, "action-msg");
        } else {
          showThought("Au naturel!"); log("Removed accessory", "action-msg");
        }
        state.stats.happiness = clamp(state.stats.happiness + 2); grantCustomizeXP();
      };
      dom.accOptions.appendChild(btn);
    }
  }

  function renderBgPicker() {
    dom.bgOptions.innerHTML = "";
    for (const [id, bg] of Object.entries(BACKGROUNDS)) {
      const unlocked = state.backgroundsUnlocked.includes(id);
      const btn = document.createElement("button");
      btn.className = `picker-btn${state.background === id ? " active" : ""}${!unlocked ? " locked" : ""}`;
      btn.textContent = bg.label + (!unlocked ? ` 🔒 Lv${bg.unlock?.level || "?"}` : "");
      btn.onclick = () => {
        if (!unlocked) { showThought(`Unlock at level ${bg.unlock?.level}!`); return; }
        state.background = id; updateBackground(); renderBgPicker();
        if (id === "space") showThought("Whoa... so many stars!");
        else if (id === "underwater") showThought("Blub blub blub!");
        else if (id === "volcano") showThought("It's getting hot in here!");
        else if (id === "snow") showThought("Brr! ...wait, I can't feel cold.");
        else showThought("Nice scenery!");
        log(`Changed scene to ${bg.label}`, "action-msg"); grantCustomizeXP();
      };
      dom.bgOptions.appendChild(btn);
    }
  }

  function renderFoodPicker() {
    dom.foodOptions.innerHTML = "";
    for (const [id, food] of Object.entries(FOODS)) {
      const unlocked = !food.unlock || food.unlock.level <= state.level;
      const btn = document.createElement("button");
      btn.className = `picker-btn${!unlocked ? " locked" : ""}`;
      btn.textContent = food.label + (!unlocked ? ` 🔒 Lv${food.unlock?.level}` : "");
      btn.onclick = () => {
        if (!unlocked) { showThought(`Unlock at level ${food.unlock?.level}!`); return; }
        feedRock(id);
      };
      dom.foodOptions.appendChild(btn);
    }
  }

  // ── Thought Bubble ─────────────────────────────────────────
  let thoughtTimeout = null;
  function showThought(text, dur = 3000) {
    clearTimeout(thoughtTimeout);
    dom.thoughtText.textContent = text;
    dom.thoughtBubble.classList.remove("hidden");
    thoughtTimeout = setTimeout(() => dom.thoughtBubble.classList.add("hidden"), dur);
  }

  // ── Rock Animations ────────────────────────────────────────
  function animateRock(cls, dur = 600) {
    dom.rock.classList.add(cls);
    setTimeout(() => dom.rock.classList.remove(cls), dur);
  }

  // ── Particles ──────────────────────────────────────────────
  function spawnParticle(emoji, x, y) {
    if (!state.particlesOn) return;
    const el = document.createElement("div");
    el.className = "particle"; el.textContent = emoji;
    const dx = (Math.random() - 0.5) * 60;
    el.style.setProperty("--dx", dx + "px");
    el.style.fontSize = (0.8 + Math.random() * 0.8).toFixed(1) + "rem";
    el.style.left = (x || 80 + Math.random() * 40) + "px";
    el.style.top = (y || 60 + Math.random() * 40) + "px";
    dom.particles.appendChild(el);
    setTimeout(() => el.remove(), 1600);
  }
  function spawnMulti(emoji, n = 5) {
    for (let i = 0; i < n; i++) setTimeout(() => spawnParticle(emoji), i * 130);
  }
  function spawnBurst(emojis, count, cx, cy) {
    if (!state.particlesOn) return;
    const arr = Array.isArray(emojis) ? emojis : [emojis];
    const ox = cx != null ? cx : window.innerWidth / 2;
    const oy = cy != null ? cy : 200;
    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "burst-particle";
      el.textContent = arr[Math.floor(Math.random() * arr.length)];
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const dist = 55 + Math.random() * 95;
      el.style.setProperty("--bx", Math.round(Math.cos(angle) * dist) + "px");
      el.style.setProperty("--by", Math.round(Math.sin(angle) * dist) + "px");
      el.style.setProperty("--brot", Math.round((Math.random() - 0.5) * 720) + "deg");
      el.style.setProperty("--dur", (0.8 + Math.random() * 0.5).toFixed(2) + "s");
      el.style.left = ox + "px";
      el.style.top = oy + "px";
      el.style.fontSize = (0.9 + Math.random() * 0.7).toFixed(1) + "rem";
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1500);
    }
  }
  function flashScreen(color = "rgba(255,215,0,0.35)") {
    const el = document.createElement("div");
    el.className = "screen-flash";
    el.style.background = color;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 750);
  }
  function spawnRipple() {
    const el = document.createElement("div");
    el.className = "rock-ripple";
    dom.rock.appendChild(el);
    setTimeout(() => el.remove(), 600);
  }

  function showStatFloater(text, color = "#6bcb77") {
    const el = document.createElement("div");
    el.className = "stat-floater";
    el.textContent = text;
    el.style.color = color;
    el.style.setProperty("--fdx", ((Math.random() - 0.5) * 32).toFixed(0) + "px");
    el.style.left = (70 + Math.random() * 60) + "px";
    el.style.top = (30 + Math.random() * 40) + "px";
    dom.particles.appendChild(el);
    setTimeout(() => el.remove(), 1400);
  }

  let sleepInterval = null;
  function startSleepZzz() {
    sleepInterval = setInterval(() => {
      const z = document.createElement("div"); z.className = "zzz"; z.textContent = "Z";
      z.style.left = (100 + Math.random() * 40) + "px"; z.style.top = (30 + Math.random() * 20) + "px";
      dom.particles.appendChild(z); setTimeout(() => z.remove(), 2000);
    }, 800);
  }
  function stopSleepZzz() { clearInterval(sleepInterval); sleepInterval = null; }

  function spawnSparkles() {
    for (let i = 0; i < 8; i++) setTimeout(() => {
      const s = document.createElement("div"); s.className = "sparkle"; s.textContent = "✨";
      s.style.left = (40 + Math.random() * 120) + "px"; s.style.top = (20 + Math.random() * 100) + "px";
      dom.particles.appendChild(s); setTimeout(() => s.remove(), 800);
    }, i * 100);
  }

  function spawnMusicNotes() {
    const notes = ["🎵", "🎶", "♪", "♫"];
    for (let i = 0; i < 6; i++) setTimeout(() => {
      const n = document.createElement("div"); n.className = "music-note"; n.textContent = pick(notes);
      n.style.left = (60 + Math.random() * 80) + "px"; n.style.top = (40 + Math.random() * 60) + "px";
      n.style.setProperty("--dx", (Math.random() * 60 - 30) + "px");
      n.style.setProperty("--rot", (Math.random() * 40 - 20) + "deg");
      dom.particles.appendChild(n); setTimeout(() => n.remove(), 2000);
    }, i * 200);
  }

  // ── Sound Effects ──────────────────────────────────────────
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) { try { audioCtx = new AudioCtx(); } catch(e) {} }
    return audioCtx;
  }

  // Haptic feedback — Capacitor Haptics on iOS, Web Vibration on Android
  function haptic(intensity = "light") {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        const H = window.Capacitor.Plugins.Haptics;
        if (intensity === "heavy")   H.impact({ style: "HEAVY" }).catch(() => {});
        else if (intensity === "medium") H.impact({ style: "MEDIUM" }).catch(() => {});
        else if (intensity === "success") H.notification({ type: "SUCCESS" }).catch(() => {});
        else if (intensity === "warning") H.notification({ type: "WARNING" }).catch(() => {});
        else H.impact({ style: "LIGHT" }).catch(() => {});
        return;
      }
    } catch(e) {}
    // Fallback: Web Vibration API (Android / desktop)
    try {
      if (navigator.vibrate) {
        const patterns = { light: 10, medium: 20, heavy: [30, 50, 30], success: [10, 50, 20], warning: [20, 30, 20] };
        navigator.vibrate(patterns[intensity] || 10);
      }
    } catch(e) {}
  }

  function playTone(freq, type = "sine", duration = 0.15, gain = 0.2, attack = 0.008) {
    if (!state.sfxOn) return;
    const ctx = getAudioCtx();
    if (!ctx) return;
    try {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g); g.connect(ctx.destination);
      osc.type = type; osc.frequency.setValueAtTime(freq, ctx.currentTime);
      g.gain.setValueAtTime(0, ctx.currentTime);
      g.gain.linearRampToValueAtTime(gain, ctx.currentTime + attack);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + Math.max(duration, attack + 0.02));
      osc.start(); osc.stop(ctx.currentTime + Math.max(duration, attack + 0.02) + 0.01);
    } catch(e) {}
  }
  function playChord(freqs, type = "sine", duration = 0.2, gain = 0.12, attack = 0.008) {
    freqs.forEach(f => playTone(f, type, duration, gain, attack));
  }

  const SFX = {
    feed:     () => { haptic("light");   playTone(440,"sine",0.1,0.18,0.01); setTimeout(()=>playChord([550,660],"sine",0.12,0.12),90); },
    pet:      () => { haptic("medium");  [523,659,784].forEach((f,i)=>setTimeout(()=>playTone(f,"sine",0.18,0.18,0.01),i*65)); },
    clean:    () => { haptic("medium");  [350,450,580,720,900].forEach((f,i)=>setTimeout(()=>playTone(f,"triangle",0.09,0.15,0.005),i*55)); },
    levelup:  () => { haptic("success"); playChord([523,659,784],"square",0.1,0.1,0.01); setTimeout(()=>playChord([659,784,1047],"square",0.12,0.13,0.01),160); setTimeout(()=>playChord([784,1047,1319],"sine",0.22,0.16,0.01),320); },
    achieve:  () => { haptic("success"); playChord([784,988,1175],"sine",0.14,0.14,0.008); setTimeout(()=>playChord([988,1319,1568],"sine",0.18,0.14,0.005),180); },
    click:    () => { haptic("light");   playTone(380,"sine",0.04,0.08,0.003); },
    win:      () => { haptic("success"); playChord([523,659,784],"sine",0.1,0.13,0.01); setTimeout(()=>playChord([659,784,1047],"sine",0.13,0.14,0.008),130); setTimeout(()=>playChord([784,1047,1319],"sine",0.28,0.16,0.006),260); },
    lose:     () => { haptic("warning"); [400,340,270,210].forEach((f,i)=>setTimeout(()=>playTone(f,"sawtooth",0.14,0.15,0.012),i*110)); },
    tap:      () => { haptic("light");   playTone(800,"square",0.04,0.15,0.003); },
    tapHit:   () => { haptic("light");   playTone(900,"sine",0.06,0.22,0.003); setTimeout(()=>playTone(1200,"sine",0.05,0.12,0.002),55); },
    tapMiss:  () => { haptic("light");   playTone(200,"sawtooth",0.08,0.14,0.008); setTimeout(()=>playTone(160,"sawtooth",0.06,0.10,0.005),80); },
    event:    () => { haptic("medium");  playChord([440,550],"sine",0.12,0.14,0.01); setTimeout(()=>playTone(660,"sine",0.14,0.16,0.008),140); },
    stack:    () => { haptic("medium");  playTone(620,"sine",0.06,0.18,0.005); setTimeout(()=>playTone(820,"sine",0.09,0.15,0.005),70); },
    evolution:() => { haptic("heavy");   [261,329,392,523,659,784,1047].forEach((f,i)=>setTimeout(()=>playChord([f,Math.round(f*1.26)],"sine",0.22,0.18,0.015),i*90)); },
    challenge:() => { haptic("success"); playChord([523,659],"triangle",0.1,0.13,0.01); setTimeout(()=>playChord([659,784,1047],"triangle",0.16,0.14,0.008),140); },
  };

  let ambientNode = null, ambientGain = null, _ambientNodes = [];
  function startAmbient() {
    if (!state.ambientOn) return;
    const ctx = getAudioCtx(); if (!ctx) return;
    try {
      stopAmbient();
      _ambientNodes = [];
      // Master output gain
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.055, ctx.currentTime);
      masterGain.connect(ctx.destination);
      ambientGain = masterGain;
      // Low rumble oscillator with slow LFO frequency tremolo
      const rumble = ctx.createOscillator();
      rumble.type = "sine"; rumble.frequency.setValueAtTime(55, ctx.currentTime);
      const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.22, ctx.currentTime);
      lfoGain.gain.setValueAtTime(7, ctx.currentTime);
      lfo.connect(lfoGain); lfoGain.connect(rumble.frequency);
      lfo.start(); rumble.connect(masterGain); rumble.start();
      _ambientNodes.push(rumble, lfo);
      ambientNode = rumble;
      // Gentle bandpass-filtered noise layer for texture
      const bufLen = ctx.sampleRate * 2;
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);
      const noise = ctx.createBufferSource(); noise.buffer = buf; noise.loop = true;
      const noiseGain = ctx.createGain(); noiseGain.gain.setValueAtTime(0.01, ctx.currentTime);
      const filter = ctx.createBiquadFilter(); filter.type = "bandpass";
      filter.frequency.setValueAtTime(250, ctx.currentTime); filter.Q.setValueAtTime(0.4, ctx.currentTime);
      noise.connect(filter); filter.connect(noiseGain); noiseGain.connect(masterGain);
      noise.start(); _ambientNodes.push(noise);
    } catch(e) {}
  }
  function stopAmbient() {
    _ambientNodes.forEach(n => { try { n.stop(); } catch(e) {} });
    _ambientNodes = []; ambientNode = null;
  }

  // ── Evolution ──────────────────────────────────────────────
  function checkEvolution() {
    let stage = 0;
    for (let i = EVOLUTION_STAGES.length - 1; i >= 0; i--) {
      if (state.level >= EVOLUTION_STAGES[i].level) { stage = i; break; }
    }
    if (stage !== state.evolutionStage) {
      const prev = state.evolutionStage;
      state.evolutionStage = stage;
      const evo = EVOLUTION_STAGES[stage];
      applyEvolutionShape();
      if (stage > prev) {
        log(`✨ ${state.name} evolved into a ${evo.name}!`, "xp-msg");
        showThought(`I'm a ${evo.name} now! I feel... rockier!`, 5000);
        spawnMulti("⭐", 8);
        spawnBurst(["✨","⭐","💫","🌈","🎆"], 20);
        flashScreen("rgba(140,80,255,0.35)");
        SFX.evolution();
        addJournalEntry(`Evolved into a ${evo.name}!`);
        grantSticker(stage === 1 ? "s_evolution1" : stage === 2 ? "s_evolution2" : "s_evolution3");
        checkAchievements();
      }
    }
  }

  function applyEvolutionShape() {
    const evo = EVOLUTION_STAGES[state.evolutionStage];
    dom.rockBody.style.width = evo.size[0] + "px";
    dom.rockBody.style.height = evo.size[1] + "px";
    dom.rockBody.style.borderRadius = evo.radius;
    if (dom.evolutionBadge) dom.evolutionBadge.textContent = evo.name;
  }

  // ── Streak ─────────────────────────────────────────────────
  function checkStreak() {
    const today = new Date().toDateString();
    if (state.lastVisitDay === today) return;
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    if (state.lastVisitDay === yesterday) {
      state.streak++;
    } else if (state.lastVisitDay !== null) {
      state.streak = 1;
    } else {
      state.streak = 1;
    }
    state.lastVisitDay = today;
    dom.streakDisplay.textContent = state.streak;
    if (state.streak > 1) {
      dom.streakText.textContent = `${state.streak}-day streak! 🔥`;
      dom.streakToast.classList.remove("hidden");
      setTimeout(() => dom.streakToast.classList.add("hidden"), 3500);
      addXP(state.streak * 3);
      addJournalEntry(`Visited ${state.streak} days in a row!`);
      SFX.event();
    }
    if (state.streak >= 3) grantSticker("s_streak3");
    if (state.streak >= 7) grantSticker("s_streak7");
    checkAchievements();
  }

  // ── Daily Events ───────────────────────────────────────────
  function checkDailyEvent() {
    const today = new Date().toDateString();
    if (state.lastEventDay === today) return;
    state.lastEventDay = today;
    if (Math.random() < 0.7) {
      const ev = pick(DAILY_EVENTS);
      for (const [stat, val] of Object.entries(ev.effects)) {
        if (state.stats[stat] !== undefined) state.stats[stat] = clamp(state.stats[stat] + val);
      }
      if (ev.xp) addXP(ev.xp);
      if (ev.sticker) grantSticker(ev.sticker);
      dom.eventIcon.textContent = ev.icon;
      dom.eventDesc.textContent = ev.desc;
      dom.eventToast.classList.remove("hidden");
      setTimeout(() => dom.eventToast.classList.add("hidden"), 4500);
      log(`📅 Daily Event: ${ev.name} — ${ev.desc}`, "system-msg");
      addJournalEntry(`${ev.icon} ${ev.name}: ${ev.desc}`);
      SFX.event();
      updateStats(); updateFace();
    }
  }

  // ── Stickers ───────────────────────────────────────────────
  function grantSticker(id) {
    if (state.stickersCollected.includes(id)) return;
    const sticker = STICKERS.find(s => s.id === id);
    if (!sticker) return;
    state.stickersCollected.push(id);
    log(`🌟 New Sticker: ${sticker.icon} ${sticker.name} — ${sticker.desc}`, "achieve-msg");
    renderStickers();
    checkAchievements();
  }

  let _lastStickerCount = -1;
  function renderStickers() {
    if (state.stickersCollected.length === _lastStickerCount) return;
    _lastStickerCount = state.stickersCollected.length;
    dom.stickersList.innerHTML = "";
    for (const sticker of STICKERS) {
      const d = document.createElement("div");
      const has = state.stickersCollected.includes(sticker.id);
      d.className = `trophy sticker ${has ? "unlocked" : "locked"}`;
      d.textContent = sticker.icon;
      d.dataset.tip = has ? sticker.name : "???";
      dom.stickersList.appendChild(d);
    }
    dom.stickerCount.textContent = `${state.stickersCollected.length}/${STICKERS.length}`;
  }

  // ── Journal ────────────────────────────────────────────────
  function addJournalEntry(text) {
    const d = new Date();
    const dateStr = d.toLocaleDateString([], { month: "short", day: "numeric" });
    const entry = { date: dateStr, text, day: state.age };
    state.journalEntries.unshift(entry);
    if (state.journalEntries.length > 50) state.journalEntries.pop();
    if (state.journalEntries.length >= 5) grantSticker("s_journal5");
    checkAchievements();
  }

  function openJournal() {
    dom.journalEntries.innerHTML = "";
    if (state.journalEntries.length === 0) {
      dom.journalEntries.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:20px">No entries yet. Keep playing!</p>';
    } else {
      for (const entry of state.journalEntries) {
        const el = document.createElement("div");
        el.className = "journal-entry";
        el.innerHTML = `<span class="journal-date">Day ${entry.day} · ${entry.date}</span><span class="journal-text">${esc(entry.text)}</span>`;
        dom.journalEntries.appendChild(el);
      }
    }
    dom.journalModal.classList.remove("hidden");
    focusFirstInModal(dom.journalModal);
  }

  // ── Export Card ────────────────────────────────────────────
  function exportRockCard() {
    const canvas = dom.exportCanvas;
    canvas.width = 400; canvas.height = 220;
    const ctx = canvas.getContext("2d");
    // Background
    const grad = ctx.createLinearGradient(0, 0, 400, 220);
    grad.addColorStop(0, "#1a1a2e"); grad.addColorStop(1, "#0f3460");
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 400, 220);
    // Border
    ctx.strokeStyle = "rgba(233,69,96,0.6)"; ctx.lineWidth = 2;
    ctx.roundRect(4, 4, 392, 212, 16); ctx.stroke();
    // Rock emoji (large)
    ctx.font = "80px serif"; ctx.textAlign = "center";
    ctx.fillText("🪨", 90, 135);
    // Evolution stage indicator
    const evo = EVOLUTION_STAGES[state.evolutionStage];
    ctx.font = "bold 22px sans-serif"; ctx.fillStyle = "#ffd93d";
    ctx.textAlign = "left"; ctx.fillText(state.name, 170, 55);
    ctx.font = "13px sans-serif"; ctx.fillStyle = "#a0a0b0";
    ctx.fillText(`${evo.name} · Lv. ${state.level}`, 170, 75);
    ctx.fillText(`Age: ${state.age} days`, 170, 95);
    ctx.fillText(`Bond: ${Math.round(state.stats.bond)}/100`, 170, 115);
    ctx.fillText(`Streak: 🔥 ${state.streak} days`, 170, 135);
    ctx.fillText(`Trophies: ${state.achievementsUnlocked.length}/${ACHIEVEMENTS.length}`, 170, 155);
    ctx.fillText(`Stickers: ${state.stickersCollected.length}/${STICKERS.length}`, 170, 175);
    // Footer
    ctx.font = "11px sans-serif"; ctx.fillStyle = "rgba(160,160,176,0.5)";
    ctx.textAlign = "center"; ctx.fillText("🪨 My Pebble Pal", 200, 205);
    // Download
    const link = document.createElement("a");
    link.download = `${state.name}_rock_card.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    grantSticker("s_card");
    log("📸 Rock card exported!", "system-msg");
  }

  // ── Settings ───────────────────────────────────────────────
  function openSettings() {
    dom.toggleSfx.textContent = state.sfxOn ? "ON" : "OFF";
    dom.toggleSfx.dataset.on = state.sfxOn ? "true" : "false";
    dom.toggleAmbient.textContent = state.ambientOn ? "ON" : "OFF";
    dom.toggleAmbient.dataset.on = state.ambientOn ? "true" : "false";
    dom.toggleParticles.textContent = state.particlesOn ? "ON" : "OFF";
    dom.toggleParticles.dataset.on = state.particlesOn ? "true" : "false";
    dom.settingsModal.classList.remove("hidden");
    focusFirstInModal(dom.settingsModal);
  }

  // ── Mini-game: Stone Skip ──────────────────────────────────
  let skipActive = false, skipCount = 0, skipCursorAnim = null, skipTapWindow = false, skipEndTimeout = null;
  function openStoneSkip() {
    skipActive = false; skipCount = 0;
    dom.stoneskipCount.textContent = "0";
    dom.stoneskipStatus.textContent = "Watch the cursor — tap when it's in the zone!";
    dom.stoneskipResult.classList.add("hidden");
    dom.stoneskipTap.classList.remove("hidden");
    dom.stoneskipTap.disabled = false;
    dom.stoneskipModal.classList.remove("hidden");
    focusFirstInModal(dom.stoneskipModal);
    startSkipCursor();
  }

  function startSkipCursor() {
    if (skipCursorAnim) clearInterval(skipCursorAnim);
    let pos = 0, dir = 1, speed = 3;
    const laneWidth = dom.stoneskipModal.querySelector("#stoneskip-lane").offsetWidth || 280;
    skipActive = true;
    skipCursorAnim = setInterval(() => {
      pos += dir * speed;
      if (pos >= laneWidth - 20) { pos = laneWidth - 20; dir = -1; }
      if (pos <= 0) { pos = 0; dir = 1; }
      dom.stoneskipCursor.style.left = pos + "px";
      // Target zone: middle 30%
      const zoneStart = laneWidth * 0.35, zoneEnd = laneWidth * 0.65;
      skipTapWindow = pos >= zoneStart && pos <= zoneEnd;
      dom.stoneskipTarget.style.opacity = skipTapWindow ? "1" : "0.4";
      dom.stoneskipTarget.classList.toggle("lit", skipTapWindow);
    }, 16);
    // Auto-end after 8 seconds (cancel any stale timer from Play Again)
    if (skipEndTimeout) clearTimeout(skipEndTimeout);
    skipEndTimeout = setTimeout(() => endSkipGame(), 8000);
  }

  function endSkipGame() {
    skipActive = false;
    if (skipEndTimeout) { clearTimeout(skipEndTimeout); skipEndTimeout = null; }
    if (skipCursorAnim) { clearInterval(skipCursorAnim); skipCursorAnim = null; }
    dom.stoneskipTap.disabled = true;
    dom.stoneskipTap.classList.add("hidden");
    dom.stoneskipResult.classList.remove("hidden");
    state.totalPlays++;
    const xpGain = skipCount * 4 + 5;
    addXP(xpGain);
    state.stats.happiness = clamp(state.stats.happiness + skipCount * 3);
    state.stats.bond = clamp(state.stats.bond + skipCount);
    const isNewSkipBest = skipCount > 0 && skipCount > (state.highestSkipCount || 0);
    if (isNewSkipBest) state.highestSkipCount = skipCount;
    const skipBestTag = state.highestSkipCount > 0
      ? (isNewSkipBest ? " 🏅 New best!" : ` (best: ${state.highestSkipCount})`)
      : "";
    dom.stoneskipOutcome.textContent = skipCount >= 10
      ? `Amazing! ${skipCount} skips! ${state.name} is thrilled!${skipBestTag}`
      : skipCount >= 5
        ? `Nice! ${skipCount} skips! Well done!${skipBestTag}`
        : `${skipCount} skips. Keep practicing!${skipBestTag}`;
    dom.stoneskipStatus.textContent = "Done!";
    if (skipCount >= 5) grantSticker("s_skip_5");
    if (skipCount >= 10) grantSticker("s_skip_10");
    log(`Stone Skip: ${skipCount} skips! +${xpGain} XP`, "action-msg");
    addJournalEntry(`Played Stone Skip — ${skipCount} skips!`);
    (skipCount >= 5 ? SFX.win : SFX.lose)();
    if (skipCount >= 5) { flashScreen("rgba(107,203,119,0.28)"); spawnBurst(["💧","✨","�"], 10); }
    updateStats(); updateFace(); checkAchievements(); checkDailyChallenges();
  }

  // ── Mini-game: Gem Match ───────────────────────────
  const GEM_ICONS = ["💎","🔮","💠","🔷","🟣","🟡","🟢","🔴"];
  let gemCards = [], gemFlipped = [], gemMatched = [], gemLocked = false, gemStartTime = 0;

  function openGemMatch() {
    gemCards = []; gemFlipped = []; gemMatched = []; gemLocked = false;
    dom.gemmatchStatus.textContent = "Tap cards to find pairs!";
    dom.gemmatchGrid.innerHTML = "";
    dom.gemmatchModal.classList.remove("hidden");
    // Pick 4 pairs (8 cards)
    const icons = GEM_ICONS.slice(0, 4);
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5);
    deck.forEach((icon, i) => {
      const card = document.createElement("button");
      card.className = "gem-card";
      card.dataset.icon = icon; card.dataset.index = i;
      card.textContent = "?";
      card.setAttribute("aria-label", "Gem card");
      card.addEventListener("click", () => onGemCardClick(card, i, icon));
      dom.gemmatchGrid.appendChild(card);
      gemCards.push(card);
    });
    gemStartTime = Date.now();
    focusFirstInModal(dom.gemmatchModal);
  }

  function onGemCardClick(card, idx, icon) {
    if (gemLocked || gemFlipped.includes(idx) || gemMatched.includes(idx)) return;
    card.textContent = icon; card.classList.add("flipped");
    gemFlipped.push(idx);
    SFX.tap();
    if (gemFlipped.length === 2) {
      gemLocked = true;
      const [a, b] = gemFlipped;
      if (gemCards[a].dataset.icon === gemCards[b].dataset.icon) {
        gemMatched.push(a, b);
        gemCards[a].classList.add("matched"); gemCards[b].classList.add("matched");
        gemFlipped = []; gemLocked = false;
        dom.gemmatchStatus.textContent = `${gemMatched.length / 2} / 4 pairs matched!`;
        if (gemMatched.length === 8) endGemMatch();
      } else {
        setTimeout(() => {
          gemCards[a].textContent = "?"; gemCards[a].classList.remove("flipped");
          gemCards[b].textContent = "?"; gemCards[b].classList.remove("flipped");
          gemFlipped = []; gemLocked = false;
        }, 800);
      }
    }
  }

  function endGemMatch() {
    const elapsed = (Date.now() - gemStartTime) / 1000;
    state.totalPlays++;
    addXP(25);
    state.stats.happiness = clamp(state.stats.happiness + 20);
    state.stats.bond = clamp(state.stats.bond + 8);
    dom.gemmatchStatus.textContent = `All matched in ${elapsed.toFixed(1)}s! +25 XP!`;
    grantSticker("s_gems");
    if (elapsed < 30) grantSticker("s_gems_fast");
    log(`Gem Match: all matched in ${elapsed.toFixed(1)}s! +25 XP`, "action-msg");
    addJournalEntry(`Won Gem Match in ${elapsed.toFixed(1)} seconds!`);
    SFX.win();
    flashScreen("rgba(100,150,255,0.28)");
    spawnBurst(["💎","✨","🔮"], 10);
    updateStats(); updateFace(); checkAchievements(); checkDailyChallenges();
  }

  // ── Mini-game: Earthquake Survival ────────────────────────
  let quakeTimer = null, quakeStarted = false, quakeFailed = false, quakeProgress = 0;
  let quakeMouseHandler = null, quakeTouchHandler = null;

  function openQuake() {
    quakeStarted = false; quakeFailed = false; quakeProgress = 0;
    dom.quakeBar.style.width = "0%";
    dom.quakeStatus.textContent = "Press Start then HOLD STILL!";
    dom.quakeResult.classList.add("hidden");
    dom.quakeStart.classList.remove("hidden");
    dom.quakeRockIcon.style.animation = "";
    dom.quakeModal.classList.remove("hidden");
    focusFirstInModal(dom.quakeModal);
  }

  function startQuake() {
    quakeStarted = true; quakeFailed = false; quakeProgress = 0;
    dom.quakeStart.classList.add("hidden");
    dom.quakeStatus.textContent = "Hold still... 🫨";
    dom.quakeRockIcon.style.animation = "quake-shake 0.1s infinite";
    quakeProgress = 0;
    quakeTimer = setInterval(() => {
      quakeProgress += 2;
      dom.quakeBar.style.width = quakeProgress + "%";
      if (quakeProgress >= 100) endQuake(true);
    }, 100);
    // Fail if user moves mouse/touches inside the modal
    quakeMouseHandler = () => { if (quakeStarted && !quakeFailed) endQuake(false); };
    quakeTouchHandler = () => { if (quakeStarted && !quakeFailed) endQuake(false); };
    dom.quakeModal.addEventListener("mousemove", quakeMouseHandler);
    dom.quakeModal.addEventListener("touchmove", quakeTouchHandler);
  }

  function endQuake(survived) {
    quakeStarted = false;
    clearInterval(quakeTimer);
    dom.quakeModal.removeEventListener("mousemove", quakeMouseHandler);
    dom.quakeModal.removeEventListener("touchmove", quakeTouchHandler);
    dom.quakeRockIcon.style.animation = "";
    dom.quakeResult.classList.remove("hidden");
    dom.quakeStart.classList.add("hidden");
    state.totalPlays++;
    if (survived) {
      dom.quakeOutcome.textContent = `${state.name} survived! Amazing stillness! +20 XP`;
      dom.quakeStatus.textContent = "You did it!";
      addXP(20);
      state.stats.happiness = clamp(state.stats.happiness + 15);
      state.stats.bond = clamp(state.stats.bond + 6);
      grantSticker("s_quake");
      log("Earthquake Survival: SURVIVED! +20 XP", "action-msg");
      addJournalEntry("Survived the earthquake!");
      SFX.win();
    } else {
      dom.quakeOutcome.textContent = `Oh no! ${state.name} got shaken up! +5 XP for trying`;
      dom.quakeStatus.textContent = "You moved!";
      dom.quakeBar.style.width = quakeProgress + "%";
      addXP(5);
      state.stats.happiness = clamp(state.stats.happiness - 5);
      log("Earthquake Survival: Failed! Try again!", "warning-msg");
      SFX.lose();
    }
    updateStats(); updateFace(); checkAchievements(); checkDailyChallenges();
  }

  // ── Eye Tracking ───────────────────────────────────────────
  function initEyeTracking() {
    function trackEyes(clientX, clientY) {
      if (state.isSleeping) return;
      const r = dom.rockBody.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = clientX - cx, dy = clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist === 0) return;
      const max = 4;
      const mx = (dx / dist) * Math.min(max, dist / 20);
      const my = (dy / dist) * Math.min(max, dist / 20);
      dom.leftPupil.style.transform = `translate(${mx}px, ${my}px)`;
      dom.rightPupil.style.transform = `translate(${mx}px, ${my}px)`;
    }
    document.addEventListener("mousemove", (e) => trackEyes(e.clientX, e.clientY));
    document.addEventListener("touchmove", (e) => {
      if (e.touches.length) trackEyes(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
  }

  // ── Cooldown ───────────────────────────────────────────────
  function startCooldown(ms = 1500) {
    state.actionCooldown = true;
    $$(".action-btn").forEach(b => b.disabled = true);
    setTimeout(() => { state.actionCooldown = false; $$(".action-btn").forEach(b => b.disabled = false); }, ms);
  }

  // ── Modal Helpers ──────────────────────────────────────────
  function trapFocus(e, container) {
    const focusable = [...container.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter(el => !el.closest('.hidden') && el.offsetParent !== null);
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function focusFirstInModal(modal) {
    requestAnimationFrame(() => {
      const el = modal.querySelector('button:not([disabled]):not(.hidden), input:not([disabled])');
      if (el) el.focus();
    });
  }

  function closeRPSModal() {
    dom.minigameModal.classList.add("hidden");
    dom.gamePicker.classList.remove("hidden");
    dom.rpsGame.classList.add("hidden");
    dom.minigameBack.classList.add("hidden");
    const msg = pick(dialogue.play); showThought(msg); log(`${state.name}: "${msg}"`, "rock-msg");
    const playBtn = $('[data-action="play"]');
    if (playBtn) playBtn.focus();
  }

  function showGamePicker() {
    dom.gamePicker.classList.remove("hidden");
    dom.rpsGame.classList.add("hidden");
    dom.minigameBack.classList.add("hidden");
    dom.minigameTitle.textContent = `Play with ${state.name}!`;
    dom.minigameDesc.textContent = "Choose a game:";
  }

  // ── Actions ────────────────────────────────────────────────
  function feedRock(foodId) {
    const food = FOODS[foodId];
    if (!food) return;
    if (state.isSleeping) { showThought("Zzz... sleeping..."); return; }
    state.stats.fullness = clamp(state.stats.fullness + food.fullness);
    state.stats.happiness = clamp(state.stats.happiness + food.happiness);
    state.stats.energy = clamp(state.stats.energy + food.energy);
    state.stats.cleanliness = clamp(state.stats.cleanliness - 3);
    state.stats.bond = clamp(state.stats.bond + 2);
    state.totalFeeds++; state.totalInteractions++;
    animateRock("anim-jelly");
    spawnMulti("🪨", 3);
    showThought(food.msg);
    log(`You fed ${state.name} ${food.label.replace(/^.+\s/, "")}`, "action-msg");
    dom.foodPicker.classList.add("hidden");
    showStatFloater(`+${food.fullness} 🍔`, "#6bcb77");
    if (food.happiness > 5) showStatFloater(`+${food.happiness} 😊`, "#ffd93d");
    SFX.feed();
    addXP(5 + Math.floor(food.happiness / 5));
    startCooldown();
    updateStats(); updateFace(); checkAchievements();
    checkDailyChallenges();
    // Track fancy-feast special challenge
    if (food.unlock && food.unlock.level >= 25) {
      for (const dc of state.dailyChallenges) {
        if (dc.id === "feed_stardust" && !dc.completed) { dc.specialProgress = (dc.specialProgress || 0) + 1; }
      }
    }
    checkDailyChallenges();
  }

  const actions = {
    feed() {
      if (state.isSleeping) { showThought("Zzz..."); return; }
      dom.foodPicker.classList.toggle("hidden");
    },
    play() {
      if (state.isSleeping) { showThought("Zzz... too sleepy..."); return; }
      if (state.stats.energy < 10) { showThought("Too tired to play..."); log(`${state.name} is too tired!`, "warning-msg"); return; }
      // Show game picker
      dom.minigameRockName.textContent = state.name;
      dom.gamePicker.classList.remove("hidden");
      dom.rpsGame.classList.add("hidden");
      dom.minigameBack.classList.add("hidden");
      dom.minigameTitle.textContent = `Play with ${state.name}!`;
      dom.minigameDesc.textContent = "Choose a game:";
      dom.minigameModal.classList.remove("hidden");
      focusFirstInModal(dom.minigameModal);
    },
    clean() {
      if (state.isSleeping) { showThought("Zzz... polish me later..."); return; }
      state.stats.cleanliness = clamp(state.stats.cleanliness + 25);
      state.stats.happiness = clamp(state.stats.happiness + 8);
      state.stats.bond = clamp(state.stats.bond + 3);
      state.totalCleans++;
      animateRock("anim-spin", 800); spawnSparkles();
      showStatFloater("+25 ✨", "#c4b5fd");
      const msg = pick(dialogue.clean); showThought(msg);
      log(`You polished ${state.name}!`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
      SFX.clean();
      addXP(4); startCooldown(2000); checkAchievements(); checkDailyChallenges();
    },
    sleep() {
      if (state.actionCooldown) return;
      if (state.isSleeping) {
        state.isSleeping = false; stopSleepZzz();
        dom.rock.classList.remove("anim-sleep"); dom.gameContainer.classList.remove("night-mode");
        showThought("*yawwn* Good morning!"); log(`${state.name} woke up!`, "system-msg");
      } else {
        state.isSleeping = true;
        dom.rock.classList.add("anim-sleep"); dom.gameContainer.classList.add("night-mode");
        startSleepZzz();
        const msg = pick(dialogue.sleep); showThought(msg, 4000);
        log(`${state.name} is napping.`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
        addXP(3);
      }
      startCooldown(1000);
      updateFace();
    },
    talk() {
      if (state.isSleeping) { showThought("Zzz..."); return; }
      state.stats.happiness = clamp(state.stats.happiness + 5);
      state.stats.bond = clamp(state.stats.bond + 4);
      state.totalTalks++;
      animateRock("anim-wiggle");
      let pool = [...dialogue.talk];
      if (state.stats.bond > 60) pool.push(...dialogue.highBond);
      if (state.stats.fullness < 30) pool.push(...dialogue.hungry);
      if (state.stats.energy < 30) pool.push(...dialogue.tired);
      if (state.stats.happiness < 30) pool.push(...dialogue.sad);
      const msg = pick(pool); showThought(msg, 4000);
      log(`You chatted with ${state.name}.`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
      addXP(3); startCooldown(); checkAchievements(); checkDailyChallenges();
    },
    pet() {
      if (state.isSleeping) { showThought("*happy sleeping sounds*"); state.stats.bond = clamp(state.stats.bond + 1); return; }
      state.stats.happiness = clamp(state.stats.happiness + 10);
      state.stats.bond = clamp(state.stats.bond + 5);
      state.totalPets++;
      animateRock("anim-jelly"); spawnMulti("💕", 4);
      showStatFloater("+10 😊", "#ffd93d");
      const msg = pick(dialogue.pet); showThought(msg);
      log(`You petted ${state.name}!`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
      SFX.pet();
      addXP(4); startCooldown(800); checkAchievements(); checkDailyChallenges();
    },
    exercise() {
      if (state.isSleeping) { showThought("Zzz... carry me later..."); return; }
      if (state.stats.energy < 15) { showThought("Too tired for a walk..."); return; }
      state.stats.energy = clamp(state.stats.energy - 12);
      state.stats.happiness = clamp(state.stats.happiness + 10);
      state.stats.bond = clamp(state.stats.bond + 4);
      state.stats.fullness = clamp(state.stats.fullness - 5);
      state.totalWalks++;
      dom.rock.classList.add("anim-walk");
      setTimeout(() => dom.rock.classList.remove("anim-walk"), 2000);
      spawnMulti("🌿", 3);
      showStatFloater("+10 😊", "#ffd93d"); showStatFloater("-12 ⚡", "#4d96ff");
      const msg = pick(dialogue.exercise); showThought(msg);
      log(`You took ${state.name} for a walk!`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
      addXP(6); startCooldown(2200); checkAchievements(); checkDailyChallenges();
    },
    music() {
      if (state.isSleeping) { showThought("*sleepy vibing*"); return; }
      state.stats.happiness = clamp(state.stats.happiness + 12);
      state.stats.energy = clamp(state.stats.energy - 5);
      state.stats.bond = clamp(state.stats.bond + 3);
      state.totalMusics++;
      dom.rock.classList.add("anim-dance");
      setTimeout(() => dom.rock.classList.remove("anim-dance"), 2400);
      spawnMusicNotes();
      showStatFloater("+12 😊", "#ffd93d");
      showStatFloater("-5 ⚡", "#4d96ff");
      const msg = pick(dialogue.music); showThought(msg);
      log(`You played tunes for ${state.name}!`, "action-msg"); log(`${state.name}: "${msg}"`, "rock-msg");
      addXP(4); startCooldown(2500); checkAchievements(); checkDailyChallenges();
    },
  };

  // ── RPS ────────────────────────────────────────────────────
  function playRPS(playerChoice) {
    const choices = ["rock", "paper", "scissors"];
    const rockChoice = choices[Math.floor(Math.random() * 3)];
    const emojis = { rock: "🪨", paper: "📄", scissors: "✂️" };
    dom.rpsChoices.classList.add("hidden"); dom.rpsResult.classList.remove("hidden");
    dom.rpsYou.textContent = `You chose: ${emojis[playerChoice]} ${playerChoice}`;
    dom.rpsRock.textContent = `${state.name} chose: ${emojis[rockChoice]} ${rockChoice}`;
    let outcome;
    state.totalPlays++;
    state.rpsPlayed++;
    if (playerChoice === rockChoice) {
      outcome = "It's a tie! 🤝"; state.stats.happiness = clamp(state.stats.happiness + 5);
    } else if (
      (playerChoice === "rock" && rockChoice === "scissors") ||
      (playerChoice === "paper" && rockChoice === "rock") ||
      (playerChoice === "scissors" && rockChoice === "paper")
    ) {
      outcome = "You win! 🎉"; state.stats.happiness = clamp(state.stats.happiness + 10); state.rpsWins++; grantSticker("s_rps_win");
    } else {
      outcome = `${state.name} wins! 🪨💪`; state.stats.happiness = clamp(state.stats.happiness + 3);
    }
    state.stats.energy = clamp(state.stats.energy - 8);
    state.stats.bond = clamp(state.stats.bond + 5);
    dom.rpsOutcome.textContent = outcome;
    log(`RPS: ${outcome}`, "action-msg");
    if (rockChoice === "rock") log(`${state.name}: "I always pick rock. Obviously."`, "rock-msg");
    addXP(6); updateStats(); updateFace(); startCooldown(); checkAchievements(); checkDailyChallenges();
  }

  // ── Decay ──────────────────────────────────────────────────
  function statDecay() {
    if (state.isSleeping) {
      state.stats.energy = clamp(state.stats.energy + 2);
      state.stats.fullness = clamp(state.stats.fullness - 0.3);
    } else {
      state.stats.happiness = clamp(state.stats.happiness - 0.8);
      state.stats.fullness = clamp(state.stats.fullness - 0.5);
      state.stats.energy = clamp(state.stats.energy - 0.4);
      state.stats.cleanliness = clamp(state.stats.cleanliness - 0.3);
      state.stats.bond = clamp(state.stats.bond - 0.1);
    }
    updateStats(); updateFace();
  }

  // ── Idle Thoughts ──────────────────────────────────────────
  function idleThoughts() {
    if (state.isSleeping || state.actionCooldown) return;
    if (Math.random() > 0.3) return;
    const { happiness: h, fullness: f, energy: e, cleanliness: c, bond: b } = state.stats;
    let pool = [];
    if (h < 30) pool.push(...dialogue.sad);
    else if (h < 50) pool.push(...dialogue.gettingBored);
    if (f < 25) pool.push(...dialogue.hungry);
    else if (f < 45) pool.push(...dialogue.gettingHungry);
    if (e < 25) pool.push(...dialogue.tired);
    else if (e < 45) pool.push(...dialogue.gettingTired);
    if (c < 25) pool.push(...dialogue.dirty);
    else if (c < 45) pool.push(...dialogue.gettingDirty);
    if (h < 40 && f > 30 && e > 30) pool.push(...dialogue.bored);
    if (b > 70 && Math.random() > 0.5) pool.push(...dialogue.highBond);
    if (pool.length > 0) showThought(pick(pool), 4000);
  }

  // ── Age ────────────────────────────────────────────────────
  let _lastAgeXP = 0;
  function ageUp() {
    if (state.createdAt) {
      state.age = Math.floor((Date.now() - state.createdAt) / 86400000);
    }
    dom.ageDisplay.textContent = state.age;
    const now = Date.now();
    if (now - _lastAgeXP >= 60000) { _lastAgeXP = now; addXP(2); }
    checkAchievements();
  }

  function checkCriticalStats() {
    const s = state.stats;
    if (s.fullness < 15 && Math.random() > .7) log(`⚠️ ${state.name} is really hungry!`, "warning-msg");
    if (s.energy < 15 && !state.isSleeping && Math.random() > .7) log(`⚠️ ${state.name} is exhausted!`, "warning-msg");
    if (s.happiness < 15 && Math.random() > .7) log(`⚠️ ${state.name} is very unhappy!`, "warning-msg");
    if (s.cleanliness < 15 && Math.random() > .7) log(`⚠️ ${state.name} is really dirty!`, "warning-msg");
  }

  // ── Rock Click ─────────────────────────────────────────────
  let _lastRockClick = 0;
  function onRockClick() {
    const now = Date.now();
    if (now - _lastRockClick < 500) return;
    _lastRockClick = now;
    if (state.isSleeping) { showThought("*snore* ...don't wake me..."); return; }
    state.totalInteractions++;
    spawnRipple();
    const reactions = [
      () => { animateRock("anim-bounce"); showThought("Hey! That tickles!"); },
      () => { animateRock("anim-wiggle"); showThought("Whoa!"); },
      () => { animateRock("anim-jelly"); showThought("Boing!"); },
      () => { animateRock("anim-bounce"); showThought(pick(["Hi!", "Hello!", "Yo!", "Sup!"])); },
    ];
    pick(reactions)();
    state.stats.happiness = clamp(state.stats.happiness + 1);
    state.stats.bond = clamp(state.stats.bond + 1);
    addXP(1); updateStats(); updateFace(); checkAchievements();
  }

  // ── Events ─────────────────────────────────────────────────
  function initEvents() {
    $$(".action-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const a = btn.dataset.action;
        if (actions[a]) {
          actions[a]();
          // feed opens food picker; play opens game picker — interactions counted on actual completion
          if (a !== "feed" && a !== "play") state.totalInteractions++;
          updateStats(); updateFace();
        }
      });
    });
    dom.rock.addEventListener("click", onRockClick);
    dom.rock.addEventListener("touchstart", (e) => { e.preventDefault(); onRockClick(); }, { passive: false });
    dom.rock.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRockClick(); } });

    dom.renameBtn.addEventListener("click", showRenameDialog);
    dom.settingsBtn.addEventListener("click", openSettings);

    // Tabs — ARIA & keyboard navigation
    const tabBtns = [...$$(".tab-btn")];
    tabBtns.forEach((btn, i) => {
      btn.id = btn.id || btn.dataset.tab + "-tab";
      btn.setAttribute("role", "tab");
      btn.setAttribute("aria-selected", btn.classList.contains("active") ? "true" : "false");
      btn.setAttribute("aria-controls", btn.dataset.tab);
      btn.setAttribute("tabindex", btn.classList.contains("active") ? "0" : "-1");
      const panel = $(`#${btn.dataset.tab}`);
      if (panel) { panel.setAttribute("role", "tabpanel"); panel.setAttribute("aria-labelledby", btn.id); }
      btn.addEventListener("click", () => {
        tabBtns.forEach(b => { b.classList.remove("active"); b.setAttribute("aria-selected", "false"); b.setAttribute("tabindex", "-1"); });
        $$(".tab-content").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        btn.setAttribute("tabindex", "0");
        $(`#${btn.dataset.tab}`).classList.add("active");
      });
      btn.addEventListener("keydown", (e) => {
        let next = -1;
        if (e.key === "ArrowRight") next = (i + 1) % tabBtns.length;
        else if (e.key === "ArrowLeft") next = (i - 1 + tabBtns.length) % tabBtns.length;
        if (next >= 0) { e.preventDefault(); tabBtns[next].click(); tabBtns[next].focus(); }
      });
    });

    // Game picker
    $$(".game-pick-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const game = btn.dataset.game;
        dom.minigameModal.classList.add("hidden");
        if (game === "rps") {
          dom.gamePicker.classList.add("hidden");
          dom.rpsGame.classList.remove("hidden");
          dom.minigameBack.classList.remove("hidden");
          dom.rpsChoices.classList.remove("hidden");
          dom.rpsResult.classList.add("hidden");
          dom.minigameTitle.textContent = `Rock Paper Scissors with ${state.name}!`;
          dom.minigameDesc.textContent = "Choose your weapon:";
          dom.minigameModal.classList.remove("hidden");
          focusFirstInModal(dom.minigameModal);
        } else if (game === "stoneskip") {
          openStoneSkip();
        } else if (game === "gemmatch") {
          openGemMatch();
        } else if (game === "quake") {
          openQuake();
        } else if (game === "rockstack") {
          openRockStack();
        }
      });
    });

    dom.minigameBack.addEventListener("click", () => {
      showGamePicker();
    });

    // RPS — with focus trap & Escape
    $$(".rps-btn").forEach(btn => btn.addEventListener("click", () => playRPS(btn.dataset.choice)));
    dom.rpsAgain.addEventListener("click", () => { dom.rpsChoices.classList.remove("hidden"); dom.rpsResult.classList.add("hidden"); focusFirstInModal(dom.minigameModal); });
    dom.rpsClose.addEventListener("click", closeRPSModal);
    $("#minigame-exit-btn").addEventListener("click", closeRPSModal);
    dom.minigameModal.addEventListener("click", (e) => { if (e.target === dom.minigameModal) closeRPSModal(); });
    dom.minigameModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeRPSModal(); return; }
      if (e.key === "Tab") trapFocus(e, dom.minigameModal);
    });

    // Food picker cancel
    $("#food-cancel-btn").addEventListener("click", () => dom.foodPicker.classList.add("hidden"));

    // Stone Skip
    dom.stoneskipTap.addEventListener("click", () => {
      if (!skipActive) return;
      if (skipTapWindow) {
        SFX.tapHit();
        skipCount++; dom.stoneskipCount.textContent = skipCount;
        dom.stoneskipStatus.textContent = `Skip! (${skipCount})`;
        dom.stoneskipCursor.style.background = "#6bcb77";
        setTimeout(() => dom.stoneskipCursor.style.background = "", 200);
      } else {
        SFX.tapMiss();
        dom.stoneskipStatus.textContent = "Missed! Wait for the zone.";
        dom.stoneskipCursor.style.background = "#e94560";
        setTimeout(() => dom.stoneskipCursor.style.background = "", 200);
        animateRock("anim-hit", 450);
      }
    });
    dom.stoneskipAgain.addEventListener("click", () => { dom.stoneskipResult.classList.add("hidden"); startSkipCursor(); dom.stoneskipTap.classList.remove("hidden"); dom.stoneskipTap.disabled = false; skipCount = 0; dom.stoneskipCount.textContent = "0"; });
    const closeStoneSkip = () => {
      skipActive = false;
      if (skipEndTimeout) { clearTimeout(skipEndTimeout); skipEndTimeout = null; }
      if (skipCursorAnim) { clearInterval(skipCursorAnim); skipCursorAnim = null; }
      dom.stoneskipModal.classList.add("hidden");
    };
    dom.stoneskipClose.addEventListener("click", closeStoneSkip);
    $("#stoneskip-exit-btn").addEventListener("click", closeStoneSkip);
    dom.stoneskipModal.addEventListener("click", e => { if (e.target === dom.stoneskipModal) closeStoneSkip(); });
    dom.stoneskipModal.addEventListener("keydown", e => { if (e.key === "Escape") closeStoneSkip(); });

    // Rock Stack
    if (dom.stackTap) {
      dom.stackTap.addEventListener("click", () => {
        if (!stackActive) return;
        if (stackTapWindow) {
          SFX.tapHit();
          stackCount++;
          dom.stackCount.textContent = stackCount;
          dom.stackStatus.textContent = `Stacked! (${stackCount})`;
          dom.stackCursor.style.background = "#6bcb77";
          setTimeout(() => dom.stackCursor.style.background = "", 200);
          // Increase difficulty: narrow zone and speed
          stackSpeed = Math.min(10, 3 + stackCount * 0.6);
          stackZoneWidth = Math.max(0.12, 0.45 - stackCount * 0.03);
        } else {
          SFX.tapMiss();
          stackLives--;
          dom.stackLives.innerHTML = ["❤️","❤️","❤️"].slice(0, stackLives).join("") || "💔";
          dom.stackStatus.textContent = `Missed! ${stackLives} life${stackLives!==1?"s":""} left`;
          dom.stackCursor.style.background = "#e94560";
          setTimeout(() => dom.stackCursor.style.background = "", 200);
          animateRock("anim-hit", 450);
          SFX.lose();
          if (stackLives <= 0) endRockStack();
        }
      });
      dom.stackAgain.addEventListener("click", () => {
        dom.stackResult.classList.add("hidden");
        stackCount = 0; stackLives = 3; stackSpeed = 3; stackZoneWidth = 0.45;
        dom.stackCount.textContent = "0"; dom.stackLives.innerHTML = "❤️❤️❤️";
        dom.stackTap.classList.remove("hidden"); dom.stackTap.disabled = false;
        dom.stackStatus.textContent = "Tap when the arrow is in the zone!";
        startStackCursor();
      });
      const closeStackModal = () => {
        stackActive = false;
        if (stackCursorAnim) { clearInterval(stackCursorAnim); stackCursorAnim = null; }
        dom.stackModal.classList.add("hidden");
      };
      dom.stackClose.addEventListener("click", closeStackModal);
      $("#rockstack-exit-btn").addEventListener("click", closeStackModal);
      dom.stackModal.addEventListener("click", e => { if (e.target === dom.stackModal) closeStackModal(); });
      dom.stackModal.addEventListener("keydown", e => { if (e.key === "Escape") closeStackModal(); });
    }

    // Gem Match
    dom.gemmatchClose.addEventListener("click", () => dom.gemmatchModal.classList.add("hidden"));
    $("#gemmatch-exit-btn").addEventListener("click", () => dom.gemmatchModal.classList.add("hidden"));
    dom.gemmatchModal.addEventListener("keydown", e => { if (e.key === "Escape") dom.gemmatchModal.classList.add("hidden"); });
    dom.gemmatchModal.addEventListener("click", e => { if (e.target === dom.gemmatchModal) dom.gemmatchModal.classList.add("hidden"); });

    // Quake
    dom.quakeStart.addEventListener("click", startQuake);
    dom.quakeAgain.addEventListener("click", () => { dom.quakeResult.classList.add("hidden"); dom.quakeStart.classList.remove("hidden"); dom.quakeBar.style.width = "0%"; dom.quakeStatus.textContent = "Press Start then HOLD STILL!"; });
    const closeQuakeModal = () => { clearInterval(quakeTimer); dom.quakeModal.classList.add("hidden"); };
    dom.quakeClose.addEventListener("click", closeQuakeModal);
    $("#quake-exit-btn").addEventListener("click", closeQuakeModal);
    dom.quakeModal.addEventListener("click", e => { if (e.target === dom.quakeModal) closeQuakeModal(); });
    dom.quakeModal.addEventListener("keydown", e => { if (e.key === "Escape") closeQuakeModal(); });

    // Journal
    dom.journalClose.addEventListener("click", () => dom.journalModal.classList.add("hidden"));
    $("#journal-exit-btn").addEventListener("click", () => dom.journalModal.classList.add("hidden"));
    dom.journalModal.addEventListener("click", e => { if (e.target === dom.journalModal) dom.journalModal.classList.add("hidden"); });
    dom.journalModal.addEventListener("keydown", e => { if (e.key === "Escape") dom.journalModal.classList.add("hidden"); });

    // Settings
    dom.settingsClose.addEventListener("click", () => dom.settingsModal.classList.add("hidden"));
    $("#settings-exit-btn").addEventListener("click", () => dom.settingsModal.classList.add("hidden"));
    dom.settingsModal.addEventListener("click", e => { if (e.target === dom.settingsModal) dom.settingsModal.classList.add("hidden"); });
    dom.settingsModal.addEventListener("keydown", e => { if (e.key === "Escape") dom.settingsModal.classList.add("hidden"); });

    dom.toggleSfx.addEventListener("click", () => {
      state.sfxOn = !state.sfxOn;
      dom.toggleSfx.textContent = state.sfxOn ? "ON" : "OFF";
      dom.toggleSfx.dataset.on = state.sfxOn ? "true" : "false";
      if (state.sfxOn) {
        if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
        SFX.click();
      } else if (audioCtx && !state.ambientOn) {
        audioCtx.suspend().catch(() => {});
      }
    });
    dom.toggleAmbient.addEventListener("click", () => {
      state.ambientOn = !state.ambientOn;
      dom.toggleAmbient.textContent = state.ambientOn ? "ON" : "OFF";
      dom.toggleAmbient.dataset.on = state.ambientOn ? "true" : "false";
      if (state.ambientOn) {
        if (audioCtx && audioCtx.state === "suspended") audioCtx.resume().catch(() => {});
        startAmbient();
      } else {
        stopAmbient();
        if (audioCtx && !state.sfxOn) audioCtx.suspend().catch(() => {});
      }
    });
    dom.toggleParticles.addEventListener("click", () => {
      state.particlesOn = !state.particlesOn;
      dom.toggleParticles.textContent = state.particlesOn ? "ON" : "OFF";
      dom.toggleParticles.dataset.on = state.particlesOn ? "true" : "false";
    });
    dom.exportCardBtn.addEventListener("click", () => { exportRockCard(); });
    dom.openJournalBtn.addEventListener("click", () => { dom.settingsModal.classList.add("hidden"); openJournal(); });
    dom.resetSaveBtn.addEventListener("click", () => {
      showConfirmDialog(
        "Reset Save Data",
        "Really reset all save data?",
        "This cannot be undone — all progress will be lost.",
        () => { localStorage.removeItem("pebblePalState2"); location.reload(); }
      );
    });
  }

  // ── Save / Load ────────────────────────────────────────────
  function save() { try { state.lastSaved = Date.now(); localStorage.setItem("pebblePalState2", JSON.stringify(state)); } catch(e){} }

  function load() {
    try {
      const d = localStorage.getItem("pebblePalState2");
      if (d) {
        const saved = JSON.parse(d);
        // Merge with defaults for new fields
        for (const k of Object.keys(state)) {
          if (saved[k] !== undefined) state[k] = saved[k];
        }
        // Reset runtime-only flags
        state.actionCooldown = false;
        // Compute real age from creation date
        if (state.createdAt) {
          state.age = Math.floor((Date.now() - state.createdAt) / 86400000);
        }
        // Time-away stat decay
        if (state.lastSaved) {
          const elapsed = (Date.now() - state.lastSaved) / 1000;
          const hours = elapsed / 3600;
          if (hours > 0.1) {
            const decay = Math.min(hours * 3, 40);
            state.stats.happiness = clamp(state.stats.happiness - decay);
            state.stats.fullness = clamp(state.stats.fullness - decay * 1.2);
            state.stats.energy = clamp(state.stats.energy - decay * 0.5);
            state.stats.cleanliness = clamp(state.stats.cleanliness - decay * 0.8);
            if (hours > 1) log(`${state.name} was alone for ${Math.floor(hours)}h... stats decayed.`, "warning-msg");
          }
        }
        dom.nameLabel.textContent = state.name;
        dom.ageDisplay.textContent = state.age;
        dom.levelDisplay.textContent = state.level;
        log("Welcome back! Your rock missed you.", "system-msg");
        showThought("You came back!", 4000);
      } else {
        log(`Welcome! Meet ${state.name}! 🪨`, "system-msg");
        log("Feed, play, customize, and level up your rock!", "system-msg");
        showThought("Hi! I'm your new pet rock! 👋", 5000);
      }
    } catch(e) {
      log(`Welcome! Meet ${state.name}! 🪨`, "system-msg");
    }
  }

  // ── Custom Confirm Dialog ──────────────────────────────────
  function showConfirmDialog(title, message, detail, onConfirm) {
    const overlay = document.createElement("div");
    overlay.className = "modal";
    const content = document.createElement("div");
    content.className = "modal-content rename-modal";
    const heading = document.createElement("h2"); heading.textContent = title;
    content.appendChild(heading);
    const msg = document.createElement("p");
    msg.style.cssText = "color:var(--text-muted);margin-bottom:8px;font-size:.9rem";
    msg.textContent = message; content.appendChild(msg);
    if (detail) {
      const det = document.createElement("p");
      det.style.cssText = "font-size:.78rem;color:var(--text-muted);opacity:.7;margin-bottom:16px";
      det.textContent = detail; content.appendChild(det);
    }
    const btnRow = document.createElement("div"); btnRow.className = "rename-btn-row";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel"; cancelBtn.className = "rename-cancel-btn";
    const okBtn = document.createElement("button");
    okBtn.textContent = "Confirm"; okBtn.className = "minigame-btn danger"; okBtn.style.margin = "0";
    btnRow.appendChild(cancelBtn); btnRow.appendChild(okBtn);
    content.appendChild(btnRow); overlay.appendChild(content);
    document.body.appendChild(overlay);
    const close = () => overlay.remove();
    okBtn.addEventListener("click", () => { close(); onConfirm(); });
    cancelBtn.addEventListener("click", close);
    overlay.addEventListener("click", e => { if (e.target === overlay) close(); });
    overlay.addEventListener("keydown", e => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") trapFocus(e, overlay);
    });
    requestAnimationFrame(() => cancelBtn.focus());
  }

  // ── Custom Rename Dialog (works on iOS/Capacitor) ──────────
  function showRenameDialog() {
    const overlay = document.createElement("div");
    overlay.className = "modal";
    const content = document.createElement("div");
    content.className = "modal-content rename-modal";
    const heading = document.createElement("h2");
    heading.textContent = "Rename Your Rock";
    content.appendChild(heading);
    const input = document.createElement("input");
    input.type = "text"; input.value = state.name; input.maxLength = 20;
    input.className = "rename-input";
    content.appendChild(input);
    const btnRow = document.createElement("div");
    btnRow.className = "rename-btn-row";
    const okBtn = document.createElement("button");
    okBtn.textContent = "Rename"; okBtn.className = "rename-ok-btn";
    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "Cancel"; cancelBtn.className = "rename-cancel-btn";
    btnRow.appendChild(okBtn); btnRow.appendChild(cancelBtn);
    content.appendChild(btnRow);
    overlay.appendChild(content);
    document.body.appendChild(overlay);
    input.focus(); input.select();
    const close = () => { overlay.remove(); dom.renameBtn.focus(); };
    const doRename = () => {
      const n = input.value.trim();
      if (n && n !== state.name) {
        const old = state.name; state.name = n;
        dom.nameLabel.textContent = state.name;
        log(`Renamed from ${old} to ${state.name}!`, "system-msg");
        showThought(`I'm ${state.name} now! Love it!`);
        state.stats.happiness = clamp(state.stats.happiness + 5);
        state.stats.bond = clamp(state.stats.bond + 2);
        addXP(3); updateStats(); updateFace();
      }
      close();
    };
    okBtn.addEventListener("click", doRename);
    cancelBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab") trapFocus(e, overlay);
    });
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") doRename(); });
  }

  // ── Capacitor Lifecycle ────────────────────────────────────
  function initCapacitorLifecycle() {
    // Listen for Electron reset command via IPC
    if (window.pebblePal && window.pebblePal.onReset) {
      window.pebblePal.onReset(() => { localStorage.removeItem("pebblePalState2"); location.reload(); });
    }
    // Save on app backgrounding (iOS)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") save();
    });
    // Also listen for Capacitor-specific events if available
    document.addEventListener("pause", save);
    document.addEventListener("resume", () => {
      showThought("You're back!", 3000);
    });
  }

  // ── Daily Challenges ──────────────────────────────────────
  const CHALLENGE_POOL = [
    { id: "feed_3",    icon: "🍪", name: "Feeding Time",   desc: "Feed your rock 3 times",           type: "counter", statKey: "totalFeeds",        target: 3,  xpReward: 20 },
    { id: "pet_5",     icon: "🤚", name: "Show Some Love", desc: "Pet your rock 5 times",            type: "counter", statKey: "totalPets",         target: 5,  xpReward: 20 },
    { id: "play_2",    icon: "🎮", name: "Game On",        desc: "Play 2 mini-games",                type: "counter", statKey: "totalPlays",        target: 2,  xpReward: 25 },
    { id: "talk_5",    icon: "💬", name: "Chatterbox",     desc: "Chat with your rock 5 times",      type: "counter", statKey: "totalTalks",        target: 5,  xpReward: 15 },
    { id: "walk_2",    icon: "🏃", name: "Daily Walk",     desc: "Walk your rock twice",             type: "counter", statKey: "totalWalks",        target: 2,  xpReward: 20 },
    { id: "clean_3",   icon: "✨", name: "Squeaky Clean",  desc: "Polish your rock 3 times",         type: "counter", statKey: "totalCleans",       target: 3,  xpReward: 20 },
    { id: "music_3",   icon: "🎵", name: "Rock Concert",   desc: "Play music 3 times",               type: "counter", statKey: "totalMusics",       target: 3,  xpReward: 20 },
    { id: "rps_1",     icon: "✌️", name: "RPS Victory",    desc: "Win a round of Rock Paper Scissors",type:"counter", statKey: "rpsWins",           target: 1,  xpReward: 20 },
    { id: "bond_70",   icon: "❤️", name: "Best Buds",      desc: "Reach 70 bond today",              type: "stat",    statKey: "bond",              target: 70, xpReward: 30 },
    { id: "happy_80",  icon: "😊", name: "Happy Rock",     desc: "Reach 80 happiness",               type: "stat",    statKey: "happiness",         target: 80, xpReward: 25 },
    { id: "full_90",   icon: "🍔", name: "Well Fed",       desc: "Reach 90 fullness",                type: "stat",    statKey: "fullness",          target: 90, xpReward: 25 },
    { id: "energy_90", icon: "⚡", name: "Fully Charged",  desc: "Reach 90 energy",                  type: "stat",    statKey: "energy",            target: 90, xpReward: 25 },
    { id: "click_10",  icon: "👆", name: "Tap Happy",      desc: "Tap your rock 10 times today",     type: "counter", statKey: "totalInteractions", target: 10, xpReward: 15 },
    { id: "interact_20",icon:"🌟", name: "Super Engaged",  desc: "20 total interactions today",      type: "counter", statKey: "totalInteractions", target: 20, xpReward: 30 },
    { id: "feed_stardust",icon:"⭐",name:"Fancy Feast",    desc: "Feed high-level food",             type: "special", target: 1,  xpReward: 35 },
  ];

  function refreshDailyChallenges() {
    const today = new Date().toDateString();
    if (state.challengeLastRefresh === today) return;
    state.challengeLastRefresh = today;
    // Seed-based shuffle for reproducible daily set
    const seed = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const pool = [...CHALLENGE_POOL];
    let s = parseInt(seed) % 999983;
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        s = (s * 1664525 + 1013904223) & 0xffffffff;
        const j = Math.abs(s) % (i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };
    const chosen = shuffle(pool).slice(0, 3);
    state.dailyChallenges = chosen.map(c => ({
      id: c.id, startVal: c.type === "counter" ? (state[c.statKey] || 0) : 0,
      completed: false,
    }));
    renderChallenges();
    save();
  }

  function checkDailyChallenges() {
    if (!state.dailyChallenges || !state.dailyChallenges.length) return;
    let anyCompleted = false;
    for (const dc of state.dailyChallenges) {
      if (dc.completed) continue;
      const def = CHALLENGE_POOL.find(c => c.id === dc.id);
      if (!def) continue;
      let progress = 0;
      if (def.type === "counter") {
        progress = (state[def.statKey] || 0) - dc.startVal;
      } else if (def.type === "stat") {
        progress = state.stats[def.statKey] || 0;
      } else if (def.type === "special") {
        progress = dc.specialProgress || 0;
      }
      if (progress >= def.target) {
        dc.completed = true;
        state.challengesCompleted = (state.challengesCompleted || 0) + 1;
        anyCompleted = true;
        addXP(def.xpReward);
        log(`📋 Challenge complete: ${def.name}! +${def.xpReward} XP`, "achieve-msg");
        showThought(`Challenge done: ${def.name}! 🌟`, 4000);
        SFX.challenge();
        flashScreen("rgba(107,203,119,0.30)");
        spawnBurst(["📋","⭐","✨"], 10);
        grantSticker("s_challenge");
        if (state.challengesCompleted >= 7) grantSticker("s_challenge7");
        checkAchievements();
      }
    }
    if (anyCompleted) renderChallenges();
  }

  function renderChallenges() {
    const el = dom.challengeList;
    if (!el) return;
    if (!state.dailyChallenges || !state.dailyChallenges.length) {
      el.innerHTML = '<div class="challenge-empty">Check back tomorrow!</div>';
      return;
    }
    el.innerHTML = "";
    for (const dc of state.dailyChallenges) {
      const def = CHALLENGE_POOL.find(c => c.id === dc.id);
      if (!def) continue;
      let progress = 0, maxProg = def.target;
      if (def.type === "counter") progress = Math.min(def.target, (state[def.statKey] || 0) - dc.startVal);
      else if (def.type === "stat") progress = Math.min(def.target, state.stats[def.statKey] || 0);
      else if (def.type === "special") progress = Math.min(def.target, dc.specialProgress || 0);
      const pct = Math.min(100, (progress / maxProg) * 100);
      const div = document.createElement("div");
      div.className = `challenge-item${dc.completed ? " done" : ""}`;
      div.innerHTML = `<span class="challenge-icon">${def.icon}</span>
        <div class="challenge-info">
          <div class="challenge-name">${def.name}${dc.completed ? " ✓" : ""}</div>
          <div class="challenge-desc">${def.desc}</div>
          <div class="challenge-bar-wrap"><div class="challenge-bar" style="width:${pct}%"></div></div>
          <div class="challenge-progress">${dc.completed ? "Complete!" : `${Math.floor(progress)}/${maxProg}`} · +${def.xpReward} XP</div>
        </div>`;
      el.appendChild(div);
    }
  }

  // ── Seasonal Events ────────────────────────────────────────
  function checkSeasonalEvent() {
    const m = new Date().getMonth(); // 0=Jan, 11=Dec
    const d = new Date().getDate();
    const today = new Date().toDateString();
    const events = [
      { months: [9],  icon: "🎃", name: "Spooky Season",       desc: "Halloween vibes! Rocky's feeling spooky!", effects: { happiness: 20 }, xp: 15 },
      { months: [11, 0], icon: "⛄", name: "Winter Festival",   desc: "Snow and magic everywhere!",              effects: { happiness: 25, energy: 10 }, xp: 20 },
      { months: [1],  icon: "💝", name: "Love Day",             desc: "Rocky feels extra loved today!",          effects: { bond: 20, happiness: 15 }, xp: 15 },
      { months: [3],  icon: "🌸", name: "Spring Awakening",     desc: "New growth — Rocky feels refreshed!",     effects: { happiness: 20, energy: 15 }, xp: 15 },
      { months: [6, 7], icon: "☀️", name: "Summer Solstice",   desc: "Maximum sunlight energy!",                effects: { energy: 25, happiness: 10 }, xp: 15 },
      { months: [8, 9, 10], icon: "🍂", name: "Autumn Drift",  desc: "Leaves fall and Rocky watches.",          effects: { happiness: 12, cleanliness: -5 }, xp: 10 },
    ];
    const match = events.find(e => e.months.includes(m));
    if (!match) return;
    const key = match.icon + new Date().toISOString().slice(0, 7); // monthly
    if (state.seasonalEventSeen && state.seasonalEventSeen[key]) return;
    if (!state.seasonalEventSeen) state.seasonalEventSeen = {};
    state.seasonalEventSeen[key] = true;
    for (const [stat, val] of Object.entries(match.effects)) {
      if (state.stats[stat] !== undefined) state.stats[stat] = clamp(state.stats[stat] + val);
    }
    if (match.xp) addXP(match.xp);
    grantSticker("s_seasonal");
    dom.eventIcon.textContent = match.icon;
    dom.eventDesc.textContent = match.desc;
    dom.eventToast.classList.remove("hidden");
    setTimeout(() => dom.eventToast.classList.add("hidden"), 5000);
    log(`🌟 Seasonal: ${match.name} — ${match.desc}`, "system-msg");
    addJournalEntry(`${match.icon} Seasonal event: ${match.name}`);
    SFX.event();
    updateStats(); updateFace();
  }

  // ── Rock Stack Mini-game ───────────────────────────────────
  let stackActive = false, stackCount = 0, stackLives = 3, stackCursorAnim = null;
  let stackPos = 0, stackDir = 1, stackSpeed = 3, stackTapWindow = false, stackZoneWidth = 0.45;

  function openRockStack() {
    stackActive = false; stackCount = 0; stackLives = 3; stackSpeed = 3; stackZoneWidth = 0.45;
    dom.stackCount.textContent = "0";
    dom.stackLives.innerHTML = "❤️❤️❤️";
    dom.stackStatus.textContent = "Tap when the arrow is in the zone!";
    dom.stackResult.classList.add("hidden");
    dom.stackTap.classList.remove("hidden");
    dom.stackTap.disabled = false;
    dom.stackModal.classList.remove("hidden");
    focusFirstInModal(dom.stackModal);
    startStackCursor();
  }

  function startStackCursor() {
    if (stackCursorAnim) clearInterval(stackCursorAnim);
    stackPos = 0; stackDir = 1;
    const lane = dom.stackModal.querySelector("#stack-lane");
    const laneWidth = (lane && lane.offsetWidth) ? lane.offsetWidth : 280;
    stackActive = true;
    stackCursorAnim = setInterval(() => {
      stackPos += stackDir * stackSpeed;
      if (stackPos >= laneWidth - 20) { stackPos = laneWidth - 20; stackDir = -1; }
      if (stackPos <= 0) { stackPos = 0; stackDir = 1; }
      dom.stackCursor.style.left = stackPos + "px";
      const hw = laneWidth * stackZoneWidth / 2;
      const mid = laneWidth / 2;
      stackTapWindow = stackPos >= (mid - hw) && stackPos <= (mid + hw);
      dom.stackTarget.style.opacity = stackTapWindow ? "1" : "0.3";
    }, 16);
  }

  function endRockStack() {
    stackActive = false;
    if (stackCursorAnim) { clearInterval(stackCursorAnim); stackCursorAnim = null; }
    dom.stackTap.disabled = true;
    dom.stackTap.classList.add("hidden");
    dom.stackResult.classList.remove("hidden");
    state.totalRockStacks = (state.totalRockStacks || 0) + 1;
    state.totalPlays++;
    const xpGain = stackCount * 6 + 8;
    addXP(xpGain);
    state.stats.happiness = clamp(state.stats.happiness + Math.min(30, stackCount * 4));
    state.stats.bond = clamp(state.stats.bond + Math.min(12, stackCount));
    const isNewStackBest = stackCount > 0 && stackCount > (state.highestStackCount || 0);
    if (isNewStackBest) state.highestStackCount = stackCount;
    const stackBestTag = state.highestStackCount > 0
      ? (isNewStackBest ? " 🏅 New best!" : ` (best: ${state.highestStackCount})`)
      : "";
    dom.stackOutcome.textContent = stackCount >= 8
      ? `Incredible! ${stackCount} rocks stacked! 🏆${stackBestTag}`
      : stackCount >= 5
        ? `Nice! ${stackCount} rocks stacked! 👍${stackBestTag}`
        : stackCount >= 2
          ? `${stackCount} rocks — keep practicing!${stackBestTag}`
          : `${stackCount} rock — the tower toppled!`;
    dom.stackStatus.textContent = "Done!";
    if (stackCount >= 1) grantSticker("s_rockstack");
    log(`Rock Stack: ${stackCount} stacked! +${xpGain} XP`, "action-msg");
    addJournalEntry(`Played Rock Stack — stacked ${stackCount} rocks!`);
    (stackCount >= 3 ? SFX.win : SFX.lose)();
    if (stackCount >= 3) { flashScreen("rgba(107,203,119,0.28)"); spawnBurst(["�","✨","⭐"], 10); }
    updateStats(); updateFace(); checkAchievements(); checkDailyChallenges();
  }

  // ── Onboarding ────────────────────────────
  function showOnboarding() {
    if (state.tutorialSeen) return;
    const overlay = document.createElement("div");
    overlay.id = "onboarding-overlay";
    overlay.className = "onboarding-overlay";
    const steps = [
      { icon: "👋", title: `Meet ${state.name}!`, body: "This little rock is your new best friend. Let's learn the basics!" },
      { icon: "🤚", title: "Tap to Interact", body: "Tap your rock anytime to say hi! It loves the attention." },
      { icon: "🍪", title: "Keep it Happy", body: "Feed it, play games, pet it, and chat to keep its stats high." },
      { icon: "🏆", title: "Level Up!", body: "Earn XP for everything you do. Level up to unlock cool skins, eyes & scenes!" },
    ];
    let step = 0;
    const render = () => {
      const s = steps[step];
      overlay.innerHTML = `
        <div class="onboarding-card">
          <div class="onboarding-icon">${s.icon}</div>
          <h2 class="onboarding-title">${s.title}</h2>
          <p class="onboarding-body">${s.body}</p>
          <div class="onboarding-dots">${steps.map((_,i) => `<span class="ob-dot${i===step?" active":""}"></span>`).join("")}</div>
          <button class="onboarding-btn">${step < steps.length - 1 ? "Next →" : "Let's Go! 🪨"}</button>
        </div>`;
      overlay.querySelector(".onboarding-btn").addEventListener("click", () => {
        if (step < steps.length - 1) { step++; render(); }
        else { state.tutorialSeen = true; save(); overlay.remove(); }
      });
    };
    render();
    document.body.appendChild(overlay);
  }

  // ── Init ───────────────────────────────────────────────────
  function init() {
    load();
    initEyeTracking();
    initEvents();
    renderPickers();
    renderAchievements();
    renderStickers();
    updateStats();
    updateFace();
    updateSkin();
    updateAccessory();
    updateBackground();
    updateXPBar();
    applyEvolutionShape();
    // If was sleeping
    if (state.isSleeping) {
      dom.rock.classList.add("anim-sleep");
      dom.gameContainer.classList.add("night-mode");
      startSleepZzz();
    }
    checkUnlocks();
    initCapacitorLifecycle();
    // Streak, daily event, seasonal event
    checkStreak();
    checkDailyEvent();
    checkSeasonalEvent();
    // Daily challenges
    refreshDailyChallenges();
    renderChallenges();
    // Ambient sound
    if (state.ambientOn) startAmbient();
    dom.streakDisplay.textContent = state.streak;
    // Onboarding for new players
    if (!state.tutorialSeen) setTimeout(showOnboarding, 1200);

    setInterval(statDecay, 5000);
    setInterval(idleThoughts, 15000);
    setInterval(ageUp, 5000);
    setInterval(checkCriticalStats, 10000);
    setInterval(() => { checkDailyChallenges(); renderChallenges(); }, 8000);
    setInterval(save, 30000);
    window.addEventListener("beforeunload", save);
  }

  init();
})();
