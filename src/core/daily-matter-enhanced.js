// 增强版日常事项测算模块 - 支持近3个月运势预测
import { Solar, Lunar } from 'lunar-javascript';
import { qigua } from './yijing.js';
import { getHuangli } from './zeji.js';

/**
 * 测算日常事项发展规律（增强版）
 * @param {Object} bazi - 测算人的八字
 * @param {string} matter - 要测算的事项
 * @param {string} direction - 想知道的规律方向
 * @param {Date} testTime - 开始测算的时间
 * @returns {Object} 测算结果
 */
export function analyzeDailyMatter(bazi, matter, direction, testTime = new Date()) {
  const year = testTime.getFullYear();
  const month = testTime.getMonth() + 1;
  const day = testTime.getDate();
  const hour = testTime.getHours();
  const minute = testTime.getMinutes();

  // 1. 基于测算时间起卦
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  // 构建测算时刻的临时八字用于起卦
  const testBazi = {
    lunar: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay()
    },
    hour: {
      zhi: getHourZhi(hour)
    },
    solar: { year, month, day, hour, minute },
    day: { gan: lunar.getDayGan(), zhi: lunar.getDayZhi(), ganZhi: lunar.getDayInGanZhi() }
  };

  // 2. 起卦分析
  const guaxiang = qigua(testBazi, 'plum');

  // 3. 黄历分析
  const huangli = getHuangli(year, month, day);

  // 4. 结合命主八字分析
  const personalAnalysis = analyzeWithBazi(bazi, testTime);

  // 5. 时间分析
  const timeAnalysis = analyzeTimeForMatter(testTime, bazi);

  // 6. 近12个月运势预测
  const twelveMonthFortune = analyzeTwelveMonthFortune(bazi, matter, testTime);

  // 7. 相关影响因素分析
  const relatedFactors = analyzeRelatedFactors(bazi, matter, guaxiang, huangli);

  // 8. 综合分析
  const result = {
    测算事项: matter,
    测算方向: direction,
    测算时间: `${year}年${month}月${day}日 ${hour}时${minute}分`,
    卦象分析: analyzeGuaxiangForMatter(guaxiang, matter, direction),
    黄历分析: analyzeHuangliForMatter(huangli, matter),
    命理分析: personalAnalysis,
    时间分析: timeAnalysis,
    近十二个月运势: twelveMonthFortune,
    相关影响因素: relatedFactors,
    综合结论: null,
    发展规律: null,
    注意事项: [],
    建议: []
  };

  // 9. 生成综合结论
  result.综合结论 = generateConclusion(result, direction);
  result.发展规律 = analyzeDevelopmentPattern(result, matter, direction);
  result.注意事项 = generateWarnings(result, matter);
  result.建议 = generateAdvice(result, matter, direction);

  return result;
}

/**
 * 分析近12个月运势
 */
function analyzeTwelveMonthFortune(bazi, matter, startTime) {
  const monthlyFortune = [];

  for (let i = 0; i < 12; i++) {
    const targetDate = new Date(startTime);
    targetDate.setMonth(targetDate.getMonth() + i);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;

    // 获取该月的干支
    const solar = Solar.fromYmd(year, month, 15); // 取月中
    const lunar = solar.getLunar();
    const monthGanZhi = lunar.getMonthInGanZhiExact();

    // 分析该月运势
    const monthAnalysis = analyzeMonthFortune(bazi, monthGanZhi, matter, year, month);

    monthlyFortune.push({
      月份: `${year}年${month}月`,
      干支: monthGanZhi,
      ...monthAnalysis
    });
  }

  return {
    总体趋势: analyzeOverallTrend(monthlyFortune),
    月度详情: monthlyFortune,
    关键时间点: findKeyTimePoints(monthlyFortune),
    建议: generateMonthlyAdvice(monthlyFortune, matter)
  };
}

/**
 * 分析近3个月运势（保留用于兼容）
 */
function analyzeThreeMonthFortune(bazi, matter, startTime) {
  const monthlyFortune = [];

  for (let i = 0; i < 3; i++) {
    const targetDate = new Date(startTime);
    targetDate.setMonth(targetDate.getMonth() + i);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;

    // 获取该月的干支
    const solar = Solar.fromYmd(year, month, 15); // 取月中
    const lunar = solar.getLunar();
    const monthGanZhi = lunar.getMonthInGanZhiExact();

    // 分析该月运势
    const monthAnalysis = analyzeMonthFortune(bazi, monthGanZhi, matter, year, month);

    monthlyFortune.push({
      月份: `${year}年${month}月`,
      干支: monthGanZhi,
      ...monthAnalysis
    });
  }

  return {
    总体趋势: analyzeOverallTrend(monthlyFortune),
    月度详情: monthlyFortune,
    关键时间点: findKeyTimePoints(monthlyFortune),
    建议: generateMonthlyAdvice(monthlyFortune, matter)
  };
}

/**
 * 分析单月运势
 */
function analyzeMonthFortune(bazi, monthGanZhi, matter, year, month) {
  const monthGan = monthGanZhi[0];
  const monthZhi = monthGanZhi[1];
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  // 天干关系
  let ganScore = 50;
  if (monthGan === rizhuGan) {
    ganScore = 60;
  } else if (isTianganHe(monthGan, rizhuGan)) {
    ganScore = 80;
  } else if (isTianganChong(monthGan, rizhuGan)) {
    ganScore = 30;
  }

  // 地支关系
  let zhiScore = 50;
  if (monthZhi === rizhuZhi) {
    zhiScore = 55;
  } else if (isDizhiLiuhe(monthZhi, rizhuZhi)) {
    zhiScore = 85;
  } else if (isDizhiLiuchong(monthZhi, rizhuZhi)) {
    zhiScore = 25;
  }

  const totalScore = Math.round((ganScore + zhiScore) / 2);

  let level = '';
  if (totalScore >= 75) level = '大吉';
  else if (totalScore >= 60) level = '吉';
  else if (totalScore >= 45) level = '平';
  else if (totalScore >= 30) level = '小凶';
  else level = '凶';

  return {
    运势等级: level,
    评分: totalScore,
    天干关系: getTianganRelation(monthGan, rizhuGan),
    地支关系: getDizhiRelation(monthZhi, rizhuZhi),
    适宜度: totalScore >= 60 ? '适宜' : totalScore >= 45 ? '一般' : '不宜',
    说明: generateMonthExplanation(level, monthGan, monthZhi, matter)
  };
}

/**
 * 分析整体趋势
 */
function analyzeOverallTrend(monthlyFortune) {
  const scores = monthlyFortune.map(m => m.评分);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  // 判断趋势
  let trend = '';
  if (scores[2] > scores[0] + 10) {
    trend = '上升';
  } else if (scores[2] < scores[0] - 10) {
    trend = '下降';
  } else {
    trend = '平稳';
  }

  let description = '';
  if (avgScore >= 70) {
    description = `未来三个月整体运势${trend === '上升' ? '持续向好' : trend === '下降' ? '先好后弱' : '保持良好'}，是行动的好时机。`;
  } else if (avgScore >= 50) {
    description = `未来三个月运势${trend === '上升' ? '逐渐好转' : trend === '下降' ? '逐渐转弱' : '较为平稳'}，需要把握时机。`;
  } else {
    description = `未来三个月运势${trend === '上升' ? '有所改善但仍需谨慎' : trend === '下降' ? '持续低迷' : '较为低迷'}，建议谨慎行事。`;
  }

  return {
    趋势: trend,
    平均评分: Math.round(avgScore),
    描述: description
  };
}

/**
 * 找出关键时间点
 */
function findKeyTimePoints(monthlyFortune) {
  const keyPoints = [];

  // 找出最佳月份
  const bestMonth = monthlyFortune.reduce((max, m) => m.评分 > max.评分 ? m : max);
  keyPoints.push({
    类型: '最佳时机',
    月份: bestMonth.月份,
    评分: bestMonth.评分,
    说明: `${bestMonth.月份}运势最佳（${bestMonth.运势等级}），是行动的最好时机`
  });

  // 找出需要注意的月份
  const worstMonth = monthlyFortune.reduce((min, m) => m.评分 < min.评分 ? m : min);
  if (worstMonth.评分 < 45) {
    keyPoints.push({
      类型: '需要注意',
      月份: worstMonth.月份,
      评分: worstMonth.评分,
      说明: `${worstMonth.月份}运势较弱（${worstMonth.运势等级}），需要谨慎行事`
    });
  }

  return keyPoints;
}

/**
 * 生成月度建议
 */
function generateMonthlyAdvice(monthlyFortune, matter) {
  const advice = [];

  monthlyFortune.forEach(month => {
    if (month.评分 >= 70) {
      advice.push(`${month.月份}：运势极佳，${month.适宜度}进行${matter}，可以积极推进`);
    } else if (month.评分 >= 60) {
      advice.push(`${month.月份}：运势良好，${month.适宜度}进行${matter}，可以正常推进`);
    } else if (month.评分 >= 45) {
      advice.push(`${month.月份}：运势平稳，${month.适宜度}进行${matter}，需要谨慎评估`);
    } else {
      advice.push(`${month.月份}：运势欠佳，${month.适宜度}进行${matter}，建议暂缓或调整策略`);
    }
  });

  return advice;
}

/**
 * 生成月份说明
 */
function generateMonthExplanation(level, gan, zhi, matter) {
  const explanations = {
    '大吉': `${gan}${zhi}月，天时地利，各方面条件都很有利，是进行${matter}的最佳时机`,
    '吉': `${gan}${zhi}月，运势良好，条件较为有利，适合进行${matter}`,
    '平': `${gan}${zhi}月，运势平稳，条件一般，进行${matter}需要谨慎评估`,
    '小凶': `${gan}${zhi}月，运势欠佳，不利因素较多，进行${matter}需要特别注意`,
    '凶': `${gan}${zhi}月，运势很不利，强烈建议暂缓${matter}或另择时机`
  };
  return explanations[level] || '';
}

/**
 * 分析相关影响因素
 */
function analyzeRelatedFactors(bazi, matter, guaxiang, huangli) {
  const factors = [];

  // 1. 个人命局因素
  const rizhuWuxing = bazi.day.ganWuxing;
  factors.push({
    类型: '个人命局',
    因素: `日主${bazi.day.gan}（${rizhuWuxing}）`,
    影响: `您的日主五行为${rizhuWuxing}，这会影响您在不同时间的运势强弱`,
    建议: `选择${rizhuWuxing}旺相的时间行事会更加顺利`
  });

  // 2. 卦象因素
  if (guaxiang.分析) {
    factors.push({
      类型: '卦象提示',
      因素: `${guaxiang.主卦.name}卦`,
      影响: `卦象显示${guaxiang.分析.吉凶 === '吉' ? '有利' : '不利'}，${guaxiang.分析.体用关系}`,
      建议: guaxiang.分析.建议
    });
  }

  // 3. 黄历因素
  factors.push({
    类型: '黄历宜忌',
    因素: `建星${huangli.建星}，星宿${huangli.星宿}`,
    影响: `当日黄历${huangli.宜.includes(matter) ? '适宜' : huangli.忌.includes(matter) ? '不宜' : '无特别宜忌'}此事`,
    建议: `选择黄历适宜的日子进行${matter}会更加顺利`
  });

  // 4. 时间因素
  const now = new Date();
  const hour = now.getHours();
  factors.push({
    类型: '时辰影响',
    因素: `当前${getHourName(hour)}`,
    影响: getHourInfluence(hour),
    建议: getHourAdvice(hour, matter)
  });

  // 5. 外部环境因素
  factors.push({
    类型: '外部环境',
    因素: '人际关系、市场环境、政策变化等',
    影响: '外部环境的变化会直接影响事情的发展',
    建议: '密切关注外部环境变化，及时调整策略'
  });

  return factors;
}

/**
 * 生成注意事项
 */
function generateWarnings(result, matter) {
  const warnings = [];

  // 根据综合评分给出警示
  const score = result.综合结论.评分;
  if (score < 50) {
    warnings.push('⚠️ 当前时机不太理想，建议谨慎行事或另择时机');
  }

  // 根据卦象给出警示
  if (result.卦象分析.吉凶 === '凶') {
    warnings.push('⚠️ 卦象显示不利，需要特别注意可能出现的阻碍和困难');
  }

  // 根据命理分析给出警示
  if (result.命理分析.个人运势 === '差') {
    warnings.push('⚠️ 当前时刻与您的命局有冲克，容易遇到波折，需要做好心理准备');
  }

  // 根据黄历给出警示
  if (result.黄历分析.适宜度 === '不宜') {
    warnings.push('⚠️ 黄历显示今日不宜此事，建议另择吉日');
  }

  // 根据近十二个月运势给出警示
  const worstMonth = result.近十二个月运势.月度详情.reduce((min, m) => m.评分 < min.评分 ? m : min);
  if (worstMonth.评分 < 40) {
    warnings.push(`⚠️ ${worstMonth.月份}运势较差，该月需要特别谨慎`);
  }

  // 通用注意事项
  warnings.push('💡 命理测算仅供参考，实际行动还需结合现实情况综合判断');
  warnings.push('💡 保持积极心态，努力和智慧才是成功的关键');

  return warnings;
}

// 辅助函数
function getHourZhi(hour) {
  const zhiMap = [
    '子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午',
    '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'
  ];
  return zhiMap[hour];
}

function getHourName(hour) {
  const names = {
    23: '子时', 1: '丑时', 3: '寅时', 5: '卯时',
    7: '辰时', 9: '巳时', 11: '午时', 13: '未时',
    15: '申时', 17: '酉时', 19: '戌时', 21: '亥时'
  };
  for (let h in names) {
    if (hour >= parseInt(h) && hour < parseInt(h) + 2) {
      return names[h];
    }
  }
  return '子时';
}

function getHourInfluence(hour) {
  if (hour >= 5 && hour < 11) return '阳气上升，适合开展新事务';
  if (hour >= 11 && hour < 17) return '阳气旺盛，适合推进重要事项';
  if (hour >= 17 && hour < 23) return '阳气渐弱，适合总结收尾';
  return '阴气较重，宜静不宜动';
}

function getHourAdvice(hour, matter) {
  if (hour >= 5 && hour < 11) return `早上时段适合开始${matter}，精力充沛`;
  if (hour >= 11 && hour < 17) return `下午时段适合推进${matter}，效率较高`;
  if (hour >= 17 && hour < 23) return `晚上时段适合规划${matter}，不宜急进`;
  return `深夜时段不适合${matter}，建议休息`;
}

function getTianganRelation(gan1, gan2) {
  if (gan1 === gan2) return '比肩';
  if (isTianganHe(gan1, gan2)) return '相合';
  if (isTianganChong(gan1, gan2)) return '相冲';
  return '平和';
}

function getDizhiRelation(zhi1, zhi2) {
  if (zhi1 === zhi2) return '伏吟';
  if (isDizhiLiuhe(zhi1, zhi2)) return '六合';
  if (isDizhiLiuchong(zhi1, zhi2)) return '六冲';
  return '平和';
}

function isTianganHe(gan1, gan2) {
  const heMap = {
    '甲': '己', '己': '甲', '乙': '庚', '庚': '乙',
    '丙': '辛', '辛': '丙', '丁': '壬', '壬': '丁',
    '戊': '癸', '癸': '戊'
  };
  return heMap[gan1] === gan2;
}

function isTianganChong(gan1, gan2) {
  const chongMap = {
    '甲': '庚', '庚': '甲', '乙': '辛', '辛': '乙',
    '丙': '壬', '壬': '丙', '丁': '癸', '癸': '丁'
  };
  return chongMap[gan1] === gan2;
}

function isDizhiLiuhe(zhi1, zhi2) {
  const liuheMap = {
    '子': '丑', '丑': '子', '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯', '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳', '午': '未', '未': '午'
  };
  return liuheMap[zhi1] === zhi2;
}

function isDizhiLiuchong(zhi1, zhi2) {
  const liuchongMap = {
    '子': '午', '午': '子', '丑': '未', '未': '丑',
    '寅': '申', '申': '寅', '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰', '巳': '亥', '亥': '巳'
  };
  return liuchongMap[zhi1] === zhi2;
}

// 导入其他必要的函数
function analyzeGuaxiangForMatter(guaxiang, matter, direction) {
  const jixiong = guaxiang.分析?.吉凶判断 || '中';
  const relation = guaxiang.分析?.体用关系 || '';

  let analysis = {
    主卦: guaxiang.主卦.name,
    变卦: guaxiang.变卦.name,
    动爻: guaxiang.动爻,
    吉凶: jixiong,
    体用关系: relation,
    卦象解读: `${guaxiang.主卦.name}卦显示，此事${jixiong === '吉' ? '吉利' : '不利'}。${guaxiang.主卦.description}`
  };

  return analysis;
}

function analyzeHuangliForMatter(huangli, matter) {
  const isYi = huangli.宜.includes(matter);
  const isJi = huangli.忌.includes(matter);

  let suitable = isYi && !isJi ? '适宜' : isJi && !isYi ? '不宜' : '无特别宜忌';

  return {
    日期: huangli.公历,
    农历: huangli.农历,
    建星: huangli.建星,
    星宿: huangli.星宿,
    适宜度: suitable,
    综合评分: huangli.综合评分,
    宜: huangli.宜.slice(0, 5),
    忌: huangli.忌.slice(0, 5),
    建议: suitable === '适宜' ? '今日黄历显示适合此事' : suitable === '不宜' ? '今日黄历显示不宜此事' : '今日黄历对此事无特别宜忌'
  };
}

function analyzeWithBazi(bazi, testTime) {
  const solar = Solar.fromDate(testTime);
  const lunar = solar.getLunar();
  const testDayGanZhi = lunar.getDayInGanZhi();
  const testDayGan = testDayGanZhi[0];
  const testDayZhi = testDayGanZhi[1];
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  let ganRelation = testDayGan === rizhuGan ? '比肩，运势平稳' :
                    isTianganHe(testDayGan, rizhuGan) ? '天干相合，贵人相助' :
                    isTianganChong(testDayGan, rizhuGan) ? '天干相冲，多有变数' : '天干平和';

  let zhiRelation = testDayZhi === rizhuZhi ? '地支伏吟，事情反复' :
                    isDizhiLiuhe(testDayZhi, rizhuZhi) ? '地支六合，得人相助' :
                    isDizhiLiuchong(testDayZhi, rizhuZhi) ? '地支六冲，变动较大' : '地支平和';

  return {
    测算时刻干支: testDayGanZhi,
    命主日柱: bazi.day.ganZhi,
    天干关系: ganRelation,
    地支关系: zhiRelation,
    个人运势: ganRelation.includes('相合') || zhiRelation.includes('六合') ? '佳' :
              ganRelation.includes('相冲') || zhiRelation.includes('六冲') ? '差' : '平',
    建议: ganRelation.includes('相冲') || zhiRelation.includes('六冲') ?
          '当前时刻与您的命局有冲克，建议谨慎' : '当前时刻与您的命局平和，可以正常行事'
  };
}

function analyzeTimeForMatter(testTime) {
  const hour = testTime.getHours();
  return {
    时辰: getHourName(hour),
    时辰特点: getHourInfluence(hour),
    时辰建议: getHourAdvice(hour, '此事'),
    星期: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][testTime.getDay()],
    星期特点: '工作日适合商务活动，周末适合个人事务'
  };
}

function generateConclusion(result, direction) {
  const guaScore = result.卦象分析.吉凶 === '吉' ? 20 : result.卦象分析.吉凶 === '凶' ? -20 : 0;
  const huangliScore = result.黄历分析.适宜度 === '适宜' ? 15 : result.黄历分析.适宜度 === '不宜' ? -15 : 0;
  const personalScore = result.命理分析.个人运势 === '佳' ? 15 : result.命理分析.个人运势 === '差' ? -15 : 0;

  const score = Math.max(0, Math.min(100, 50 + guaScore + huangliScore + personalScore));

  const conclusion = score >= 80 ? '极为有利' : score >= 65 ? '比较有利' :
                     score >= 50 ? '中等偏上' : score >= 35 ? '中等偏下' : '不太有利';

  return {
    评分: score,
    结论: conclusion,
    说明: `综合分析，此事${conclusion}（评分：${score}分）`
  };
}

function analyzeDevelopmentPattern(result, matter, direction) {
  return {
    初期: '事情开始阶段，需要做好准备',
    中期: '发展过程中，需要持续推进',
    后期: '接近尾声，需要善始善终',
    关键节点: '中期是关键，需要全力以赴',
    整体趋势: result.卦象分析.吉凶 === '吉' ? '整体向好发展' : '发展过程会遇到阻碍'
  };
}

function generateAdvice(result, matter, direction) {
  const advice = [];
  advice.push(`【卦象建议】${result.卦象分析.卦象解读}`);
  advice.push(`【黄历建议】${result.黄历分析.建议}`);
  advice.push(`【命理建议】${result.命理分析.建议}`);
  advice.push(`【时辰建议】${result.时间分析.时辰建议}`);

  const score = result.综合结论.评分;
  if (score >= 80) {
    advice.push('【综合建议】当前是非常好的时机，建议积极行动');
  } else if (score >= 50) {
    advice.push('【综合建议】当前时机一般，建议谨慎评估后行动');
  } else {
    advice.push('【综合建议】当前时机不太理想，建议暂缓或另择时机');
  }

  return advice;
}
