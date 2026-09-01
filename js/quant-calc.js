/**
 * Interactive Quantization & VRAM Hardware Calculator
 * Demonstrates local LLM inference optimization on RTX 4060 (8GB VRAM)
 */

(function() {
  const modelData = {
    'llama3_8b': { name: 'Meta Llama-3 8B', params: 8.03, ctxDefault: 8192 },
    'mistral_7b': { name: 'Mistral 7B v0.3', params: 7.24, ctxDefault: 8192 },
    'qwen25_7b': { name: 'Qwen 2.5 7B Coder', params: 7.61, ctxDefault: 16384 },
    'deepseek_8b': { name: 'DeepSeek-R1 Distill 8B', params: 8.10, ctxDefault: 8192 },
    'llama3_70b': { name: 'Meta Llama-3 70B', params: 70.6, ctxDefault: 8192 }
  };

  const quantMultipliers = {
    'fp16': { bpw: 16.0, name: 'FP16 (Uncompressed)', tokSecBase: 24 },
    'q8_0': { bpw: 8.5, name: 'Q8_0 (8.5-bit High Precision)', tokSecBase: 48 },
    'q5_k_m': { bpw: 5.5, name: 'Q5_K_M (5.5-bit Balanced)', tokSecBase: 65 },
    'q4_k_m': { bpw: 4.5, name: 'Q4_K_M (4.5-bit Recommended)', tokSecBase: 78 },
    'q2_k': { bpw: 2.6, name: 'Q2_K (2.6-bit Ultra-Compressed)', tokSecBase: 92 }
  };

  function updateCalculator() {
    const modelSelect = document.getElementById('calc-model-select');
    const quantSelect = document.getElementById('calc-quant-select');
    const ctxRange = document.getElementById('calc-ctx-range');

    if (!modelSelect || !quantSelect || !ctxRange) return;

    const modelKey = modelSelect.value;
    const quantKey = quantSelect.value;
    const ctxTokens = parseInt(ctxRange.value, 10);

    const model = modelData[modelKey] || modelData['llama3_8b'];
    const quant = quantMultipliers[quantKey] || quantMultipliers['q4_k_m'];

    // Update Context Label
    const ctxValElem = document.getElementById('calc-ctx-val');
    if (ctxValElem) ctxValElem.innerText = `${(ctxTokens / 1024).toFixed(0)}k Tokens`;

    // Formula: Weight VRAM = (Params in Billions * Bits-Per-Weight) / 8
    const weightsVRAM = (model.params * quant.bpw) / 8;
    // KV Cache VRAM approx: ~0.5GB per 4k tokens on 8B
    const kvCacheVRAM = (ctxTokens / 4096) * 0.45 * (model.params / 8);
    const totalVRAM = (weightsVRAM + kvCacheVRAM + 0.4).toFixed(2);

    // Hardware fit assessment (RTX 4060 has 8.0 GB VRAM)
    const maxVRAM = 8.0;
    const vramPct = Math.min((totalVRAM / maxVRAM) * 100, 100);
    const isFits = totalVRAM <= maxVRAM;

    // Tokens/sec estimate
    let speedEst = isFits ? (quant.tokSecBase * (8 / model.params)).toFixed(1) : 'OOM (Offloaded to RAM)';

    // Update UI elements
    const vramValElem = document.getElementById('calc-vram-val');
    const fitStatusElem = document.getElementById('calc-fit-status');
    const speedValElem = document.getElementById('calc-speed-val');
    const progressFill = document.getElementById('calc-vram-fill');

    if (vramValElem) vramValElem.innerText = `${totalVRAM} GB`;
    if (speedValElem) speedValElem.innerText = isFits ? `${speedEst} tok/s` : speedEst;

    if (fitStatusElem) {
      if (isFits) {
        fitStatusElem.innerHTML = `<span style="color:#10b981;"><i class="ti ti-check"></i> 100% GPU VRAM Fit (RTX 4060)</span>`;
      } else {
        fitStatusElem.innerHTML = `<span style="color:#ef4444;"><i class="ti ti-alert-triangle"></i> Exceeds 8GB VRAM (CPU Fallback)</span>`;
      }
    }

    if (progressFill) {
      progressFill.style.width = `${vramPct}%`;
      progressFill.style.background = isFits
        ? 'linear-gradient(90deg, #10b981, #06b6d4)'
        : 'linear-gradient(90deg, #f59e0b, #ef4444)';
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const modelSelect = document.getElementById('calc-model-select');
    const quantSelect = document.getElementById('calc-quant-select');
    const ctxRange = document.getElementById('calc-ctx-range');

    if (modelSelect) modelSelect.addEventListener('change', updateCalculator);
    if (quantSelect) quantSelect.addEventListener('change', updateCalculator);
    if (ctxRange) ctxRange.addEventListener('input', updateCalculator);

    updateCalculator();
  });
})();
