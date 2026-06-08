// ============================================================
// 类目选择器 + HSCode 双向查询模块
// 支持：① 国际站四层类目树逐级下拉选择
//       ② HSCode 输入（2/4/6位）模糊匹配
//       ③ 两者双向联动
// ============================================================

let _hsLoaded = false;

// ── 懒加载 HSCode 数据 ───────────────────────────────────────
function ensureHSLoaded(cb) {
  if (_hsLoaded) { cb(); return; }
  const s = document.createElement('script');
  s.src = 'hscode-map.js';
  s.onload = () => { _hsLoaded = true; cb(); };
  document.head.appendChild(s);
}

// ── 渲染类目选择器面板 ────────────────────────────────────────
function renderCategorySelector(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = `
<div class="card" style="padding:20px;margin-bottom:16px;">
  <div style="font-size:14px;font-weight:600;margin-bottom:14px;color:var(--cyan);">
    🔍 选择分析类目
  </div>

  <!-- 双模式切换 -->
  <div style="display:flex;gap:8px;margin-bottom:16px;">
    <button class="tab-btn active" id="cs-mode-cat" onclick="switchCSMode('cat')">📂 国际站类目</button>
    <button class="tab-btn" id="cs-mode-hs" onclick="switchCSMode('hs')">🔢 海关 HSCode</button>
  </div>

  <!-- 模式A：国际站类目 -->
  <div id="cs-panel-cat">
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;">
      <div>
        <label style="font-size:11px;color:#94a3b8;">一级类目 (L1)</label>
        <select id="cs-l1" style="width:100%;margin-top:4px;" onchange="onCSL1Change()">
          <option value="">-- 请选择 --</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;color:#94a3b8;">二级类目 (L2)</label>
        <select id="cs-l2" style="width:100%;margin-top:4px;" onchange="onCSL2Change()" disabled>
          <option value="">-- 请先选L1 --</option>
        </select>
      </div>
      <div>
        <label style="font-size:11px;color:#94a3b8;">三级类目 (L3)</label>
        <select id="cs-l3" style="width:100%;margin-top:4px;" onchange="onCSL3Change()" disabled>
          <option value="">-- 请先选L2 --</option>
        </select>
      </div>
      <div id="cs-l4-wrap" style="display:none;">
        <label style="font-size:11px;color:#94a3b8;">四级类目 (L4)</label>
        <select id="cs-l4" style="width:100%;margin-top:4px;" onchange="onCSL4Change()" disabled>
          <option value="">-- 请先选L3 --</option>
        </select>
      </div>
    </div>
  </div>

  <!-- 模式B：HSCode -->
  <div id="cs-panel-hs" style="display:none;">
    <div style="display:flex;gap:10px;align-items:flex-end;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;">
        <label style="font-size:11px;color:#94a3b8;">输入HSCode（2/4/6位）或关键词</label>
        <input id="cs-hs-input" style="width:100%;margin-top:4px;" 
          placeholder="如: 8471 或 850440 或 计算机" 
          oninput="onHSInput(this.value)">
      </div>
      <button class="btn-primary" onclick="onHSSearch()">🔍 查询</button>
    </div>
    <div id="cs-hs-results" style="margin-top:12px;max-height:240px;overflow-y:auto;"></div>
  </div>

  <!-- 当前选中结果展示 -->
  <div id="cs-selected" style="margin-top:16px;display:none;">
    <div style="background:#0a1628;border-radius:8px;padding:12px;border-left:3px solid var(--cyan);">
      <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">✅ 当前分析对象</div>
      <div id="cs-selected-path" style="font-size:13px;font-weight:600;color:#e2e8f0;"></div>
      <div id="cs-selected-hs" style="font-size:11px;color:#64748b;margin-top:4px;"></div>
    </div>
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn-primary" onclick="applyCSSelection()">📊 应用到看板分析</button>
      <button class="tab-btn" onclick="resetCSSelection()">↺ 重新选择</button>
    </div>
  </div>
</div>`;

  // 填充 L1 下拉
  const sel = document.getElementById('cs-l1');
  ALL_L1.forEach(l1 => {
    const opt = document.createElement('option');
    opt.value = l1; opt.textContent = l1;
    sel.appendChild(opt);
  });
}

// ── 模式切换 ─────────────────────────────────────────────────
function switchCSMode(mode) {
  document.getElementById('cs-panel-cat').style.display = mode === 'cat' ? '' : 'none';
  document.getElementById('cs-panel-hs').style.display  = mode === 'hs'  ? '' : 'none';
  document.getElementById('cs-mode-cat').classList.toggle('active', mode === 'cat');
  document.getElementById('cs-mode-hs').classList.toggle('active',  mode === 'hs');
  if (mode === 'hs') ensureHSLoaded(() => {});
}

// ── 类目级联 ─────────────────────────────────────────────────
function onCSL1Change() {
  const l1 = document.getElementById('cs-l1').value;
  const l2sel = document.getElementById('cs-l2');
  const l3sel = document.getElementById('cs-l3');
  const l4sel = document.getElementById('cs-l4');

  l2sel.innerHTML = '<option value="">-- 请选择 --</option>';
  l3sel.innerHTML = '<option value="">-- 请先选L2 --</option>';
  l4sel.innerHTML = '<option value="">-- 请先选L3 --</option>';
  l2sel.disabled = !l1;
  l3sel.disabled = true;
  l4sel.disabled = true;
  document.getElementById('cs-l4-wrap').style.display = 'none';
  document.getElementById('cs-selected').style.display = 'none';

  if (!l1) return;
  const l2keys = Object.keys(CATEGORY_TREE[l1] || {});
  l2keys.forEach(l2 => {
    const opt = document.createElement('option');
    opt.value = l2; opt.textContent = l2;
    l2sel.appendChild(opt);
  });
}

function onCSL2Change() {
  const l1 = document.getElementById('cs-l1').value;
  const l2 = document.getElementById('cs-l2').value;
  const l3sel = document.getElementById('cs-l3');
  const l4sel = document.getElementById('cs-l4');

  l3sel.innerHTML = '<option value="">-- 请选择 --</option>';
  l4sel.innerHTML = '<option value="">-- 请先选L3 --</option>';
  l3sel.disabled = !l2;
  l4sel.disabled = true;
  document.getElementById('cs-l4-wrap').style.display = 'none';
  document.getElementById('cs-selected').style.display = 'none';

  if (!l2) return;
  const l2node = CATEGORY_TREE[l1]?.[l2];
  if (!l2node) return;

  const l3keys = Object.keys(l2node);
  l3keys.forEach(l3 => {
    const opt = document.createElement('option');
    opt.value = l3; opt.textContent = l3;
    l3sel.appendChild(opt);
  });

  // 如果 L2 下全是叶子（null值），L3 本身即为叶子
  const hasLeafDirect = l3keys.some(k => l2node[k] === null);
  if (hasLeafDirect) {
    // L3 里有直接叶子，选中后就完成
  }
}

function onCSL3Change() {
  const l1 = document.getElementById('cs-l1').value;
  const l2 = document.getElementById('cs-l2').value;
  const l3 = document.getElementById('cs-l3').value;
  const l4wrap = document.getElementById('cs-l4-wrap');
  const l4sel  = document.getElementById('cs-l4');

  l4sel.innerHTML = '<option value="">-- 请选择 --</option>';
  l4sel.disabled = true;
  l4wrap.style.display = 'none';
  document.getElementById('cs-selected').style.display = 'none';

  if (!l3) return;
  const l3node = CATEGORY_TREE[l1]?.[l2]?.[l3];

  if (l3node === null) {
    // L3 本身就是叶子（虚拟情况）
    showCSSelected(l1, l2, l3, null);
  } else if (typeof l3node === 'object') {
    const l4keys = Object.keys(l3node);
    if (l4keys.length === 0) {
      showCSSelected(l1, l2, l3, null);
    } else {
      l4wrap.style.display = '';
      l4sel.disabled = false;
      l4keys.forEach(l4 => {
        const opt = document.createElement('option');
        opt.value = l4; opt.textContent = l4;
        l4sel.appendChild(opt);
      });
    }
  }
}

function onCSL4Change() {
  const l1 = document.getElementById('cs-l1').value;
  const l2 = document.getElementById('cs-l2').value;
  const l3 = document.getElementById('cs-l3').value;
  const l4 = document.getElementById('cs-l4').value;
  if (l4) showCSSelected(l1, l2, l3, l4);
}

// ── 选中结果展示 ──────────────────────────────────────────────
function showCSSelected(l1, l2, l3, l4) {
  const path = [l1, l2, l3, l4].filter(Boolean).join(' › ');
  document.getElementById('cs-selected-path').textContent = path;

  // 查关联 HSCode
  const key = `${l1}__${l2}`;
  ensureHSLoaded(() => {
    const codes = (CATEGORY_TO_HS || {})[key] || [];
    const hsText = codes.length
      ? `关联HSCode: ${codes.slice(0,8).join(' · ')}${codes.length > 8 ? ` 等${codes.length}个` : ''}`
      : '暂无直接关联HSCode映射';
    document.getElementById('cs-selected-hs').textContent = hsText;
  });

  document.getElementById('cs-selected').style.display = '';

  // 保存当前选中
  window._csSelection = { l1, l2, l3, l4, path };
}

// ── HSCode 搜索 ───────────────────────────────────────────────
function onHSInput(val) {
  if (val.length >= 2) {
    clearTimeout(window._hsDebounce);
    window._hsDebounce = setTimeout(() => onHSSearch(), 300);
  }
}

function onHSSearch() {
  ensureHSLoaded(() => {
    const val = document.getElementById('cs-hs-input').value.trim();
    if (!val) return;
    const results = searchHSCode(val);
    renderHSResults(results);
  });
}

function searchHSCode(query) {
  if (!window.HSCODE_INDEX) return [];
  const q = query.toLowerCase();
  const results = [];
  const isNumeric = /^\d+$/.test(q);

  for (const [hs6, entry] of Object.entries(HSCODE_INDEX)) {
    let match = false;
    if (isNumeric) {
      match = hs6.startsWith(q.padStart(q.length,'0')) ||
              hs6.includes(q) ||
              (HS4_DESC && Object.keys(HS4_DESC).some(h4 => h4.startsWith(q) && hs6.startsWith(h4)));
    } else {
      match = entry.d.toLowerCase().includes(q);
    }
    if (match) results.push({ hs6, ...entry });
    if (results.length >= 50) break;
  }
  return results;
}

function renderHSResults(results) {
  const el = document.getElementById('cs-hs-results');
  if (!results.length) {
    el.innerHTML = '<div style="color:#475569;font-size:12px;padding:8px;">未找到匹配结果，请尝试其他关键词</div>';
    return;
  }
  el.innerHTML = `
    <div style="font-size:11px;color:#94a3b8;margin-bottom:8px;">找到 ${results.length} 条结果（点击选择）</div>
    ${results.map(r => `
    <div onclick="selectHSCode('${r.hs6}')"
      style="background:#0a1628;border:1px solid var(--border);border-radius:6px;padding:8px 10px;
             margin-bottom:6px;cursor:pointer;transition:border-color .2s;"
      onmouseover="this.style.borderColor='var(--cyan)'"
      onmouseout="this.style.borderColor='var(--border)'">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
        <span style="font-family:monospace;font-size:13px;color:var(--cyan);font-weight:600;">${r.hs6}</span>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${r.c.map(([l1,l2]) => `<span class="badge-blue">${l2}</span>`).join('')}
        </div>
      </div>
      <div style="font-size:12px;color:#94a3b8;margin-top:3px;">${r.d}</div>
    </div>`).join('')}`;
}

function selectHSCode(hs6) {
  ensureHSLoaded(() => {
    const entry = HSCODE_INDEX[hs6];
    if (!entry) return;

    // 找到对应的国际站类目
    const cats = entry.c || [];
    const l1 = cats[0]?.[0] || '';
    const l2 = cats[0]?.[1] || '';

    document.getElementById('cs-selected-path').innerHTML =
      `HSCode <span style="color:var(--cyan);font-family:monospace">${hs6}</span> — ${entry.d}`;
    document.getElementById('cs-selected-hs').textContent =
      cats.length
        ? `对应类目: ${cats.map(([a,b])=>`${a} › ${b}`).join(' | ')}`
        : '暂无类目映射';
    document.getElementById('cs-selected').style.display = '';

    window._csSelection = { hs6, desc: entry.d, l1, l2, path: `${l1} › ${l2}` };

    // 同步切换到类目模式并定位 L1/L2
    if (l1 && CATEGORY_TREE[l1]) {
      switchCSMode('cat');
      const l1sel = document.getElementById('cs-l1');
      l1sel.value = l1;
      onCSL1Change();
      setTimeout(() => {
        const l2sel = document.getElementById('cs-l2');
        if (l2sel) { l2sel.value = l2; onCSL2Change(); }
      }, 50);
    }
  });
}

// ── 应用选中结果到看板 ────────────────────────────────────────
function applyCSSelection() {
  const sel = window._csSelection;
  if (!sel) return;

  // 更新看板标题
  const headEl = document.getElementById('cs-applied-label');
  if (headEl) headEl.textContent = sel.path;

  // 如果跨境智库已打开，重新渲染国别卡片
  const catSel = document.getElementById('category-select');
  if (catSel && sel.l2) {
    // 找一个最接近的品类
    const opts = Array.from(catSel.options).map(o => o.value);
    const match = opts.find(o => o && sel.l2.includes(o)) ||
                  opts.find(o => o && sel.l1.includes(o));
    if (match) { catSel.value = match; renderCountryCards(); }
  }

  // 如果合规查询已打开，联动设置品类
  const complyCat = document.getElementById('comply-cat');
  if (complyCat && sel.l2) {
    const opts = Array.from(complyCat.options).map(o => o.value);
    const match = opts.find(o => o && (sel.l2.includes(o) || sel.l1.includes(o)));
    if (match) complyCat.value = match;
  }

  // 显示应用成功提示
  showToast(`已切换分析类目：${sel.path}`);
}

function resetCSSelection() {
  window._csSelection = null;
  document.getElementById('cs-selected').style.display = 'none';
  ['cs-l1','cs-l2','cs-l3','cs-l4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  document.getElementById('cs-l4-wrap').style.display = 'none';
  ['cs-l2','cs-l3','cs-l4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.disabled = true;
  });
  const inp = document.getElementById('cs-hs-input');
  if (inp) inp.value = '';
  const res = document.getElementById('cs-hs-results');
  if (res) res.innerHTML = '';
}

// ── Toast 提示 ────────────────────────────────────────────────
function showToast(msg) {
  let toast = document.getElementById('cs-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cs-toast';
    toast.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:linear-gradient(135deg,#0ea5e9,#6366f1);
      color:#fff;border-radius:10px;padding:12px 20px;
      font-size:13px;box-shadow:0 4px 24px rgba(0,0,0,.4);
      opacity:0;transition:opacity .3s;pointer-events:none;
    `;
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}

// ── 初始化：在页面加载后插入选择器 ──────────────────────────
function initCategorySelector() {
  // 在跨境智库模块顶部插入选择器
  const thinkTank = document.getElementById('mod-think-tank');
  if (!thinkTank) return;
  const wrap = document.createElement('div');
  wrap.id = 'cs-root';
  thinkTank.insertBefore(wrap, thinkTank.firstChild);
  renderCategorySelector('cs-root');

  // 在工具箱模块也插入（共享选择器）
  const toolbox = document.getElementById('mod-toolbox');
  if (toolbox) {
    const wrap2 = document.createElement('div');
    wrap2.id = 'cs-root-toolbox';
    toolbox.insertBefore(wrap2, toolbox.firstChild);
    wrap2.innerHTML = `
      <div class="card" style="padding:12px 20px;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
        <span style="font-size:13px;color:#94a3b8;">当前分析类目：</span>
        <span id="cs-applied-label" style="font-size:14px;font-weight:600;color:var(--cyan);">
          全品类（未指定）
        </span>
        <button class="tab-btn" style="padding:4px 12px;font-size:12px;"
          onclick="switchModule('think-tank');event.stopPropagation();">
          ✏️ 切换类目
        </button>
      </div>`;
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCategorySelector);
} else {
  initCategorySelector();
}
