// ============================================================
// COUNTRIES DATA - 35 Countries
// ============================================================
const COUNTRIES = [
  // 欧洲 (19)
  { code:'GB', name:'英国',    region:'欧洲', flag:'🇬🇧', gdp:47000, pop:67,  net:97, imports:78, score:92, lang:'英语', currency:'GBP', risk:35, growth:2.1 },
  { code:'DE', name:'德国',    region:'欧洲', flag:'🇩🇪', gdp:52000, pop:84,  net:94, imports:85, score:91, lang:'德语', currency:'EUR', risk:30, growth:1.8 },
  { code:'FR', name:'法国',    region:'欧洲', flag:'🇫🇷', gdp:44000, pop:68,  net:93, imports:72, score:88, lang:'法语', currency:'EUR', risk:32, growth:1.9 },
  { code:'ES', name:'西班牙',  region:'欧洲', flag:'🇪🇸', gdp:34000, pop:47,  net:92, imports:58, score:84, lang:'西班牙语', currency:'EUR', risk:36, growth:2.5 },
  { code:'NL', name:'荷兰',    region:'欧洲', flag:'🇳🇱', gdp:57000, pop:18,  net:96, imports:65, score:90, lang:'荷兰语', currency:'EUR', risk:28, growth:2.0 },
  { code:'IT', name:'意大利',  region:'欧洲', flag:'🇮🇹', gdp:38000, pop:60,  net:90, imports:61, score:82, lang:'意大利语', currency:'EUR', risk:40, growth:1.2 },
  { code:'PL', name:'波兰',    region:'欧洲', flag:'🇵🇱', gdp:22000, pop:38,  net:88, imports:42, score:79, lang:'波兰语', currency:'PLN', risk:38, growth:3.1 },
  { code:'CH', name:'瑞士',    region:'欧洲', flag:'🇨🇭', gdp:82000, pop:9,   net:97, imports:35, score:89, lang:'德/法/意', currency:'CHF', risk:22, growth:1.5 },
  { code:'BE', name:'比利时',  region:'欧洲', flag:'🇧🇪', gdp:50000, pop:11,  net:95, imports:40, score:87, lang:'法/荷兰语', currency:'EUR', risk:29, growth:1.7 },
  { code:'SE', name:'瑞典',    region:'欧洲', flag:'🇸🇪', gdp:55000, pop:10,  net:96, imports:32, score:88, lang:'瑞典语', currency:'SEK', risk:25, growth:2.0 },
  { code:'RO', name:'罗马尼亚', region:'砍沙', flag:'🇷🇴', gdp:15000, pop:19,  net:78, imports:22, score:70, lang:'罗马尼亚语', currency:'RON', risk:45, growth:3.8 },
  { code:'PT', name:'葡萄牙',  region:'欧洲', flag:'🇵🇹', gdp:28000, pop:10,  net:89, imports:25, score:78, lang:'葡萄牙语', currency:'EUR', risk:34, growth:2.2 },
  { code:'DK', name:'丹麦',    region:'欧洲', flag:'🇩🇰', gdp:62000, pop:6,   net:97, imports:28, score:88, lang:'丹麦语', currency:'DKK', risk:23, growth:1.8 },
  { code:'AT', name:'奥地利',  region:'欧洲', flag:'🇦🇹', gdp:53000, pop:9,   net:95, imports:30, score:87, lang:'德语', currency:'EUR', risk:27, growth:1.9 },
  { code:'CZ', name:'捷克',    region:'欧洲', flag:'🇨🇿', gdp:28000, pop:11,  net:90, imports:28, score:80, lang:'捷克语', currency:'CZK', risk:33, growth:2.9 },
  { code:'IE', name:'爱尔兰',  region:'欧洲', flag:'🇮🇪', gdp:85000, pop:5,   net:96, imports:22, score:86, lang:'英语', currency:'EUR', risk:26, growth:4.5 },
  { code:'GR', name:'希腊',    region:'欧洲', flag:'🇬🇷', gdp:22000, pop:11,  net:82, imports:18, score:72, lang:'希腊语', currency:'EUR', risk:44, growth:2.6 },
  { code:'HU', name:'匈牙利',  region:'欧洲', flag:'🇭🇺', gdp:19000, pop:10,  net:85, imports:20, score:74, lang:'匈牙利语', currency:'HUF', risk:42, growth:3.2 },
  { code:'NO', name:'挪威',    region:'欧洲', flag:'🇳🇴', gdp:89000, pop:5,   net:98, imports:24, score:88, lang:'挪威语', currency:'NOK', risk:20, growth:2.3 },
  // 亚洲 (10)
  { code:'ID', name:'印尼',    region:'亚洲', flag:'🇮🇩', gdp:5000,  pop:275, net:78, imports:55, score:81, lang:'印尼语', currency:'IDR', risk:42, growth:5.2 },
  { code:'PH', name:'菲律宾',  region:'亚洲', flag:'🇵🇭', gdp:4000,  pop:113, net:75, imports:40, score:76, lang:'菲律宾语', currency:'PHP', risk:46, growth:6.0 },
  { code:'MY', name:'马来西亚', region:'亚洲', flag:'🇲🇾', gdp:13000, pop:33,  net:90, imports:45, score:83, lang:'马来语', currency:'MYR', risk:35, growth:4.5 },
  { code:'VN', name:'越南',    region:'亚洲', flag:'🇻🇳', gdp:4500,  pop:97,  net:78, imports:62, score:80, lang:'越南语', currency:'VND', risk:40, growth:6.5 },
  { code:'TH', name:'泰国',    region:'亚洲', flag:'🇹🇭', gdp:9000,  pop:70,  net:88, imports:48, score:82, lang:'泰语', currency:'THB', risk:38, growth:3.8 },
  { code:'JP', name:'日本',    region:'亚洲', flag:'🇯🇵', gdp:42000, pop:125, net:96, imports:98, score:93, lang:'日语', currency:'JPY', risk:28, growth:1.1 },
  { code:'IN', name:'印度',    region:'亚洲', flag:'🇮🇳', gdp:2800,  pop:1420,net:52, imports:88, score:85, lang:'印地语/英语', currency:'INR', risk:44, growth:7.2 },
  { code:'KR', name:'韩国',    region:'亚洲', flag:'🇰🇷', gdp:35000, pop:52,  net:97, imports:72, score:90, lang:'韩语', currency:'KRW', risk:30, growth:2.8 },
  { code:'SA', name:'沙特',    region:'砍沙', flag:'🇸🇦', gdp:28000, pop:36,  net:82, imports:58, score:84, lang:'阿拉伯语', currency:'SAR', risk:38, growth:3.5 },
  { code:'AE', name:'阿联酋',  region:'砍沙', flag:'🇦🇪', gdp:48000, pop:10,  net:99, imports:65, score:88, lang:'阿拉伯语', currency:'AED', risk:32, growth:4.0 },
  // 北美 (2)
  { code:'US', name:'美国',    region:'北美', flag:'🇺🇸', gdp:63000, pop:335, net:95, imports:520,score:95, lang:'英语', currency:'USD', risk:45, growth:2.8 },
  { code:'CA', name:'加拿大',  region:'北美', flag:'🇨🇦', gdp:51000, pop:40,  net:94, imports:85, score:90, lang:'英语/法语', currency:'CAD', risk:28, growth:2.2 },
  // 拉美 (2)
  { code:'MX', name:'墨西哥',  region:'拉美', flag:'🇲🇽', gdp:11000, pop:130, net:76, imports:58, score:79, lang:'西班牙语', currency:'MXN', risk:48, growth:3.2 },
  { code:'BR', name:'巴西',    region:'拉美', flag:'🇧🇷', gdp:9000,  pop:215, net:84, imports:72, score:77, lang:'葡萄牙语', currency:'BRL', risk:52, growth:2.9 },
  // 大洋洲 (2)
  { code:'AU', name:'澳大利亚', region:'大洋洲', flag:'🇦🇺', gdp:56000, pop:26, net:96, imports:68, score:91, lang:'英语', currency:'AUD', risk:25, growth:2.4 },
  { code:'NZ', name:'新西兰',  region:'大洋洲', flag:'🇳🇿', gdp:44000, pop:5,  net:97, imports:22, score:87, lang:'英语', currency:'NZD', risk:22, growth:2.1 },
];

// Compliance database
const COMPLY_DB = {
  '消费电子': {
    'US':  { certs:['FCC','UL','Energy Star'], tariff:'7.5%-25%', note:'需TSCA合规及防倾销申报' },
    'EU':  { certs:['CE','RoHS','WEEE','ErP'], tariff:'0%-3.7%', note:'CBAM碳边境税2026起执行' },
    'GB':  { certs:['UKCA','RoHS UK'], tariff:'0%-6%', note:'脱欧后需单独UKCA认证' },
    'JP':  { certs:['PSE','VCCI','Telec'], tariff:'0%-4%', note:'需JIS标准检测' },
    'AU':  { certs:['RCM','SAA'], tariff:'0%-5%', note:'电气安全需SAA认证' },
    'CA':  { certs:['IC','CSA','Energy Star CA'], tariff:'0%-5%', note:'需IC无线电认证' },
    'KR':  { certs:['KC','EK'], tariff:'8%', note:'需韩语标签及KC认证' },
    'IN':  { certs:['BIS','WPC'], tariff:'20%-28%', note:'强制BIS认证，关税较高' },
    'SA':  { certs:['SASO','GSO'], tariff:'5%', note:'GCC海关联盟统一税率' },
    'AE':  { certs:['ESMA','TRA'], tariff:'5%', note:'迪拜转口贸易便利' },
    'BR':  { certs:['ANATEL','INMETRO'], tariff:'18%-28%', note:'ICMS州税叠加，成本显著增加' },
    'MX':  { certs:['NOM','IFETEL'], tariff:'15%', note:'USMCA豁免可降至0%' },
  },
  '食品及饮料': {
    'US':  { certs:['FDA','FSMA','USDA'], tariff:'0%-25%', note:'需在FDA注册，进口商须签订保证书' },
    'EU':  { certs:['HACCP','有机认证'], tariff:'0%-15%', note:'农残检测标准严格，部分品类禁止进口' },
    'GB':  { certs:['FSA','HACCP'], tariff:'0%-12%', note:'脱欧后新增边境检查' },
    'JP':  { certs:['JAS','食品卫生法'], tariff:'5%-50%', note:'农产品关税极高，加工食品相对低' },
    'AU':  { certs:['FSANZ','检疫许可'], tariff:'0%-10%', note:'生物安全检疫要求严格' },
    'KR':  { certs:['KFDA认证'], tariff:'8%-45%', note:'泡菜/大米保护关税高' },
    'SA':  { certs:['SFDA','清真认证'], tariff:'5%', note:'清真认证是必要条件' },
    'AE':  { certs:['ESMA食品安全','清真'], tariff:'5%', note:'迪拜是中东最大食品分销枢纽' },
    'IN':  { certs:['FSSAI'], tariff:'30%-100%', note:'印度食品进口关税普遍较高' },
    'CA':  { certs:['CFIA','SFCR'], tariff:'0%-8%', note:'CPTPP协定降税中' },
    'BR':  { certs:['MAPA','ANVISA'], tariff:'10%-35%', note:'MERCOSUR关税联盟，需注意产地证书' },
    'MX':  { certs:['COFEPRIS','NOM'], tariff:'0%-45%', note:'USMCA农产品0关税' },
  },
  '服装及配饰': {
    'US':  { certs:['CPSC','FTC标签法'], tariff:'12%-32%', note:'纺织品关税高，需注明产地和成分' },
    'EU':  { certs:['REACH','纺织标签法规'], tariff:'6%-12%', note:'化学物质REACH限制严格' },
    'GB':  { certs:['UK REACH','纺织标签'], tariff:'10%-12%', note:'英国独立REACH法规' },
    'JP':  { certs:['家用品品质标注法'], tariff:'5%-14%', note:'需日语成分标签' },
    'AU':  { certs:['ACL合规'], tariff:'0%-10%', note:'需澳大利亚消费者法合规' },
    'KR':  { certs:['KC纺织品'], tariff:'13%', note:'韩国时尚市场本土品牌强势' },
    'SA':  { certs:['SASO服装规定'], tariff:'5%', note:'女性服装需遵守特殊规定' },
    'AE':  { certs:['ESMA'], tariff:'5%', note:'迪拜是中东时尚中心' },
    'IN':  { certs:['BIS纺织品'], tariff:'20%-40%', note:'强制BIS认证，本土棉花保护' },
    'CA':  { certs:['CGSB标签'], tariff:'16%-18%', note:'需法英双语标签' },
    'BR':  { certs:['ABNT'], tariff:'20%-35%', note:'进口替代政策保护本土纺织' },
    'MX':  { certs:['NOM-004'], tariff:'25%-30%', note:'USMCA纺织原产地规则复杂' },
  },
};

// Add default fallback
COUNTRIES.forEach(c => {
  if (!COMPLY_DB['消费电子'][c.code]) {
    COMPLY_DB['消费电子'][c.code] = { certs:['当地认证'], tariff:'5%-15%', note:'请查阅当地监管机构要求' };
  }
});

// Trend data
const TRENDS = [
  { icon:'⚡', name:'户外储能', heat:96, yoy:'+185%', top:'美国/澳大利亚/德国', note:'露营经济爆发，大容量便携储能需求激增' },
  { icon:'🤖', name:'AI智能家居', heat:94, yoy:'+120%', top:'美国/英国/日本', note:'语音控制+AI联动，2026年爆发式增长' },
  { icon:'🚴', name:'电动自行车', heat:91, yoy:'+78%', top:'德国/荷兰/法国', note:'欧洲城市通勤政策支持，补贴力度大' },
  { icon:'🌱', name:'可持续产品', heat:89, yoy:'+65%', top:'北欧/英国/加拿大', note:'ESG消费意识提升，绿色溢价明显' },
  { icon:'💆', name:'健康护理设备', heat:88, yoy:'+55%', top:'日本/韩国/美国', note:'老龄化加速，家用医疗设备需求持续' },
  { icon:'📱', name:'折叠屏手机壳', heat:85, yoy:'+210%', top:'韩国/美国/日本', note:'折叠屏渗透率提升带动配件市场' },
  { icon:'🐾', name:'宠物智能用品', heat:84, yoy:'+92%', top:'美国/澳大利亚/英国', note:'宠物经济持续高景气，智能化升级' },
  { icon:'🎮', name:'云游戏外设', heat:82, yoy:'+68%', top:'美国/韩国/日本', note:'云游戏渗透率提升，专用外设崛起' },
];

// Intel news data
const INTEL_DATA = [
  { tag:'高风险', cat:'policy', src:'USTR 301调查', time:'2小时前', title:'USTR发布60国301关税调查提案：全球贸易格局面临重塑', body:'美国贸易代表办公室正式发布针对60个国家的301条款关税调查提案，涵盖贸易逆差、知识产权、市场准入三大领域。', url:'https://ustr.gov' },
  { tag:'高风险', cat:'shipping', src:'Reuters', time:'4小时前', title:'中东停火谈判进入关键阶段：红海航运恢复预期升温', body:'以色列与哈马斯在多哈进行新一轮停火谈判，若达成停火协议，亚欧航线有望恢复苏伊士运河通行，预计运费下降40-55%。', url:'https://reuters.com' },
  { tag:'高风险', cat:'shipping', src:'Lloyd\'s List', time:'6小时前', title:'红海危机持续：绕行好望角成本累计超800亿美元', body:'2026年上半年已发生超120起袭击事件，全球90%以上亚欧航线被迫绕行好望角，SCFI亚欧线维持3500+高位。', url:'https://lloydslist.com' },
  { tag:'高风险', cat:'policy', src:'EU Official Journal', time:'3天前', title:'欧盟CBAM碳边境税首批缴费通知：中国钢企影响最大', body:'欧盟CBAM机制首批正式缴费通知发出，钢铁、铝材进口商须按嵌入碳排放购买证书(EUR 68/吨CO₂)。中国钢铁出口欧盟成本增加18-25%。', url:'https://ec.europa.eu' },
  { tag:'中风险', cat:'policy', src:'Panama Canal Authority', time:'5天前', title:'巴拿马运河恢复正常通行：美东航线运费回调18%', body:'巴拿马运河加通湖水位完全恢复，日均过闸量达36艘(满载)。太平洋-美东航线运费已较年初高点回落18%。', url:'https://pancanal.com' },
  { tag:'低影响', cat:'trade', src:'WTO', time:'10天前', title:'RCEP 2026年度关税减让生效：零关税品类再扩围', body:'RCEP第四轮年度关税减让于6月1日生效，中国与日本、韩国、东盟的零关税品类覆盖率分别提升至85%/89%/93%。', url:'https://wto.org' },
  { tag:'高风险', cat:'policy', src:'USTR', time:'2天前', title:'越南反规避调查裁定出炉：光伏/钢铁产品追缴税差', body:'美国商务部对越南出口的中国制造光伏电池板和钢铁制品作出反规避终裁，涉案企业须追缴23-47%反倾销税差额。', url:'https://ustr.gov' },
  { tag:'中风险', cat:'energy', src:'Bloomberg Energy', time:'5天前', title:'布伦特原油在$95-102区间震荡：中东局势主导', body:'OPEC+维持现有产量政策不变，布伦特原油受中东停火谈判消息反复影响宽幅震荡。', url:'https://bloomberg.com' },
  { tag:'高风险', cat:'trade', src:'Financial Times', time:'25天前', title:'Trump loses his trade superpower', body:'美国国际贸易法院裁定Section 122全球关税违法，对特朗普政府贸易政策构成重大挑战。', url:'https://ft.com' },
  { tag:'低影响', cat:'trade', src:'Saudi MISA', time:'18天前', title:'沙特MISA新政：中国制造企业享15年免税+本地优先', body:'沙特投资部更新制造业FDI优惠政策，对在沙特设立工厂的中国企业提供15年企业所得税豁免。', url:'https://misa.gov.sa' },
];

// Warning data
const WARNINGS_RED = [
  { title:'美国对华关税 145%', body:'中美综合关税维持极端水平，USTR第三轮豁免清单6月15日前提交申请', icon:'🇺🇸' },
  { title:'红海航运持续受阻', body:'胡塞武装袭击频率不减，2026年上半年超120起，亚欧航线绕行好望角成本增加', icon:'🚢' },
  { title:'欧盟CBAM正式执行', body:'碳边境税首批通知发出，钢铁铝材进口成本增18-25%，中国出口商合规压力剧增', icon:'🇪🇺' },
];
const WARNINGS_ORANGE = [
  { title:'越南反规避风险', body:'美国对越南出口中国制造商品追缴23-47%税差，供应链转移策略需重新评估', icon:'🇻🇳' },
  { title:'印度反倾销激增', body:'2026年前5月新立47起反规案件同比+85%，化工/钢铁/纺织受影响最大', icon:'🇮🇳' },
  { title:'布伦特油价高位震荡', body:'$95-102区间波动，航运燃油附加费同步上升，物流成本压力持续', icon:'⛽' },
];
const OPPS_GREEN = [
  { title:'沙特制造业FDI新政', body:'15年免税+政府采购加分，中东本土化布局窗口大幅开放', icon:'🇸🇦' },
  { title:'RCEP关税减让生效', body:'零关税品类覆盖率大幅提升，东南亚出口竞争力增强', icon:'🌏' },
  { title:'中国-GCC自贸谈判突破', body:'年底有望签署，出口GCC关税降至0-5%', icon:'🤝' },
];
