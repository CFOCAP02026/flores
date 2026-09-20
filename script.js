const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
const galaxyContainer = document.getElementById('galaxyContainer');
const flowerInput = document.getElementById('flowerInput');
const iconSelect = document.getElementById('iconSelect');
const addBtn = document.getElementById('addBtn');
const petalRainBtn = document.getElementById('petalRainBtn');
const audioBtn = document.getElementById('audioBtn');
const bgMusic = document.getElementById('bgMusic');

const letterModal = document.getElementById('letterModal');
const closeModal = document.getElementById('closeModal');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');

let stars = [];
let particles = [];
let rainPetals = [];
let nodes = [];
let isRainActive = false;
let isAudioPlaying = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Recalcular radios según la pantalla del celular
function updateNodeRadii() {
  const minDim = Math.min(window.innerWidth, window.innerHeight);
  nodes.forEach((node, index) => {
    // Radio responsivo adaptado a la pantalla del móvil
    node.radius = (minDim * 0.18) + (index % 3) * (minDim * 0.08);
  });
}

window.addEventListener('resize', () => {
  resizeCanvas();
  updateNodeRadii();
});
resizeCanvas();

// Estrellas de fondo
for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    alpha: Math.random(),
    speed: Math.random() * 0.015 + 0.005
  });
}

// Agujero Negro Central (Adaptado a Pantalla)
function drawBlackHole() {
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.07;

  const glow = ctx.createRadialGradient(cx, cy, radius * 0.5, cx, cy, radius * 3.2);
  glow.addColorStop(0, 'rgba(255, 220, 100, 0.9)');
  glow.addColorStop(0.3, 'rgba(255, 140, 0, 0.5)');
  glow.addColorStop(0.6, 'rgba(180, 50, 0, 0.2)');
  glow.addColorStop(1, 'transparent');

  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 3.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.shadowColor = 'rgba(255, 200, 50, 0.9)';
  ctx.shadowBlur = 20;
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawSpace() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 20,
    canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.75
  );
  gradient.addColorStop(0, '#120a02');
  gradient.addColorStop(0.5, '#080512');
  gradient.addColorStop(1, '#020205');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
    ctx.fillStyle = `rgba(255, 240, 180, ${Math.abs(s.alpha)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  drawBlackHole();

  // Partículas
  particles.forEach((p, index) => {
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.02;
    if (p.alpha <= 0) particles.splice(index, 1);
    else {
      ctx.fillStyle = `rgba(255, 215, 0, ${p.alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Lluvia de Pétalos
  if (isRainActive && Math.random() < 0.35) {
    rainPetals.push({
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 5 + 3,
      vy: Math.random() * 2 + 1,
      vx: Math.sin(Math.random() * Math.PI) * 1.5,
      rotation: Math.random() * 360,
      vRot: Math.random() * 2 - 1
    });
  }

  rainPetals.forEach((p, index) => {
    p.y += p.vy;
    p.x += p.vx;
    p.rotation += p.vRot;
    if (p.y > canvas.height + 20) rainPetals.splice(index, 1);
    else {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = 'rgba(255, 215, 0, 0.85)';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });

  requestAnimationFrame(drawSpace);
}
drawSpace();

// Palabras del Video Viral
const tiktokPhrases = [
  { text: "Mi sol ☀️", icon: "🌻", note: "Eres la razón de mi sonrisa todos los días." },
  { text: "Mi destino 🌌", icon: "💐", note: "El universo me guió directamente hacia ti." },
  { text: "Esperanza ✨", icon: "🌻", note: "A tu lado todo es más bonito y brillante." },
  { text: "Eternidad ♾️", icon: "💐", note: "Lo que siento por ti no tiene fin." },
  { text: "Brillas 🌟", icon: "🌻", note: "Iluminas mi mundo con tu sola presencia." },
  { text: "Mi amor ❤️", icon: "💐", note: "Eres lo más especial que me ha pasado." },
  { text: "Pasión 🔥", icon: "🌻", note: "Cada segundo a tu lado es inolvidable." },
  { text: "Reina 👑", icon: "🌼", note: "Te mereces todas las flores del universo hoy." },
  { text: "Felicidad 😊", icon: "🌻", note: "Estar contigo es mi lugar favorito." },
  { text: "Libertad 🕊️", icon: "🌼", note: "Contigo soy mi versión más feliz." },
  { text: "Dulcura 🍯", icon: "💐", note: "Gracias por llenar mi vida de ternura." },
  { text: "Contigo 💛", icon: "🌻", note: "Siempre juntos bajo el mismo cielo." }
];

function createFlowerNode(text, icon, angle, index, note) {
  const node = document.createElement('div');
  node.className = 'flower-node';

  const iconEl = document.createElement('div');
  iconEl.className = 'flower-icon';
  iconEl.innerText = icon;

  const labelEl = document.createElement('div');
  labelEl.className = 'tag-label';
  labelEl.innerText = text;

  node.appendChild(iconEl);
  node.appendChild(labelEl);
  galaxyContainer.appendChild(node);

  const speed = (0.0012 + Math.random() * 0.001) * (Math.random() > 0.5 ? 1 : -1);
  const nodeData = { element: node, angle, radius: 0, speed, text, icon, note };
  nodes.push(nodeData);

  // Funciona con clic y toque en pantalla de celular
  const handleTap = (e) => {
    e.stopPropagation();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    spawnExplosion(clientX || window.innerWidth / 2, clientY || window.innerHeight / 2);
    openModal(nodeData);
  };

  node.addEventListener('click', handleTap);
}

const total = tiktokPhrases.length;
tiktokPhrases.forEach((item, index) => {
  const angle = (index / total) * Math.PI * 2;
  createFlowerNode(item.text, item.icon, angle, index, item.note);
});
updateNodeRadii();

function animateOrbit() {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  nodes.forEach(node => {
    node.angle += node.speed;
    const x = cx + Math.cos(node.angle) * node.radius;
    const y = cy + Math.sin(node.angle) * (node.radius * 0.55);

    const depthScale = 0.75 + ((y - (cy - node.radius * 0.55)) / (node.radius * 1.1 + 1)) * 0.45;
    const zIndex = Math.floor(depthScale * 100);

    node.element.style.left = `${x}px`;
    node.element.style.top = `${y}px`;
    node.element.style.transform = `translate(-50%, -50%) scale(${depthScale})`;
    node.element.style.zIndex = zIndex;
  });

  requestAnimationFrame(animateOrbit);
}
animateOrbit();

function spawnExplosion(x, y) {
  for (let i = 0; i < 25; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      size: Math.random() * 3.5 + 1.5,
      alpha: 1
    });
  }
}

function openModal(data) {
  modalIcon.innerText = data.icon;
  modalTitle.innerText = data.text;
  modalBody.innerText = data.note;
  letterModal.classList.add('active');
}

closeModal.addEventListener('click', () => letterModal.classList.remove('active'));
letterModal.addEventListener('click', (e) => {
  if (e.target === letterModal) letterModal.classList.remove('active');
});

function addCustomFlower() {
  const text = flowerInput.value.trim() || "Mi Sol 🌻";
  const icon = iconSelect.value;
  const angle = Math.random() * Math.PI * 2;

  createFlowerNode(text, icon, angle, nodes.length, `Mensaje dedicado: "${text}". ¡Eres mi universo! ❤️`);
  updateNodeRadii();
  flowerInput.value = "";
  flowerInput.blur();
}

addBtn.addEventListener('click', addCustomFlower);
flowerInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addCustomFlower();
});

petalRainBtn.addEventListener('click', () => {
  isRainActive = !isRainActive;
  petalRainBtn.style.background = isRainActive ? 'rgba(255, 215, 0, 0.4)' : 'rgba(255, 215, 0, 0.15)';
});

// Control de Música para Celular (Touch/Clic)
function toggleMusic() {
  if (bgMusic.paused) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      audioBtn.innerText = '⏸️ Pausar';
      audioBtn.style.background = 'rgba(255, 215, 0, 0.5)';
    }).catch(() => {
      alert("Recuerda guardar la canción con el nombre 'flores.mp3' en la misma carpeta.");
    });
  } else {
    bgMusic.pause();
    isAudioPlaying = false;
    audioBtn.innerText = '🎵 Música';
    audioBtn.style.background = 'rgba(255, 215, 0, 0.15)';
  }
}

audioBtn.addEventListener('click', toggleMusic);

// Activar audio automáticamente con el primer toque en pantalla en Android/iPhone
const startAudioOnTouch = () => {
  if (bgMusic.paused && !isAudioPlaying) {
    bgMusic.play().then(() => {
      isAudioPlaying = true;
      audioBtn.innerText = '⏸️ Pausar';
      audioBtn.style.background = 'rgba(255, 215, 0, 0.5)';
    }).catch(() => {});
  }
};

window.addEventListener('touchstart', startAudioOnTouch, { once: true });
window.addEventListener('click', startAudioOnTouch, { once: true });