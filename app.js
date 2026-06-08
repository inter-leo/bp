// ============================================================
// APP LOGIC
// ============================================================

// ---- Module Switch ----
function switchModule(id) {
  document.querySelectorAll('.module').forEach(m => m.classList.remove('active'));
  document.querySelectorAll('nav .tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('mod-' + id).classList.add('active');
  event.currentTarget.classList.add('active');
  if (id === 'riskmap') initMap();
  if (id === 'warning') initWarningCharts();
  if (id === 'intel') { loadIntel(); setIntelTime(); }
  if (id === 'toolbox') initTrending();
  if (id === 'think-tank') initDemandPanels();
}

// ---- Toolbox Tab ----
function switchToolTab(tab) {
  document.querySelectorAll('.tool-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('[id^="tool-tab-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('tool-' + tab).style.display = 'block';
  document.getElementById('tool-tab-' + tab).classList.add('active');
  if (tab === 'trending') initTrending();
}

// ---- Think Tank Tab ----
function switchTTTab(tab) {
  document.querySelectorAll('.tt-panel').forEach(p => p.style.display = 'none');
  document.querySelectorAll('[id^="tt-tab-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('tt-' + tab).style.display = 'block';
  document.getElementById('tt-tab-' + tab).classList.add('active');
  if (tab === 'demand') initDemandPanels();
  if (tab === 'trend') initTrendCards();
}

// ---- Country Cards ----
function renderCountryCards() {
  const cat = document.getElementById('category-select').value;
  const region = document.getElementById('region-filter').value;
  const grid = document.getElementById('country-cards-grid');
  let list = COUNTRIES.filter(c => !region || c.region === region);

  if (!cat) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:#475569;"><div style="font-size:32px;">🌍</div><p>请选择品类后生成评分</p></div>`;
    return;
  }

  // compute per-category score variation
  list = list.map(c => {
    const variation = Math.floor(Math.random() * 15) - 7;
    const catScore = Math.min(99, Math.max(40, c.score + variation));
    return { ...c, catScore };
  }).sort((a, b) => b.catScore - a.catScore);

  grid.innerHTML = list.map((c, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
    const riskColor = c.risk < 30 ? '#10b981' : c.risk < 45 ? '#f97316' : '#ef4444';
    const scoreColor = c.catScore >= 85 ? '#10b981' : c.catScore >= 70 ? '#0ea5e9' : '#f97316';
    return `
    <div class="country-card" onclick="showCountryDetail('${c.code}')">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="font-size:22px;">${c.flag}</span>
          <div>
            <div style="font-weight:600;font-size:14px;">${c.name}</div>
            <div style="font-size:11px;color:#64748b;">${c.region} · ${c.currency}</div>
          </div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:18px;">${medal}</div>
          <div style="font-size:20px;font-weight:700;color:${scoreColor};">${c.catScore}</div>
        </div>
      </div>
      <div style="margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:#94a3b8;margin-bottom:3px;">
          <span>${cat}综合评分</span><span>${c.catScore}/100</span>
        </div>
        <div class="score-bar"><div class="score-fill" style="width:${c.catScore}%;background:${scoreColor};"></div></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:11px;margin-top:8px;">
        <div style="background:#0f1629;border-radius:6px;padding:5px 8px;"><span style="color:#64748b;">人均GDP</span><br><span style="color:#e2e8f0;font-weight:600;">$${(c.gdp/1000).toFixed(0)}K</span></div>
        <div style="background:#0f1629;border-radius:6px;padding:5px 8px;"><span style="color:#64748b;">人口</span><br><span style="color:#e2e8f0;font-weight:600;">${c.pop < 10 ? (c.pop*100)+'万' : c.pop+'M'}</span></div>
        <div style="background:#0f1629;border-radius:6px;padding:5px 8px;"><span style="color:#64748b;">网络普及</span><br><span style="color:#e2e8f0;font-weight:600;">${c.net}%</span></div>
        <div style="background:#0f1629;border-radius:6px;padding:5px 8px;"><span style="color:#64748b;">风险指数</span><br><span style="font-weight:600;color:${riskColor};">${c.risk}</span></div>
      </div>
      <div style="margin-top:8px;font-size:11px;color:#64748b;">从中国进口额: <span style="color:#60a5fa;">${c.imports}亿USD</span> · GDP增速: <span class="up">+${c.growth}%</span></div>
    </div>`;
  }).join('');
}

function showCountryDetail(code) {
  const c = COUNTRIES.find(x => x.code === code);
  if (!c) return;
  alert(`${c.flag} ${c.name} 详情\n\n人均GDP: $${c.gdp.toLocaleString()}\n人口: ${c.pop}M\n网络普及率: ${c.net}%\n从中国进口: $${c.imports}B\nGDP增速: +${c.growth}%\n货币: ${c.currency}\n语言: ${c.lang}\n风险指数: ${c.risk}/100`);
}

// ---- Demand Panels ----
function initDemandPanels() {
  const byGDP = [...COUNTRIES].sort((a,b) => b.gdp - a.gdp).slice(0,5);
  const byPop = [...COUNTRIES].sort((a,b) => b.pop - a.pop).slice(0,5);
  const emerging = COUNTRIES.filter(c => c.gdp < 15000 && c.growth > 4).sort((a,b) => b.growth - a.growth).slice(0,5);

  document.getElementById('top-profit-list').innerHTML = byGDP.map(c =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1e3a5f;">
      <span>${c.flag} ${c.name}</span>
      <span style="color:var(--cyan);font-weight:600;">$${(c.gdp/1000).toFixed(0)}K</span>
    </div>`).join('');

  document.getElementById('top-scale-list').innerHTML = byPop.map(c =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1e3a5f;">
      <span>${c.flag} ${c.name}</span>
      <span style="color:var(--purple);font-weight:600;">${c.pop}M</span>
    </div>`).join('');

  document.getElementById('top-blue-list').innerHTML = emerging.map(c =>
    `<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid #1e3a5f;">
      <span>${c.flag} ${c.name}</span>
      <span style="color:var(--green);font-weight:600;">+${c.growth}%</span>
    </div>`).join('');

  document.getElementById('compliance-tips').innerHTML = [
    { icon:'🌿', tip:'欧盟CBAM 2026正式执行，钢铁/铝出口需购买碳证书' },
    { icon:'♻', tip:'ESPR产品生态设计法规覆盖范围扩大至电子设备' },
    { icon:'🔒', tip:'美国CPSC强化中国产品第三方检测要求，认证成本增40%' },
    { icon:'📋', tip:'越南出口需加强产地证明，防范美国反规避调查风险' },
  ].map(t => `<div style="background:#0a1628;border-radius:8px;padding:10px 12px;font-size:12px;display:flex;gap:8px;align-items:center;">
    <span style="font-size:18px;">${t.icon}</span><span style="color:#cbd5e1;">${t.tip}</span></div>`).join('');
}

// ---- Trend Cards ----
function initTrendCards() {
  document.getElementById('trend-cards').innerHTML = TRENDS.map(t => `
    <div class="country-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:28px;">${t.icon}</div>
        <div class="badge-green">${t.yoy} YoY</div>
      </div>
      <div style="font-weight:600;font-size:15px;margin-bottom:4px;">${t.name}</div>
      <div style="font-size:12px;color:#64748b;margin-bottom:8px;">${t.note}</div>
      <div style="font-size:11px;color:#94a3b8;">热门市场: <span style="color:#60a5fa;">${t.top}</span></div>
      <div style="margin-top:8px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;margin-bottom:3px;"><span style="color:#94a3b8;">热度</span><span>${t.heat}/100</span></div>
        <div class="score-bar"><div class="score-fill" style="width:${t.heat}%;background:linear-gradient(90deg,#0ea5e9,#6366f1);"></div></div>
      </div>
    </div>`).join('');
}

// ---- Compliance ----
function runComply() {
  const cat = document.getElementById('comply-cat').value;
  const mkt = document.getElementById('comply-mkt').value;
  const db = COMPLY_DB[cat] || {};
  const info = db[mkt] || { certs:['当地认证要求'], tariff:'视具体商品而定', note:'请查阅当地监管机构官网获取最新要求' };
  const country = COUNTRIES.find(c => c.code === mkt || (mkt === 'EU' && c.code === 'DE'));
  const flag = country ? country.flag : '🌍';
  document.getElementById('comply-result').innerHTML = `
    <h3 style="margin:0 0 16px;font-size:16px;">${flag} ${cat} → ${mkt} 合规要求</h3>
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;color:#94a3b8;margin-bottom:8px;">📜 必备认证</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${info.certs.map(c => `<span class="badge-blue">${c}</span>`).join('')}
      </div>
    </div>
    <div style="margin-bottom:14px;background:#0a1628;border-radius:8px;padding:12px;">
      <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">💰 参考关税区间</div>
      <div style="font-size:20px;font-weight:700;color:#f97316;">${info.tariff}</div>
    </div>
    <div style="background:#1a2744;border-radius:8px;padding:12px;border-left:3px solid var(--cyan);">
      <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">💡 关键提示</div>
      <div style="font-size:13px;color:#e2e8f0;">${info.note}</div>
    </div>
    <div style="margin-top:14px;font-size:11px;color:#475569;">⚠ 以上为参考信息，实际合规要求请以官方法规为准。建议聘请当地合规顾问。</div>`;
}

// ---- Tariff Calculator ----
function calcTariff() {
  const hs = document.getElementById('hs-code').value || '未填写';
  const country = document.getElementById('tariff-country').value;
  const fob = parseFloat(document.getElementById('fob').value) || 0;
  const freight = parseFloat(document.getElementById('freight').value) || 0;
  const insurance = parseFloat(document.getElementById('insurance').value) || 0;
  const cif = fob + freight + insurance;

  const rates = { US:0.175, EU:0.035, GB:0.04, JP:0.025, AU:0.03, CA:0.04, IN:0.22, KR:0.08, SA:0.05, BR:0.22 };
  const extraUS = country === 'US' ? cif * 0.25 : 0;
  const baseRate = rates[country] || 0.1;
  const baseDuty = cif * baseRate;
  const total = baseDuty + extraUS;
  const landed = cif + total;

  document.getElementById('tariff-result').innerHTML = `
    <h3 style="margin:0 0 16px;">📊 计算结果</h3>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:14px;">
      <div style="background:#0a1628;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:11px;color:#94a3b8;">CIF价格</div>
        <div style="font-size:18px;font-weight:700;color:#60a5fa;">$${cif.toLocaleString()}</div>
      </div>
      <div style="background:#0a1628;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:11px;color:#94a3b8;">基础税率</div>
        <div style="font-size:18px;font-weight:700;color:#f97316;">${(baseRate*100).toFixed(1)}%</div>
      </div>
      <div style="background:#0a1628;border-radius:8px;padding:12px;text-align:center;">
        <div style="font-size:11px;color:#94a3b8;">基础关税</div>
        <div style="font-size:18px;font-weight:700;color:#f97316;">$${baseDuty.toFixed(0)}</div>
      </div>
      ${country === 'US' ? `<div style="background:#7f1d1d;border-radius:8px;padding:12px;text-align:center;"><div style="font-size:11px;color:#fca5a5;">301关税(25%)</div><div style="font-size:18px;font-weight:700;color:#ef4444;">$${extraUS.toFixed(0)}</div></div>` : '<div></div>'}
    </div>
    <div style="background:linear-gradient(135deg,#1a2744,#0f1629);border-radius:10px;padding:16px;border:1px solid var(--cyan);text-align:center;">
      <div style="font-size:12px;color:#94a3b8;margin-bottom:4px;">总关税 (含附加税)</div>
      <div style="font-size:28px;font-weight:700;color:#ef4444;">$${total.toFixed(0)}</div>
      <div style="font-size:12px;color:#94a3b8;margin-top:8px;">完税后到岸成本</div>
      <div style="font-size:22px;font-weight:700;color:#10b981;">$${landed.toFixed(0)}</div>
    </div>
    <div style="margin-top:10px;font-size:11px;color:#475569;">HS: ${hs} · 数据仅供参考，实际关税以海关裁定为准</div>`;
}

// ---- Trending ----
function initTrending() {
  const bsr = TRENDS.map(t => `
    <div class="country-card">
      <div style="font-size:24px;margin-bottom:8px;">${t.icon}</div>
      <div style="font-weight:600;margin-bottom:6px;">${t.name}</div>
      <div class="badge-green" style="margin-bottom:8px;">${t.yoy}</div>
      <div style="font-size:12px;color:#64748b;">${t.note}</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:8px;">🏆 ${t.top}</div>
    </div>`).join('');
  const container = document.getElementById('trending-grid');
  if (container) container.innerHTML = bsr;
}

// ---- Compass ----
function runCompass() {
  const kw = document.getElementById('compass-input').value.trim();
  if (!kw) return;
  const scored = COUNTRIES.map(c => ({
    ...c,
    matchScore: Math.min(99, c.score + Math.floor(Math.random() * 20) - 5)
  })).sort((a,b) => b.matchScore - a.matchScore);

  document.getElementById('compass-result').innerHTML = scored.map(c => {
    const col = c.matchScore >= 85 ? '#10b981' : c.matchScore >= 70 ? '#0ea5e9' : '#f97316';
    return `<div class="country-card">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
        <div style="display:flex;gap:8px;align-items:center;">
          <span style="font-size:20px;">${c.flag}</span>
          <div><div style="font-weight:600;">${c.name}</div><div style="font-size:11px;color:#64748b;">${c.region}</div></div>
        </div>
        <div style="font-size:22px;font-weight:700;color:${col};">${c.matchScore}</div>
      </div>
      <div class="score-bar"><div class="score-fill" style="width:${c.matchScore}%;background:${col};"></div></div>
      <div style="font-size:11px;color:#64748b;margin-top:8px;">
        匹配: <span style="color:${col};">${kw}</span> · 风险: ${c.risk} · GDP增速: +${c.growth}%
      </div>
    </div>`;
  }).join('');
}

// ---- Map ----
let mapInited = false;
function initMap() {
  if (mapInited) return;
  mapInited = true;
  const map = L.map('map', { center: [20, 10], zoom: 2 });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '©OpenStreetMap ©CARTO', subdomains: 'abcd', maxZoom: 19
  }).addTo(map);

  // Risk hotspots
  const hotspots = [
    { lat:13, lng:44, label:'红海·胡塞武装', risk:'极高', color:'#ef4444' },
    { lat:26.5, lng:56, label:'霍尔木兹海峡', risk:'高', color:'#f97316' },
    { lat:1.3, lng:104, label:'马六甲海峡', risk:'中', color:'#eab308' },
    { lat:9, lng:-80, label:'巴拿马运河', risk:'低', color:'#10b981' },
    { lat:51, lng:3, label:'英吉利海峡', risk:'低', color:'#10b981' },
    { lat:35, lng:25, label:'苏伊士运河', risk:'高', color:'#f97316' },
  ];
  hotspots.forEach(h => {
    L.circleMarker([h.lat, h.lng], { radius: 10, fillColor: h.color, color: h.color, fillOpacity: 0.7, weight: 2 })
      .addTo(map).bindPopup(`<b>${h.label}</b><br>风险等级: ${h.risk}`);
  });

  // Sea routes
  const routes = [
    { points:[[31,121],[35,130],[1,104],[13,45],[30,33],[51,2]], color:'#0ea5e9', label:'亚欧主航线' },
    { points:[[31,121],[35,130],[22,114],[35,139]], color:'#6366f1', label:'亚日韩航线' },
    { points:[[31,121],[35,130],[1,104],[33,-118]], color:'#10b981', label:'跨太平洋' },
    { points:[[22,114],[51,2],[40,-74]], color:'#a855f7', label:'欧美大西洋' },
  ];
  routes.forEach(r => {
    L.polyline(r.points, { color: r.color, weight: 2, opacity: 0.7, dashArray: '5,5' })
      .addTo(map).bindPopup(r.label);
  });

  // SCFI Chart
  const ctx = document.getElementById('scfi-chart').getContext('2d');
  const labels = Array.from({length:13}, (_,i) => `W${i*7+1}`);
  const data = [1650,1720,1780,1820,1890,1940,1870,1820,1900,1950,1890,1840,1894];
  new Chart(ctx, {
    type:'line', data:{
      labels, datasets:[{ data, borderColor:'#0ea5e9', backgroundColor:'rgba(14,165,233,0.1)',
        fill:true, tension:0.4, pointRadius:3, pointBackgroundColor:'#0ea5e9' }]
    },
    options:{ plugins:{legend:{display:false}}, scales:{
      x:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#1e3a5f'}},
      y:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#1e3a5f'}}
    }}
  });

  // Freight grid
  document.getElementById('freight-grid').innerHTML = `
    <div><div style="font-size:11px;color:#0ea5f0;margin-bottom:6px;">🚢 集装箱海运(40'GP)</div>
      ${[['上海→鹿特丹','$3,800'],['上海→洛杉矶','$2,400'],['上海→汉堡','$3,600']].map(r=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid #1e3a5f;"><span style="color:#94a3b8;">${r[0]}</span><span style="color:#f97316;">${r[1]}</span></div>`).join('')}
    </div>
    <div><div style="font-size:11px;color:#a855f7;margin-bottom:6px;">✈ 国际空运($/kg)</div>
      ${[['浦东→法兰克福','$5.2'],['浦东→芝加哥','$4.8'],['浦东→东京','$2.1']].map(r=>`<div style="display:flex;justify-content:space-between;font-size:11px;padding:4px 0;border-bottom:1px solid #1e3a5f;"><span style="color:#94a3b8;">${r[0]}</span><span style="color:#f97316;">${r[1]}</span></div>`).join('')}
    </div>`;
}

function toggleMapLayer(type) {
  document.querySelectorAll('[id^="map-tab-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('map-tab-' + type).classList.add('active');
}

// ---- Warning Charts ----
let warningChartsInited = false;
function initWarningCharts() {
  // Risk score cards
  const scores = [
    { label:'综合风险指数', val:78, sub:'高风险 ↑16', color:'#f97316' },
    { label:'贸易政策风险', val:91, sub:'关税战极端风险', color:'#ef4444' },
    { label:'汇率波动风险', val:41, sub:'人民币承压', color:'#eab308' },
    { label:'地缘政治风险', val:82, sub:'多点冲突高位', color:'#ef4444' },
  ];
  document.getElementById('risk-scores').innerHTML = scores.map(s => `
    <div class="stat-card">
      <div style="font-size:32px;font-weight:700;color:${s.color};">${s.val}</div>
      <div style="font-size:13px;margin:4px 0;">${s.label}</div>
      <div style="font-size:11px;color:${s.color};">${s.sub}</div>
    </div>`).join('');

  // Red warnings
  document.getElementById('red-warnings').innerHTML = `<div style="font-size:13px;font-weight:600;color:#ef4444;margin-bottom:8px;">🔴 红色预警</div>` +
    WARNINGS_RED.map(w => `<div class="risk-card" style="border-color:#ef4444;margin-bottom:8px;">
      <div style="display:flex;gap:8px;align-items:flex-start;">
        <span style="font-size:20px;">${w.icon}</span>
        <div><div style="font-weight:600;font-size:13px;margin-bottom:4px;">${w.title}</div>
          <div style="font-size:12px;color:#94a3b8;">${w.body}</div></div>
      </div></div>`).join('');

  document.getElementById('orange-warnings').innerHTML = `<div style="font-size:13px;font-weight:600;color:#f97316;margin-bottom:8px;">🟠 橙色预警</div>` +
    WARNINGS_ORANGE.map(w => `<div class="risk-card" style="border-color:#f97316;margin-bottom:8px;">
      <div style="display:flex;gap:8px;align-items:flex-start;">
        <span style="font-size:20px;">${w.icon}</span>
        <div><div style="font-weight:600;font-size:13px;margin-bottom:4px;">${w.title}</div>
          <div style="font-size:12px;color:#94a3b8;">${w.body}</div></div>
      </div></div>`).join('');

  document.getElementById('green-opps').innerHTML = `<div style="font-size:13px;font-weight:600;color:#10b981;margin-bottom:8px;">✅ 绿色机遇</div>` +
    OPPS_GREEN.map(w => `<div class="risk-card" style="border-color:#10b981;margin-bottom:8px;">
      <div style="display:flex;gap:8px;align-items:flex-start;">
        <span style="font-size:20px;">${w.icon}</span>
        <div><div style="font-weight:600;font-size:13px;margin-bottom:4px;">${w.title}</div>
          <div style="font-size:12px;color:#94a3b8;">${w.body}</div></div>
      </div></div>`).join('');

  if (warningChartsInited) return;
  warningChartsInited = true;

  // FX chart
  const fxCtx = document.getElementById('fx-chart').getContext('2d');
  const months = ['1月','2月','3月','4月','5月','6月'];
  new Chart(fxCtx, {
    type:'line', data:{
      labels: months,
      datasets:[
        { label:'USD/CNY', data:[7.18,7.22,7.15,6.95,6.85,6.79], borderColor:'#f59e0b', tension:0.4, pointRadius:3 },
        { label:'EUR/CNY', data:[7.75,7.80,7.88,7.92,7.90,7.89], borderColor:'#60a5fa', tension:0.4, pointRadius:3 },
        { label:'GBP/CNY', data:[9.05,9.10,9.15,9.12,9.08,9.12], borderColor:'#a78bfa', tension:0.4, pointRadius:3 },
      ]
    },
    options:{ plugins:{legend:{labels:{color:'#94a3b8',font:{size:11}}}},
      scales:{ x:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#1e3a5f'}},
                y:{ticks:{color:'#64748b',font:{size:10}},grid:{color:'#1e3a5f'}} }}
  });

  // Commodity radar
  const rCtx = document.getElementById('commodity-radar').getContext('2d');
  new Chart(rCtx, {
    type:'radar', data:{
      labels:['原油','黄金','铜','钢铁','大豆','煤炭'],
      datasets:[{ data:[78,82,65,70,55,60], borderColor:'#0ea5e9', backgroundColor:'rgba(14,165,233,0.15)',
        pointBackgroundColor:'#0ea5e9' }]
    },
    options:{ plugins:{legend:{display:false}},
      scales:{ r:{ticks:{color:'#64748b',font:{size:9}},grid:{color:'#1e3a5f'},
        pointLabels:{color:'#94a3b8',font:{size:11}},suggestedMin:0,suggestedMax:100}} }
  });
}

// ---- Intel ----
let currentIntelFilter = 'all';
function filterIntel(cat) {
  currentIntelFilter = cat;
  document.querySelectorAll('[id^="intel-tab-"]').forEach(b => b.classList.remove('active'));
  document.getElementById('intel-tab-' + cat).classList.add('active');
  loadIntel();
}

function loadIntel() {
  const list = currentIntelFilter === 'all' ? INTEL_DATA : INTEL_DATA.filter(i => i.cat === currentIntelFilter);
  document.getElementById('intel-list').innerHTML = list.map(item => {
    const badgeClass = item.tag === '高风险' ? 'badge-red' : item.tag === '中风险' ? 'badge-orange' : 'badge-green';
    return `<div class="news-card">
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">
        <span class="${badgeClass}">${item.tag}</span>
        <span style="font-size:11px;color:#64748b;">${item.src}</span>
        <span style="font-size:11px;color:#475569;">· ${item.time}</span>
      </div>
      <h4 style="margin:0 0 6px;font-size:14px;color:#e2e8f0;">${item.title}</h4>
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;line-height:1.6;">${item.body}</p>
      <a href="${item.url}" target="_blank" style="font-size:11px;color:#0ea5e9;text-decoration:none;">🔗 阅读原文 ↗</a>
    </div>`;
  }).join('') || '<div style="text-align:center;padding:40px;color:#475569;">该分类暂无情报</div>';
}

function setIntelTime() {
  const now = new Date();
  document.getElementById('intel-time').textContent = now.toLocaleString('zh-CN');
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  // default: think tank demand
  initDemandPanels();
});
