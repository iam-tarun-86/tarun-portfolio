/**
 * Pro Interactive Developer CLI & Terminal Engine
 * Supports Tab-Autocomplete, Up/Down History, Benchmarking, Matrix rain, and Game triggers
 */

class TerminalEngine {
  constructor(outputId, inputId) {
    this.outputEl = document.getElementById(outputId);
    this.inputEl = document.getElementById(inputId);
    this.history = [];
    this.historyIndex = -1;
    this.availableCommands = [
      'help',
      'cat bio.md',
      'ls projects/',
      'systemctl status',
      'curl contact/',
      'bench',
      'matrix',
      'play game',
      'download resume',
      'theme finlytic',
      'theme epoch',
      'theme akor',
      'theme ember',
      'clear'
    ];

    if (this.inputEl) {
      this.bindEvents();
    }
  }

  bindEvents() {
    this.inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = this.inputEl.value.trim();
        this.inputEl.value = '';
        if (cmd) {
          this.history.push(cmd);
          this.historyIndex = this.history.length;
          this.execute(cmd);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputEl.value = this.history[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputEl.value = this.history[this.historyIndex];
        } else {
          this.historyIndex = this.history.length;
          this.inputEl.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const current = this.inputEl.value.trim();
        if (current) {
          const match = this.availableCommands.find(c => c.startsWith(current));
          if (match) {
            this.inputEl.value = match;
          }
        }
      }
    });
  }

  execute(command) {
    if (window.soundEngine) window.soundEngine.playClick();
    this.print(`<span style="color:#10b981;">guest@skct-agent:~$</span> ${command}`);

    const norm = command.toLowerCase().trim();

    if (norm === 'clear' || norm === 'cls') {
      this.outputEl.innerHTML = '';
      return;
    }

    if (norm === 'help') {
      this.print(`
Available Shell Commands:
  <span style="color:#a855f7;">cat bio.md</span>          Generate AI Engineer introduction summary
  <span style="color:#a855f7;">ls projects/</span>        Inspect repository blueprints and architectures
  <span style="color:#a855f7;">systemctl status</span>    View active local daemon & RTX 4060 CUDA stats
  <span style="color:#a855f7;">bench</span>               Run in-browser WebGL tensor benchmark
  <span style="color:#a855f7;">matrix</span>              Toggle full-screen Matrix rain background
  <span style="color:#a855f7;">play game</span>           Launch interactive 2D Cyberpunk AI Lab RPG
  <span style="color:#a855f7;">download resume</span>     Download Tarun R's official resume PDF
  <span style="color:#a855f7;">curl contact/</span>       Output raw JSON endpoints
  <span style="color:#a855f7;">theme [name]</span>        Switch active theme (finlytic, epoch, akor, ember)
  <span style="color:#a855f7;">clear</span>               Clear screen buffer
      `);
      return;
    }

    if (norm === 'cat bio.md' || norm === 'bio') {
      this.print(`<span style="color:#38bdf8;">[SYSTEM]: Generating bio summary...</span>`);
      this.print(`"I'm Tarun R, a CSE (AI & ML) student at SKCT specializing in local LLM infrastructure, LangGraph agent pipelines, and high-throughput Python backends."`);
      return;
    }

    if (norm === 'ls projects/' || norm === 'projects' || norm === 'ls') {
      this.print(`
<span style="color:#94a3b8;">drwxr-xr-x 8 tarun staff 256B Sep 01 2026 .</span>
-rwxr-xr-x 1 tarun staff 4.2K <span style="color:#10b981;">local-ai-log-analyzer/</span> (Full-stack LangGraph SIEM + llama.cpp)
-rwxr-xr-x 1 tarun staff 3.8K <span style="color:#ef4444;">agent-sentinel/</span> (Zero-Trust Behavioral AI Agent Firewall)
-rwxr-xr-x 1 tarun staff 5.1K <span style="color:#a855f7;">Aegis/</span> (Privacy-Preserving Research Intelligence & RAG)
-rwxr-xr-x 1 tarun staff 3.2K <span style="color:#0ea5e9;">dockmind/</span> (Offline Document Analysis RAG + ChromaDB)
-rwxr-xr-x 1 tarun staff 2.9K <span style="color:#f59e0b;">fraudlens-lstm/</span> (Sequential Deep Learning Fraud Detection)
-rwxr-xr-x 1 tarun staff 3.5K <span style="color:#06b6d4;">carin/</span> (Intelligent In-Vehicle Vision & Voice AI Co-Pilot)
      `);
      return;
    }

    if (norm === 'systemctl status') {
      this.print(`
● skct-inference-daemon.service - Local LLM Engine Bridge
   Active: <span style="color:#10b981;">active (running)</span> since Mon 2026-08-31
   Hardware: NVIDIA GeForce RTX 4060 (8GB GDDR6)
   Backend: llama.cpp CUDA Kernel acceleration on port 8085
   Context Window: 8192 tokens (Flash Attention v2 enabled)
      `);
      return;
    }

    if (norm === 'bench') {
      this.runBenchmark();
      return;
    }

    if (norm === 'matrix') {
      if (window.bgEngine) {
        window.bgEngine.setMode('matrix');
        this.print(`<span style="color:#10b981;">[MATRIX RAIN ACTIVE]: Background canvas switched to cyber stream.</span>`);
      }
      return;
    }

    if (norm === 'play game' || norm === 'game') {
      if (window.switchPortfolioStyle) {
        window.switchPortfolioStyle('game');
      }
      return;
    }

    if (norm === 'download resume' || norm === 'resume') {
      if (window.downloadResume) {
        window.downloadResume();
        this.print(`<span style="color:#10b981;">[OK]: Resume download initiated.</span>`);
      }
      return;
    }

    if (norm.startsWith('theme ')) {
      const themeName = norm.replace('theme ', '').trim();
      if (['finlytic', 'epoch', 'akor', 'ember', 'game'].includes(themeName)) {
        window.switchPortfolioStyle(themeName);
        this.print(`<span style="color:#10b981;">[OK]: Theme switched to '${themeName}'.</span>`);
      } else {
        this.print(`<span style="color:#ef4444;">Invalid theme. Choose: finlytic, epoch, akor, ember, game</span>`);
      }
      return;
    }

    if (norm === 'curl contact/' || norm === 'contact') {
      this.print(`
<span style="color:#38bdf8;">{
  "name": "Tarun R",
  "role": "AI & ML Infrastructure Engineer",
  "college": "Sri Krishna College of Technology",
  "email": "tarunsanjay1910@gmail.com",
  "phone": "+91 94896 60152",
  "linkedin": "https://linkedin.com/in/tarun-r-ai-ml",
  "github": "https://github.com/iam-tarun-86"
}</span>
      `);
      return;
    }

    this.print(`<span style="color:#ef4444;">Command not found: '${command}'. Type 'help' for command list.</span>`);
  }

  print(html) {
    if (!this.outputEl) return;
    this.outputEl.innerHTML += `${html}<br>`;
    this.outputEl.scrollTop = this.outputEl.scrollHeight;
  }

  runBenchmark() {
    this.print(`<span style="color:#f59e0b;">[BENCHMARK]: Running 512x512 Float32 Matrix Multiplication in browser...</span>`);
    const size = 512;
    const start = performance.now();
    const a = new Float32Array(size * size).fill(1.5);
    const b = new Float32Array(size * size).fill(2.5);
    const c = new Float32Array(size * size);

    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        let sum = 0;
        for (let k = 0; k < size; k++) {
          sum += a[i * size + k] * b[k * size + j];
        }
        c[i * size + j] = sum;
      }
    }
    const duration = (performance.now() - start).toFixed(2);
    const gflops = ((2 * Math.pow(size, 3)) / (duration * 1e6)).toFixed(2);

    setTimeout(() => {
      this.print(`<span style="color:#10b981;">[BENCHMARK COMPLETE]: Completed in ${duration}ms (${gflops} GFLOPS). Ready for local client tensor workloads!</span>`);
      if (window.completeQuest) window.completeQuest('bench');
    }, 200);
  }
}

window.initTerminal = function() {
  window.terminalEngine = new TerminalEngine('cli-output', 'cli-input-field');
};
