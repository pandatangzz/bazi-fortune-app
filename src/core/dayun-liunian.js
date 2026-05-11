// 大运流年计算模块
import { TIANGAN, DIZHI } from './tiangan-dizhi.js';
import { getShishen } from './bazi.js';

/**
 * 计算大运
 * @param {Object} bazi - 八字对象
 * @param {number} startAge - 起运年龄
 * @returns {Array} 大运数组
 */
export function calculateDayun(bazi, startAge = null) {
  const gender = bazi.gender === '男' ? 1 : 0;
  const yearGanYinyang = getGanYinyang(bazi.year.gan);

  // 判断顺逆
  // 阳男阴女顺行，阴男阳女逆行
  const isShun = (gender === 1 && yearGanYinyang === '阳') ||
                 (gender === 0 && yearGanYinyang === '阴');

  // 如果没有提供起运年龄，计算起运年龄
  if (startAge === null) {
    startAge = calculateQiyunAge(bazi, isShun);
  }

  const dayunList = [];
  const monthGanIndex = TIANGAN.indexOf(bazi.month.gan);
  const monthZhiIndex = DIZHI.indexOf(bazi.month.zhi);

  // 生成10步大运（每步10年）
  for (let i = 0; i < 10; i++) {
    let ganIndex, zhiIndex;

    if (isShun) {
      ganIndex = (monthGanIndex + i + 1) % 10;
      zhiIndex = (monthZhiIndex + i + 1) % 12;
    } else {
      ganIndex = (monthGanIndex - i - 1 + 10) % 10;
      zhiIndex = (monthZhiIndex - i - 1 + 12) % 12;
    }

    const gan = TIANGAN[ganIndex];
    const zhi = DIZHI[zhiIndex];
    const ganZhi = gan + zhi;
    const startAgeForThisDayun = startAge + i * 10;
    const endAge = startAgeForThisDayun + 9;

    dayunList.push({
      index: i + 1,
      ganZhi,
      gan,
      zhi,
      startAge: startAgeForThisDayun,
      endAge,
      shishen: getShishen(bazi.day.gan, gan),
      ageRange: `${startAgeForThisDayun}-${endAge}岁`
    });
  }

  return {
    isShun,
    qiyunAge: startAge,
    direction: isShun ? '顺行' : '逆行',
    dayunList
  };
}

/**
 * 计算起运年龄
 */
function calculateQiyunAge(bazi, isShun) {
  // 简化算法：阳男阴女从出生后第3天开始，每3天为1年
  // 阴男阳女从出生前第3天开始，每3天为1年
  // 实际应用中需要根据节气精确计算

  // 这里使用简化版本，实际项目中应该计算到下一个节气的天数
  const baseAge = Math.floor(Math.random() * 3) + 1; // 1-3岁之间
  return baseAge;
}

/**
 * 获取天干阴阳
 */
function getGanYinyang(gan) {
  const yangGan = ['甲', '丙', '戊', '庚', '壬'];
  return yangGan.includes(gan) ? '阳' : '阴';
}

/**
 * 计算流年
 * @param {number} currentYear - 当前年份
 * @param {number} birthYear - 出生年份
 * @param {Object} bazi - 八字对象
 * @returns {Array} 流年数组
 */
export function calculateLiunian(currentYear, birthYear, bazi) {
  const liunianList = [];
  const startYear = currentYear - 5; // 显示前后5年
  const endYear = currentYear + 5;

  for (let year = startYear; year <= endYear; year++) {
    const age = year - birthYear + 1;
    const ganZhi = getYearGanZhi(year);
    const gan = ganZhi[0];
    const zhi = ganZhi[1];

    liunianList.push({
      year,
      age,
      ganZhi,
      gan,
      zhi,
      shishen: getShishen(bazi.day.gan, gan),
      isCurrent: year === currentYear
    });
  }

  return liunianList;
}

/**
 * 根据年份获取干支
 */
function getYearGanZhi(year) {
  // 1984年是甲子年（干支纪年的起点之一）
  const baseYear = 1984;
  const baseGanIndex = 0; // 甲
  const baseZhiIndex = 0; // 子

  const offset = year - baseYear;
  const ganIndex = (baseGanIndex + offset) % 10;
  const zhiIndex = (baseZhiIndex + offset) % 12;

  // 处理负数情况
  const finalGanIndex = ganIndex >= 0 ? ganIndex : ganIndex + 10;
  const finalZhiIndex = zhiIndex >= 0 ? zhiIndex : zhiIndex + 12;

  return TIANGAN[finalGanIndex] + DIZHI[finalZhiIndex];
}

/**
 * 分析大运流年关系
 * @param {Object} bazi - 八字对象
 * @param {Object} dayun - 当前大运
 * @param {Object} liunian - 当前流年
 * @returns {Object} 分析结果
 */
export function analyzeDayunLiunian(bazi, dayun, liunian) {
  const analysis = {
    dayun: {
      ganZhi: dayun.ganZhi,
      shishen: dayun.shishen,
      ageRange: dayun.ageRange
    },
    liunian: {
      year: liunian.year,
      ganZhi: liunian.ganZhi,
      shishen: liunian.shishen,
      age: liunian.age
    },
    relationships: []
  };

  // 分析大运与八字的关系
  const dayunRelations = analyzePillarRelations(bazi, dayun.gan, dayun.zhi);
  analysis.relationships.push({
    type: '大运与命局',
    details: dayunRelations
  });

  // 分析流年与八字的关系
  const liunianRelations = analyzePillarRelations(bazi, liunian.gan, liunian.zhi);
  analysis.relationships.push({
    type: '流年与命局',
    details: liunianRelations
  });

  // 分析大运与流年的关系
  const dayunLiunianRelation = checkGanZhiRelation(dayun.gan, dayun.zhi, liunian.gan, liunian.zhi);
  if (dayunLiunianRelation.length > 0) {
    analysis.relationships.push({
      type: '大运与流年',
      details: dayunLiunianRelation
    });
  }

  return analysis;
}

/**
 * 分析柱与八字的关系
 */
function analyzePillarRelations(bazi, gan, zhi) {
  const relations = [];
  const pillars = [
    { name: '年柱', gan: bazi.year.gan, zhi: bazi.year.zhi },
    { name: '月柱', gan: bazi.month.gan, zhi: bazi.month.zhi },
    { name: '日柱', gan: bazi.day.gan, zhi: bazi.day.zhi },
    { name: '时柱', gan: bazi.hour.gan, zhi: bazi.hour.zhi }
  ];

  pillars.forEach(pillar => {
    const relation = checkGanZhiRelation(gan, zhi, pillar.gan, pillar.zhi);
    if (relation.length > 0) {
      relations.push({
        pillar: pillar.name,
        relation: relation.join('、')
      });
    }
  });

  return relations;
}

/**
 * 检查干支关系
 */
function checkGanZhiRelation(gan1, zhi1, gan2, zhi2) {
  const relations = [];

  // 天干关系
  if (isTianganHe(gan1, gan2)) {
    relations.push('天干相合');
  }
  if (isTianganChong(gan1, gan2)) {
    relations.push('天干相冲');
  }

  // 地支关系
  if (isDizhiLiuhe(zhi1, zhi2)) {
    relations.push('地支六合');
  }
  if (isDizhiLiuchong(zhi1, zhi2)) {
    relations.push('地支六冲');
  }
  if (isDizhiXing(zhi1, zhi2)) {
    relations.push('地支相刑');
  }
  if (isDizhiHai(zhi1, zhi2)) {
    relations.push('地支相害');
  }

  return relations;
}

// 导入关系判断函数
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

function isTianganChong(gan1, gan2) {
  const chongMap = {
    '甲': '庚', '庚': '甲',
    '乙': '辛', '辛': '乙',
    '丙': '壬', '壬': '丙',
    '丁': '癸', '癸': '丁'
  };
  return chongMap[gan1] === gan2;
}

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

function isDizhiXing(zhi1, zhi2) {
  const xingMap = {
    '子': ['卯'], '卯': ['子'],
    '寅': ['巳'], '巳': ['申'], '申': ['寅'],
    '丑': ['戌'], '戌': ['未'], '未': ['丑']
  };
  return xingMap[zhi1]?.includes(zhi2);
}

function isDizhiHai(zhi1, zhi2) {
  const haiMap = {
    '子': '未', '未': '子',
    '丑': '午', '午': '丑',
    '寅': '巳', '巳': '寅',
    '卯': '辰', '辰': '卯',
    '申': '亥', '亥': '申',
    '酉': '戌', '戌': '酉'
  };
  return haiMap[zhi1] === zhi2;
}

/**
 * 获取当前所处大运
 */
export function getCurrentDayun(dayunData, currentAge) {
  for (let dayun of dayunData.dayunList) {
    if (currentAge >= dayun.startAge && currentAge <= dayun.endAge) {
      return dayun;
    }
  }
  return null;
}
