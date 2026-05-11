// 日常事项测算模块 - 基于生辰八字和起卦时间
import { Solar, Lunar } from 'lunar-javascript';
import { qigua, zhanbuMatter } from './yijing.js';
import { getHuangli, analyzeMatterOnDate } from './zeji.js';

/**
 * 测算日常事项发展规律
 * @param {Object} bazi - 测算人的八字
 * @param {string} matter - 要测算的事项
 * @param {string} direction - 想知道的规律方向（如：结果、时机、方法、注意事项）
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
    }
  };

  // 2. 起卦分析
  const guaxiang = qigua(testBazi, 'plum');

  // 3. 黄历分析
  const huangli = getHuangli(year, month, day);

  // 4. 结合命主八字分析
  const personalAnalysis = analyzeWithBazi(bazi, testTime);

  // 5. 综合分析
  const result = {
    测算事项: matter,
    测算方向: direction,
    测算时间: `${year}年${month}月${day}日 ${hour}时${minute}分`,
    卦象分析: analyzeGuaxiangForMatter(guaxiang, matter, direction),
    黄历分析: analyzeHuangliForMatter(huangli, matter),
    命理分析: personalAnalysis,
    时间分析: analyzeTimeForMatter(testTime, bazi),
    综合结论: null,
    发展规律: null,
    建议: []
  };

  // 6. 生成综合结论
  result.综合结论 = generateConclusion(result, direction);
  result.发展规律 = analyzeDevelopmentPattern(result, matter, direction);
  result.建议 = generateAdvice(result, matter, direction);

  return result;
}

/**
 * 根据小时获取时辰地支
 */
function getHourZhi(hour) {
  const zhiMap = [
    '子', '丑', '丑', '寅', '寅', '卯', '卯', '辰', '辰', '巳', '巳', '午',
    '午', '未', '未', '申', '申', '酉', '酉', '戌', '戌', '亥', '亥', '子'
  ];
  return zhiMap[hour];
}

/**
 * 卦象分析事项
 */
function analyzeGuaxiangForMatter(guaxiang, matter, direction) {
  const jixiong = guaxiang.分析?.吉凶判断 || '中';
  const tiWuxing = guaxiang.分析?.体卦五行 || '';
  const yongWuxing = guaxiang.分析?.用卦五行 || '';
  const relation = guaxiang.分析?.体用关系 || '';

  let analysis = {
    主卦: guaxiang.主卦.name,
    变卦: guaxiang.变卦.name,
    动爻: guaxiang.动爻,
    吉凶: jixiong,
    体用关系: relation,
    卦象解读: ''
  };

  // 根据方向给出不同的解读
  if (direction === '结果') {
    if (jixiong === '吉') {
      analysis.卦象解读 = `${guaxiang.主卦.name}卦显示，此事结果吉利。${relation}，表明事情会朝着有利的方向发展，最终能够达成所愿。`;
    } else {
      analysis.卦象解读 = `${guaxiang.主卦.name}卦显示，此事结果不太理想。${relation}，表明事情发展会遇到阻碍，需要调整策略或另择时机。`;
    }
  } else if (direction === '时机') {
    const yaoPosition = guaxiang.动爻;
    const timing = getTimingByYao(yaoPosition);
    analysis.卦象解读 = `动爻在第${yaoPosition}爻，${timing}。${guaxiang.主卦.name}变为${guaxiang.变卦.name}，表明事情的转折点即将到来。`;
  } else if (direction === '方法') {
    analysis.卦象解读 = `${guaxiang.主卦.name}卦提示，处理此事应该${getMethodByGua(guaxiang.主卦.name)}。体用关系为${relation}，建议${guaxiang.分析?.建议 || '顺势而为'}。`;
  } else if (direction === '注意事项') {
    analysis.卦象解读 = `${guaxiang.主卦.name}卦警示，需要注意${getWarningByGua(guaxiang.主卦.name, jixiong)}。动爻发动表明变数较大，需要灵活应对。`;
  } else {
    analysis.卦象解读 = `${guaxiang.主卦.name}卦显示，此事${jixiong === '吉' ? '吉利' : '不利'}。${guaxiang.主卦.description}`;
  }

  return analysis;
}

/**
 * 根据爻位判断时机
 */
function getTimingByYao(yao) {
  const timingMap = {
    1: '时机尚早，事情刚刚开始，需要耐心等待',
    2: '时机渐近，可以开始准备，但不宜急进',
    3: '时机已到，正是行动的关键时刻',
    4: '时机正好，可以大胆推进',
    5: '时机最佳，天时地利人和，应把握机会',
    6: '时机已过，事情接近尾声，宜收不宜放'
  };
  return timingMap[yao] || '时机平常';
}

/**
 * 根据卦象给出方法建议
 */
function getMethodByGua(guaName) {
  const methodMap = {
    '乾为天': '刚健进取，自强不息，主动出击',
    '坤为地': '厚德载物，以柔克刚，顺势而为',
    '水雷屯': '循序渐进，不可急躁，稳扎稳打',
    '山水蒙': '虚心求教，学习积累，不耻下问',
    '水天需': '耐心等待，养精蓄锐，时机未到',
    '天水讼': '避免争执，和平解决，退一步海阔天空',
    '地水师': '团结众人，集思广益，借助外力',
    '水地比': '亲近贵人，寻求合作，互利共赢',
    '风天小畜': '积少成多，稳步前进，不求速成',
    '天泽履': '谨慎行事，如履薄冰，步步为营',
    '地天泰': '顺势而为，把握机会，大展宏图',
    '天地否': '守成待变，韬光养晦，等待转机'
  };
  return methodMap[guaName] || '根据实际情况灵活应对';
}

/**
 * 根据卦象给出警示
 */
function getWarningByGua(guaName, jixiong) {
  if (jixiong === '吉') {
    return '虽然卦象吉利，但也要防止乐极生悲，保持谦虚谨慎的态度';
  } else {
    const warningMap = {
      '天地否': '天地不交，沟通不畅，需要加强交流',
      '水雷屯': '困难重重，阻碍较多，需要坚持不懈',
      '山水蒙': '迷茫困惑，方向不明，需要寻求指导',
      '天水讼': '容易起争执，需要避免冲突，以和为贵'
    };
    return warningMap[guaName] || '卦象不利，需要谨慎行事，避免冒进';
  }
}

/**
 * 黄历分析事项
 */
function analyzeHuangliForMatter(huangli, matter) {
  const isYi = huangli.宜.includes(matter);
  const isJi = huangli.忌.includes(matter);

  let suitable = '';
  if (isYi && !isJi) {
    suitable = '适宜';
  } else if (isJi && !isYi) {
    suitable = '不宜';
  } else if (isYi && isJi) {
    suitable = '有争议';
  } else {
    suitable = '无特别宜忌';
  }

  return {
    日期: huangli.公历,
    农历: huangli.农历,
    建星: huangli.建星,
    星宿: huangli.星宿,
    适宜度: suitable,
    综合评分: huangli.综合评分,
    宜: huangli.宜.slice(0, 5),
    忌: huangli.忌.slice(0, 5),
    建议: suitable === '适宜' ? '今日黄历显示适合此事，可以进行' : suitable === '不宜' ? '今日黄历显示不宜此事，建议另择吉日' : '今日黄历对此事无特别宜忌，可根据实际情况决定'
  };
}

/**
 * 结合命主八字分析
 */
function analyzeWithBazi(bazi, testTime) {
  const solar = Solar.fromDate(testTime);
  const lunar = solar.getLunar();

  // 获取测算时刻的干支
  const testDayGanZhi = lunar.getDayInGanZhi();
  const testDayGan = testDayGanZhi[0];
  const testDayZhi = testDayGanZhi[1];

  // 与命主日柱对比
  const rizhuGan = bazi.day.gan;
  const rizhuZhi = bazi.day.zhi;

  // 判断关系
  let ganRelation = '';
  let zhiRelation = '';

  if (testDayGan === rizhuGan) {
    ganRelation = '比肩，运势平稳，可以按计划行事';
  } else if (isTianganHe(testDayGan, rizhuGan)) {
    ganRelation = '天干相合，贵人相助，事情顺利';
  } else if (isTianganChong(testDayGan, rizhuGan)) {
    ganRelation = '天干相冲，多有变数，需要谨慎';
  } else {
    ganRelation = '天干平和，无特别影响';
  }

  if (testDayZhi === rizhuZhi) {
    zhiRelation = '地支伏吟，事情反复，需要耐心';
  } else if (isDizhiLiuhe(testDayZhi, rizhuZhi)) {
    zhiRelation = '地支六合，得人相助，容易成功';
  } else if (isDizhiLiuchong(testDayZhi, rizhuZhi)) {
    zhiRelation = '地支六冲，变动较大，需要灵活应对';
  } else {
    zhiRelation = '地支平和，无特别影响';
  }

  return {
    测算时刻干支: testDayGanZhi,
    命主日柱: bazi.day.ganZhi,
    天干关系: ganRelation,
    地支关系: zhiRelation,
    个人运势: ganRelation.includes('相合') || zhiRelation.includes('六合') ? '佳' : ganRelation.includes('相冲') || zhiRelation.includes('六冲') ? '差' : '平',
    建议: ganRelation.includes('相冲') || zhiRelation.includes('六冲') ? '当前时刻与您的命局有冲克，建议谨慎行事或另择时机' : ganRelation.includes('相合') || zhiRelation.includes('六合') ? '当前时刻与您的命局相合，是行事的好时机' : '当前时刻与您的命局平和，可以正常行事'
  };
}

/**
 * 时间分析
 */
function analyzeTimeForMatter(testTime, bazi) {
  const hour = testTime.getHours();
  const dayOfWeek = testTime.getDay();

  // 时辰分析
  const hourAnalysis = getHourAnalysis(hour);

  // 星期分析
  const weekAnalysis = getWeekAnalysis(dayOfWeek);

  return {
    时辰: hourAnalysis.name,
    时辰特点: hourAnalysis.feature,
    时辰建议: hourAnalysis.advice,
    星期: weekAnalysis.name,
    星期特点: weekAnalysis.feature
  };
}

/**
 * 时辰分析
 */
function getHourAnalysis(hour) {
  const hourMap = {
    23: { name: '子时', feature: '阴阳交替，万物更新', advice: '适合思考规划，不宜行动' },
    1: { name: '丑时', feature: '夜深人静，阴气最重', advice: '宜休息养神，不宜外出' },
    3: { name: '寅时', feature: '阳气初生，万物苏醒', advice: '适合开始新事物' },
    5: { name: '卯时', feature: '日出东方，生机勃勃', advice: '最佳行动时机' },
    7: { name: '辰时', feature: '朝气蓬勃，精力充沛', advice: '适合重要事务' },
    9: { name: '巳时', feature: '阳气旺盛，事业运强', advice: '适合工作商谈' },
    11: { name: '午时', feature: '阳气最盛，火气较旺', advice: '宜动不宜静' },
    13: { name: '未时', feature: '阳气渐弱，需要休息', advice: '适合午休调整' },
    15: { name: '申时', feature: '精神恢复，适合行动', advice: '下午办事良机' },
    17: { name: '酉时', feature: '日落西山，收获时刻', advice: '适合总结收尾' },
    19: { name: '戌时', feature: '夜幕降临，归家之时', advice: '宜静不宜动' },
    21: { name: '亥时', feature: '夜深宁静，休养生息', advice: '适合休息放松' }
  };

  for (let h in hourMap) {
    if (hour >= parseInt(h) && hour < parseInt(h) + 2) {
      return hourMap[h];
    }
  }
  return { name: '子时', feature: '阴阳交替', advice: '宜静不宜动' };
}

/**
 * 星期分析
 */
function getWeekAnalysis(dayOfWeek) {
  const weekMap = {
    0: { name: '星期日', feature: '休息日，适合放松和家庭活动' },
    1: { name: '星期一', feature: '一周之始，适合规划和开始新项目' },
    2: { name: '星期二', feature: '火星日，适合积极行动和竞争' },
    3: { name: '星期三', feature: '水星日，适合沟通交流和学习' },
    4: { name: '星期四', feature: '木星日，适合扩展和发展' },
    5: { name: '星期五', feature: '金星日，适合社交和艺术活动' },
    6: { name: '星期六', feature: '土星日，适合总结和整理' }
  };
  return weekMap[dayOfWeek];
}

/**
 * 生成综合结论
 */
function generateConclusion(result, direction) {
  const guaJixiong = result.卦象分析.吉凶;
  const huangliSuitable = result.黄历分析.适宜度;
  const personalYunshi = result.命理分析.个人运势;

  let score = 50;

  // 卦象评分
  if (guaJixiong === '吉') score += 20;
  else if (guaJixiong === '凶') score -= 20;

  // 黄历评分
  if (huangliSuitable === '适宜') score += 15;
  else if (huangliSuitable === '不宜') score -= 15;

  // 个人运势评分
  if (personalYunshi === '佳') score += 15;
  else if (personalYunshi === '差') score -= 15;

  score = Math.max(0, Math.min(100, score));

  let conclusion = '';
  if (score >= 80) {
    conclusion = '极为有利';
  } else if (score >= 65) {
    conclusion = '比较有利';
  } else if (score >= 50) {
    conclusion = '中等偏上';
  } else if (score >= 35) {
    conclusion = '中等偏下';
  } else {
    conclusion = '不太有利';
  }

  return {
    评分: score,
    结论: conclusion,
    说明: `综合卦象、黄历和个人命理分析，此事${conclusion}（评分：${score}分）。${getDetailedExplanation(score, direction)}`
  };
}

/**
 * 获取详细说明
 */
function getDetailedExplanation(score, direction) {
  if (score >= 80) {
    return '天时地利人和，各方面条件都很有利，可以放心进行。';
  } else if (score >= 65) {
    return '大部分条件有利，虽有小的阻碍，但不影响大局，可以进行。';
  } else if (score >= 50) {
    return '条件一般，有利有弊，需要谨慎评估，做好准备后可以尝试。';
  } else if (score >= 35) {
    return '不利因素较多，建议调整策略或另择时机，避免强行推进。';
  } else {
    return '当前条件很不利，强烈建议暂缓或放弃，等待更好的时机。';
  }
}

/**
 * 分析发展规律
 */
function analyzeDevelopmentPattern(result, matter, direction) {
  const guaxiang = result.卦象分析;
  const yao = guaxiang.动爻;

  let pattern = {
    初期: '',
    中期: '',
    后期: '',
    关键节点: '',
    整体趋势: ''
  };

  // 根据动爻判断发展阶段
  if (yao <= 2) {
    pattern.初期 = '事情刚刚开始，处于萌芽阶段，需要耐心培育';
    pattern.中期 = '逐渐发展，会遇到一些挑战，需要坚持';
    pattern.后期 = '渐入佳境，开始看到成果';
    pattern.关键节点 = '中期是关键，需要克服困难';
  } else if (yao <= 4) {
    pattern.初期 = '已经有了一定基础，可以加快推进';
    pattern.中期 = '进入快速发展期，是最关键的阶段';
    pattern.后期 = '逐渐稳定，需要巩固成果';
    pattern.关键节点 = '当前正是关键时期，需要全力以赴';
  } else {
    pattern.初期 = '事情已经发展到后期';
    pattern.中期 = '接近尾声，需要做好收尾工作';
    pattern.后期 = '即将结束，要注意善始善终';
    pattern.关键节点 = '现在是收获期，也要防止功亏一篑';
  }

  // 整体趋势
  if (guaxiang.吉凶 === '吉') {
    pattern.整体趋势 = '整体向好发展，虽有波折但最终能够成功';
  } else {
    pattern.整体趋势 = '发展过程会遇到较多阻碍，需要调整策略或另择时机';
  }

  return pattern;
}

/**
 * 生成建议
 */
function generateAdvice(result, matter, direction) {
  const advice = [];

  // 卦象建议
  advice.push(`【卦象建议】${result.卦象分析.卦象解读}`);

  // 黄历建议
  advice.push(`【黄历建议】${result.黄历分析.建议}`);

  // 命理建议
  advice.push(`【命理建议】${result.命理分析.建议}`);

  // 时间建议
  advice.push(`【时辰建议】${result.时间分析.时辰建议}`);

  // 综合建议
  const score = result.综合结论.评分;
  if (score >= 80) {
    advice.push('【综合建议】当前是非常好的时机，建议积极行动，把握机会。同时也要保持谦虚谨慎，避免乐极生悲。');
  } else if (score >= 65) {
    advice.push('【综合建议】当前时机较好，可以进行，但要注意细节，做好充分准备，避免疏忽大意。');
  } else if (score >= 50) {
    advice.push('【综合建议】当前时机一般，建议谨慎评估利弊，做好风险防范，稳步推进。');
  } else if (score >= 35) {
    advice.push('【综合建议】当前时机不太理想，建议暂缓行动，调整策略，或者等待更好的时机。');
  } else {
    advice.push('【综合建议】当前时机很不利，强烈建议暂停或放弃，另择吉日吉时再行动。');
  }

  return advice;
}

// 辅助函数
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
