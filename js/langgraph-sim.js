/**
 * Interactive 3-Node LangGraph SIEM Threat Pipeline Simulator
 * Visualizes (Ingest ➔ Classify [llama.cpp] ➔ Route [FastAPI]) in real-time
 */

class LangGraphSimulator {
  constructor() {
    this.presets = {
      ssh_brute: {
        name: "SSH Brute-Force Attack",
        raw: "POST /auth/ssh - IP: 185.220.101.5 - 450 failed logins in 10s - User: root",
        ingest: "Extracted: { ip: '185.220.101.5', rate: '45/sec', target: 'root' }",
        classify: "llama.cpp verdict: HIGH THREAT (Confidence: 99.4%) | MITRE ATT&CK T1110.001 (Brute Force)",
        route: "Action: Auto-injected iptables DROP rule for 185.220.101.5. Sent high-priority PagerDuty incident.",
        threatLevel: "CRITICAL",
        threatColor: "#ef4444"
      },
      sqli_attempt: {
        name: "SQL Injection Payload",
        raw: "GET /api/v1/users?id=1%27%20UNION%20SELECT%20username,%20password_hash%20FROM%20users--",
        ingest: "Extracted: URI query decode matched SQL keyword pattern [UNION, SELECT, --]",
        classify: "llama.cpp verdict: CRITICAL EXPLOIT (Confidence: 98.8%) | MITRE ATT&CK T1190 (Exploit Public-Facing App)",
        route: "Action: Cloudflare WAF rule updated. Request terminated with HTTP 403 Forbidden.",
        threatLevel: "CRITICAL",
        threatColor: "#ef4444"
      },
      benign_telemetry: {
        name: "Normal Health Check",
        raw: "GET /healthz - Client: Prometheus Scraper (10.0.4.12) - HTTP 200 OK - Latency: 1.2ms",
        ingest: "Extracted: Standard telemetry probe from trusted internal subnet 10.0.0.0/16",
        classify: "llama.cpp verdict: BENIGN TRAFFIC (Confidence: 99.9%) | No malicious heuristics detected",
        route: "Action: Passed through to logging backend. Zero intervention needed.",
        threatLevel: "CLEAN",
        threatColor: "#10b981"
      }
    };

    this.isSimulating = false;
  }

  runSimulation(presetKey) {
    if (this.isSimulating) return;
    const data = this.presets[presetKey];
    if (!data) return;

    this.isSimulating = true;
    if (window.soundEngine) window.soundEngine.playLaser();

    // DOM Elements
    const nodeIngest = document.getElementById('node-ingest');
    const nodeClassify = document.getElementById('node-classify');
    const nodeRoute = document.getElementById('node-route');
    const conn1 = document.getElementById('conn-1');
    const conn2 = document.getElementById('conn-2');
    const logOutput = document.getElementById('dag-log-output');

    // Reset styles
    [nodeIngest, nodeClassify, nodeRoute].forEach(n => n && n.classList.remove('active'));
    [conn1, conn2].forEach(c => c && c.classList.remove('active'));

    if (logOutput) {
      logOutput.innerHTML = `<span style="color:#94a3b8;">[SIEM INIT]: Received packet trace for evaluation: <strong>${data.name}</strong></span><br><span style="color:#e2e8f0;">[RAW LOG]: ${data.raw}</span><br>`;
    }

    // Step 1: Ingest (0ms - 800ms)
    if (nodeIngest) nodeIngest.classList.add('active');
    setTimeout(() => {
      if (conn1) conn1.classList.add('active');
      if (logOutput) {
        logOutput.innerHTML += `<span style="color:#0ea5e9;">[NODE 1: INGEST] ${data.ingest}</span><br>`;
        logOutput.scrollTop = logOutput.scrollHeight;
      }
      if (window.soundEngine) window.soundEngine.playClick();
    }, 600);

    // Step 2: Classify (800ms - 1800ms)
    setTimeout(() => {
      if (nodeIngest) nodeIngest.classList.remove('active');
      if (nodeClassify) nodeClassify.classList.add('active');
      if (conn2) conn2.classList.add('active');

      if (logOutput) {
        logOutput.innerHTML += `<span style="color:#a855f7;">[NODE 2: LLAMA.CPP QUANTIZED CLASSIFIER]</span><br><span style="color:${data.threatColor}; font-weight:bold;">${data.classify}</span><br>`;
        logOutput.scrollTop = logOutput.scrollHeight;
      }
      if (window.soundEngine) window.soundEngine.playClick();
    }, 1400);

    // Step 3: Route (1800ms - 2800ms)
    setTimeout(() => {
      if (nodeClassify) nodeClassify.classList.remove('active');
      if (nodeRoute) nodeRoute.classList.add('active');

      if (logOutput) {
        logOutput.innerHTML += `<span style="color:#10b981;">[NODE 3: FASTAPI ACTION ROUTER] ${data.route}</span><br><span style="color:#34d399; font-weight:bold;">[STATUS]: Threat mitigation completed in 18.4ms (Zero Cloud API Costs).</span><br>`;
        logOutput.scrollTop = logOutput.scrollHeight;
      }
      if (window.soundEngine) window.soundEngine.playGameBeep();
      if (window.completeQuest) window.completeQuest('siem');
      this.isSimulating = false;
    }, 2400);
  }
}

window.langGraphSim = new LangGraphSimulator();
