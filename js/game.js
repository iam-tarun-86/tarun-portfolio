/**
 * 2D Cyberpunk AI Lab RPG & Interactive Arcade Engine
 * Top-down canvas adventure featuring WASD/Arrow/Touch controls, interactive terminals, and GGUF shard quests!
 */

class CyberpunkGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.active = false;

    // Game dimensions
    this.width = 900;
    this.height = 600;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    // Player state
    this.player = {
      x: 450,
      y: 300,
      size: 24,
      speed: 3.5,
      direction: 'down',
      animFrame: 0,
      shardsCollected: 0
    };

    // Input state
    this.keys = {
      up: false,
      down: false,
      left: false,
      right: false,
      interact: false
    };

    // Interactive Terminals & Pods
    this.terminals = [
      { id: 'projects', x: 200, y: 150, width: 60, height: 60, title: 'PROJECTS_VAULT', color: '#10b981', icon: '💻' },
      { id: 'skills', x: 700, y: 150, width: 60, height: 60, title: 'SKILLS_REACTOR', color: '#0ea5e9', icon: '⚡' },
      { id: 'certs', x: 200, y: 450, width: 60, height: 60, title: 'CERTS_ARCHIVE', color: '#f59e0b', icon: '🏆' },
      { id: 'contact', x: 700, y: 450, width: 60, height: 60, title: 'COMM_UPLINK', color: '#ec4899', icon: '📡' },
      { id: 'core', x: 450, y: 120, width: 70, height: 70, title: 'QUANTUM_CORE', color: '#a855f7', icon: '🔮' }
    ];

    // Collectible GGUF Quantization Shards
    this.shards = [
      { x: 330, y: 220, collected: false },
      { x: 570, y: 220, collected: false },
      { x: 330, y: 380, collected: false },
      { x: 570, y: 380, collected: false },
      { x: 450, y: 460, collected: false }
    ];

    this.nearTerminal = null;
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.active) return;
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.up = true;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.down = true;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = true;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = true;
      if (['KeyE', 'Space', 'Enter'].includes(e.code)) {
        this.handleInteraction();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) this.keys.up = false;
      if (['KeyS', 'ArrowDown'].includes(e.code)) this.keys.down = false;
      if (['KeyA', 'ArrowLeft'].includes(e.code)) this.keys.left = false;
      if (['KeyD', 'ArrowRight'].includes(e.code)) this.keys.right = false;
    });

    // Touch Virtual D-pad
    const bindTouch = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('touchstart', (e) => { e.preventDefault(); this.keys[key] = true; });
      el.addEventListener('touchend', (e) => { e.preventDefault(); this.keys[key] = false; });
    };

    bindTouch('dpad-up', 'up');
    bindTouch('dpad-down', 'down');
    bindTouch('dpad-left', 'left');
    bindTouch('dpad-right', 'right');

    const actBtn = document.getElementById('virtual-action-btn');
    if (actBtn) {
      actBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.handleInteraction();
      });
    }
  }

  start() {
    this.active = true;
    this.loop();
  }

  stop() {
    this.active = false;
  }

  handleInteraction() {
    if (this.nearTerminal) {
      if (window.soundEngine) window.soundEngine.playGameBeep();
      this.triggerTerminalAction(this.nearTerminal);
    }
  }

  triggerTerminalAction(term) {
    if (term.id === 'projects') {
      window.openProjectModal && window.openProjectModal();
    } else if (term.id === 'skills') {
      window.openSkillsModal && window.openSkillsModal();
    } else if (term.id === 'certs') {
      window.openCertsModal && window.openCertsModal();
    } else if (term.id === 'contact') {
      window.openContactModal && window.openContactModal();
    } else if (term.id === 'core') {
      this.showDialogue("TARUN_AI // QUANTUM CORE", "Welcome to my AI Infrastructure Command Station! I engineer localized, high-throughput machine learning pipelines and agentic LangGraph systems. Explore all pods to inspect my code and credentials!");
    }
  }

  showDialogue(speaker, text) {
    const box = document.getElementById('game-dialogue-box');
    const spkEl = document.getElementById('dialogue-speaker');
    const txtEl = document.getElementById('dialogue-text');
    if (box && spkEl && txtEl) {
      spkEl.innerText = speaker;
      txtEl.innerText = text;
      box.classList.add('active');
    }
  }

  closeDialogue() {
    const box = document.getElementById('game-dialogue-box');
    if (box) box.classList.remove('active');
  }

  update() {
    if (!this.active) return;

    let moveX = 0;
    let moveY = 0;

    if (this.keys.up) { moveY -= this.player.speed; this.player.direction = 'up'; }
    if (this.keys.down) { moveY += this.player.speed; this.player.direction = 'down'; }
    if (this.keys.left) { moveX -= this.player.speed; this.player.direction = 'left'; }
    if (this.keys.right) { moveX += this.player.speed; this.player.direction = 'right'; }

    // Normalize diagonal speed
    if (moveX !== 0 && moveY !== 0) {
      moveX *= 0.7071;
      moveY *= 0.7071;
    }

    this.player.x = Math.max(30, Math.min(this.width - 30, this.player.x + moveX));
    this.player.y = Math.max(30, Math.min(this.height - 30, this.player.y + moveY));

    if (moveX !== 0 || moveY !== 0) {
      this.player.animFrame += 0.15;
    }

    // Check Shard Collections
    this.shards.forEach((s) => {
      if (!s.collected && Math.hypot(this.player.x - s.x, this.player.y - s.y) < 25) {
        s.collected = true;
        this.player.shardsCollected++;
        if (window.soundEngine) window.soundEngine.playShardCollect();
        const hudShard = document.getElementById('hud-shards');
        if (hudShard) hudShard.innerText = `${this.player.shardsCollected}/5`;
      }
    });

    // Check Terminal Proximity
    this.nearTerminal = null;
    this.terminals.forEach((term) => {
      const dist = Math.hypot(this.player.x - (term.x + term.width / 2), this.player.y - (term.y + term.height / 2));
      if (dist < 65) {
        this.nearTerminal = term;
      }
    });
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // 1. Cyber Laboratory Floor Grid
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < this.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, this.height);
      ctx.stroke();
    }
    for (let y = 0; y < this.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(this.width, y);
      ctx.stroke();
    }

    // 2. Glowing Server Racks & Wall Borders
    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, this.width - 20, this.height - 20);

    // 3. Draw Terminals & Pods
    this.terminals.forEach((term) => {
      // Glow Aura
      ctx.shadowColor = term.color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#12131e';
      ctx.fillRect(term.x, term.y, term.width, term.height);

      ctx.strokeStyle = term.color;
      ctx.lineWidth = 2;
      ctx.strokeRect(term.x, term.y, term.width, term.height);
      ctx.shadowBlur = 0;

      // Icon & Label
      ctx.fillStyle = '#fff';
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(term.icon, term.x + term.width / 2, term.y + term.height / 2 + 8);

      ctx.fillStyle = term.color;
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillText(term.title, term.x + term.width / 2, term.y + term.height + 18);
    });

    // 4. Draw Collectible GGUF Shards
    this.shards.forEach((s) => {
      if (!s.collected) {
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#0ea5e9';
        ctx.beginPath();
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.arc(s.x, s.y, 6 + pulse, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    });

    // 5. Draw Player (Cyber Developer Avatar)
    ctx.shadowColor = '#a855f7';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#8b5cf6';
    ctx.beginPath();
    ctx.arc(this.player.x, this.player.y, this.player.size / 2, 0, Math.PI * 2);
    ctx.fill();

    // Directional visor
    ctx.fillStyle = '#06b6d4';
    ctx.beginPath();
    let vx = this.player.x;
    let vy = this.player.y;
    if (this.player.direction === 'up') vy -= 6;
    if (this.player.direction === 'down') vy += 6;
    if (this.player.direction === 'left') vx -= 6;
    if (this.player.direction === 'right') vx += 6;
    ctx.arc(vx, vy, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // 6. Proximity Interaction HUD Banner
    if (this.nearTerminal) {
      ctx.fillStyle = 'rgba(10, 12, 20, 0.9)';
      ctx.fillRect(this.player.x - 90, this.player.y - 45, 180, 24);
      ctx.strokeStyle = this.nearTerminal.color;
      ctx.lineWidth = 1;
      ctx.strokeRect(this.player.x - 90, this.player.y - 45, 180, 24);

      ctx.fillStyle = '#fff';
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('[E] ACCESS POD', this.player.x, this.player.y - 29);
    }
  }

  loop() {
    if (!this.active) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.loop());
  }
}

window.initGameEngine = function() {
  window.cyberGame = new CyberpunkGame('game-canvas');
};
