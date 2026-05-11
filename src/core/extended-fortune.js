// 扩展的运势分析模块 - 支持一年运势和逐日解读

import { Solar, Lunar } from 'lunar-javascript';
import { getHuangli } from './zeji.js';

/**
 * 分析一年运势（12个月）
 */
export function analyzeYearlyFortune(bazi, matter, startTime = new Date()) {
  const monthlyFortune = [];

  for (let i = 0; i < 12; i++) {
    const targetDate = new Date(startTime);
    targetDate.setMonth(targetDate.getMonth() + i);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;

    const solar = Solar.fromYmd(year, month, 15);
    const lunar = solar.getLunar();
    const monthGanZhi = lunar.getMonthInGanZhiExact();

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
    最佳月份: findBestMonths(monthlyFortune),
    需注意月份: findWarningMonths(monthlyFortune),
    建议: generateYearlyAdvice(monthlyFortune, matter)
  };
}

/**
 * 逐日解读（90天或直到事情结束）
 */
export function analyzeDailyFortune(bazi, matter, startTime = new Date(), days = 90) {
  const dailyFortune = [];
  const keyDates = [];

  for (let i = 0; i < days; i++) {
    const targetDate = new Date(startTime);
    targetDate.setDate(targetDate.getDate() + i);

    const year = targetDate.getFullYear();
    const month = targetDate.getMonth() + 1;
    const day = targetDate.getDate();

    // 获取黄历信息
    const huangli = getHuangli(year, month, day);

    // 分析当日运势
    const dayAnalysis = analyzeSingleDay(bazi, targetDate, huangli, matter);

    dailyFortune.push({
      日期: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      星期: huangli.星期,
      干支: huangli.干支.split(' ')[2],
      建星: huangli.建星,
      星宿: huangli.星宿,
      ...dayAnalysis
    });

    // 记录关键日期
    if (dayAnalysis.评分 >= 85 || dayAnalysis.评分 <= 30) {
      keyDates.push({
        日期: `${year}-${month}-${day}`,
        类型: dayAnalysis.评分 >= 85 ? '最佳时机' : '需要注意',
        评分: dayAnalysis.评分,
        说明: dayAnalysis.当日运势
      });
    }
  }

  return {
    逐日分析: dailyFortune,
    关键日期: keyDates,
    统计信息: calculateDailyStatistics(dailyFortune),
    事项进展: analyzeProgressByDays(dailyFortune, matter),
    建议: generateDailyAdvice(dailyFortune, matter)
  };
}

/**
 * 分析单日运势
 */
function analyzeSingleDay(bazi, date, huangli, matter) {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();

  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  // 计算天干地支关系
  let score = 50;

  // 天干关系
  if (dayGan === rizhuGan) {
    score += 10;
  } else if (isTianganHe(dayGan, rizhuGan)) {
    score += 20;
  } else if (isTianganChong(dayGan, rizhuGan)) {
    score -= 20;
  }

  // 地支关系
  if (dayZhi === rizhuZhi) {
    score += 5;
  } else if (isDizhiLiuhe(dayZhi, rizhuZhi)) {
    score += 25;
  } else if (isDizhiLiuchong(dayZhi, rizhuZhi)) {
    score -= 25;
  }

  // 黄历评分
  score += (huangli.综合评分 - 50) * 0.5;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let level = '';
  if (score >= 85) level = '大吉';
  else if (score >= 70) level = '吉';
  else if (score >= 55) level = '平';
  else if (score >= 40) level = '小凶';
  else level = '凶';

  return {
    评分: score,
    当日运势: level,
    宜: huangli.宜.slice(0, 3),
    忌: huangli.忌.slice(0, 3),
    天干关系: getTianganRelation(dayGan, rizhuGan),
    地支关系: getDizhiRelation(dayZhi, rizhuZhi),
    详细解读: generateDayExplanation(score, level, matter),
    事项进展: getProgressStage(score, matter)
  };
}

/**
 * 分析月度运势
 */
function analyzeMonthFortune(bazi, monthGanZhi, matter, year, month) {
  const monthGan = monthGanZhi[0];
  const monthZhi = monthGanZhi[1];
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  let ganScore = 50;
  if (monthGan === rizhuGan) {
    ganScore = 60;
  } else if (isTianganHe(monthGan, rizhuGan)) {
    ganScore = 80;
  } else if (isTianganChong(monthGan, rizhuGan)) {
    ganScore = 30;
  }

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

  let trend = '';
  const firstQuarter = scores.slice(0, 3).reduce((a, b) => a + b, 0) / 3;
  const lastQuarter = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;

  if (lastQuarter > firstQuarter + 10) {
    trend = '上升';
  } else if (lastQuarter < firstQuarter - 10) {
    trend = '下降';
  } else {
    trend = '平稳';
  }

  let description = '';
  if (avgScore >= 70) {
    description = `全年整体运势${trend === '上升' ? '持续向好' : trend === '下降' ? '先好后弱' : '保持良好'}，是行动的好时机。`;
  } else if (avgScore >= 50) {
    description = `全年运势${trend === '上升' ? '逐渐好转' : trend === '下降' ? '逐渐转弱' : '较为平稳'}，需要把握时机。`;
  } else {
    description = `全年运势${trend === '上升' ? '有所改善但仍需谨慎' : trend === '下降' ? '持续低迷' : '较为低迷'}，建议谨慎行事。`;
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

  const bestMonth = monthlyFortune.reduce((max, m) => m.评分 > max.评分 ? m : max);
  keyPoints.push({
    类型: '最佳时机',
    月份: bestMonth.月份,
    评分: bestMonth.评分,
    说明: `${bestMonth.月份}运势最佳（${bestMonth.运势等级}），是行动的最好时机`
  });

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
 * 找出最佳月份
 */
function findBestMonths(monthlyFortune) {
  return monthlyFortune
    .filter(m => m.评分 >= 75)
    .map(m => m.月份);
}

/**
 * 找出需注意月份
 */
function findWarningMonths(monthlyFortune) {
  return monthlyFortune
    .filter(m => m.评分 < 45)
    .map(m => m.月份);
}

/**
 * 生成年度建议
 */
function generateYearlyAdvice(monthlyFortune, matter) {
  const advice = [];
  const bestMonths = findBestMonths(monthlyFortune);
  const warningMonths = findWarningMonths(monthlyFortune);

  if (bestMonths.length > 0) {
    advice.push(`最佳行动月份：${bestMonths.join('、')}，这些月份运势极佳，适合推进${matter}`);
  }

  if (warningMonths.length > 0) {
    advice.push(`需要注意月份：${warningMonths.join('、')}，这些月份运势欠佳，建议谨慎或暂缓`);
  }

  monthlyFortune.forEach(month => {
    if (month.评分 >= 70) {
      advice.push(`${month.月份}：运势极佳，可以积极推进${matter}`);
    }
  });

  return advice;
}

/**
 * 计算每日统计
 */
function calculateDailyStatistics(dailyFortune) {
  const scores = dailyFortune.map(d => d.评分);
  const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

  const excellentDays = dailyFortune.filter(d => d.评分 >= 85).length;
  const goodDays = dailyFortune.filter(d => d.评分 >= 70 && d.评分 < 85).length;
  const normalDays = dailyFortune.filter(d => d.评分 >= 55 && d.评分 < 70).length;
  const badDays = dailyFortune.filter(d => d.评分 < 55).length;

  return {
    总天数: dailyFortune.length,
    平均评分: Math.round(avgScore),
    大吉天数: excellentDays,
    吉日天数: goodDays,
    平日天数: normalDays,
    凶日天数: badDays,
    吉日占比: `${Math.round((excellentDays + goodDays) / dailyFortune.length * 100)}%`
  };
}

/**
 * 分析事项进展
 */
function analyzeProgressByDays(dailyFortune, matter) {
  const totalDays = dailyFortune.length;
  const stages = [];

  // 初期（前30%）
  const earlyDays = dailyFortune.slice(0, Math.floor(totalDays * 0.3));
  const earlyAvg = earlyDays.reduce((sum, d) => sum + d.评分, 0) / earlyDays.length;
  stages.push({
    阶段: '初期',
    天数范围: `第1-${earlyDays.length}天`,
    平均评分: Math.round(earlyAvg),
    状态: earlyAvg >= 70 ? '顺利' : earlyAvg >= 50 ? '一般' : '困难',
    说明: `${matter}初期阶段，${earlyAvg >= 70 ? '开局顺利，可以积极推进' : earlyAvg >= 50 ? '进展一般，需要耐心' : '阻力较大，需要调整策略'}`
  });

  // 中期（中间40%）
  const midStart = Math.floor(totalDays * 0.3);
  const midEnd = Math.floor(totalDays * 0.7);
  const midDays = dailyFortune.slice(midStart, midEnd);
  const midAvg = midDays.reduce((sum, d) => sum + d.评分, 0) / midDays.length;
  stages.push({
    阶段: '中期',
    天数范围: `第${midStart + 1}-${midEnd}天`,
    平均评分: Math.round(midAvg),
    状态: midAvg >= 70 ? '顺利' : midAvg >= 50 ? '一般' : '困难',
    说明: `${matter}中期阶段，${midAvg >= 70 ? '进展顺利，继续保持' : midAvg >= 50 ? '稳步推进，需要坚持' : '遇到困难，需要调整'}`
  });

  // 后期（后30%）
  const lateDays = dailyFortune.slice(midEnd);
  const lateAvg = lateDays.reduce((sum, d) => sum + d.评分, 0) / lateDays.length;
  stages.push({
    阶段: '后期',
    天数范围: `第${midEnd + 1}-${totalDays}天`,
    平均评分: Math.round(lateAvg),
    状态: lateAvg >= 70 ? '顺利' : lateAvg >= 50 ? '一般' : '困难',
    说明: `${matter}后期阶段，${lateAvg >= 70 ? '收尾顺利，可以圆满完成' : lateAvg >= 50 ? '需要善始善终' : '需要特别注意，避免功亏一篑'}`
  });

  return {
    阶段分析: stages,
    整体评价: generateOverallProgress(earlyAvg, midAvg, lateAvg)
  };
}

/**
 * 生成整体进展评价
 */
function generateOverallProgress(earlyAvg, midAvg, lateAvg) {
  if (earlyAvg >= 70 && midAvg >= 70 && lateAvg >= 70) {
    return '全程顺利，从开始到结束都很顺畅，可以放心推进';
  } else if (earlyAvg < 50 && midAvg >= 60 && lateAvg >= 70) {
    return '先难后易，初期困难但逐渐好转，坚持就能成功';
  } else if (earlyAvg >= 70 && midAvg >= 60 && lateAvg < 50) {
    return '先易后难，初期顺利但后期需要注意，善始善终很重要';
  } else {
    return '过程起伏，需要根据实际情况灵活调整策略';
  }
}

/**
 * 生成每日建议
 */
function generateDailyAdvice(dailyFortune, matter) {
  const advice = [];
  const keyDays = dailyFortune.filter(d => d.评分 >= 85 || d.评分 <= 30);

  keyDays.forEach(day => {
    if (day.评分 >= 85) {
      advice.push(`${day.日期}（${day.星期}）：大吉之日，评分${day.评分}分，非常适合推进${matter}`);
    } else {
      advice.push(`${day.日期}（${day.星期}）：需要注意，评分${day.评分}分，建议谨慎或暂缓${matter}`);
    }
  });

  return advice;
}

/**
 * 生成日期说明
 */
function generateDayExplanation(score, level, matter) {
  if (score >= 85) {
    return `今日运势极佳，天时地利人和，非常适合推进${matter}，可以积极行动`;
  } else if (score >= 70) {
    return `今日运势良好，条件有利，适合进行${matter}，可以正常推进`;
  } else if (score >= 55) {
    return `今日运势平稳，条件一般，进行${matter}需要谨慎评估`;
  } else if (score >= 40) {
    return `今日运势欠佳，不利因素较多，进行${matter}需要特别注意`;
  } else {
    return `今日运势很不利，强烈建议暂缓${matter}或另择吉日`;
  }
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
 * 获取进展阶段
 */
function getProgressStage(score, matter) {
  if (score >= 85) {
    return '最佳推进期，可以全力以赴';
  } else if (score >= 70) {
    return '良好推进期，可以正常进行';
  } else if (score >= 55) {
    return '平稳期，需要谨慎推进';
  } else if (score >= 40) {
    return '困难期，需要调整策略';
  } else {
    return '不利期，建议暂缓或休整';
  }
}

// 辅助函数
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
