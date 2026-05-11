// 日常事项择吉模块
import { Solar, Lunar } from 'lunar-javascript';

/**
 * 黄历宜忌事项
 */
const HUANGLI_MATTERS = {
  宜: [
    '嫁娶', '祭祀', '祈福', '求嗣', '开光', '出行', '解除', '伐木',
    '入宅', '移徙', '安床', '开市', '交易', '立券', '挂匾', '栽种',
    '破土', '安葬', '启攒', '修坟', '立碑', '谢土', '纳采', '订盟',
    '冠笄', '裁衣', '会亲友', '进人口', '竖柱', '上梁', '修造', '动土',
    '起基', '定磉', '造庙', '安香', '出火', '纳畜', '牧养', '造畜稠',
    '教牛马', '破屋', '坏垣', '求医', '治病', '造车器', '嫁娶', '纳婿',
    '归宁', '安机械', '造船', '开池', '开厕', '结网', '畋猎', '取渔',
    '纳财', '开仓', '修饰垣墙', '平治道涂', '造桥', '作灶', '造仓',
    '修置产室', '开渠', '穿井', '塞穴', '筑堤', '补垣', '造畜椆栖',
    '修门', '盖屋', '合脊', '安门', '作梁', '修井', '扫舍', '放水',
    '造酒', '经络', '酝酿', '开柱眼', '开生坟', '合寿木', '修饰垣墙'
  ],
  忌: [
    '嫁娶', '安葬', '开市', '动土', '破土', '修造', '入宅', '移徙',
    '出行', '祈福', '祭祀', '安床', '栽种', '纳畜', '立券', '交易',
    '求医', '治病', '开光', '修坟', '作灶', '开仓', '纳财', '盖屋',
    '起基', '竖柱', '上梁', '造船', '开池', '穿井', '安门', '造桥',
    '筑堤', '开渠', '掘井', '补垣', '伐木', '纳采', '订盟', '嫁娶',
    '纳婿', '归宁', '安香', '出火', '挂匾', '拆卸', '破屋', '坏垣',
    '求嗣', '上册受封', '会亲友', '赴任', '临政亲民', '结婚姻',
    '纳财', '开市', '立券', '交易', '纳畜', '牧养', '纳采', '问名',
    '嫁娶', '冠笄', '安机械', '造车器', '祭祀', '祈福', '求嗣',
    '开光', '塑绘', '斋醮', '沐浴', '酬神', '造庙', '祀灶', '谢土'
  ]
};

/**
 * 十二建星
 */
const JIANXING = ['建', '除', '满', '平', '定', '执', '破', '危', '成', '收', '开', '闭'];

/**
 * 根据日期计算建星
 * 建星的计算规则：以月建为起点，按日支顺序排列
 */
function getJianxingByDate(lunar) {
  // 获取月支和日支
  const monthZhi = lunar.getMonthZhi();
  const dayZhi = lunar.getDayZhi();

  // 地支顺序
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

  // 获取月支和日支的索引
  const monthIndex = zhiOrder.indexOf(monthZhi);
  const dayIndex = zhiOrder.indexOf(dayZhi);

  // 计算建星索引：从月支开始，按日支顺序计算
  let jianxingIndex = (dayIndex - monthIndex + 12) % 12;

  return JIANXING[jianxingIndex];
}

/**
 * 获取冲煞
 */
function getChongSha(dayZhi) {
  const chongMap = {
    '子': '午马', '午': '子鼠',
    '丑': '未羊', '未': '丑牛',
    '寅': '申猴', '申': '寅虎',
    '卯': '酉鸡', '酉': '卯兔',
    '辰': '戌狗', '戌': '辰龙',
    '巳': '亥猪', '亥': '巳蛇'
  };
  return `冲${chongMap[dayZhi] || ''}`;
}

/**
 * 获取胎神
 */
function getTaiShen(dayGan, dayZhi) {
  const taiShenMap = {
    '甲子': '占门碓外东南', '乙丑': '碓磨厕外东南', '丙寅': '厨灶炉外正南',
    '丁卯': '仓库门外正南', '戊辰': '房床栖外正南', '己巳': '占门床外正南',
    '庚午': '占碓磨外西南', '辛未': '厨灶厕外西南', '壬申': '仓库炉外西南',
    '癸酉': '房床门外西南', '甲戌': '占房床外西南', '乙亥': '碓磨栖外西南'
  };
  const ganZhi = dayGan + dayZhi;
  return taiShenMap[ganZhi] || '占房床';
}

/**
 * 获取彭祖百忌
 */
function getPengZu(dayGan, dayZhi) {
  const ganMap = {
    '甲': '不开仓', '乙': '不栽植', '丙': '不修灶', '丁': '不剃头',
    '戊': '不受田', '己': '不破券', '庚': '不经络', '辛': '不合酱',
    '壬': '不汲水', '癸': '不词讼'
  };
  const zhiMap = {
    '子': '不问卜', '丑': '不冠带', '寅': '不祭祀', '卯': '不穿井',
    '辰': '不哭泣', '巳': '不远行', '午': '不苫盖', '未': '不服药',
    '申': '不安床', '酉': '不会客', '戌': '不吃犬', '亥': '不嫁娶'
  };
  return `${ganMap[dayGan] || ''} ${zhiMap[dayZhi] || ''}`;
}

/**
 * 建星吉凶
 */
const JIANXING_JIXIONG = {
  '建': { level: '中', description: '建日宜开业、上任、嫁娶，忌动土、出行' },
  '除': { level: '吉', description: '除日宜除旧布新、沐浴、求医、扫舍' },
  '满': { level: '吉', description: '满日宜祈福、嫁娶、开市、交易' },
  '平': { level: '吉', description: '平日万事皆可，平平安安' },
  '定': { level: '吉', description: '定日宜订婚、签约、交易、收财' },
  '执': { level: '凶', description: '执日宜捕捉、拆卸，忌嫁娶、搬家' },
  '破': { level: '凶', description: '破日诸事不宜，宜破旧立新' },
  '危': { level: '凶', description: '危日宜登高、乘船，忌出行、嫁娶' },
  '成': { level: '吉', description: '成日宜开业、嫁娶、入学、赴任' },
  '收': { level: '吉', description: '收日宜收纳、收藏、收账、收徒' },
  '开': { level: '吉', description: '开日宜开业、开工、开市、求财' },
  '闭': { level: '凶', description: '闭日宜修造、埋葬，忌开业、出行' }
};

/**
 * 二十八星宿
 */
const ERSHIBA_XINGXIU = [
  '角', '亢', '氐', '房', '心', '尾', '箕',
  '斗', '牛', '女', '虚', '危', '室', '壁',
  '奎', '娄', '胃', '昴', '毕', '觜', '参',
  '井', '鬼', '柳', '星', '张', '翼', '轸'
];

/**
 * 星宿吉凶
 */
const XINGXIU_JIXIONG = {
  '角': '吉', '亢': '凶', '氐': '凶', '房': '吉', '心': '凶', '尾': '吉', '箕': '吉',
  '斗': '吉', '牛': '凶', '女': '凶', '虚': '凶', '危': '凶', '室': '吉', '壁': '吉',
  '奎': '吉', '娄': '吉', '胃': '吉', '昴': '凶', '毕': '吉', '觜': '凶', '参': '吉',
  '井': '吉', '鬼': '凶', '柳': '凶', '星': '凶', '张': '吉', '翼': '凶', '轸': '吉'
};

/**
 * 获取指定日期的黄历信息
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @returns {Object} 黄历信息
 */
export function getHuangli(year, month, day) {
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  // 获取宜忌
  const yi = lunar.getDayYi() || [];
  const ji = lunar.getDayJi() || [];

  // 获取建星 - 使用正确的方法
  const jianxing = getJianxingByDate(lunar);

  // 获取星宿
  const xingxiu = lunar.getXiu() || '角';

  // 获取冲煞 - 简化版
  const dayZhi = lunar.getDayZhi();
  const chongsha = getChongSha(dayZhi);

  // 获取胎神 - 简化版
  const taishen = getTaiShen(lunar.getDayGan(), dayZhi);

  // 获取彭祖百忌 - 简化版
  const pengzu = getPengZu(lunar.getDayGan(), dayZhi);

  // 获取五行
  const wuxing = lunar.getDayNaYin() || '';

  return {
    公历: `${year}年${month}月${day}日`,
    农历: `${lunar.getYearInChinese()}年${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
    干支: `${lunar.getYearInGanZhiExact()}年 ${lunar.getMonthInGanZhiExact()}月 ${lunar.getDayInGanZhi()}日`,
    生肖: lunar.getYearShengXiao(),
    星期: solar.getWeek(),
    宜: yi.length > 0 ? yi : ['诸事不宜'],
    忌: ji.length > 0 ? ji : ['无'],
    建星: jianxing,
    建星吉凶: JIANXING_JIXIONG[jianxing] || { level: '中', description: '' },
    星宿: xingxiu,
    星宿吉凶: XINGXIU_JIXIONG[xingxiu] || '中',
    冲煞: chongsha,
    胎神: taishen,
    彭祖百忌: pengzu,
    五行: wuxing,
    节气: lunar.getJieQi() || '无',
    综合评分: calculateDayScore(yi, ji, jianxing, xingxiu)
  };
}

/**
 * 计算日期综合评分
 */
function calculateDayScore(yi, ji, jianxing, xingxiu) {
  let score = 50; // 基础分

  // 宜事项加分
  score += yi.length * 2;

  // 忌事项减分
  score -= ji.length * 1.5;

  // 建星加减分
  const jianxingInfo = JIANXING_JIXIONG[jianxing];
  if (jianxingInfo) {
    if (jianxingInfo.level === '吉') score += 10;
    else if (jianxingInfo.level === '凶') score -= 10;
  }

  // 星宿加减分
  const xingxiuJixiong = XINGXIU_JIXIONG[xingxiu];
  if (xingxiuJixiong === '吉') score += 10;
  else if (xingxiuJixiong === '凶') score -= 10;

  // 限制分数范围
  score = Math.max(0, Math.min(100, score));

  return Math.round(score);
}

/**
 * 择吉日
 * @param {string} matter - 事项（如：嫁娶、开业、搬家等）
 * @param {number} startYear - 开始年份
 * @param {number} startMonth - 开始月份
 * @param {number} days - 查询天数
 * @returns {Array} 吉日列表
 */
export function selectAuspiciousDays(matter, startYear, startMonth, days = 30) {
  const auspiciousDays = [];
  const solar = Solar.fromYmd(startYear, startMonth, 1);

  for (let i = 0; i < days; i++) {
    const currentSolar = solar.next(i);
    const lunar = currentSolar.getLunar();

    const yi = lunar.getDayYi();
    const ji = lunar.getDayJi();
    const jianxing = lunar.getDayJianChu();
    const xingxiu = lunar.getXiu();

    // 判断是否适合该事项
    const isYi = yi.includes(matter);
    const isJi = ji.includes(matter);

    if (isYi && !isJi) {
      const score = calculateDayScore(yi, ji, jianxing, xingxiu);

      auspiciousDays.push({
        日期: `${currentSolar.getYear()}年${currentSolar.getMonth()}月${currentSolar.getDay()}日`,
        农历: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
        星期: currentSolar.getWeek(),
        干支: lunar.getDayInGanZhi(),
        建星: jianxing,
        星宿: xingxiu,
        评分: score,
        宜: yi,
        忌: ji,
        推荐度: score >= 80 ? '极佳' : score >= 70 ? '很好' : score >= 60 ? '适宜' : '一般'
      });
    }
  }

  // 按评分排序
  auspiciousDays.sort((a, b) => b.评分 - a.评分);

  return auspiciousDays;
}

/**
 * 分析特定日期是否适合某事项
 * @param {string} matter - 事项
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @returns {Object} 分析结果
 */
export function analyzeMatterOnDate(matter, year, month, day) {
  const huangli = getHuangli(year, month, day);

  const isYi = huangli.宜.includes(matter);
  const isJi = huangli.忌.includes(matter);

  let result = '';
  let suitable = false;

  if (isYi && !isJi) {
    result = '适宜';
    suitable = true;
  } else if (isJi && !isYi) {
    result = '不宜';
    suitable = false;
  } else if (isYi && isJi) {
    result = '有争议，需谨慎';
    suitable = false;
  } else {
    result = '无特别宜忌';
    suitable = true;
  }

  return {
    事项: matter,
    日期: huangli.公历,
    农历: huangli.农历,
    结论: result,
    适宜: suitable,
    评分: huangli.综合评分,
    建议: getSuggestionForMatter(matter, suitable, huangli),
    详细信息: huangli
  };
}

/**
 * 根据事项给出建议
 */
function getSuggestionForMatter(matter, suitable, huangli) {
  if (suitable) {
    return `${huangli.公历}（${huangli.农历}）适合${matter}，建星为${huangli.建星}（${huangli.建星吉凶.description}），星宿为${huangli.星宿}（${huangli.星宿吉凶}），综合评分${huangli.综合评分}分，是个好日子。`;
  } else {
    return `${huangli.公历}（${huangli.农历}）不适合${matter}，建议另择吉日。建星为${huangli.建星}（${huangli.建星吉凶.description}），星宿为${huangli.星宿}（${huangli.星宿吉凶}）。`;
  }
}

/**
 * 获取本月黄道吉日
 * @param {number} year - 年
 * @param {number} month - 月
 * @returns {Array} 黄道吉日列表
 */
export function getMonthAuspiciousDays(year, month) {
  const auspiciousDays = [];
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let day = 1; day <= daysInMonth; day++) {
    const huangli = getHuangli(year, month, day);

    // 评分大于70分的为黄道吉日
    if (huangli.综合评分 >= 70) {
      auspiciousDays.push({
        日期: `${month}月${day}日`,
        星期: huangli.星期,
        农历: huangli.农历,
        评分: huangli.综合评分,
        建星: huangli.建星,
        星宿: huangli.星宿,
        宜: huangli.宜.slice(0, 5).join('、') + (huangli.宜.length > 5 ? '等' : ''),
        等级: huangli.综合评分 >= 85 ? '上吉' : huangli.综合评分 >= 75 ? '中吉' : '小吉'
      });
    }
  }

  return auspiciousDays;
}

/**
 * 获取今日运势
 * @param {Object} bazi - 八字对象
 * @returns {Object} 今日运势
 */
export function getTodayFortune(bazi) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const huangli = getHuangli(year, month, day);
  const solar = Solar.fromYmd(year, month, day);
  const lunar = solar.getLunar();

  // 获取今日干支
  const todayGanZhi = lunar.getDayInGanZhi();
  const todayGan = todayGanZhi[0];
  const todayZhi = todayGanZhi[1];

  // 与八字日柱对比
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  // 判断天干关系
  let ganRelation = '';
  if (todayGan === rizhuGan) {
    ganRelation = '比肩，运势平稳';
  } else if (isTianganHe(todayGan, rizhuGan)) {
    ganRelation = '天干相合，运势吉利';
  } else if (isTianganChong(todayGan, rizhuGan)) {
    ganRelation = '天干相冲，需谨慎行事';
  } else {
    ganRelation = '天干平和';
  }

  // 判断地支关系
  let zhiRelation = '';
  if (todayZhi === rizhuZhi) {
    zhiRelation = '地支伏吟，运势反复';
  } else if (isDizhiLiuhe(todayZhi, rizhuZhi)) {
    zhiRelation = '地支六合，贵人相助';
  } else if (isDizhiLiuchong(todayZhi, rizhuZhi)) {
    zhiRelation = '地支六冲，多有变动';
  } else {
    zhiRelation = '地支平和';
  }

  // 综合运势
  let fortuneLevel = '';
  let fortuneColor = '';
  if (huangli.综合评分 >= 80) {
    fortuneLevel = '大吉';
    fortuneColor = '红色、紫色';
  } else if (huangli.综合评分 >= 60) {
    fortuneLevel = '吉';
    fortuneColor = '黄色、金色';
  } else if (huangli.综合评分 >= 40) {
    fortuneLevel = '平';
    fortuneColor = '绿色、蓝色';
  } else {
    fortuneLevel = '凶';
    fortuneColor = '黑色、白色';
  }

  return {
    日期: huangli.公历,
    农历: huangli.农历,
    干支: todayGanZhi,
    运势等级: fortuneLevel,
    综合评分: huangli.综合评分,
    天干关系: ganRelation,
    地支关系: zhiRelation,
    幸运颜色: fortuneColor,
    幸运方位: getLuckyDirection(todayZhi),
    宜: huangli.宜,
    忌: huangli.忌,
    建星: huangli.建星,
    星宿: huangli.星宿,
    建议: getFortuneAdvice(fortuneLevel, ganRelation, zhiRelation)
  };
}

/**
 * 天干相合判断
 */
function isTianganHe(gan1, gan2) {
  const heMap = {
    '甲': '己', '己': '甲',
    '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙',
    '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
  };
  return heMap[gan1] === gan2;
}

/**
 * 天干相冲判断
 */
function isTianganChong(gan1, gan2) {
  const chongMap = {
    '甲': '庚', '庚': '甲',
    '乙': '辛', '辛': '乙',
    '丙': '壬', '壬': '丙',
    '丁': '癸', '癸': '丁'
  };
  return chongMap[gan1] === gan2;
}

/**
 * 地支六合判断
 */
function isDizhiLiuhe(zhi1, zhi2) {
  const liuheMap = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午'
  };
  return liuheMap[zhi1] === zhi2;
}

/**
 * 地支六冲判断
 */
function isDizhiLiuchong(zhi1, zhi2) {
  const liuchongMap = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳'
  };
  return liuchongMap[zhi1] === zhi2;
}

/**
 * 获取幸运方位
 */
function getLuckyDirection(zhi) {
  const directionMap = {
    '子': '北方', '丑': '东北', '寅': '东方', '卯': '东方',
    '辰': '东南', '巳': '南方', '午': '南方', '未': '西南',
    '申': '西方', '酉': '西方', '戌': '西北', '亥': '北方'
  };
  return directionMap[zhi] || '中央';
}

/**
 * 获取运势建议
 */
function getFortuneAdvice(level, ganRelation, zhiRelation) {
  let advice = '';

  if (level === '大吉') {
    advice = '今日运势极佳，适合开展重要事务，把握机会，积极进取。';
  } else if (level === '吉') {
    advice = '今日运势良好，可以按计划行事，稳中求进。';
  } else if (level === '平') {
    advice = '今日运势平稳，宜守不宜攻，谨慎行事为上。';
  } else {
    advice = '今日运势欠佳，宜静不宜动，避免重大决策。';
  }

  if (ganRelation.includes('相冲') || zhiRelation.includes('六冲')) {
    advice += '注意与人沟通，避免冲突。';
  }

  if (ganRelation.includes('相合') || zhiRelation.includes('六合')) {
    advice += '贵人运佳，可寻求他人帮助。';
  }

  return advice;
}
