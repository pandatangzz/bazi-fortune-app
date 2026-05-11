// 一年运势和逐日解读模块

import { Solar, Lunar } from 'lunar-javascript';

/**
 * 分析一年运势（12个月）
 */
export function analyzeYearFortune(bazi, matter, startTime) {
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
    季度分析: analyzeQuarterly(monthlyFortune),
    建议: generateYearlyAdvice(monthlyFortune, matter)
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
 * 逐日解读功能
 */
export function analyzeDailyProgress(bazi, matter, startDate, daysCount = 90) {
  const dailyAnalysis = [];
  const start = new Date(startDate);

  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();

    const solar = Solar.fromYmd(year, month, day);
    const lunar = solar.getLunar();

    const dayAnalysis = analyzeSingleDay(bazi, lunar, matter, currentDate);

    dailyAnalysis.push({
      日期: `${year}年${month}月${day}日`,
      星期: getWeekDay(currentDate.getDay()),
      农历: `${lunar.getMonthInChinese()}月${lunar.getDayInChinese()}`,
      干支: lunar.getDayInGanZhi(),
      ...dayAnalysis
    });
  }

  return {
    逐日详情: dailyAnalysis,
    重要日期: findImportantDays(dailyAnalysis),
    周期规律: analyzeWeeklyPattern(dailyAnalysis),
    建议: generateDailyAdvice(dailyAnalysis, matter)
  };
}

/**
 * 分析单日运势
 */
function analyzeSingleDay(bazi, lunar, matter, date) {
  const dayGan = lunar.getDayGan();
  const dayZhi = lunar.getDayZhi();
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  // 天干关系评分
  let ganScore = 50;
  if (dayGan === rizhuGan) ganScore = 60;
  else if (isTianganHe(dayGan, rizhuGan)) ganScore = 85;
  else if (isTianganChong(dayGan, rizhuGan)) ganScore = 25;

  // 地支关系评分
  let zhiScore = 50;
  if (dayZhi === rizhuZhi) zhiScore = 55;
  else if (isDizhiLiuhe(dayZhi, rizhuZhi)) zhiScore = 90;
  else if (isDizhiLiuchong(dayZhi, rizhuZhi)) zhiScore = 20;

  // 黄历因素
  const yi = lunar.getDayYi() || [];
  const ji = lunar.getDayJi() || [];
  const isYi = yi.includes(matter);
  const isJi = ji.includes(matter);

  let huangliScore = 50;
  if (isYi && !isJi) huangliScore = 80;
  else if (isJi && !isYi) huangliScore = 20;

  // 综合评分
  const totalScore = Math.round((ganScore + zhiScore + huangliScore) / 3);

  let level = '';
  if (totalScore >= 75) level = '极佳';
  else if (totalScore >= 65) level = '很好';
  else if (totalScore >= 55) level = '较好';
  else if (totalScore >= 45) level = '一般';
  else if (totalScore >= 35) level = '较差';
  else level = '很差';

  return {
    运势等级: level,
    评分: totalScore,
    天干关系: getTianganRelation(dayGan, rizhuGan),
    地支关系: getDizhiRelation(dayZhi, rizhuZhi),
    黄历宜忌: isYi ? '宜' : isJi ? '忌' : '无',
    适宜度: totalScore >= 60 ? '适宜' : totalScore >= 45 ? '可行' : '不宜',
    建议: generateDayAdvice(level, totalScore, matter)
  };
}

/**
 * 找出重要日期
 */
function findImportantDays(dailyAnalysis) {
  const important = [];

  // 找出评分最高的5天
  const sorted = [...dailyAnalysis].sort((a, b) => b.评分 - a.评分);
  const topDays = sorted.slice(0, 5);

  topDays.forEach(day => {
    if (day.评分 >= 70) {
      important.push({
        日期: day.日期,
        类型: '吉日',
        评分: day.评分,
        说明: `${day.日期}运势极佳（${day.运势等级}），${day.适宜度}进行此事`
      });
    }
  });

  // 找出需要注意的日期
  const bottomDays = sorted.slice(-5);
  bottomDays.forEach(day => {
    if (day.评分 < 40) {
      important.push({
        日期: day.日期,
        类型: '需注意',
        评分: day.评分,
        说明: `${day.日期}运势欠佳（${day.运势等级}），${day.适宜度}进行此事，需谨慎`
      });
    }
  });

  return important;
}

/**
 * 分析周期规律
 */
function analyzeWeeklyPattern(dailyAnalysis) {
  const weekdayScores = {
    '星期一': [], '星期二': [], '星期三': [], '星期四': [],
    '星期五': [], '星期六': [], '星期日': []
  };

  dailyAnalysis.forEach(day => {
    if (weekdayScores[day.星期]) {
      weekdayScores[day.星期].push(day.评分);
    }
  });

  const weekdayAvg = {};
  for (let day in weekdayScores) {
    const scores = weekdayScores[day];
    if (scores.length > 0) {
      weekdayAvg[day] = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }
  }

  // 找出最佳和最差的星期
  const sorted = Object.entries(weekdayAvg).sort((a, b) => b[1] - a[1]);
  const bestDay = sorted[0];
  const worstDay = sorted[sorted.length - 1];

  return {
    星期平均分: weekdayAvg,
    最佳星期: { 星期: bestDay[0], 平均分: bestDay[1] },
    最差星期: { 星期: worstDay[0], 平均分: worstDay[1] },
    规律说明: `${bestDay[0]}运势最好（平均${bestDay[1]}分），${worstDay[0]}运势较差（平均${worstDay[1]}分）`
  };
}

/**
 * 季度分析
 */
function analyzeQuarterly(monthlyFortune) {
  const quarters = [
    { name: '第一季度', months: monthlyFortune.slice(0, 3) },
    { name: '第二季度', months: monthlyFortune.slice(3, 6) },
    { name: '第三季度', months: monthlyFortune.slice(6, 9) },
    { name: '第四季度', months: monthlyFortune.slice(9, 12) }
  ];

  return quarters.map(q => {
    const avgScore = Math.round(
      q.months.reduce((sum, m) => sum + m.评分, 0) / q.months.length
    );

    let level = '';
    if (avgScore >= 70) level = '优';
    else if (avgScore >= 60) level = '良';
    else if (avgScore >= 50) level = '中';
    else if (avgScore >= 40) level = '差';
    else level = '很差';

    return {
      季度: q.name,
      平均评分: avgScore,
      等级: level,
      月份: q.months.map(m => m.月份).join('、')
    };
  });
}

/**
 * 生成年度建议
 */
function generateYearlyAdvice(monthlyFortune, matter) {
  const advice = [];

  // 找出最佳月份
  const bestMonths = monthlyFortune.filter(m => m.评分 >= 70);
  if (bestMonths.length > 0) {
    advice.push(`最佳月份：${bestMonths.map(m => m.月份).join('、')}，这些月份运势极佳，是进行${matter}的最好时机`);
  }

  // 找出需要注意的月份
  const worstMonths = monthlyFortune.filter(m => m.评分 < 45);
  if (worstMonths.length > 0) {
    advice.push(`需要注意：${worstMonths.map(m => m.月份).join('、')}，这些月份运势较差，需要谨慎行事`);
  }

  // 整体建议
  const avgScore = Math.round(
    monthlyFortune.reduce((sum, m) => sum + m.评分, 0) / monthlyFortune.length
  );

  if (avgScore >= 60) {
    advice.push('全年整体运势良好，可以积极推进计划');
  } else if (avgScore >= 50) {
    advice.push('全年运势平稳，需要把握好时机，稳步推进');
  } else {
    advice.push('全年运势一般，需要谨慎行事，做好风险防范');
  }

  return advice;
}

/**
 * 生成每日建议
 */
function generateDailyAdvice(dailyAnalysis, matter) {
  const advice = [];

  const goodDays = dailyAnalysis.filter(d => d.评分 >= 70).length;
  const badDays = dailyAnalysis.filter(d => d.评分 < 40).length;

  advice.push(`在未来${dailyAnalysis.length}天中，有${goodDays}天运势极佳，${badDays}天需要特别注意`);

  if (goodDays > 0) {
    advice.push('建议在运势好的日子推进重要事项，事半功倍');
  }

  if (badDays > 0) {
    advice.push('运势差的日子宜守不宜攻，避免重大决策');
  }

  return advice;
}

/**
 * 生成单日建议
 */
function generateDayAdvice(level, score, matter) {
  if (score >= 75) {
    return `今日运势极佳，非常适合进行${matter}，可以积极推进`;
  } else if (score >= 65) {
    return `今日运势很好，适合进行${matter}，可以正常推进`;
  } else if (score >= 55) {
    return `今日运势较好，可以进行${matter}，保持积极态度`;
  } else if (score >= 45) {
    return `今日运势一般，进行${matter}需要谨慎评估`;
  } else if (score >= 35) {
    return `今日运势较差，不太适合进行${matter}，建议暂缓`;
  } else {
    return `今日运势很差，不宜进行${matter}，建议另择吉日`;
  }
}

// 辅助函数
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
    description = `全年运势${trend === '上升' ? '持续向好' : trend === '下降' ? '先好后弱' : '保持良好'}，整体非常有利。`;
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

function getWeekDay(day) {
  const days = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return days[day];
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
