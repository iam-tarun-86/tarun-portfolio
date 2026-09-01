/**
 * Multi-Mode Dynamic Canvas Background Engine
 * Adapts to Finlytic, Epoch, AKOR, Ember, and Matrix modes
 */

class BackgroundEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.matrixChars = [];
    this.mode = 'finlytic';
    this.mouse = { x: null, y: null, radius: 120 };
    this.radarAngle = 0;
    this.matrixColumns = 0;
    this.matrixDrops = [];

    this.resize();
    this.bindEvents();
    this.initMode(this.mode);
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.initMode(this.mode);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  setMode(newMode) {
    this.mode = newMode;
    this.initMode(newMode);
  }

  initMode(mode) {
    this.particles = [];
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (mode === 'matrix') {
      const fontSize = 14;
      this.matrixColumns = Math.floor(w / fontSize);
      this.matrixDrops = Array(this.matrixColumns).fill(1);
      return;
    }

    if (mode === 'finlytic') {
      const count = Math.min(Math.floor((w * h) / 18000), 70);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          baseX: Math.random() * w,
          baseY: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2.5 + 1,
          color: Math.random() > 0.5 ? '139, 92, 246' : '6, 182, 212', // Violet / Cyan
          density: Math.random() * 20 + 5
        });
      }
    } else if (mode === 'epoch') {
      const count = Math.min(Math.floor((w * h) / 22000), 50);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.8,
          vy: (Math.random() - 0.5) * 0.8,
          size: 2,
          color: '14, 165, 233' // Neon Blue
        });
      }
    } else if (mode === 'ember') {
      const count = Math.min(Math.floor((w * h) / 20000), 45);
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3,
          vy: -Math.random() * 0.5 - 0.1, // Floating upwards like embers
          size: Math.random() * 2 + 1,
          color: Math.random() > 0.6 ? '245, 158, 11' : '236, 72, 153', // Amber / Rose
          alpha: Math.random() * 0.6 + 0.2
        });
      }
    }
  }

  animate() {
    requestAnimationFrame(this.animate);
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    if (this.mode === 'game') {
      ctx.clearRect(0, 0, w, h);
      return;
    }

    if (this.mode === 'matrix') {
      ctx.fillStyle = 'rgba(5, 5, 8, 0.08)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#10b981';
      ctx.font = '14px "Fira Code", monospace';

      const chars = '01TARUNSKCTAI4060CUDA';
      for (let i = 0; i < this.matrixDrops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        ctx.fillText(text, i * 14, this.matrixDrops[i] * 14);
        if (this.matrixDrops[i] * 14 > h && Math.random() > 0.975) {
          this.matrixDrops[i] = 0;
        }
        this.matrixDrops[i]++;
      }
      return;
    }

    ctx.clearRect(0, 0, w, h);

    if (this.mode === 'akor') {
      // Sweeping radar scan in center
      this.radarAngle += 0.015;
      const centerX = w / 2;
      const centerY = h / 2;
      const maxRadius = Math.min(w, h) * 0.45;

      // Radar rings
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.08)';
      ctx.lineWidth = 1;
      for (let r = 50; r <= maxRadius; r += 70) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar Sweep Cone
      const grad = ctx.createConicGradient(this.radarAngle, centerX, centerY);
      grad.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
      grad.addColorStop(0.1, 'rgba(16, 185, 129, 0)');
      grad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius, 0, Math.PI * 2);
      ctx.fill();
      return;
    }

    // Particle-based modes (Finlytic, Epoch, Ember)
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Cursor interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = this.mouse.x - p.x;
        const dy = this.mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.mouse.radius) {
          const force = (this.mouse.radius - dist) / this.mouse.radius;
          p.x -= (dx / dist) * force * 5;
          p.y -= (dy / dist) * force * 5;
        }
      }

      // Render Particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha || 0.4})`;
      ctx.fill();

      // Epoch Network Lines connecting nearby nodes
      if (this.mode === 'epoch') {
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(14, 165, 233, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    }
  }
}

window.initBackgroundEngine = function() {
  window.bgEngine = new BackgroundEngine('bg-canvas');
};
