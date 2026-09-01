/**
 * Master Application Orchestrator for 3D Spatial Portfolio
 * Controls Terminal, Audio Synthesizer, Modals, and Resume Download
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Terminal
  if (window.initTerminal) {
    window.initTerminal();
  }

  // 2. Audio button binding
  const soundBtn = document.getElementById('sound-toggle-btn');
  if (soundBtn) {
    updateSoundBtnIcon(soundBtn);
    soundBtn.addEventListener('click', () => {
      const enabled = window.soundEngine ? window.soundEngine.toggle() : false;
      updateSoundBtnIcon(soundBtn);
    });
  }

  // 3. Resume Download Buttons
  const resumeBtns = document.querySelectorAll('.download-resume-action');
  resumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadResume();
    });
  });

  // 4. Smooth Anchor Navigation Scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.soundEngine) window.soundEngine.playClick();
      }
    });
  });
});

function updateSoundBtnIcon(btn) {
  const isMuted = !window.soundEngine || !window.soundEngine.enabled;
  btn.innerHTML = isMuted 
    ? '<i class="ti ti-volume-3"></i>' 
    : '<i class="ti ti-volume"></i>';
  btn.title = isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects';
}

/**
 * Resume Download Action
 */
window.downloadResume = function() {
  if (window.soundEngine) window.soundEngine.playGameBeep();
  
  const resumeWindow = window.open('', '_blank');
  if (!resumeWindow) return;
  resumeWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Tarun R — AI & ML Infrastructure Resume</title>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #111; line-height: 1.6; max-width: 800px; margin: 0 auto; }
        h1 { margin: 0; font-size: 28px; color: #7c3aed; }
        h2 { font-size: 16px; border-bottom: 2px solid #7c3aed; padding-bottom: 4px; margin-top: 24px; text-transform: uppercase; }
        .sub { color: #555; font-size: 14px; margin-bottom: 20px; }
        .item { margin-bottom: 15px; }
        .item h3 { margin: 0; font-size: 15px; }
        .item p { margin: 4px 0 0; font-size: 13px; color: #444; }
        .tag { display: inline-block; background: #eee; padding: 2px 8px; border-radius: 4px; font-size: 11px; margin-right: 4px; }
      </style>
    </head>
    <body>
      <h1>TARUN R</h1>
      <div class="sub">B.E. Computer Science (AI & ML) | Sri Krishna College of Technology | Coimbatore, TN<br>Email: tarunsanjay1910@gmail.com | Phone: +91 94896 60152 | GitHub: github.com/iam-tarun-86</div>

      <h2>Technical Arsenal</h2>
      <p><strong>AI & LLMs:</strong> llama.cpp, Ollama, LangGraph, LangChain, LlamaIndex, PyTorch, TensorFlow, Hugging Face</p>
      <p><strong>Systems & Backend:</strong> Python, FastAPI, Flask, Docker, Linux, CUDA Core Optimization</p>

      <h2>Featured Projects</h2>
      <div class="item">
        <h3>Local AI Security Log Analyzer</h3>
        <p>Offline SIEM automated forensic triage pipeline. Employs 3-node LangGraph logic routing (Ingest ➔ Classify ➔ Route) with llama.cpp quantization for zero cloud API costs and air-gapped compliance.</p>
      </div>

      <div class="item">
        <h3>Hybrid Vector & Keyword RAG Engine</h3>
        <p>Sub-millisecond retrieval engine combining BM25 keyword matching and dense vector embeddings with Reciprocal Rank Fusion (RRF) and LanceDB embedded database.</p>
      </div>

      <div class="item">
        <h3>TensorRT Edge Vision Classifier</h3>
        <p>Compiled FP16/INT8 deep learning vision models optimized with NVIDIA TensorRT execution providers, achieving 180+ FPS on edge camera streams.</p>
      </div>

      <h2>Certifications</h2>
      <p>• Google &mdash; Prompting Essentials & Introduction to AI</p>
      <p>• Johns Hopkins University &mdash; Advanced Statistical Methods & Computational Probability Models</p>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `);
  resumeWindow.document.close();
};
