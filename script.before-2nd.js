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

const KOREA_DEX = "https://data1.pokemonkorea.co.kr/newdata/pokedex/mid/";
const OFFICIAL_ARTWORK = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";

const players = [
  { koreaId: "002501", dexId: 25, name: "피카츄", type: "전기", color: "#ffd84d", hp: 3, speed: 5.3, fireRate: 170, power: 1, shot: "#ffe25d", projectile: "lightning" },
  { koreaId: "000601", dexId: 6, name: "리자몽", type: "불꽃", color: "#ff8a3d", hp: 4, speed: 4.2, fireRate: 250, power: 2, shot: "#ff7a32", projectile: "flame" },
  { koreaId: "000701", dexId: 7, name: "꼬부기", type: "물", color: "#62b6ff", hp: 5, speed: 4.6, fireRate: 220, power: 1, shot: "#75d6ff", projectile: "bubble" },
  { koreaId: "000101", dexId: 1, name: "이상해씨", type: "풀", color: "#7edc91", hp: 4, speed: 4.7, fireRate: 210, power: 1, shot: "#78db76", projectile: "leaf" },
  { koreaId: "013301", dexId: 133, name: "이브이", type: "노말", color: "#c7925b", hp: 3, speed: 5.5, fireRate: 185, power: 1, shot: "#f4c27a", projectile: "star" },
];

const enemyTypes = [
  { koreaId: "001601", dexId: 16, name: "구구", hp: 1, score: 20, speed: 1.5, color: "#caa47a", shotKind: "gust" },
  { koreaId: "004101", dexId: 41, name: "주뱃", hp: 1, score: 25, speed: 1.8, color: "#7a5ed6", shotKind: "sonic" },
  { koreaId: "009201", dexId: 92, name: "고오스", hp: 2, score: 35, speed: 1.35, color: "#7163a7", shotKind: "ghost" },
  { koreaId: "005201", dexId: 52, name: "나옹", hp: 2, score: 45, speed: 1.65, color: "#e8d39d", shotKind: "claw" },
  { koreaId: "012901", dexId: 129, name: "잉어킹", hp: 3, score: 60, speed: 1.2, color: "#ff8b56", shotKind: "splash" },
];

const imageCache = new Map();
const keys = new Set();
let selectedIndex = 0;
let state = "ready";
let score = 0;
let stage = 1;
let lastTime = 0;
let lastShot = 0;
let lastSpawn = 0;
let lastHit = 0;
let skillUntil = 0;

const player = {
  x: canvas.width / 2,
  y: canvas.height - 92,
  size: 58,
  hp: 3,
  vx: 0,
  vy: 0,
  data: players[0],
};

const bullets = [];
const enemies = [];
const enemyShots = [];
const particles = [];
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
  [...players, ...enemyTypes].forEach((item) => getImage(item));
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
      <span>${item.type}</span>
    `;
    button.addEventListener("click", () => {
      selectedIndex = index;
      renderCharacterSelect();
    });
    characterGrid.appendChild(button);
  });
}

function startGame() {
  player.data = players[selectedIndex];
  player.hp = player.data.hp;
  player.x = canvas.width / 2;
  player.y = canvas.height - 92;
  score = 0;
  stage = 1;
  lastTime = performance.now();
  lastShot = 0;
  lastSpawn = 0;
  lastHit = 0;
  skillUntil = 0;
  bullets.length = 0;
  enemies.length = 0;
  enemyShots.length = 0;
  particles.length = 0;
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  state = "playing";
  updateHud();
  requestAnimationFrame(loop);
}

function updateHud() {
  scoreText.textContent = score;
  stageText.textContent = stage;
  hpText.textContent = Math.max(0, player.hp);
}

function loop(now) {
  const delta = Math.min(32, now - lastTime);
  lastTime = now;

  if (state === "playing") {
    update(now, delta);
  }
  draw(now);

  if (state === "playing") requestAnimationFrame(loop);
}

function update(now, delta) {
  const d = delta / 16.67;
  stage = Math.min(3, Math.floor(score / 500) + 1);

  movePlayer(d);
  autoShoot(now);
  spawnEnemies(now);
  updateBullets(d);
  updateEnemies(now, d);
  updateParticles(d);
  checkCollisions(now);
  updateHud();
}

function movePlayer(d) {
  let dx = 0;
  let dy = 0;
  if (keys.has("ArrowLeft") || keys.has("KeyA")) dx -= 1;
  if (keys.has("ArrowRight") || keys.has("KeyD")) dx += 1;
  if (keys.has("ArrowUp") || keys.has("KeyW")) dy -= 1;
  if (keys.has("ArrowDown") || keys.has("KeyS")) dy += 1;
  const len = Math.hypot(dx, dy) || 1;
  player.x += (dx / len) * player.data.speed * d;
  player.y += (dy / len) * player.data.speed * d;
  player.x = clamp(player.x, 34, canvas.width - 34);
  player.y = clamp(player.y, 92, canvas.height - 40);
}

function autoShoot(now) {
  const fireRate = skillUntil > now ? Math.max(70, player.data.fireRate * 0.48) : player.data.fireRate;
  if (now - lastShot < fireRate) return;
  lastShot = now;
  const spread = skillUntil > now ? [-15, 0, 15] : [0];
  spread.forEach((angle) => {
    bullets.push({
      x: player.x,
      y: player.y - 30,
      vx: Math.sin((angle * Math.PI) / 180) * 3.2,
      vy: -8,
      r: 6,
      power: player.data.power,
      color: player.data.shot,
      kind: player.data.projectile,
      spin: Math.random() * Math.PI * 2,
    });
  });
}

function spawnEnemies(now) {
  const interval = Math.max(480, 1050 - stage * 180);
  if (now - lastSpawn < interval) return;
  lastSpawn = now;
  const pool = enemyTypes.slice(0, stage + 2);
  const base = pool[Math.floor(Math.random() * pool.length)];
  enemies.push({
    ...base,
    hp: base.hp + stage - 1,
    maxHp: base.hp + stage - 1,
    x: 36 + Math.random() * (canvas.width - 72),
    y: -52,
    size: 46 + Math.random() * 10,
    drift: Math.random() * Math.PI * 2,
  });
}

function updateBullets(d) {
  for (let i = bullets.length - 1; i >= 0; i -= 1) {
    const b = bullets[i];
    b.x += b.vx * d;
    b.y += b.vy * d;
    b.spin += 0.22 * d;
    if (Math.random() < 0.36) addTrailParticle(b);
    if (b.y < -20 || b.x < -20 || b.x > canvas.width + 20) bullets.splice(i, 1);
  }
  for (let i = enemyShots.length - 1; i >= 0; i -= 1) {
    const s = enemyShots[i];
    s.x += s.vx * d;
    s.y += s.vy * d;
    s.spin += 0.12 * d;
    s.wave += 0.08 * d;
    s.x += Math.sin(s.wave) * s.sway * d;
    if (Math.random() < 0.42) addEnemyTrailParticle(s);
    if (s.y > canvas.height + 20) enemyShots.splice(i, 1);
  }
}

function updateEnemies(now, d) {
  for (let i = enemies.length - 1; i >= 0; i -= 1) {
    const e = enemies[i];
    e.drift += 0.03 * d;
    e.y += (e.speed + stage * 0.38) * d;
    e.x += Math.sin(e.drift) * 1.35 * d;
    if (stage >= 2 && Math.random() < 0.005 * stage) {
      enemyShots.push({
        x: e.x,
        y: e.y + 18,
        vx: (Math.random() - 0.5) * 0.45,
        vy: 3.2 + stage * 0.4,
        r: 6,
        color: e.color,
        kind: e.shotKind,
        spin: Math.random() * Math.PI * 2,
        wave: Math.random() * Math.PI * 2,
        sway: 0.25 + Math.random() * 0.55,
      });
    }
    if (e.y > canvas.height + 60) enemies.splice(i, 1);
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
          score += e.score * stage;
          burst(e.x, e.y, e.color, 14);
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
}

function damagePlayer(now) {
  if (now - lastHit < 800) return;
  lastHit = now;
  player.hp -= 1;
  burst(player.x, player.y, "#ffffff", 18);
  if (player.hp <= 0) endGame();
}

function endGame() {
  state = "gameover";
  finalScore.textContent = `${score}점`;
  finalStage.textContent = `도달 스테이지 ${stage}`;
  gameOverScreen.classList.remove("hidden");
}

function useSkill() {
  if (state !== "playing") return;
  skillUntil = performance.now() + 4200;
  burst(player.x, player.y - 20, player.data.shot, 26);
}

function burst(x, y, color, count) {
  for (let i = 0; i < count; i += 1) {
    const a = Math.random() * Math.PI * 2;
    const s = 1 + Math.random() * 3;
    particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 18 + Math.random() * 18, color });
  }
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

function draw(now) {
  drawBackground(now);
  bullets.forEach(drawBullet);
  enemyShots.forEach(drawEnemyShot);
  enemies.forEach(drawEnemy);
  drawPlayer(now);
  particles.forEach(drawParticle);
}

function drawBackground(now) {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#b9efff");
  gradient.addColorStop(0.55, "#fff2cb");
  gradient.addColorStop(1, "#bfe7a5");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  clouds.forEach((c) => {
    c.y += c.speed;
    if (c.y > canvas.height + 40) {
      c.y = -40;
      c.x = Math.random() * canvas.width;
    }
    ctx.fillStyle = "rgba(255,255,255,0.74)";
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
    ctx.arc(c.x + c.r * 0.9, c.y + 4, c.r * 0.72, 0, Math.PI * 2);
    ctx.arc(c.x - c.r * 0.8, c.y + 7, c.r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  });

  const scroll = (now * 0.035) % 120;
  for (let y = -120 + scroll; y < canvas.height + 120; y += 120) {
    drawVillageRow(y);
  }
}

function drawVillageRow(y) {
  for (let x = 24; x < canvas.width; x += 96) {
    ctx.fillStyle = "rgba(122, 194, 118, 0.38)";
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 82, 52, 18, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.52)";
    ctx.fillRect(x + 8, y + 52, 32, 22);
    ctx.fillStyle = "rgba(255, 139, 108, 0.58)";
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
  if (skillUntil > now) {
    ctx.strokeStyle = player.data.shot;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.size * 0.62, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawEnemy(e) {
  const img = getImage(e);
  drawSprite(img, e.x, e.y, e.size, e.color, e.name);
  if (e.maxHp > 1) {
    ctx.fillStyle = "rgba(255,255,255,0.76)";
    ctx.fillRect(e.x - 20, e.y - e.size * 0.58, 40, 5);
    ctx.fillStyle = e.color;
    ctx.fillRect(e.x - 20, e.y - e.size * 0.58, 40 * (e.hp / e.maxHp), 5);
  }
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

function drawGustShot(s) {
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
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();
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

function drawClawShot(s) {
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

function drawSplashShot(s) {
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

function drawEnemyOrb(s) {
  ctx.fillStyle = s.color;
  ctx.beginPath();
  ctx.arc(0, 0, s.r, 0, Math.PI * 2);
  ctx.fill();
}

function drawParticle(p) {
  ctx.globalAlpha = Math.max(0, p.life / 34);
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.size || 3, 0, Math.PI * 2);
  ctx.fill();
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

window.addEventListener("keydown", (event) => {
  keys.add(event.code);
  if (event.code === "Enter" && state !== "playing") startGame();
  if (event.code === "Space") {
    event.preventDefault();
    useSkill();
  }
});

window.addEventListener("keyup", (event) => keys.delete(event.code));

canvas.addEventListener("pointermove", (event) => {
  if (state !== "playing") return;
  const rect = canvas.getBoundingClientRect();
  player.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  player.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener("pointerdown", (event) => {
  if (state === "playing") {
    canvas.setPointerCapture(event.pointerId);
  }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);
skillButton.addEventListener("click", useSkill);

preloadImages();
renderCharacterSelect();
draw(performance.now());
