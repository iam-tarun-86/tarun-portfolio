/**
 * Interactive Quest Log & Gamification Engine
 * Bridges Professionalism and Gamified Interaction
 */

(function() {
  const quests = {
    calc: { id: 'calc', name: 'Calibrate Local VRAM Calculator', xp: 250, done: false },
    siem: { id: 'siem', name: 'Neutralize an Injected Threat in SIEM', xp: 350, done: false },
    bench: { id: 'bench', name: 'Execute "bench" in Developer CLI', xp: 300, done: false },
    resume: { id: 'resume', name: 'Download / Inspect Resume [PDF]', xp: 200, done: false }
  };

  let totalXP = 0;
  const maxXP = 1100;

  function initQuestDock() {
    updateQuestUI();

    // Listen for Calculator interaction
    const modelSelect = document.getElementById('calc-model-select');
    const quantSelect = document.getElementById('calc-quant-select');
    if (modelSelect) modelSelect.addEventListener('change', () => completeQuest('calc'));
    if (quantSelect) quantSelect.addEventListener('change', () => completeQuest('calc'));

    // Listen for Resume download
    document.querySelectorAll('.download-resume-action').forEach(btn => {
      btn.addEventListener('click', () => completeQuest('resume'));
    });
  }

  window.completeQuest = function(questId) {
    if (quests[questId] && !quests[questId].done) {
      quests[questId].done = true;
      totalXP += quests[questId].xp;

      if (window.soundEngine) {
        window.soundEngine.playShardCollect();
      }

      showNotification(`🏆 Quest Complete: ${quests[questId].name} (+${quests[questId].xp} XP)`);
      updateQuestUI();
    }
  };

  function updateQuestUI() {
    const listElem = document.getElementById('quest-items-list');
    const xpElem = document.getElementById('quest-total-xp');
    const fillElem = document.getElementById('quest-progress-fill');
    const rankElem = document.getElementById('quest-rank-badge');

    if (xpElem) xpElem.innerText = `${totalXP} / ${maxXP} XP`;
    if (fillElem) fillElem.style.width = `${(totalXP / maxXP) * 100}%`;

    if (rankElem) {
      if (totalXP >= 1100) {
        rankElem.innerHTML = '<span style="color:#fbbf24;"><i class="ti ti-crown"></i> L4 SENIOR AI ARCHITECT</span>';
      } else if (totalXP >= 600) {
        rankElem.innerHTML = '<span style="color:#c084fc;"><i class="ti ti-shield-check"></i> L3 AI INFRA ENGINEER</span>';
      } else if (totalXP >= 250) {
        rankElem.innerHTML = '<span style="color:#38bdf8;"><i class="ti ti-cpu"></i> L2 SYSTEMS SPECIALIST</span>';
      } else {
        rankElem.innerHTML = '<span style="color:#94a3b8;"><i class="ti ti-user"></i> L1 GUEST RECRUITER</span>';
      }
    }

    if (listElem) {
      listElem.innerHTML = Object.values(quests).map(q => `
        <div class="quest-item ${q.done ? 'quest-done' : ''}">
          <i class="ti ${q.done ? 'ti-circle-check-filled' : 'ti-circle'}"></i>
          <span>${q.name}</span>
          <strong>+${q.xp} XP</strong>
        </div>
      `).join('');
    }
  }

  function showNotification(text) {
    const toast = document.createElement('div');
    toast.className = 'quest-toast';
    toast.innerHTML = `<i class="ti ti-sparkles"></i> <span>${text}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 50);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  document.addEventListener('DOMContentLoaded', initQuestDock);
})();
