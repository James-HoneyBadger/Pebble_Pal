// ============================================================
//  🪨 PET ROCK GAME — Enhanced Edition
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
    lastSaved: Date.now(),
    lastCustomizeXP: 0,
    createdAt: Date.now(),
  };

  // ── DOM ────────────────────────────────────────────────────
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  const dom = {
    nameLabel: $("#name-label"), renameBtn: $("#rename-btn"),
    ageDisplay: $("#age"), levelDisplay: $("#level"),
    xpBar: $("#xp-bar"), xpText: $("#xp-text"),
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
    minigameModal: $("#minigame-modal"), rpsChoices: $("#rps-choices"),
    rpsResult: $("#rps-result"), rpsYou: $("#rps-you"), rpsRock: $("#rps-rock"),
    rpsOutcome: $("#rps-outcome"), rpsAgain: $("#rps-again"), rpsClose: $("#rps-close"),
    gameContainer: $("#game-container"),
    achievementToast: $("#achievement-toast"), toastIcon: $("#toast-icon"),
    toastDesc: $("#toast-desc"),
    levelupOverlay: $("#levelup-overlay"), levelupNumber: $("#levelup-number"),
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
  };

  // ── Data: Eye Styles ───────────────────────────────────────
  const EYE_STYLES = {
    normal:  { label: "Normal",   css: "",             unlock: null },
    big:     { label: "Big",      css: "eyes-big",     unlock: null },
    anime:   { label: "Anime",    css: "eyes-anime",   unlock: { level: 4 } },
    sleepy:  { label: "Sleepy",   css: "eyes-sleepy",  unlock: { level: 6 } },
    cyclops: { label: "Cyclops",  css: "eyes-cyclops", unlock: { level: 9 } },
    star:    { label: "Star",     css: "eyes-star",    unlock: { level: 12 } },
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
    snow:       { label: "Snowfield", css: "env-snow", unlock: { level: 22 } },
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
    stardust:   { label: "⭐ Stardust",       fullness: 15, happiness: 30, energy: 20, msg: "Stardust... I can taste the cosmos!", unlock: { level: 18 } },
  };

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
      checkUnlocks();
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
    // Refresh the gradient
    dom.rockBody.style.background = `radial-gradient(ellipse at 35% 30%, ${s.hi}, ${s.color} 50%, ${s.sh})`;
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
    const el = document.createElement("div");
    el.className = "particle"; el.textContent = emoji;
    el.style.left = (x || 80 + Math.random() * 40) + "px";
    el.style.top = (y || 60 + Math.random() * 40) + "px";
    dom.particles.appendChild(el);
    setTimeout(() => el.remove(), 1500);
  }
  function spawnMulti(emoji, n = 5) {
    for (let i = 0; i < n; i++) setTimeout(() => spawnParticle(emoji), i * 150);
  }

  function showStatFloater(text, color = "#6bcb77") {
    const el = document.createElement("div");
    el.className = "stat-floater";
    el.textContent = text;
    el.style.color = color;
    el.style.left = (70 + Math.random() * 60) + "px";
    el.style.top = (30 + Math.random() * 40) + "px";
    dom.particles.appendChild(el);
    setTimeout(() => el.remove(), 1200);
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
    const msg = pick(dialogue.play); showThought(msg); log(`${state.name}: "${msg}"`, "rock-msg");
    const playBtn = $('[data-action="play"]');
    if (playBtn) playBtn.focus();
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
    state.totalFeeds++;
    animateRock("anim-jelly");
    spawnMulti("🪨", 3);
    showThought(food.msg);
    log(`You fed ${state.name} ${food.label.replace(/^.+\s/, "")}`, "action-msg");
    dom.foodPicker.classList.add("hidden");
    showStatFloater(`+${food.fullness} 🍔`, "#6bcb77");
    if (food.happiness > 5) showStatFloater(`+${food.happiness} 😊`, "#ffd93d");
    addXP(5 + Math.floor(food.happiness / 5));
    startCooldown();
    updateStats(); updateFace(); checkAchievements();
  }

  const actions = {
    feed() {
      if (state.isSleeping) { showThought("Zzz..."); return; }
      dom.foodPicker.classList.toggle("hidden");
    },
    play() {
      if (state.isSleeping) { showThought("Zzz... too sleepy..."); return; }
      if (state.stats.energy < 10) { showThought("Too tired to play..."); log(`${state.name} is too tired!`, "warning-msg"); return; }
      dom.minigameModal.classList.remove("hidden");
      dom.rpsChoices.classList.remove("hidden");
      dom.rpsResult.classList.add("hidden");
      $("#minigame-title").textContent = `Rock Paper Scissors with ${state.name}!`;
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
      addXP(4); startCooldown(2000); checkAchievements();
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
      addXP(3); startCooldown(); checkAchievements();
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
      addXP(4); startCooldown(800); checkAchievements();
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
      addXP(6); startCooldown(2200); checkAchievements();
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
      addXP(4); startCooldown(2500); checkAchievements();
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
      outcome = "You win! 🎉"; state.stats.happiness = clamp(state.stats.happiness + 10); state.rpsWins++;
    } else {
      outcome = `${state.name} wins! 🪨💪`; state.stats.happiness = clamp(state.stats.happiness + 3);
    }
    state.stats.energy = clamp(state.stats.energy - 8);
    state.stats.bond = clamp(state.stats.bond + 5);
    dom.rpsOutcome.textContent = outcome;
    log(`RPS: ${outcome}`, "action-msg");
    if (rockChoice === "rock") log(`${state.name}: "I always pick rock. Obviously."`, "rock-msg");
    addXP(6); updateStats(); updateFace(); startCooldown(); checkAchievements();
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
        if (actions[a]) { actions[a](); state.totalInteractions++; updateStats(); updateFace(); }
      });
    });
    dom.rock.addEventListener("click", onRockClick);
    dom.rock.addEventListener("touchstart", (e) => { e.preventDefault(); onRockClick(); }, { passive: false });
    dom.rock.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRockClick(); } });

    dom.renameBtn.addEventListener("click", showRenameDialog);

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

    // RPS — with focus trap & Escape
    $$(".rps-btn").forEach(btn => btn.addEventListener("click", () => playRPS(btn.dataset.choice)));
    dom.rpsAgain.addEventListener("click", () => { dom.rpsChoices.classList.remove("hidden"); dom.rpsResult.classList.add("hidden"); focusFirstInModal(dom.minigameModal); });
    dom.rpsClose.addEventListener("click", closeRPSModal);
    dom.minigameModal.addEventListener("click", (e) => { if (e.target === dom.minigameModal) closeRPSModal(); });
    dom.minigameModal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { closeRPSModal(); return; }
      if (e.key === "Tab") trapFocus(e, dom.minigameModal);
    });
  }

  // ── Save / Load ────────────────────────────────────────────
  function save() { try { state.lastSaved = Date.now(); localStorage.setItem("petRockState2", JSON.stringify(state)); } catch(e){} }

  function load() {
    try {
      const d = localStorage.getItem("petRockState2");
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
    if (window.petRock && window.petRock.onReset) {
      window.petRock.onReset(() => { localStorage.clear(); location.reload(); });
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

  // ── Init ───────────────────────────────────────────────────
  function init() {
    load();
    initEyeTracking();
    initEvents();
    renderPickers();
    renderAchievements();
    updateStats();
    updateFace();
    updateSkin();
    updateAccessory();
    updateBackground();
    updateXPBar();
    // If was sleeping
    if (state.isSleeping) {
      dom.rock.classList.add("anim-sleep");
      dom.gameContainer.classList.add("night-mode");
      startSleepZzz();
    }
    checkUnlocks();
    initCapacitorLifecycle();

    setInterval(statDecay, 5000);
    setInterval(idleThoughts, 15000);
    setInterval(ageUp, 5000);
    setInterval(checkCriticalStats, 10000);
    setInterval(save, 30000);
    window.addEventListener("beforeunload", save);
  }

  init();
})();
