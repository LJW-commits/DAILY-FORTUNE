const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("scoreText");
const stageText = document.getElementById("stageText");
const hpText = document.getElementById("hpText");
const startScreen = document.getElementById("startScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScore = document.getElementById("finalScore");
const finalStage = document.getElementById("finalStage");
const characterGrid = document.getElementById("characterGrid");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const skillButton = document.getElementById("skillButton");
const joystick = document.getElementById("joystick");
const joystickKnob = document.getElementById("joystickKnob");

const KOREA_DEX = "https://data1.pokemonkorea.co.kr/newdata/pokedex/mid/";
const OFFICIAL_ARTWORK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
const MAX_STAGE = 10;
const MAX_PLAYER_HP = 10;
const EVOLVE_SCORE = 4000;
const STAGE_SCORE_STEP = 2000;
const ENDING_SCORE = MAX_STAGE * STAGE_SCORE_STEP;
const BOSS_SCORE_BEFORE_STAGE_END = 200;

const players = [
  {
    koreaId: "002501",
    dexId: 25,
    name: "피카츄",
    type: "전기",
    color: "#ffd84d",
    hp: 3,
    speed: 5.45,
    fireRate: 160,
    power: 1,
    shot: "#ffe25d",
    projectile: "lightning",
    skillName: "3갈래 번개",
  },
  {
    koreaId: "000601",
    dexId: 6,
    name: "리자몽",
    type: "불꽃",
    color: "#ff8a3d",
    hp: 4,
    speed: 4.15,
    fireRate: 245,
    power: 2,
    shot: "#ff7a32",
    projectile: "flame",
    skillName: "화염 브레스",
  },
  {
    koreaId: "000701",
    dexId: 7,
    name: "꼬부기",
    type: "물",
    color: "#62b6ff",
    hp: 5,
    speed: 4.5,
    fireRate: 220,
    power: 1,
    shot: "#75d6ff",
    projectile: "bubble",
    skillName: "물방울 보호막",
  },
  {
    koreaId: "000101",
    dexId: 1,
    name: "이상해씨",
    type: "풀",
    color: "#7edc91",
    hp: 4,
    speed: 4.75,
    fireRate: 210,
    power: 1,
    shot: "#78db76",
    projectile: "leaf",
    skillName: "덩굴 회복",
  },
  {
    koreaId: "013301",
    dexId: 133,
    name: "이브이",
    type: "노말",
    color: "#c7925b",
    hp: 3,
    speed: 5.55,
    fireRate: 185,
    power: 1,
    shot: "#f4c27a",
    projectile: "star",
    skillName: "진화 버프",
  },
];

const evolvedPlayers = [
  {
    koreaId: "002601",
    dexId: 26,
    name: "라이츄",
    type: "전기",
    color: "#f5a640",
    hp: 5,
    speed: 5.9,
    fireRate: 125,
    power: 2,
    shot: "#ffe06b",
    projectile: "lightning",
    skillName: "번개 폭풍",
  },
  {
    koreaId: "000602",
    dexId: 10034,
    name: "메가리자몽X",
    type: "불꽃",
    color: "#4c6070",
    hp: 6,
    speed: 4.85,
    fireRate: 190,
    power: 3,
    shot: "#5ee7ff",
    projectile: "flame",
    skillName: "푸른 화염",
  },
  {
    koreaId: "000901",
    dexId: 9,
    name: "거북왕",
    type: "물",
    color: "#4c8fdc",
    hp: 8,
    speed: 4.9,
    fireRate: 180,
    power: 2,
    shot: "#83e5ff",
    projectile: "bubble",
    skillName: "하이드로 캐논",
  },
  {
    koreaId: "000301",
    dexId: 3,
    name: "이상해꽃",
    type: "풀",
    color: "#62c67c",
    hp: 7,
    speed: 4.95,
    fireRate: 175,
    power: 2,
    shot: "#9cff78",
    projectile: "leaf",
    skillName: "꽃잎 폭풍",
  },
  {
    koreaId: "070001",
    dexId: 700,
    name: "님피아",
    type: "페어리",
    color: "#f3a8c9",
    hp: 6,
    speed: 6.0,
    fireRate: 145,
    power: 2,
    shot: "#ffd2ef",
    projectile: "star",
    skillName: "요정 버프",
  },
];

const enemyTypes = [
  { koreaId: "001601", dexId: 16, name: "구구", minStage: 1, hp: 1, score: 20, speed: 1.45, color: "#caa47a", shotKind: "gust", pattern: "sway", shotChance: 0 },
  { koreaId: "002101", dexId: 21, name: "깨비참", minStage: 1, hp: 1, score: 25, speed: 2.05, color: "#b9865d", shotKind: "gust", pattern: "dash", shotChance: 0 },
  { koreaId: "002301", dexId: 23, name: "아보", minStage: 1, hp: 2, score: 35, speed: 1.18, color: "#a36bd0", shotKind: "poison", pattern: "snake", shotChance: 0.002 },
  { koreaId: "008801", dexId: 88, name: "질퍽이", minStage: 2, hp: 3, score: 45, speed: 0.95, color: "#8f68a8", shotKind: "poison", pattern: "drop", shotChance: 0.003 },
  { koreaId: "005201", dexId: 52, name: "나옹", minStage: 2, hp: 2, score: 45, speed: 1.7, color: "#e8d39d", shotKind: "claw", pattern: "chase", shotChance: 0.003 },
  { koreaId: "004101", dexId: 41, name: "주뱃", minStage: 2, hp: 1, score: 35, speed: 1.9, color: "#7a5ed6", shotKind: "sonic", pattern: "zigzag", shotChance: 0.004 },
  { koreaId: "009201", dexId: 92, name: "고오스", minStage: 3, hp: 2, score: 55, speed: 1.38, color: "#7163a7", shotKind: "ghost", pattern: "ghost", shotChance: 0.004 },
  { koreaId: "022801", dexId: 228, name: "델빌", minStage: 3, hp: 2, score: 60, speed: 1.72, color: "#66504a", shotKind: "ember", pattern: "chase", shotChance: 0.004 },
  { koreaId: "005601", dexId: 56, name: "망키", minStage: 3, hp: 3, score: 65, speed: 1.85, color: "#d8b899", shotKind: "claw", pattern: "rage", shotChance: 0.004 },
  { koreaId: "008101", dexId: 81, name: "코일", minStage: 3, hp: 2, score: 70, speed: 1.45, color: "#aeb8c2", shotKind: "spark", pattern: "straight", shotChance: 0.006 },
  { koreaId: "020101", dexId: 201, name: "안농", minStage: 4, hp: 1, score: 80, speed: 1.35, color: "#6b6f80", shotKind: "ghost", pattern: "swarm", shotChance: 0.005 },
  { koreaId: "004201", dexId: 42, name: "골뱃", minStage: 4, hp: 4, score: 90, speed: 1.55, color: "#6d55bd", shotKind: "sonic", pattern: "zigzag", shotChance: 0.006 },
  { koreaId: "001501", dexId: 15, name: "독침붕", minStage: 4, hp: 2, score: 95, speed: 2.2, color: "#e2bb38", shotKind: "needle", pattern: "dash", shotChance: 0.006 },
  { koreaId: "002201", dexId: 22, name: "깨비드릴조", minStage: 4, hp: 4, score: 110, speed: 1.95, color: "#b36d45", shotKind: "gust", pattern: "wide", shotChance: 0.006 },
  { koreaId: "000401", dexId: 4, name: "파이리", minStage: 4, hp: 3, score: 100, speed: 1.55, color: "#ff8b4b", shotKind: "ember", pattern: "straight", shotChance: 0.007 },
  { koreaId: "020001", dexId: 200, name: "무우마", minStage: 5, hp: 2, score: 125, speed: 1.65, color: "#6e62a8", shotKind: "ghost", pattern: "ghost", shotChance: 0.008 },
  { koreaId: "012301", dexId: 123, name: "스라크", minStage: 5, hp: 5, score: 150, speed: 2.05, color: "#88c777", shotKind: "claw", pattern: "dash", shotChance: 0.008 },
  { koreaId: "009301", dexId: 93, name: "고우스트", minStage: 5, hp: 5, score: 170, speed: 1.4, color: "#5f4a96", shotKind: "ghost", pattern: "ghost", shotChance: 0.009 },
  { koreaId: "013001", dexId: 130, name: "갸라도스", minStage: 5, hp: 10, score: 280, speed: 0.92, color: "#5d97d8", shotKind: "splash", pattern: "wide", shotChance: 0.012, miniBoss: true },
  { koreaId: "015001", dexId: 150, name: "뮤츠", minStage: 5, hp: 16, score: 500, speed: 1.02, color: "#b7a6df", shotKind: "psychic", pattern: "boss", shotChance: 0.018, miniBoss: true },
];

const stageBosses = [
  null,
  { koreaId: "002301", dexId: 23, name: "아보", hp: 16, score: 420, speed: 0.68, color: "#a36bd0", shotKind: "poison", pattern: "boss", size: 82 },
  { koreaId: "004201", dexId: 42, name: "골뱃", hp: 24, score: 620, speed: 0.82, color: "#6d55bd", shotKind: "sonic", pattern: "boss", size: 92 },
  { koreaId: "009401", dexId: 94, name: "팬텀", hp: 34, score: 860, speed: 0.84, color: "#5f4a96", shotKind: "ghost", pattern: "boss", size: 98 },
  { koreaId: "013001", dexId: 130, name: "갸라도스", hp: 46, score: 1150, speed: 0.68, color: "#5d97d8", shotKind: "splash", pattern: "boss", size: 110 },
  { koreaId: "015001", dexId: 150, name: "뮤츠", hp: 58, score: 1700, speed: 0.74, color: "#b7a6df", shotKind: "psychic", pattern: "boss", size: 112 },
  { koreaId: "002401", dexId: 24, name: "아보크", hp: 70, score: 2100, speed: 0.8, color: "#8f5bc4", shotKind: "poison", pattern: "boss", size: 112 },
  { koreaId: "014201", dexId: 142, name: "프테라", hp: 82, score: 2600, speed: 0.98, color: "#9a8f83", shotKind: "gust", pattern: "boss", size: 118 },
  { koreaId: "024801", dexId: 248, name: "마기라스", hp: 96, score: 3200, speed: 0.72, color: "#94a75a", shotKind: "needle", pattern: "boss", size: 124 },
  { koreaId: "038401", dexId: 384, name: "레쿠쟈", hp: 112, score: 3900, speed: 0.92, color: "#4fb688", shotKind: "spark", pattern: "boss", size: 132 },
  { koreaId: "015001", dexId: 150, name: "뮤츠 최종형", hp: 140, score: 6000, speed: 0.86, color: "#b7a6df", shotKind: "psychic", pattern: "boss", size: 134 },
];

const itemTypes = [
  { kind: "heart", label: "HP", color: "#ff6f9b" },
  { kind: "score", label: "+", color: "#ffd760" },
  { kind: "assist", label: "A", color: "#9ee6ff" },
  { kind: "speed", label: "S", color: "#9af4a1" },
  { kind: "shield", label: "B", color: "#9cc8ff" },
  { kind: "magnet", label: "M", color: "#d7b2ff" },
];

const imageCache = new Map();
const keys = new Set();
const joystickState = {
  active: false,
  pointerId: null,
  x: 0,
  y: 0,
};
let selectedIndex = 0;
let state = "ready";
let score = 0;
let stage = 1;
let lastTime = 0;
let lastShot = 0;
let lastSpawn = 0;
let lastHit = 0;
let lastItemSpawn = 0;
let skillReadyAt = 0;
let rapidUntil = 0;
let shieldUntil = 0;
let speedBuffUntil = 0;
let attackBuffUntil = 0;
let magnetUntil = 0;
let assistUntil = 0;
let stageStartScore = 0;
let bossSpawnedForStage = 0;
let backgroundScroll = 0;
let evolved = false;
let flashUntil = 0;
let endingStartedAt = 0;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 92,
  size: 58,
  hp: 3,
  data: players[0],
};

const bullets = [];
const enemies = [];
const enemyShots = [];
const particles = [];
const items = [];
const messages = [];
const clouds = Array.from({ length: 12 }, (_, index) => ({
  x: Math.random() * canvas.width,
  y: index * 70,
  r: 16 + Math.random() * 18,
  speed: 0.25 + Math.random() * 0.45,
}));

function koreaImgUrl(item) {
  return `${KOREA_DEX}${item.koreaId}.png`;
}

function officialImgUrl(item) {
  return `${OFFICIAL_ARTWORK}${item.dexId}.png`;
}

function getImage(item) {
  const key = `${item.name}-${item.dexId}`;
  if (imageCache.has(key)) return imageCache.get(key);
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onerror = () => {
    if (img.src !== officialImgUrl(item)) {
      img.src = officialImgUrl(item);
    }
  };
  img.src = koreaImgUrl(item);
  imageCache.set(key, img);
  return img;
}

function preloadImages() {
  [...players, ...evolvedPlayers, ...enemyTypes, ...stageBosses.filter(Boolean)].forEach((item) => getImage(item));
}

function renderCharacterSelect() {
  characterGrid.innerHTML = "";
  players.forEach((item, index) => {
    const button = document.createElement("button");
    button.className = `character-card${index === selectedIndex ? " selected" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <img src="${koreaImgUrl(item)}" alt="${item.name}" onerror="this.onerror=null;this.src='${officialImgUrl(item)}';" />
      <strong>${item.name}</strong>
      <span>${item.type} · ${item.skillName}</span>
    `;
    button.addEventListener("click", () => {
      selectedIndex = index;
      renderCharacterSelect();
    });
    characterGrid.appendChild(button);
  });
}

function startGame() {
  resetJoystick();
  player.data = players[selectedIndex];
  player.hp = player.data.hp;
  player.size = 58;
  player.x = canvas.width / 2;
  player.y = canvas.height - 92;
  score = 0;
  stage = 1;
  stageStartScore = 0;
  bossSpawnedForStage = 0;
  lastTime = performance.now();
  lastShot = 0;
  lastSpawn = 0;
  lastHit = 0;
  lastItemSpawn = 0;
  evolved = false;
  skillReadyAt = 0;
  endingStartedAt = 0;
  rapidUntil = 0;
  shieldUntil = 0;
  speedBuffUntil = 0;
  attackBuffUntil = 0;
  magnetUntil = 0;
  assistUntil = 0;
  bullets.length = 0;
  enemies.length = 0;
  enemyShots.length = 0;
  particles.length = 0;
  items.length = 0;
  messages.length = 0;
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  showMessage(`${player.data.name} 출격!`, player.data.color);
  state = "playing";
  updateHud(performance.now());
  requestAnimationFrame(loop);
}

function updateHud(now = performance.now()) {
  scoreText.textContent = score;
  stageText.textContent = `${stage}${evolved ? " EV" : ""}`;
  hpText.textContent = `${Math.max(0, player.hp)}${shieldUntil > now ? " +방어" : ""}`;
  skillButton.textContent = now >= skillReadyAt ? "특수" : Math.ceil((skillReadyAt - now) / 1000);
}

function loop(now) {
  const delta = Math.min(32, now - lastTime);
  lastTime = now;

  if (state === "playing") update(now, delta);
  if (state === "ending") updateEnding(now, delta);
  draw(now);

  if (state === "playing" || state === "ending") requestAnimationFrame(loop);
}

function update(now, delta) {
  const d = delta / 16.67;
  const nextStage = Math.min(MAX_STAGE, Math.floor(score / STAGE_SCORE_STEP) + 1);
  if (nextStage !== stage) {
    stage = nextStage;
    stageStartScore = score;
    showMessage(`스테이지 ${stage}`, "#2f9e7e");
  }

  movePlayer(now, d);
  maybeEvolve(now);
  autoShoot(now);
  spawnEnemies(now);
  spawnPassiveItem(now);
  updateBullets(d);
  updateEnemies(now, d);
  updateItems(now, d);
  updateParticles(d);
  updateMessages(d);
  checkCollisions(now);
  checkEnding(now);
  updateHud(now);
}

function checkEnding(now) {
  if (score < ENDING_SCORE || state !== "playing") return;
  startEnding(now);
}

function startEnding(now) {
  resetJoystick();
  state = "ending";
  endingStartedAt = now;
  flashUntil = now + 1200;
  gameOverScreen.classList.add("hidden");
  enemies.forEach((enemy) => burst(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 48 : 18));
  enemies.length = 0;
  enemyShots.length = 0;
  bullets.length = 0;
  items.length = 0;
  messages.length = 0;
  player.x = canvas.width / 2;
  player.y = canvas.height / 2 + 20;
  showMessage("축하합니다!", player.data.shot);
  for (let i = 0; i < 90; i += 1) spawnSparkle(Math.random() * canvas.width, Math.random() * canvas.height, player.data.shot);
}

function updateEnding(now, delta) {
  const d = delta / 16.67;
  backgroundScroll += 0.1 * d;
  player.x += (canvas.width / 2 - player.x) * 0.04 * d;
  player.y += (canvas.height / 2 + 20 - player.y) * 0.04 * d;
  if (Math.random() < 0.55) {
    spawnSparkle(Math.random() * canvas.width, Math.random() * canvas.height * 0.72, player.data.shot);
  }
  updateParticles(d);
  updateMessages(d);
  updateHud(now);
}

function movePlayer(now, d) {
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("KeyW")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("KeyS")) dy += 1;
  dx += joystickState.x;
  dy += joystickState.y;
  const len = Math.hypot(dx, dy) || 1;
  const speedMul = speedBuffUntil > now ? 1.35 : 1;
  player.x += (dx / len) * player.data.speed * speedMul * d;
  player.y += (dy / len) * player.data.speed * speedMul * d;
  player.x = clamp(player.x, 34, canvas.width - 34);
  player.y = clamp(player.y, 92, canvas.height - 40);
}

function maybeEvolve(now) {
  if (evolved || score < EVOLVE_SCORE) return;
  evolved = true;
  const currentHp = player.hp;
  clearEnemiesForEvolution();
  player.data = evolvedPlayers[selectedIndex];
  player.hp = Math.min(MAX_PLAYER_HP, Math.max(currentHp + 2, player.data.hp));
  player.size = 68;
  flashUntil = now + 900;
  rapidUntil = now + 5000;
  attackBuffUntil = now + 5000;
  shieldUntil = now + 3500;
  skillReadyAt = Math.min(skillReadyAt, now + 800);
  burst(player.x, player.y, player.data.shot, 90);
  showMessage(`${player.data.name}로 진화!`, player.data.shot);
}

function clearEnemiesForEvolution() {
  enemies.forEach((enemy) => {
    score += Math.floor(enemy.score * stage * 0.5);
    burst(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 42 : 18);
  });
  enemies.length = 0;
  enemyShots.length = 0;
}

function getPlayerPower() {
  return player.data.power + (evolved ? 1 : 0);
}

function autoShoot(now) {
  const fireRate = rapidUntil > now ? Math.max(70, player.data.fireRate * 0.5) : player.data.fireRate;
  if (now - lastShot < fireRate) return;
  lastShot = now;
  const spread = rapidUntil > now || assistUntil > now ? [-13, 0, 13] : [0];
  spread.forEach((angle) => firePlayerBullet(player.x, player.y - 30, angle, getPlayerPower(), player.data.projectile));
  if (assistUntil > now) {
    firePlayerBullet(player.x - 22, player.y - 18, -8, 1, "star");
    firePlayerBullet(player.x + 22, player.y - 18, 8, 1, "star");
  }
}

function firePlayerBullet(x, y, angle, power, kind, speed = 8) {
  bullets.push({
    x,
    y,
    vx: Math.sin((angle * Math.PI) / 180) * 3.2,
    vy: -speed,
    r: kind === "flame" ? 9 : 7,
    power: power + (attackBuffUntil > performance.now() ? 1 : 0),
    color: player.data.shot,
    kind,
    spin: Math.random() * Math.PI * 2,
  });
}

function spawnEnemies(now) {
  maybeSpawnBoss(now);
  const bossAlive = enemies.some((enemy) => enemy.isBoss);
  const interval = bossAlive ? 1650 : Math.max(620, 1280 - stage * 70);
  if (now - lastSpawn < interval) return;
  lastSpawn = now;

  const available = enemyTypes.filter((enemy) => enemy.minStage <= stage && !enemy.miniBoss);
  const miniBosses = enemyTypes.filter((enemy) => enemy.minStage <= stage && enemy.miniBoss);
  const base = miniBosses.length && Math.random() < 0.025 + stage * 0.006
    ? choice(miniBosses)
    : choice(available);
  spawnEnemy(base);
}

function maybeSpawnBoss(now) {
  if (bossSpawnedForStage === stage) return;
  const bossScore = stage * STAGE_SCORE_STEP - BOSS_SCORE_BEFORE_STAGE_END;
  if (score < bossScore) return;
  if (enemies.some((enemy) => enemy.isBoss)) return;
  bossSpawnedForStage = stage;
  const boss = stageBosses[stage];
  if (!boss) return;
  spawnEnemy(boss, true);
  showMessage(`${boss.name} 보스 등장!`, boss.color);
}

function spawnEnemy(base, isBoss = false) {
  const stageBoost = Math.max(0, stage - base.minStage);
  enemies.push({
    ...base,
    hp: base.hp + Math.floor(stageBoost * 0.65) + (isBoss ? stage * 3 : 0),
    maxHp: base.hp + Math.floor(stageBoost * 0.65) + (isBoss ? stage * 3 : 0),
    x: isBoss ? canvas.width / 2 : 36 + Math.random() * (canvas.width - 72),
    y: isBoss ? -88 : -52,
    size: isBoss ? Math.round((base.size || 98) * 1.28) : base.size || (base.miniBoss ? 72 : 44 + Math.random() * 12),
    drift: Math.random() * Math.PI * 2,
    bornAt: performance.now(),
    isBoss,
  });
}

function spawnPassiveItem(now) {
  if (now - lastItemSpawn < 10000) return;
  lastItemSpawn = now;
  if (Math.random() < 0.35) {
    spawnItem(choice(itemTypes), 34 + Math.random() * (canvas.width - 68), -24);
  }
}

function updateBullets(d) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const b = bullets[i];
    b.x += b.vx * d;
    b.y += b.vy * d;
    b.spin += 0.22 * d;
    if (Math.random() < 0.36) addTrailParticle(b);
    if (b.y < -30 || b.x < -30 || b.x > canvas.width + 30) bullets.splice(i, 1);
  }

  for (let i = enemyShots.length - 1; i >= 0; i -= 1) {
    const s = enemyShots[i];
    s.x += s.vx * d;
    s.y += s.vy * d;
    s.spin += 0.12 * d;
    s.wave += 0.08 * d;
    s.x += Math.sin(s.wave) * s.sway * d;
    if (Math.random() < 0.42) addEnemyTrailParticle(s);
    if (s.y > canvas.height + 28 || s.x < -28 || s.x > canvas.width + 28) enemyShots.splice(i, 1);
  }
}

function updateEnemies(now, d) {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    e.drift += (e.pattern === "rage" ? 0.06 : 0.032) * d;
    moveEnemy(e, d);
    maybeEnemyShoot(e, now);
    if (e.y > canvas.height + 90) enemies.splice(i, 1);
  }
}

function moveEnemy(e, d) {
  const baseSpeed = e.isBoss ? e.speed + stage * 0.04 : e.speed + stage * 0.22;
  e.y += baseSpeed * d;
  if (e.isBoss && e.y > 92) e.y -= baseSpeed * 0.72 * d;

  if (e.pattern === "dash") e.x += Math.sin(e.drift * 1.4) * 2.4 * d;
  else if (e.pattern === "snake") e.x += Math.sin(e.drift) * 3.0 * d;
  else if (e.pattern === "zigzag") e.x += Math.sin(e.drift * 1.8) * 2.8 * d;
  else if (e.pattern === "chase") e.x += Math.sign(player.x - e.x) * 0.9 * d;
  else if (e.pattern === "ghost") e.x += Math.sin(e.drift) * 1.8 * d + Math.cos(e.drift * 0.7) * 0.8 * d;
  else if (e.pattern === "rage") e.x += Math.sign(player.x - e.x) * 1.2 * d + Math.sin(e.drift) * 1.3 * d;
  else if (e.pattern === "wide") e.x += Math.sin(e.drift * 0.7) * 1.6 * d;
  else if (e.pattern === "boss") e.x += Math.sin(e.drift * 0.5) * 1.4 * d;
  else e.x += Math.sin(e.drift) * 1.25 * d;

  e.x = clamp(e.x, e.size * 0.45, canvas.width - e.size * 0.45);
}

function maybeEnemyShoot(e, now) {
  const chance = (e.shotChance * 0.55 + (e.isBoss ? 0.02 : 0) + stage * 0.0007) * (e.y > 0 ? 1 : 0);
  if (Math.random() > chance) return;
  fireEnemyShot(e, 0);
  if (e.isBoss) {
    fireEnemyShot(e, -8);
    fireEnemyShot(e, 8);
    fireEnemyShot(e, -16);
    fireEnemyShot(e, 16);
    if (stage >= 3) {
      fireEnemyShot(e, -30);
      fireEnemyShot(e, 30);
    }
    if (stage >= 6) {
      fireEnemyShot(e, -42);
      fireEnemyShot(e, 42);
    }
    if (stage >= 9) {
      fireEnemyShot(e, -55);
      fireEnemyShot(e, 55);
    }
  }
}

function fireEnemyShot(e, angle) {
  enemyShots.push({
    x: e.x,
    y: e.y + e.size * 0.32,
    vx: Math.sin((angle * Math.PI) / 180) * 2.0 + (Math.random() - 0.5) * 0.35,
    vy: 3.1 + stage * 0.32 + (e.isBoss ? 0.85 : 0),
    r: e.isBoss ? 10 : 6,
    color: e.color,
    kind: e.shotKind,
    spin: Math.random() * Math.PI * 2,
    wave: Math.random() * Math.PI * 2,
    sway: e.isBoss ? 0.48 : 0.25 + Math.random() * 0.55,
  });
}

function updateItems(now, d) {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = items[i];
    item.y += item.vy * d;
    item.spin += 0.05 * d;
    if (magnetUntil > now && distance(player.x, player.y, item.x, item.y) < 150) {
      item.x += Math.sign(player.x - item.x) * 3.0 * d;
      item.y += Math.sign(player.y - item.y) * 2.2 * d;
    }
    if (item.y > canvas.height + 28) items.splice(i, 1);
  }
}

function updateParticles(d) {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx * d;
    p.y += p.vy * d;
    p.life -= d;
    if (p.life <= 0) particles.splice(i, 1);
  }
}

function updateMessages(d) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    messages[i].life -= d;
    messages[i].y -= 0.25 * d;
    if (messages[i].life <= 0) messages.splice(i, 1);
  }
}

function checkCollisions(now) {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    for (let j = bullets.length - 1; j >= 0; j -= 1) {
      const b = bullets[j];
      if (distance(e.x, e.y, b.x, b.y) < e.size * 0.44 + b.r) {
        e.hp -= b.power;
        bullets.splice(j, 1);
        burst(b.x, b.y, player.data.shot, 5);
        if (e.hp <= 0) {
          defeatEnemy(e);
          enemies.splice(i, 1);
        }
        break;
      }
    }
    if (enemies[i] && distance(player.x, player.y, e.x, e.y) < player.size * 0.42 + e.size * 0.38) {
      enemies.splice(i, 1);
      damagePlayer(now);
    }
  }

  for (let i = enemyShots.length - 1; i >= 0; i -= 1) {
    const s = enemyShots[i];
    if (distance(player.x, player.y, s.x, s.y) < player.size * 0.38 + s.r) {
      enemyShots.splice(i, 1);
      damagePlayer(now);
    }
  }

  for (let i = items.length - 1; i >= 0; i -= 1) {
    const item = items[i];
    if (distance(player.x, player.y, item.x, item.y) < player.size * 0.42 + 15) {
      applyItem(item.kind);
      items.splice(i, 1);
    }
  }
}

function defeatEnemy(enemy) {
  score += enemy.score * stage;
  burst(enemy.x, enemy.y, enemy.color, enemy.isBoss ? 34 : 14);
  if (enemy.isBoss) showMessage(`${enemy.name} 격파!`, enemy.color);
  const dropRate = enemy.isBoss ? 1 : enemy.miniBoss ? 0.45 : 0.14;
  if (Math.random() < dropRate) spawnItem(choice(itemTypes), enemy.x, enemy.y);
}

function damagePlayer(now) {
  if (now - lastHit < 800) return;
  lastHit = now;
  if (shieldUntil > now) {
    shieldUntil = Math.max(now, shieldUntil - 1200);
    burst(player.x, player.y, "#9cc8ff", 18);
    showMessage("방어!", "#5b8cff");
    return;
  }
  player.hp -= 1;
  burst(player.x, player.y, "#ffffff", 18);
  if (player.hp <= 0) endGame();
}

function endGame() {
  resetJoystick();
  state = "gameover";
  finalScore.textContent = `${score}점`;
  finalStage.textContent = `도달 스테이지 ${stage}`;
  gameOverScreen.classList.remove("hidden");
}

function useSkill() {
  const now = performance.now();
  if (state !== "playing" || now < skillReadyAt) return;
  skillReadyAt = now + 6500;
  const type = player.data.projectile;

  if (type === "lightning") {
    [-38, -24, -12, 0, 12, 24, 38].forEach((angle) => firePlayerBullet(player.x, player.y - 24, angle, evolved ? 4 : 2, "lightning", 9.5));
    enemies.forEach((enemy) => {
      enemy.hp -= 1;
      burst(enemy.x, enemy.y, player.data.shot, 5);
    });
    showMessage("3갈래 번개!", player.data.shot);
  } else if (type === "flame") {
    [-40, -28, -16, -6, 6, 16, 28, 40].forEach((angle) => firePlayerBullet(player.x, player.y - 18, angle, evolved ? 5 : 3, "flame", 7.5));
    rapidUntil = now + 2800;
    showMessage("화염 브레스!", player.data.shot);
  } else if (type === "bubble") {
    shieldUntil = now + 5200;
    for (let i = 0; i < 12; i += 1) firePlayerBullet(player.x, player.y - 18, -50 + i * 9, evolved ? 3 : 1, "bubble", 6.6);
    showMessage("물방울 보호막!", player.data.shot);
  } else if (type === "leaf") {
    player.hp = Math.min(MAX_PLAYER_HP, player.hp + 1);
    for (let i = 0; i < 16; i += 1) firePlayerBullet(player.x, player.y - 18, -60 + i * 8, evolved ? 3 : 1, "leaf", 7.2);
    showMessage("덩굴 회복!", player.data.shot);
  } else {
    const buffs = ["rapid", "attack", "speed", "shield"];
    const buff = choice(buffs);
    if (buff === "rapid") rapidUntil = now + 5200;
    if (buff === "attack") attackBuffUntil = now + 5200;
    if (buff === "speed") speedBuffUntil = now + 5200;
    if (buff === "shield") shieldUntil = now + 4200;
    for (let i = 0; i < 10; i += 1) firePlayerBullet(player.x, player.y - 18, -45 + i * 10, evolved ? 4 : 2, "star", 8.2);
    showMessage("진화 버프!", player.data.shot);
  }
  burst(player.x, player.y - 20, player.data.shot, 26);
}

function spawnItem(item, x, y) {
  items.push({
    ...item,
    x,
    y,
    vy: 1.25,
    spin: Math.random() * Math.PI * 2,
  });
}

function applyItem(kind) {
  const now = performance.now();
  if (kind === "heart") {
    player.hp = Math.min(MAX_PLAYER_HP, player.hp + 1);
    showMessage("체력 회복", "#ff6f9b");
  } else if (kind === "score") {
    score += 180;
    showMessage("점수 +180", "#d69b00");
  } else if (kind === "assist") {
    assistUntil = now + 7500;
    showMessage("보조 미사일", "#38aeea");
  } else if (kind === "speed") {
    speedBuffUntil = now + 8000;
    showMessage("속도 증가", "#31b55d");
  } else if (kind === "shield") {
    shieldUntil = now + 6500;
    showMessage("보호막", "#5b8cff");
  } else if (kind === "magnet") {
    magnetUntil = now + 8500;
    showMessage("아이템 자석", "#9d6ce5");
  }
  burst(player.x, player.y, "#ffffff", 14);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 1 + Math.random() * 3;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 18 + Math.random() * 18, color });
  }
}

function spawnSparkle(x, y, color) {
  const a = Math.random() * Math.PI * 2;
  const s = 0.5 + Math.random() * 2.2;
  particles.push({
    x,
    y,
    vx: Math.cos(a) * s,
    vy: Math.sin(a) * s + 0.3,
    life: 28 + Math.random() * 38,
    color: Math.random() < 0.45 ? "#ffffff" : color,
    size: 2.5 + Math.random() * 4.5,
    shape: "sparkle",
  });
}

function addTrailParticle(b) {
  const jitter = (Math.random() - 0.5) * 8;
  const trailColors = {
    lightning: "#fff8ad",
    flame: "#ffb14f",
    bubble: "#b7efff",
    leaf: "#b7f39a",
    star: "#ffe2a3",
  };
  particles.push({
    x: b.x + jitter,
    y: b.y + 8 + Math.random() * 8,
    vx: (Math.random() - 0.5) * 0.7,
    vy: 0.8 + Math.random() * 0.8,
    life: 10 + Math.random() * 10,
    color: trailColors[b.kind] || b.color,
    size: 2 + Math.random() * 2,
  });
}

function addEnemyTrailParticle(s) {
  const colors = {
    gust: "#efe1c7",
    sonic: "#c8b8ff",
    ghost: "#cab7ff",
    claw: "#fff1be",
    splash: "#ffd1bd",
    poison: "#dca5ef",
    spark: "#fff79d",
    ember: "#ffbc83",
    needle: "#f4dc62",
    psychic: "#f0b8ff",
  };
  particles.push({
    x: s.x + (Math.random() - 0.5) * 9,
    y: s.y - 8 + Math.random() * 7,
    vx: (Math.random() - 0.5) * 0.6,
    vy: -0.2 + Math.random() * 0.5,
    life: 9 + Math.random() * 11,
    color: colors[s.kind] || s.color,
    size: 1.6 + Math.random() * 2.6,
  });
}

function showMessage(text, color) {
  messages.push({ text, color, x: canvas.width / 2, y: 138, life: 80 });
}

function draw(now) {
  drawBackground(now);
  items.forEach(drawItem);
  bullets.forEach(drawBullet);
  enemyShots.forEach(drawEnemyShot);
  enemies.forEach(drawEnemy);
  if (state === "ending") drawEnding(now);
  else drawPlayer(now);
  particles.forEach(drawParticle);
  drawBossHud();
  drawFlash(now);
  messages.forEach(drawMessage);
}

function drawBackground(now) {
  backgroundScroll += 0.18 + stage * 0.018;
  const palettes = [
    ["#b9efff", "#fff2cb", "#bfe7a5"],
    ["#b8f0e7", "#fff0c9", "#c9e69b"],
    ["#c6e5ff", "#f8d8ff", "#b7d7aa"],
    ["#d6e3ff", "#ffe7c2", "#aacfd3"],
    ["#cbbcff", "#ffd4d7", "#96bdd4"],
    ["#bdd8ff", "#ffe3ef", "#9fd3c6"],
    ["#b9f0ff", "#f2e4ff", "#92c9e0"],
    ["#d5c9ff", "#ffd9c8", "#7fb8c8"],
    ["#b7c8ff", "#f7c4d8", "#708fb8"],
    ["#b5a7ff", "#ffc9dd", "#5f79aa"],
  ];
  const palette = palettes[stage - 1] || palettes[0];
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, palette[0]);
  gradient.addColorStop(0.55, palette[1]);
  gradient.addColorStop(1, palette[2]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  clouds.forEach((c) => {
    c.y += c.speed + stage * 0.015;
    if (c.y > canvas.height + 40) {
      c.y = -40;
      c.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = "rgba(255,255,255,0.7)";
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.arc(c.x + c.r * 0.9, c.y + 4, c.r * 0.72, 0, Math.PI * 2);
    ctx.arc(c.x - c.r * 0.8, c.y + 7, c.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  const scroll = backgroundScroll % 120;
  for (let y = -120 + scroll; y < canvas.height + 120; y += 120) drawVillageRow(y);
}

function drawVillageRow(y) {
  for (let x = 24; x < canvas.width; x += 96) {
    ctx.fillStyle = stage >= 4 ? "rgba(98, 134, 156, 0.32)" : "rgba(122, 194, 118, 0.38)";
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 82, 52, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = stage >= 5 ? "rgba(255, 255, 255, 0.34)" : "rgba(255, 255, 255, 0.52)";
    ctx.fillRect(x + 8, y + 52, 32, 22);
    ctx.fillStyle = stage >= 4 ? "rgba(139, 111, 169, 0.56)" : "rgba(255, 139, 108, 0.58)";
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 52);
    ctx.lineTo(x + 24, y + 34);
    ctx.lineTo(x + 44, y + 52);
    ctx.closePath();
    ctx.fill();
  }
}

function drawPlayer(now) {
  const blink = now - lastHit < 800 && Math.floor(now / 90) % 2 === 0;
  if (blink) return;
  const img = getImage(player.data);
  drawSprite(img, player.x, player.y, player.size, player.data.color, player.data.name);
  if (shieldUntil > now) drawRing(player.x, player.y, player.size * 0.68, "#9cc8ff");
  if (rapidUntil > now || attackBuffUntil > now || speedBuffUntil > now) drawRing(player.x, player.y, player.size * 0.82, player.data.shot);
  if (evolved) drawRing(player.x, player.y, player.size * 0.98, player.data.shot);
}

function drawEnemy(e) {
  const img = getImage(e);
  if (e.isBoss) {
    drawBossAura(e);
  }
  drawSprite(img, e.x, e.y, e.size, e.color, e.name);
  if (e.isBoss) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = colorWithAlpha(e.color, 0.9);
    ctx.lineWidth = 4;
    ctx.font = "900 16px Malgun Gothic, sans-serif";
    ctx.textAlign = "center";
    ctx.strokeText("BOSS", e.x, e.y - e.size * 0.58);
    ctx.fillText("BOSS", e.x, e.y - e.size * 0.58);
  }
  if (e.maxHp > 1 && !e.isBoss) {
    ctx.fillStyle = "rgba(255,255,255,0.76)";
    ctx.fillRect(e.x - 20, e.y - e.size * 0.58, 40, 5);
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x - 20, e.y - e.size * 0.58, 40 * (e.hp / e.maxHp), 5);
  }
}

function drawBossAura(e) {
  const pulse = 1 + Math.sin((performance.now() - e.bornAt) * 0.006) * 0.04;
  ctx.save();
  ctx.translate(e.x, e.y);
  ctx.strokeStyle = colorWithAlpha(e.color, 0.55);
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, e.size * 0.58 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(0, 0, e.size * 0.68 * pulse, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawSprite(img, x, y, size, color, label) {
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, x - size / 2, y - size / 2, size, size);
    return;
  }
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, size * 0.42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 11px Malgun Gothic, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(label, x, y + 4);
}

function drawBullet(b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.rotate(Math.atan2(b.vy, b.vx) + Math.PI / 2);
  drawBulletGlow(b);
  if (b.kind === "lightning") drawLightning(b);
  else if (b.kind === "flame") drawFlame(b);
  else if (b.kind === "bubble") drawBubble(b);
  else if (b.kind === "leaf") drawLeaf(b);
  else if (b.kind === "star") drawStarBullet(b);
  else drawSimpleBullet(b);
  ctx.restore();
}

function drawBulletGlow(b) {
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 18);
  glow.addColorStop(0, colorWithAlpha(b.color, 0.72));
  glow.addColorStop(1, colorWithAlpha(b.color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
}

function drawLightning(b) {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff7a5";
  ctx.lineWidth = 9;
  lightningPath();
  ctx.stroke();
  ctx.strokeStyle = b.color;
  ctx.lineWidth = 4;
  lightningPath();
  ctx.stroke();
}

function lightningPath() {
  ctx.beginPath();
  ctx.moveTo(-2, 13);
  ctx.lineTo(5, 2);
  ctx.lineTo(0, 2);
  ctx.lineTo(8, -14);
  ctx.lineTo(-8, 3);
  ctx.lineTo(-2, 3);
  ctx.lineTo(-9, 15);
}

function drawFlame(b) {
  const flame = ctx.createLinearGradient(0, 16, 0, -16);
  flame.addColorStop(0, "#ff3f23");
  flame.addColorStop(0.55, b.color);
  flame.addColorStop(1, "#fff0a8");
  ctx.fillStyle = flame;
  ctx.beginPath();
  ctx.moveTo(0, -18);
  ctx.bezierCurveTo(15, -6, 11, 12, 0, 17);
  ctx.bezierCurveTo(-13, 10, -12, -5, 0, -18);
  ctx.fill();
  ctx.fillStyle = "#fff2a8";
  ctx.beginPath();
  ctx.moveTo(1, -8);
  ctx.bezierCurveTo(7, 1, 5, 10, -1, 12);
  ctx.bezierCurveTo(-7, 6, -4, -2, 1, -8);
  ctx.fill();
}

function drawBubble(b) {
  ctx.fillStyle = "rgba(117, 214, 255, 0.64)";
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 0, 10, 14, Math.sin(b.spin) * 0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.86)";
  ctx.beginPath();
  ctx.arc(-4, -5, 3, 0, Math.PI * 2);
  ctx.fill();
}

function drawLeaf(b) {
  ctx.rotate(Math.sin(b.spin) * 0.35);
  const leaf = ctx.createLinearGradient(0, 14, 0, -16);
  leaf.addColorStop(0, "#3aaa55");
  leaf.addColorStop(1, "#c8ff8e");
  ctx.fillStyle = leaf;
  ctx.beginPath();
  ctx.moveTo(0, -17);
  ctx.bezierCurveTo(14, -6, 11, 11, 0, 16);
  ctx.bezierCurveTo(-13, 6, -10, -9, 0, -17);
  ctx.fill();
  ctx.strokeStyle = "#e9ffd8";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -12);
  ctx.lineTo(0, 12);
  ctx.stroke();
}

function drawStarBullet(b) {
  ctx.rotate(b.spin);
  ctx.fillStyle = "#ffe08a";
  ctx.strokeStyle = "#fff8d2";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const radius = i % 2 === 0 ? 15 : 7;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawSimpleBullet(b) {
  ctx.fillStyle = b.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, b.r * 0.72, b.r * 1.45, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemyShot(s) {
  ctx.save();
  ctx.translate(s.x, s.y);
  ctx.rotate(s.spin);
  drawEnemyShotGlow(s);
  if (s.kind === "gust") drawGustShot(s);
  else if (s.kind === "sonic") drawSonicShot(s);
  else if (s.kind === "ghost") drawGhostShot(s);
  else if (s.kind === "claw") drawClawShot(s);
  else if (s.kind === "splash") drawSplashShot(s);
  else if (s.kind === "poison") drawPoisonShot(s);
  else if (s.kind === "spark") drawSparkShot(s);
  else if (s.kind === "ember") drawEmberShot(s);
  else if (s.kind === "needle") drawNeedleShot(s);
  else if (s.kind === "psychic") drawPsychicShot(s);
  else drawEnemyOrb(s);
  ctx.restore();
}

function drawEnemyShotGlow(s) {
  const glow = ctx.createRadialGradient(0, 0, 1, 0, 0, 16);
  glow.addColorStop(0, colorWithAlpha(s.color, 0.45));
  glow.addColorStop(1, colorWithAlpha(s.color, 0));
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 16, 0, Math.PI * 2);
  ctx.fill();
}

function drawGustShot() {
  ctx.strokeStyle = "rgba(83, 82, 72, 0.6)";
  ctx.lineWidth = 2.5;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 2 + i * 4, 7 + i * 3, Math.PI * 0.1, Math.PI * 1.45);
    ctx.stroke();
  }
  ctx.strokeStyle = "#fff2d4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 4, 11, Math.PI * 0.15, Math.PI * 1.35);
  ctx.stroke();
}

function drawSonicShot(s) {
  ctx.strokeStyle = "#efe9ff";
  ctx.lineWidth = 2.4;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.ellipse(0, 0, 5 + i * 5, 9 + i * 2, 0, 0, Math.PI * 2);
    ctx.stroke();
  }
  drawEnemyOrb({ ...s, r: 4 });
}

function drawGhostShot(s) {
  ctx.fillStyle = colorWithAlpha(s.color, 0.88);
  ctx.beginPath();
  ctx.arc(0, -3, 9, Math.PI, 0);
  ctx.lineTo(9, 8);
  ctx.quadraticCurveTo(4, 4, 0, 8);
  ctx.quadraticCurveTo(-4, 4, -9, 8);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = "#f6efff";
  ctx.beginPath();
  ctx.arc(-3, -3, 1.7, 0, Math.PI * 2);
  ctx.arc(4, -2, 1.7, 0, Math.PI * 2);
  ctx.fill();
}

function drawClawShot() {
  ctx.strokeStyle = "#fff2b6";
  ctx.lineWidth = 4.5;
  ctx.lineCap = "round";
  [-5, 0, 5].forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, -11);
    ctx.quadraticCurveTo(x + 5, 0, x - 2, 11);
    ctx.stroke();
  });
  ctx.strokeStyle = "#8c6d38";
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-7, -9);
  ctx.lineTo(7, 10);
  ctx.stroke();
}

function drawSplashShot() {
  const splash = ctx.createLinearGradient(0, -12, 0, 14);
  splash.addColorStop(0, "#fff7df");
  splash.addColorStop(0.45, "#ff9c66");
  splash.addColorStop(1, "#ff6740");
  ctx.fillStyle = splash;
  ctx.beginPath();
  ctx.moveTo(0, -13);
  ctx.bezierCurveTo(10, -2, 8, 11, 0, 14);
  ctx.bezierCurveTo(-9, 8, -8, -3, 0, -13);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.75)";
  ctx.beginPath();
  ctx.arc(-3, -4, 2.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawPoisonShot(s) {
  ctx.fillStyle = colorWithAlpha("#b65ad8", 0.82);
  ctx.beginPath();
  ctx.arc(0, 0, s.r + 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0c2ff";
  ctx.beginPath();
  ctx.arc(-3, -4, 2, 0, Math.PI * 2);
  ctx.arc(4, 3, 1.8, 0, Math.PI * 2);
  ctx.fill();
}

function drawSparkShot() {
  ctx.strokeStyle = "#fff49c";
  ctx.lineWidth = 4;
  lightningPath();
  ctx.stroke();
  ctx.strokeStyle = "#8b8d96";
  ctx.lineWidth = 1.5;
  lightningPath();
  ctx.stroke();
}

function drawEmberShot(s) {
  drawFlame({ ...s, color: "#ff914d" });
}

function drawNeedleShot() {
  ctx.fillStyle = "#f4dc62";
  ctx.strokeStyle = "#6f6629";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, -15);
  ctx.lineTo(6, 10);
  ctx.lineTo(0, 15);
  ctx.lineTo(-6, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

function drawPsychicShot(s) {
  ctx.strokeStyle = "#ffe4ff";
  ctx.lineWidth = 3;
  for (let i = 0; i < 3; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 6 + i * 5, Math.PI * 0.15, Math.PI * 1.75);
    ctx.stroke();
  }
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemyOrb(s) {
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(0, 0, s.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawItem(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.rotate(item.spin);
  ctx.fillStyle = colorWithAlpha(item.color, 0.28);
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = item.color;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  ctx.beginPath();
  if (item.kind === "heart") {
    ctx.moveTo(0, 10);
    ctx.bezierCurveTo(-15, 1, -8, -12, 0, -4);
    ctx.bezierCurveTo(8, -12, 15, 1, 0, 10);
  } else {
    for (let i = 0; i < 8; i += 1) {
      const radius = i % 2 === 0 ? 15 : 8;
      const angle = -Math.PI / 2 + (i * Math.PI) / 4;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  }
  ctx.fill();
  ctx.stroke();
  ctx.rotate(-item.spin);
  ctx.fillStyle = "#ffffff";
  ctx.font = "900 11px Segoe UI, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.label, 0, 1);
  ctx.restore();
}

function drawParticle(p) {
  ctx.globalAlpha = Math.max(0, p.life / 34);
  ctx.fillStyle = p.color;
  if (p.shape === "sparkle") {
    drawSparkleParticle(p);
  } else {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawSparkleParticle(p) {
  const size = p.size || 4;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.life * 0.08);
  ctx.beginPath();
  for (let i = 0; i < 8; i += 1) {
    const radius = i % 2 === 0 ? size : size * 0.38;
    const angle = -Math.PI / 2 + (i * Math.PI) / 4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawRing(x, y, radius, color) {
  ctx.strokeStyle = colorWithAlpha(color, 0.82);
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBossHud() {
  const boss = enemies.find((enemy) => enemy.isBoss);
  if (!boss) return;
  const barWidth = canvas.width - 44;
  const y = 54;
  ctx.fillStyle = "rgba(255,255,255,0.84)";
  ctx.fillRect(22, y, barWidth, 18);
  ctx.fillStyle = boss.color;
  ctx.fillRect(22, y, barWidth * Math.max(0, boss.hp / boss.maxHp), 18);
  ctx.strokeStyle = "rgba(72,88,96,0.72)";
  ctx.lineWidth = 2;
  ctx.strokeRect(22, y, barWidth, 18);
  ctx.fillStyle = "#38464c";
  ctx.font = "900 14px Malgun Gothic, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(`BOSS ${boss.name}`, canvas.width / 2, y - 6);
}

function drawEnding(now) {
  const elapsed = Math.max(0, now - endingStartedAt);
  const grow = Math.min(1, elapsed / 2200);
  const pulse = 1 + Math.sin(now * 0.006) * 0.04;
  const size = (player.size + grow * 92) * pulse;
  const img = getImage(player.data);

  drawRing(player.x, player.y, size * 0.66, player.data.shot);
  drawRing(player.x, player.y, size * 0.86, "#ffffff");
  drawSprite(img, player.x, player.y, size, player.data.color, player.data.name);

  ctx.save();
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = colorWithAlpha(player.data.shot, 0.95);
  ctx.lineWidth = 7;
  ctx.font = "900 38px Malgun Gothic, sans-serif";
  ctx.strokeText("축하합니다!", canvas.width / 2, 118);
  ctx.fillText("축하합니다!", canvas.width / 2, 118);
  ctx.font = "900 17px Malgun Gothic, sans-serif";
  ctx.strokeStyle = "rgba(55, 77, 87, 0.65)";
  ctx.lineWidth = 4;
  ctx.strokeText("포코피아 마을을 지켜냈습니다", canvas.width / 2, 148);
  ctx.fillText("포코피아 마을을 지켜냈습니다", canvas.width / 2, 148);
  ctx.font = "800 15px Malgun Gothic, sans-serif";
  ctx.fillStyle = "#37505b";
  ctx.fillText(`최종 점수 ${score}점`, canvas.width / 2, canvas.height - 72);
  ctx.fillText("Enter 키로 다시 시작", canvas.width / 2, canvas.height - 48);
  ctx.restore();
}

function drawFlash(now) {
  if (now >= flashUntil) return;
  const progress = (flashUntil - now) / 900;
  ctx.save();
  ctx.globalAlpha = Math.min(0.92, progress);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalAlpha = Math.min(0.75, progress);
  ctx.strokeStyle = player.data.shot;
  ctx.lineWidth = 10;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(player.x, player.y, 40 + i * 42 + (1 - progress) * 120, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawMessage(message) {
  ctx.globalAlpha = Math.min(1, message.life / 20);
  ctx.fillStyle = colorWithAlpha(message.color, 0.9);
  ctx.font = "900 22px Malgun Gothic, sans-serif";
  ctx.textAlign = "center";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255,255,255,0.86)";
  ctx.strokeText(message.text, message.x, message.y);
  ctx.fillText(message.text, message.x, message.y);
  ctx.globalAlpha = 1;
}

function colorWithAlpha(hex, alpha) {
  const value = hex.replace("#", "");
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function distance(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

function choice(itemsList) {
  return itemsList[Math.floor(Math.random() * itemsList.length)];
}

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "Enter" && state !== "playing") startGame();
  if (event.code === "Space") {
    event.preventDefault();
    useSkill();
  }
});

window.addEventListener("keyup", (event) => keys.delete(event.code));

function updateJoystick(event) {
  const rect = joystick.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  const max = rect.width * 0.34;
  const rawX = event.clientX - centerX;
  const rawY = event.clientY - centerY;
  const len = Math.hypot(rawX, rawY);
  const limited = Math.min(max, len || 0);
  const nx = len ? rawX / len : 0;
  const ny = len ? rawY / len : 0;
  const knobX = nx * limited;
  const knobY = ny * limited;

  joystickState.x = Math.abs(knobX) < 5 ? 0 : knobX / max;
  joystickState.y = Math.abs(knobY) < 5 ? 0 : knobY / max;
  joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
}

function resetJoystick() {
  joystickState.active = false;
  joystickState.pointerId = null;
  joystickState.x = 0;
  joystickState.y = 0;
  joystickKnob.style.transform = "translate(-50%, -50%)";
}

joystick.addEventListener("pointerdown", (event) => {
  if (state !== "playing") return;
  event.preventDefault();
  joystickState.active = true;
  joystickState.pointerId = event.pointerId;
  joystick.setPointerCapture(event.pointerId);
  updateJoystick(event);
});

joystick.addEventListener("pointermove", (event) => {
  if (!joystickState.active || joystickState.pointerId !== event.pointerId) return;
  event.preventDefault();
  updateJoystick(event);
});

joystick.addEventListener("pointerup", (event) => {
  if (joystickState.pointerId === event.pointerId) resetJoystick();
});

joystick.addEventListener("pointercancel", (event) => {
  if (joystickState.pointerId === event.pointerId) resetJoystick();
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
skillButton.addEventListener("click", useSkill);

preloadImages();
renderCharacterSelect();
draw(performance.now());
