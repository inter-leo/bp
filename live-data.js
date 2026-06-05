// ============================================================
// LIVE DATA MODULE - 实时API接入
// 数据源：
//   1. 汇率       → open.er-api.com (免费，无需Key)
//   2. 大宗商品    → Yahoo Finance非官方API (免费，无需Key)
//   3. 国家经济    → World Bank API (免费，无需Key)
//   4. 贸易新闻    → Google News RSS via allorigins.win (免费，无需Key)
//   5. 地缘风险    → GDELT Project API (免费，无需Key)
// ============================================================

const CORS_PROXY = 'https://api.allorigins.win/get?url=';

// ── 1. 汇率 open.er-api.com ──────────────────────────────────
async function fetchLiveFX() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const d = await res.json();
    if (d.result !== 'success') return;
    const r = d.rates;
    const cny = r.CNY;

    // 更新 Ticker Bar
    const usdcny = cny.toFixed(4);
    const eurcny = (cny / r.EUR).toFixed(4);
    const gbpcny = (cny / r.GBP).toFixed(4);

    const tUsd = document.getElementById('t-usd');
    const tEur = document.getElementById('t-eur');
    const tGbp = document.getElementById('t-gbp');
    if (tUsd) tUsd.textContent = usdcny;
    if (tEur) tEur.textContent = eurcny;
    if (tGbp) tGbp.textContent = gbpcny;

    // 保存供图表使用
    window._liveFX = {
      usdcny: parseFloat(usdcny),
      eurcny: parseFloat(eurcny),
      gbpcny: parseFloat(gbpcny),
      updated: new Date().toLocaleString('zh-CN')
    };

    // 如果风险预警汇率图已渲染，更新图表
    updateFXChart();
    console.log('[LiveData] 汇率更新成功', window._liveFX);
  } catch (e) {
    console.warn('[LiveData] 汇率获取失败，使用静态数据', e.message);
  }
}

function updateFXChart() {
  if (!window._liveFX || !window._fxChartInstance) return;
  const chart = window._fxChartInstance;
  const fx = window._liveFX;
  // 在末尾追加当前值（用当月实时值覆盖最后一格）
  const usdData = chart.data.datasets[0].data;
  const eurData = chart.data.datasets[1].data;
  const gbpData = chart.data.datasets[2].data;
  usdData[usdData.length - 1] = fx.usdcny;
  eurData[eurData.length - 1] = fx.eurcny;
  gbpData[gbpData.length - 1] = fx.gbpcny;
  chart.update('none');
}

// ── 2. 大宗商品 Yahoo Finance ─────────────────────────────────
const YAHOO_SYMBOLS = {
  'GC=F':  { label: '伦敦金',   unit: '/oz',   tickerId: 'ticker-gold',   radarIdx: 1 },
  'CL=F':  { label: '布伦特油', unit: '/桶',   tickerId: 'ticker-oil',    radarIdx: 0 },
  'HG=F':  { label: '铜',       unit: '/磅',   tickerId: null,            radarIdx: 2 },
  'ZW=F':  { label: '小麦',     unit: '/蒲式耳',tickerId: null,           radarIdx: 5 },
  'ZS=F':  { label: '大豆',     unit: '/蒲式耳',tickerId: null,           radarIdx: 4 },
  'SB=F':  { label: '钢铁指数', unit: '',      tickerId: null,            radarIdx: 3 },
};

async function fetchOneYahoo(symbol) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
  const proxyUrl = CORS_PROXY + encodeURIComponent(url);
  const res = await fetch(proxyUrl);
  const wrapper = await res.json();
  const data = JSON.parse(wrapper.contents);
  const meta = data.chart.result[0].meta;
  return {
    symbol,
    price: meta.regularMarketPrice,
    prevClose: meta.chartPreviousClose,
    label: YAHOO_SYMBOLS[symbol].label,
    unit: YAHOO_SYMBOLS[symbol].unit,
  };
}

async function fetchLiveCommodities() {
  const symbols = Object.keys(YAHOO_SYMBOLS);
  const results = await Promise.allSettled(symbols.map(s => fetchOneYahoo(s)));

  const prices = {};
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      prices[symbols[i]] = r.value;
    }
  });

  // 更新 Ticker - 金价
  if (prices['GC=F']) {
    const gold = prices['GC=F'];
    const change = ((gold.price - gold.prevClose) / gold.prevClose * 100).toFixed(1);
    const cls = change >= 0 ? 'up' : 'dn';
    const tickerGold = document.querySelector('.ticker-gold');
    if (tickerGold) {
      tickerGold.innerHTML = `●伦敦金 <span class="${cls}">$${gold.price.toFixed(0)}</span>/oz`;
    }
    // 更新第一个 ticker item
    const items = document.querySelectorAll('.ticker-item');
    if (items.length > 0) {
      items[0].innerHTML = `●伦敦金 <span class="${cls}">$${gold.price.toFixed(0)}</span>/oz`;
      if (items.length > 8) items[8].innerHTML = items[0].innerHTML;
    }
  }

  // 更新 Ticker - 原油
  if (prices['CL=F']) {
    const oil = prices['CL=F'];
    const change = ((oil.price - oil.prevClose) / oil.prevClose * 100).toFixed(1);
    const cls = change >= 0 ? 'up' : 'dn';
    const items = document.querySelectorAll('.ticker-item');
    if (items.length > 4) {
      items[4].innerHTML = `●布伦特原油 <span class="${cls}">$${oil.price.toFixed(1)}</span>/桶`;
      if (items.length > 12) items[12].innerHTML = items[4].innerHTML;
    }
  }

  // 更新大宗商品雷达图
  window._liveCommodities = prices;
  updateCommodityRadar(prices);

  // 更新风险预警看板顶部行情条
  updateCommodityBadges(prices);

  console.log('[LiveData] 大宗商品更新成功', Object.keys(prices));
}

function updateCommodityRadar(prices) {
  if (!window._commodityRadarInstance) return;
  const chart = window._commodityRadarInstance;
  // labels: ['原油','黄金','铜','钢铁','大豆','煤炭']
  // 转换为0-100的相对指数（基于52周区间）
  const symbolMap = ['CL=F', 'GC=F', 'HG=F', null, 'ZS=F', null];
  const newData = symbolMap.map((sym, i) => {
    if (!sym || !prices[sym]) return chart.data.datasets[0].data[i];
    const p = prices[sym].price;
    const prev = prices[sym].prevClose;
    // 用涨跌幅映射到 50±30 的指数
    const chg = (p - prev) / prev * 100;
    const base = chart.data.datasets[0].data[i];
    return Math.min(99, Math.max(20, base + chg * 2));
  });
  chart.data.datasets[0].data = newData;
  chart.update('none');
}

function updateCommodityBadges(prices) {
  // 在风险预警看板的能源部分更新油价信息
  const el = document.getElementById('live-oil-badge');
  if (el && prices['CL=F']) {
    const oil = prices['CL=F'];
    const chg = ((oil.price - oil.prevClose) / oil.prevClose * 100).toFixed(2);
    const cls = chg >= 0 ? 'up' : 'dn';
    el.innerHTML = `布伦特原油 <span class="${cls}">${chg >= 0 ? '+' : ''}${chg}%</span> $${oil.price.toFixed(1)}`;
  }
}

// ── 3. 国家经济数据 World Bank API ───────────────────────────
// 指标代码
const WB_INDICATORS = {
  'NY.GDP.PCAP.CD': 'gdpPerCapita',  // 人均GDP (现价美元)
  'SP.POP.TOTL':    'population',     // 总人口
  'IT.NET.USER.ZS': 'internetPct',    // 互联网普及率(%)
};

async function fetchWorldBankData(countryCode, indicator) {
  const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator}?format=json&mrv=1&per_page=1`;
  const res = await fetch(url);
  const d = await res.json();
  if (!d[1] || !d[1][0]) return null;
  return d[1][0].value;
}

async function fetchLiveCountryData() {
  // 只更新前10个高优先级国家（避免请求过多）
  const priority = ['US', 'DE', 'GB', 'JP', 'AU', 'CN', 'IN', 'FR', 'KR', 'CA'];

  try {
    const updates = {};
    await Promise.allSettled(priority.map(async (code) => {
      const [gdp, pop, net] = await Promise.allSettled([
        fetchWorldBankData(code, 'NY.GDP.PCAP.CD'),
        fetchWorldBankData(code, 'SP.POP.TOTL'),
        fetchWorldBankData(code, 'IT.NET.USER.ZS'),
      ]);
      updates[code] = {
        gdp:  gdp.status  === 'fulfilled' && gdp.value  ? Math.round(gdp.value)  : null,
        pop:  pop.status  === 'fulfilled' && pop.value  ? Math.round(pop.value / 1e6) : null,
        net:  net.status  === 'fulfilled' && net.value  ? Math.round(net.value)  : null,
      };
    }));

    // 将实时数据合并进 COUNTRIES 数组
    COUNTRIES.forEach(c => {
      const u = updates[c.code];
      if (!u) return;
      if (u.gdp)  c.gdp  = u.gdp;
      if (u.pop)  c.pop  = u.pop;
      if (u.net)  c.net  = u.net;
    });

    window._worldBankUpdated = true;
    console.log('[LiveData] World Bank 数据更新成功', Object.keys(updates).length, '个国家');
  } catch (e) {
    console.warn('[LiveData] World Bank 数据获取失败，使用静态数据', e.message);
  }
}

// ── 4. 贸易新闻 Google News RSS ───────────────────────────────
const NEWS_QUERIES = [
  { q: 'global+trade+tariff+2026',  cat: 'trade',    label: '贸易' },
  { q: 'shipping+freight+red+sea',  cat: 'shipping', label: '航运' },
  { q: 'oil+price+energy+market',   cat: 'energy',   label: '能源' },
  { q: 'trade+policy+WTO+customs',  cat: 'policy',   label: '政策' },
];

function parseRSSItem(item) {
  const title   = (item.querySelector('title')?.textContent || '').replace('<![CDATA[','').replace(']]>','').trim();
  const link    = item.querySelector('link')?.textContent?.trim() || '#';
  const pubDate = item.querySelector('pubDate')?.textContent?.trim() || '';
  const source  = item.querySelector('source')?.textContent?.trim() ||
                  new URL(link.startsWith('http') ? link : 'https://news.google.com').hostname.replace('www.','');
  const desc    = (item.querySelector('description')?.textContent || '').replace(/<[^>]+>/g,'').slice(0,120);

  // 简单风险关键词判断
  const riskWords = ['tariff','sanction','ban','war','conflict','crisis','restrict','penalty','fine','block'];
  const lowWords  = ['cooperation','deal','agreement','growth','expand','sign'];
  const t = title.toLowerCase();
  const tag = riskWords.some(w => t.includes(w)) ? '高风险' :
              lowWords.some(w => t.includes(w))  ? '低影响' : '中风险';

  const timeAgo = pubDate ? relativeTime(new Date(pubDate)) : '未知时间';

  return { title, link, source, desc, tag, timeAgo };
}

function relativeTime(date) {
  const diff = Date.now() - date.getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1)   return '刚刚';
  if (h < 24)  return `${h}小时前`;
  const d = Math.floor(h / 24);
  if (d < 30)  return `${d}天前`;
  return `${Math.floor(d/30)}个月前`;
}

async function fetchLiveNews() {
  const allItems = [];

  await Promise.allSettled(NEWS_QUERIES.map(async (q) => {
    try {
      const rssUrl = `https://news.google.com/rss/search?q=${q.q}&hl=en-US&gl=US&ceid=US:en`;
      const proxyUrl = CORS_PROXY + encodeURIComponent(rssUrl);
      const res = await fetch(proxyUrl);
      const wrapper = await res.json();
      const parser = new DOMParser();
      const xml = parser.parseFromString(wrapper.contents, 'text/xml');
      const items = Array.from(xml.querySelectorAll('item')).slice(0, 5);
      items.forEach(item => {
        const parsed = parseRSSItem(item);
        allItems.push({ ...parsed, cat: q.cat });
      });
    } catch (e) {
      console.warn(`[LiveData] 新闻获取失败 (${q.label})`, e.message);
    }
  }));

  if (allItems.length === 0) {
    console.warn('[LiveData] 新闻全部获取失败，保留静态数据');
    return;
  }

  // 按时间排序
  window._liveNews = allItems;
  console.log('[LiveData] 新闻更新成功', allItems.length, '条');

  // 如果当前在情报流模块，立即刷新显示
  if (document.getElementById('intel-list')) {
    renderLiveNews(currentIntelFilter || 'all');
  }
}

function renderLiveNews(filter) {
  const items = window._liveNews || INTEL_DATA;
  const list = filter === 'all' ? items : items.filter(i => i.cat === filter);

  const container = document.getElementById('intel-list');
  if (!container) return;

  // 判断是静态数据还是实时数据
  const isLive = !!window._liveNews;

  container.innerHTML = list.slice(0, 20).map(item => {
    const badgeClass = item.tag === '高风险' ? 'badge-red' :
                       item.tag === '中风险' ? 'badge-orange' : 'badge-green';
    const url  = item.url  || item.link  || '#';
    const body = item.body || item.desc  || '';
    const time = item.time || item.timeAgo || '';
    const src  = item.src  || item.source || '';

    return `<div class="news-card">
      <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;flex-wrap:wrap;">
        <span class="${badgeClass}">${item.tag}</span>
        ${isLive ? '<span class="badge-blue">实时</span>' : ''}
        <span style="font-size:11px;color:#64748b;">${src}</span>
        <span style="font-size:11px;color:#475569;">· ${time}</span>
      </div>
      <h4 style="margin:0 0 6px;font-size:14px;color:#e2e8f0;">${item.title}</h4>
      <p style="margin:0 0 8px;font-size:12px;color:#94a3b8;line-height:1.6;">${body}</p>
      <a href="${url}" target="_blank" style="font-size:11px;color:#0ea5e9;text-decoration:none;">🔗 阅读原文 ↗</a>
    </div>`;
  }).join('') || '<div style="text-align:center;padding:40px;color:#475569;">该分类暂无情报</div>';
}

// ── 5. 地缘风险 GDELT Project ─────────────────────────────────
async function fetchGDELTRisk() {
  try {
    // GDELT GKG 最近15分钟的冲突事件数
    const url = 'https://api.gdeltproject.org/api/v2/doc/doc?query=conflict%20OR%20war%20OR%20sanction%20sourcelang:english&mode=artlist&maxrecords=10&format=json';
    const proxyUrl = CORS_PROXY + encodeURIComponent(url);
    const res = await fetch(proxyUrl);
    const wrapper = await res.json();
    const data = JSON.parse(wrapper.contents);

    if (!data.articles || data.articles.length === 0) return;

    const riskArticles = data.articles.slice(0, 6).map(a => ({
      title:   a.title,
      url:     a.url,
      src:     a.domain,
      timeAgo: relativeTime(new Date(a.seendate?.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/, '$1-$2-$3T$4:$5:$6'))),
      tag:     '高风险',
      cat:     'policy',
      body:    a.title,
    }));

    // 追加到新闻流
    if (window._liveNews) {
      // 去重追加
      const existing = new Set(window._liveNews.map(n => n.title));
      riskArticles.filter(a => !existing.has(a.title)).forEach(a => window._liveNews.unshift(a));
    } else {
      window._liveNews = riskArticles;
    }

    // 更新地缘风险指数（基于事件数量动态调整）
    const count = data.articles.length;
    const riskEl = document.querySelector('#risk-scores .stat-card:last-child .text-3xl, #risk-scores div:last-child div:first-child');
    if (riskEl) {
      const newScore = Math.min(99, 70 + count * 2);
      riskEl.textContent = newScore;
    }

    console.log('[LiveData] GDELT 地缘风险更新成功', count, '条事件');
  } catch (e) {
    console.warn('[LiveData] GDELT 获取失败，使用静态预警数据', e.message);
  }
}

// ── 覆盖 app.js 中的 loadIntel / filterIntel ─────────────────
// 在 live-data.js 加载后，重写这两个函数以支持实时数据
function _overrideIntelFunctions() {
  window.filterIntel = function(cat) {
    currentIntelFilter = cat;
    document.querySelectorAll('[id^="intel-tab-"]').forEach(b => b.classList.remove('active'));
    const tabEl = document.getElementById('intel-tab-' + cat);
    if (tabEl) tabEl.classList.add('active');
    renderLiveNews(cat);
  };

  window.loadIntel = async function() {
    const container = document.getElementById('intel-list');
    if (container) container.innerHTML = '<div style="text-align:center;padding:40px;color:#94a3b8;">⏳ 正在拉取实时情报...</div>';
    await fetchLiveNews();
    await fetchGDELTRisk();
    renderLiveNews(currentIntelFilter || 'all');
    setIntelTime();
  };
}

// ── 覆盖 initWarningCharts 注册图表实例 ──────────────────────
function _patchWarningCharts() {
  const origInit = window.initWarningCharts;
  window.initWarningCharts = function() {
    origInit();
    // 注册图表实例以供实时更新
    const allCharts = Object.values(Chart.instances || {});
    allCharts.forEach(c => {
      if (c.canvas?.id === 'fx-chart')         window._fxChartInstance = c;
      if (c.canvas?.id === 'commodity-radar') window._commodityRadarInstance = c;
    });
    // 有实时汇率数据则立即更新图表
    if (window._liveFX) updateFXChart();
    if (window._liveCommodities) updateCommodityRadar(window._liveCommodities);
  };
}

// ── 初始化：按优先级并发加载 ─────────────────────────────────
async function initLiveData() {
  console.log('[LiveData] 开始加载实时数据...');

  _overrideIntelFunctions();
  _patchWarningCharts();

  // 优先加载轻量、用户立即可见的数据
  await Promise.allSettled([
    fetchLiveFX(),
    fetchLiveCommodities(),
  ]);

  // 后台加载耗时较长的数据
  fetchLiveNews().then(() => {
    fetchGDELTRisk();
  });

  // World Bank 数据量大，最后加载
  setTimeout(() => fetchLiveWorldBank(), 3000);

  // 每5分钟自动刷新汇率和商品价格
  setInterval(fetchLiveFX, 5 * 60 * 1000);
  setInterval(fetchLiveCommodities, 5 * 60 * 1000);

  console.log('[LiveData] 初始化完成');
}

async function fetchLiveWorldBank() {
  await fetchLiveCountryData();
}

// DOM ready 后启动
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLiveData);
} else {
  initLiveData();
}
