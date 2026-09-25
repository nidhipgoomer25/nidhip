/* ============================================================
   RANDOMVERSE - Procedural Engine, Web Audio Synth, & Arcade
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // -------------------------------------------------------------
  // 1. Audio Engine (Web Audio API)
  // -------------------------------------------------------------
  let audioCtx = null;
  let audioEnabled = true;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSynth(type) {
    if (!audioEnabled) return;
    initAudio();
    if (!audioCtx) return;

    const now = audioCtx.currentTime;

    switch (type) {
      case 'laser': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case 'bass': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
        break;
      }
      case 'arpeggio': {
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25];
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          const noteTime = now + idx * 0.06;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, noteTime);
          gain.gain.setValueAtTime(0.15, noteTime);
          gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.12);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(noteTime);
          osc.stop(noteTime + 0.12);
        });
        break;
      }
      case 'warp': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
        break;
      }
      case 'powerup': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.2);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.2);
        break;
      }
      case 'glitch': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(600 + Math.random() * 800, now);
        osc.frequency.setValueAtTime(200 + Math.random() * 400, now + 0.05);
        osc.frequency.setValueAtTime(900 + Math.random() * 600, now + 0.1);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case 'click': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }
      case 'hit': {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      }
    }
  }

  // Audio Toggle Button
  const audioToggleBtn = document.getElementById('audio-toggle-btn');
  if (audioToggleBtn) {
    audioToggleBtn.addEventListener('click', () => {
      initAudio();
      audioEnabled = !audioEnabled;
      audioToggleBtn.querySelector('.icon').textContent = audioEnabled ? '🔊' : '🔇';
      audioToggleBtn.querySelector('.label').textContent = audioEnabled ? 'AUDIO ON' : 'AUDIO MUTED';
      showToast(audioEnabled ? 'Sound synthesizer enabled' : 'Sound synthesizer muted');
    });
  }

  // Synth Pad triggers
  document.querySelectorAll('.synth-pad').forEach(pad => {
    pad.addEventListener('click', () => {
      const soundType = pad.getAttribute('data-sound');
      playSynth(soundType);
      pad.classList.add('active');
      setTimeout(() => pad.classList.remove('active'), 180);
    });
  });

  const randomSoundBtn = document.getElementById('random-sound-btn');
  if (randomSoundBtn) {
    randomSoundBtn.addEventListener('click', () => {
      initAudio();
      const soundTypes = ['laser', 'bass', 'arpeggio', 'warp', 'powerup', 'glitch'];
      const sequence = [
        soundTypes[Math.floor(Math.random() * soundTypes.length)],
        soundTypes[Math.floor(Math.random() * soundTypes.length)],
        soundTypes[Math.floor(Math.random() * soundTypes.length)],
      ];
      sequence.forEach((s, idx) => {
        setTimeout(() => playSynth(s), idx * 160);
      });
      showToast('🎶 Random Chiptune Composed!');
    });
  }

  // -------------------------------------------------------------
  // 2. Interactive Background Particle Canvas
  // -------------------------------------------------------------
  const bgCanvas = document.getElementById('bg-canvas');
  const bgCtx = bgCanvas ? bgCanvas.getContext('2d') : null;
  let particles = [];
  const PARTICLE_COUNT = 70;
  let mouseX = -1000;
  let mouseY = -1000;
  let gravityAttract = true;

  function resizeBgCanvas() {
    if (!bgCanvas) return;
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeBgCanvas);
  resizeBgCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * bgCanvas.width;
      this.y = Math.random() * bgCanvas.height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.2 + 1;
      this.baseAlpha = Math.random() * 0.5 + 0.2;
      this.hue = Math.random() > 0.5 ? 185 : 280; // cyan or purple
    }
    update() {
      // Mouse gravity interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 180 && dist > 1) {
        const force = (180 - dist) / 180 * 0.05;
        const angle = Math.atan2(dy, dx);
        if (gravityAttract) {
          this.vx += Math.cos(angle) * force;
          this.vy += Math.sin(angle) * force;
        } else {
          this.vx -= Math.cos(angle) * force * 1.5;
          this.vy -= Math.sin(angle) * force * 1.5;
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Friction
      this.vx *= 0.985;
      this.vy *= 0.985;

      // Wrap around screen
      if (this.x < 0) this.x = bgCanvas.width;
      if (this.x > bgCanvas.width) this.x = 0;
      if (this.y < 0) this.y = bgCanvas.height;
      if (this.y > bgCanvas.height) this.y = 0;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${this.baseAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `hsl(${this.hue}, 95%, 60%)`;
      ctx.fill();
    }
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('click', (e) => {
    // Spawn supernova shockwave on background click
    if (e.target.tagName !== 'BUTTON' && e.target.tagName !== 'INPUT') {
      burstParticles(e.clientX, e.clientY);
    }
  });

  function burstParticles(cx, cy) {
    playSynth('click');
    particles.forEach(p => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.max(0, (300 - dist) / 300) * 12;
      p.vx += (dx / dist) * force;
      p.vy += (dy / dist) * force;
    });
  }

  function renderBg() {
    if (!bgCtx) return;
    bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);

    // Draw connecting lines between nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          const alpha = (1 - dist / 110) * 0.15;
          bgCtx.beginPath();
          bgCtx.moveTo(particles[i].x, particles[i].y);
          bgCtx.lineTo(particles[j].x, particles[j].y);
          bgCtx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          bgCtx.lineWidth = 0.8;
          bgCtx.shadowBlur = 0;
          bgCtx.stroke();
        }
      }
    }

    particles.forEach(p => {
      p.update();
      p.draw(bgCtx);
    });

    requestAnimationFrame(renderBg);
  }
  requestAnimationFrame(renderBg);

  // Background Control Buttons
  const scatterBtn = document.getElementById('scatter-particles-btn');
  if (scatterBtn) {
    scatterBtn.addEventListener('click', () => {
      burstParticles(window.innerWidth / 2, window.innerHeight / 2);
      playSynth('warp');
      showToast('💥 Supernova Shockwave unleashed!');
    });
  }

  const gravityBtn = document.getElementById('gravity-toggle-btn');
  if (gravityBtn) {
    gravityBtn.addEventListener('click', () => {
      gravityAttract = !gravityAttract;
      gravityBtn.textContent = gravityAttract ? '🧲 Gravity: Attract' : '💨 Gravity: Repel';
      playSynth('click');
      showToast(gravityAttract ? 'Swarm mode: Attract' : 'Swarm mode: Repel');
    });
  }

  const resetParticlesBtn = document.getElementById('reset-particles-btn');
  if (resetParticlesBtn) {
    resetParticlesBtn.addEventListener('click', () => {
      initParticles();
      playSynth('bass');
      showToast('🔄 Particle Swarm Re-seeded');
    });
  }

  // -------------------------------------------------------------
  // 3. Cyber Reflex Arcade Game
  // -------------------------------------------------------------
  const gameCanvas = document.getElementById('game-canvas');
  const gameCtx = gameCanvas ? gameCanvas.getContext('2d') : null;
  const gameOverlay = document.getElementById('game-overlay');
  const startGameBtn = document.getElementById('start-game-btn');
  const currentScoreVal = document.getElementById('current-score-val');
  const highScoreVal = document.getElementById('high-score-val');
  const gameTimerVal = document.getElementById('game-timer-val');
  const overlayTitle = document.getElementById('overlay-title');
  const overlayDesc = document.getElementById('overlay-desc');

  let gameState = 'idle'; // 'idle', 'playing', 'ended'
  let gameScore = 0;
  let gameTimeLeft = 30;
  let gameTimerInterval = null;
  let targets = [];
  let nextTargetSpawn = 0;
  let savedHighScore = parseInt(localStorage.getItem('randomverse_highscore') || '0', 10);
  if (highScoreVal) highScoreVal.textContent = savedHighScore;

  class GameTarget {
    constructor(w, h) {
      this.radius = Math.random() * 12 + 20; // 20 - 32px
      this.x = this.radius + Math.random() * (w - this.radius * 2);
      this.y = this.radius + Math.random() * (h - this.radius * 2);
      this.lifetime = 2400; // ms
      this.born = Date.now();
      this.hue = Math.random() > 0.4 ? 330 : 185; // neon pink or cyan
      this.isBonus = Math.random() < 0.2;
      if (this.isBonus) {
        this.hue = 50; // gold
        this.radius *= 0.8;
      }
    }
    draw(ctx) {
      const elapsed = Date.now() - this.born;
      const progress = 1 - Math.min(1, elapsed / this.lifetime);

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 55%, 0.3)`;
      ctx.fill();

      // Countdown outer ring
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * progress);
      ctx.lineWidth = 4;
      ctx.strokeStyle = `hsl(${this.hue}, 100%, 65%)`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
      ctx.stroke();

      // Inner dot
      ctx.beginPath();
      ctx.arc(this.x, this.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
    }
    isHit(mx, my) {
      const dx = mx - this.x;
      const dy = my - this.y;
      return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
  }

  function resizeGameCanvas() {
    if (!gameCanvas) return;
    const rect = gameCanvas.parentElement.getBoundingClientRect();
    gameCanvas.width = rect.width;
    gameCanvas.height = rect.height;
  }
  window.addEventListener('resize', resizeGameCanvas);
  setTimeout(resizeGameCanvas, 100);

  function startGame() {
    resizeGameCanvas();
    gameState = 'playing';
    gameScore = 0;
    gameTimeLeft = 30;
    targets = [];
    currentScoreVal.textContent = '0';
    gameTimerVal.textContent = '30s';
    gameOverlay.classList.add('hidden');
    playSynth('powerup');

    if (gameTimerInterval) clearInterval(gameTimerInterval);
    gameTimerInterval = setInterval(() => {
      gameTimeLeft--;
      gameTimerVal.textContent = gameTimeLeft + 's';
      if (gameTimeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function endGame() {
    gameState = 'ended';
    clearInterval(gameTimerInterval);
    playSynth('warp');

    if (gameScore > savedHighScore) {
      savedHighScore = gameScore;
      localStorage.setItem('randomverse_highscore', savedHighScore.toString());
      if (highScoreVal) highScoreVal.textContent = savedHighScore;
      showToast(`🏆 NEW ALL-TIME HIGH SCORE: ${savedHighScore}!`);
    }

    overlayTitle.textContent = 'TIME OVER!';
    overlayDesc.textContent = `You scored ${gameScore} points! Synaptic agility level: ${gameScore > 35 ? 'CYBER DEMON' : gameScore > 20 ? 'NETRUNNER' : 'STREET ROOKIE'}.`;
    startGameBtn.textContent = 'PLAY AGAIN';
    gameOverlay.classList.remove('hidden');
  }

  function renderGame() {
    if (gameCtx && gameCanvas) {
      gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

      if (gameState === 'playing') {
        const now = Date.now();
        if (now > nextTargetSpawn && targets.length < 5) {
          targets.push(new GameTarget(gameCanvas.width, gameCanvas.height));
          nextTargetSpawn = now + (Math.random() * 400 + 400);
        }

        // Expire targets
        targets = targets.filter(t => now - t.born < t.lifetime);

        targets.forEach(t => t.draw(gameCtx));
      }
    }
    requestAnimationFrame(renderGame);
  }
  requestAnimationFrame(renderGame);

  if (gameCanvas) {
    gameCanvas.addEventListener('mousedown', (e) => {
      if (gameState !== 'playing') return;
      const rect = gameCanvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let hitAny = false;
      for (let i = targets.length - 1; i >= 0; i--) {
        if (targets[i].isHit(mx, my)) {
          const hitTarget = targets[i];
          targets.splice(i, 1);
          hitAny = true;
          const points = hitTarget.isBonus ? 5 : 1;
          gameScore += points;
          currentScoreVal.textContent = gameScore;
          playSynth(hitTarget.isBonus ? 'arpeggio' : 'hit');
          burstParticles(e.clientX, e.clientY);
          break;
        }
      }
      if (!hitAny) {
        playSynth('glitch');
      }
    });
  }

  if (startGameBtn) {
    startGameBtn.addEventListener('click', startGame);
  }

  // -------------------------------------------------------------
  // 4. Color Palette Alchemy
  // -------------------------------------------------------------
  const paletteDisplay = document.getElementById('palette-display');
  const genPaletteBtn = document.getElementById('gen-palette-btn');
  const copyGradientBtn = document.getElementById('copy-css-gradient-btn');
  let currentPalette = [];

  function generateRandomHex() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function generateHarmoniousPalette() {
    const baseHue = Math.floor(Math.random() * 360);
    const mode = Math.floor(Math.random() * 3); // 0: analogous, 1: triadic, 2: cyber vibrant
    const palette = [];

    for (let i = 0; i < 5; i++) {
      let hue;
      let sat = Math.floor(Math.random() * 25 + 75); // 75-100%
      let light = Math.floor(Math.random() * 30 + 45); // 45-75%

      if (mode === 0) {
        hue = (baseHue + i * 25) % 360;
      } else if (mode === 1) {
        hue = (baseHue + (i % 3) * 120 + i * 15) % 360;
      } else {
        hue = (baseHue + i * 72) % 360;
      }

      palette.push(hslToHex(hue, sat, light));
    }
    return palette;
  }

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    const toHex = x => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`.toUpperCase();
  }

  function renderPalette() {
    currentPalette = generateHarmoniousPalette();
    if (!paletteDisplay) return;
    paletteDisplay.innerHTML = '';

    currentPalette.forEach((hex) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.backgroundColor = hex;
      swatch.title = `Click to copy ${hex}`;

      const hexLabel = document.createElement('span');
      hexLabel.className = 'swatch-hex';
      hexLabel.textContent = hex;
      swatch.appendChild(hexLabel);

      swatch.addEventListener('click', () => {
        copyToClipboard(hex);
        playSynth('click');
        showToast(`Copied ${hex} to clipboard!`);
      });

      paletteDisplay.appendChild(swatch);
    });
  }

  if (genPaletteBtn) {
    genPaletteBtn.addEventListener('click', () => {
      renderPalette();
      playSynth('laser');
      showToast('🎨 New color spectrum generated');
    });
  }

  if (copyGradientBtn) {
    copyGradientBtn.addEventListener('click', () => {
      if (currentPalette.length >= 2) {
        const cssGradient = `linear-gradient(135deg, ${currentPalette[0]} 0%, ${currentPalette[2]} 50%, ${currentPalette[4]} 100%);`;
        copyToClipboard(`background: ${cssGradient}`);
        playSynth('powerup');
        showToast('📋 Copied CSS gradient to clipboard!');
      }
    });
  }

  renderPalette();

  // -------------------------------------------------------------
  // 5. Cyberpunk Identity Forge
  // -------------------------------------------------------------
  const personaAvatar = document.getElementById('persona-avatar');
  const personaName = document.getElementById('persona-name');
  const personaRole = document.getElementById('persona-role');
  const personaTags = document.getElementById('persona-tags');
  const personaStats = document.getElementById('persona-stats');
  const genPersonaBtn = document.getElementById('gen-persona-btn');

  const avatars = ['🦾', '⚡', '🥽', '🕶️', '🧬', '🤖', '🔮', '🛸', '🛰️', '📡', '👾', '🔥'];
  const firstNames = ['Vesper', 'Kael', 'Nova', 'Echo', 'Zara', 'Orion', 'Sable', 'Nyx', 'Dante', 'Raven', 'Cipher', 'Valkyrie'];
  const handles = ['"Ghost"', '"Zero"', '"Phantasm"', '"Neon"', '"Glitch"', '"Pulse"', '"Static"', '"Specter"', '"Vapor"', '"Apex"'];
  const lastNames = ['Sterling', 'Vance', 'Cross', 'Mercer', 'Blackwood', 'Chen', 'Volkov', 'Kovacs', 'Winter', 'Tanaka'];
  const roles = [
    'Level 5 Neural Cryptographer',
    'Quantum Grid Smuggler',
    'Deep Matrix Architect',
    'Bio-Synthetic Specialist',
    'Underground AI Whisperer',
    'Hyper-Orbital Courier',
    'High-Frequency Netrunner',
    'Cybernetic Surgeon'
  ];
  const allTags = ['Sector 9', 'Augmented', 'Night Owl', 'Overclocked', 'Rogue AI Ally', 'High Altitude', 'Black Market', 'Cryo-Adapted', 'Bionic Core'];

  function rollPersona() {
    const avatar = avatars[Math.floor(Math.random() * avatars.length)];
    const fullName = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${handles[Math.floor(Math.random() * handles.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    const role = roles[Math.floor(Math.random() * roles.length)];

    // 3 random unique tags
    const shuffledTags = [...allTags].sort(() => 0.5 - Math.random()).slice(0, 3);

    if (personaAvatar) personaAvatar.textContent = avatar;
    if (personaName) personaName.textContent = fullName;
    if (personaRole) personaRole.textContent = role;

    if (personaTags) {
      personaTags.innerHTML = '';
      shuffledTags.forEach(t => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = t;
        personaTags.appendChild(span);
      });
    }

    // Stats
    const stats = [
      { name: 'Neural Overclock', val: Math.floor(Math.random() * 45 + 55) },
      { name: 'Firewall Breach', val: Math.floor(Math.random() * 50 + 50) },
      { name: 'Stealth Infiltration', val: Math.floor(Math.random() * 40 + 60) },
      { name: 'Synthetic Synergy', val: Math.floor(Math.random() * 60 + 40) },
    ];

    if (personaStats) {
      personaStats.innerHTML = '';
      stats.forEach(st => {
        const row = document.createElement('div');
        row.className = 'stat-row';
        row.innerHTML = `
          <div class="stat-label-wrap">
            <span>${st.name}</span>
            <span>${st.val}%</span>
          </div>
          <div class="stat-bar-track">
            <div class="stat-bar-fill" style="width: 0%"></div>
          </div>
        `;
        personaStats.appendChild(row);
        // Animate width
        setTimeout(() => {
          row.querySelector('.stat-bar-fill').style.width = `${st.val}%`;
        }, 50);
      });
    }
  }

  if (genPersonaBtn) {
    genPersonaBtn.addEventListener('click', () => {
      rollPersona();
      playSynth('glitch');
      showToast('⚡ Identity Matrix re-forged');
    });
  }
  rollPersona();

  // -------------------------------------------------------------
  // 6. Cosmic Oracle / Wisdom Seed
  // -------------------------------------------------------------
  const oracleQuote = document.getElementById('oracle-quote');
  const oracleSeed = document.getElementById('oracle-seed');
  const newOracleBtn = document.getElementById('new-oracle-btn');
  const copyQuoteBtn = document.getElementById('copy-quote-btn');

  const truths = [
    "The universe doesn't calculate the odds before unfolding.",
    "Chaos is merely an unindexed hyper-dimensional database.",
    "True innovation occurs in the static between planned frequencies.",
    "Every glitch is an evolutionary shortcut waiting to be deciphered.",
    "The quickest route through the matrix is to bend the destination.",
    "Randomness is the only truly unbiased algorithm in existence.",
    "Quiet minds perceive the subtle echoes of tomorrow's signal.",
    "To forge something extraordinary, discard yesterday's blue-prints.",
    "Quantum superposition proves you have already succeeded in another timeline."
  ];

  function rollOracle() {
    const seed = Math.floor(Math.random() * 900000 + 100000);
    const quote = truths[Math.floor(Math.random() * truths.length)];
    if (oracleSeed) oracleSeed.textContent = `SEED #${seed}`;
    if (oracleQuote) {
      oracleQuote.style.opacity = '0';
      setTimeout(() => {
        oracleQuote.textContent = `"${quote}"`;
        oracleQuote.style.opacity = '1';
      }, 150);
    }
  }

  if (newOracleBtn) {
    newOracleBtn.addEventListener('click', () => {
      rollOracle();
      playSynth('laser');
    });
  }

  if (copyQuoteBtn) {
    copyQuoteBtn.addEventListener('click', () => {
      if (oracleQuote) {
        copyToClipboard(oracleQuote.textContent);
        playSynth('click');
        showToast('📜 Oracle quote copied!');
      }
    });
  }
  rollOracle();

  // -------------------------------------------------------------
  // 7. Daily Micro-Quests
  // -------------------------------------------------------------
  const questType = document.getElementById('quest-type');
  const questTitle = document.getElementById('quest-title');
  const questDiff = document.getElementById('quest-diff');
  const questXp = document.getElementById('quest-xp');
  const genQuestBtn = document.getElementById('gen-quest-btn');
  const completeQuestBtn = document.getElementById('complete-quest-btn');

  const questList = [
    { type: 'NEURAL DRILL', title: 'Learn 3 facts about orbital satellite propulsion.', diff: 'Easy', xp: '+100 XP' },
    { type: 'CREATIVE EXPEDITION', title: 'Sketch a fictional corporate logo for a martian water monopoly.', diff: 'Medium', xp: '+250 XP' },
    { type: 'PHYSICAL PROTOCOL', title: 'Drop and execute 20 push-ups or 1 minute plank right now.', diff: 'Hard', xp: '+400 XP' },
    { type: 'DIGITAL HYGIENE', title: 'Unsubscribe from 5 newsletter emails that clutter your stream.', diff: 'Easy', xp: '+120 XP' },
    { type: 'AUDIO FREQUENCY', title: 'Listen to an entirely new ambient synth track with closed eyes.', diff: 'Chill', xp: '+150 XP' },
    { type: 'SYNTACTIC CRAFT', title: 'Write a 4-line cyberpunk haiku about artificial intelligence.', diff: 'Medium', xp: '+220 XP' }
  ];

  function rollQuest() {
    const q = questList[Math.floor(Math.random() * questList.length)];
    if (questType) questType.textContent = q.type;
    if (questTitle) questTitle.textContent = `"${q.title}"`;
    if (questDiff) questDiff.textContent = q.diff;
    if (questXp) questXp.textContent = q.xp;
  }

  if (genQuestBtn) {
    genQuestBtn.addEventListener('click', () => {
      rollQuest();
      playSynth('click');
    });
  }

  if (completeQuestBtn) {
    completeQuestBtn.addEventListener('click', () => {
      playSynth('powerup');
      showToast('🎉 Quest Completed! Karma & XP added to profile.');
      rollQuest();
    });
  }
  rollQuest();

  // -------------------------------------------------------------
  // 8. Theme Randomizer
  // -------------------------------------------------------------
  const themeDiceBtn = document.getElementById('theme-dice-btn');
  const themes = [
    {
      name: 'Cyberpunk Neon',
      bgPrimary: '#0a0b10',
      bgSecondary: '#121420',
      accentCyan: '#00f2fe',
      accentPink: '#ff007f'
    },
    {
      name: 'Synthwave Sunset',
      bgPrimary: '#13091e',
      bgSecondary: '#210d35',
      accentCyan: '#f72585',
      accentPink: '#7209b7'
    },
    {
      name: 'Emerald Matrix',
      bgPrimary: '#05130b',
      bgSecondary: '#092113',
      accentCyan: '#10b981',
      accentPink: '#34d399'
    },
    {
      name: 'Solar Flare',
      bgPrimary: '#170c04',
      bgSecondary: '#291407',
      accentCyan: '#f59e0b',
      accentPink: '#ef4444'
    }
  ];

  let currentThemeIdx = 0;
  if (themeDiceBtn) {
    themeDiceBtn.addEventListener('click', () => {
      currentThemeIdx = (currentThemeIdx + 1) % themes.length;
      const t = themes[currentThemeIdx];
      document.documentElement.style.setProperty('--bg-primary', t.bgPrimary);
      document.documentElement.style.setProperty('--bg-secondary', t.bgSecondary);
      document.documentElement.style.setProperty('--accent-cyan', t.accentCyan);
      document.documentElement.style.setProperty('--accent-pink', t.accentPink);
      playSynth('warp');
      showToast(`🌌 Atmosphere shifted: ${t.name}`);
    });
  }

  // -------------------------------------------------------------
  // Utilities
  // -------------------------------------------------------------
  function copyToClipboard(text) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
  }

  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }
});
