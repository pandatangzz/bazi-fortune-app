// 渊海子平命理分析模块

/**
 * 分析八字格局（渊海子平）
 * @param {Object} bazi - 八字对象
 * @returns {Object} 格局分析结果
 */
export function analyzeGeju(bazi) {
  const rizhuGan = bazi.day.gan;
  const monthZhi = bazi.month.zhi;
  const monthGan = bazi.month.gan;

  // 判断是否为特殊格局
  const specialGeju = checkSpecialGeju(bazi);
  if (specialGeju) {
    return specialGeju;
  }

  // 普通格局：以月令为主
  const monthShishen = bazi.month.shishen;
  const geju = determineNormalGeju(bazi, monthShishen);

  return geju;
}

/**
 * 检查特殊格局
 */
function checkSpecialGeju(bazi) {
  // 从旺格：日主极旺，顺其旺势
  if (isConwangGe(bazi)) {
    return {
      name: '从旺格',
      type: '特殊格局',
      description: '日主极旺，比劫众多，宜顺其旺势，忌官杀克制',
      xishen: ['比劫', '食伤'],
      jishen: ['官杀', '财星']
    };
  }

  // 从弱格：日主极弱，顺其弱势
  if (isCongruoGe(bazi)) {
    return {
      name: '从弱格',
      type: '特殊格局',
      description: '日主极弱，无根无助，宜顺从克泄耗之势',
      xishen: ['官杀', '财星', '食伤'],
      jishen: ['比劫', '印星']
    };
  }

  // 化气格：天干化合成功
  const huaqiGe = checkHuaqiGe(bazi);
  if (huaqiGe) {
    return huaqiGe;
  }

  return null;
}

/**
 * 判断从旺格
 */
function isConwangGe(bazi) {
  const shishenCount = countShishen(bazi);
  const bijieCount = (shishenCount['比肩'] || 0) + (shishenCount['劫财'] || 0);

  // 比劫占多数，且日主得令
  return bijieCount >= 4 && isDayuanDeling(bazi);
}

/**
 * 判断从弱格
 */
function isCongruoGe(bazi) {
  const shishenCount = countShishen(bazi);
  const bijieCount = (shishenCount['比肩'] || 0) + (shishenCount['劫财'] || 0);
  const yinxingCount = (shishenCount['正印'] || 0) + (shishenCount['偏印'] || 0);

  // 比劫和印星极少，日主失令
  return (bijieCount + yinxingCount) <= 1 && !isDayuanDeling(bazi);
}

/**
 * 检查化气格
 */
function checkHuaqiGe(bazi) {
  const rizhuGan = bazi.day.gan;
  const heGanMap = {
    '甲己': '土',
    '乙庚': '金',
    '丙辛': '水',
    '丁壬': '木',
    '戊癸': '火'
  };

  // 检查日干与其他天干的合化
  const ganList = [bazi.year.gan, bazi.month.gan, bazi.hour.gan];

  for (let gan of ganList) {
    const pair1 = rizhuGan + gan;
    const pair2 = gan + rizhuGan;

    if (heGanMap[pair1] || heGanMap[pair2]) {
      const huaWuxing = heGanMap[pair1] || heGanMap[pair2];
      return {
        name: `${pair1 in heGanMap ? pair1 : pair2}化${huaWuxing}格`,
        type: '特殊格局',
        description: `日干${rizhuGan}与${gan}相合化${huaWuxing}，需月令透出${huaWuxing}气方能成格`,
        xishen: [huaWuxing],
        jishen: ['克化神之五行']
      };
    }
  }

  return null;
}

/**
 * 确定普通格局
 */
function determineNormalGeju(bazi, monthShishen) {
  const gejuMap = {
    '正官': {
      name: '正官格',
      description: '月令正官，为人正直，适合仕途，喜印星生身，忌伤官克官',
      xishen: ['正印', '偏印', '食神'],
      jishen: ['伤官', '七杀']
    },
    '七杀': {
      name: '七杀格',
      description: '月令七杀，性格刚烈，喜食神制杀或印星化杀',
      xishen: ['食神', '正印', '偏印'],
      jishen: ['伤官', '财星']
    },
    '正财': {
      name: '正财格',
      description: '月令正财，善于理财，喜身旺有食伤生财',
      xishen: ['食神', '伤官', '比肩'],
      jishen: ['劫财', '偏印']
    },
    '偏财': {
      name: '偏财格',
      description: '月令偏财，善于经商，喜身旺财旺',
      xishen: ['食神', '伤官', '比肩'],
      jishen: ['劫财', '偏印']
    },
    '食神': {
      name: '食神格',
      description: '月令食神，温和有福，喜财星泄秀，忌枭神夺食',
      xishen: ['正财', '偏财'],
      jishen: ['偏印', '正印']
    },
    '伤官': {
      name: '伤官格',
      description: '月令伤官，聪明才智，喜财星或印星，伤官见官为祸百端',
      xishen: ['正财', '偏财', '正印'],
      jishen: ['正官', '七杀']
    },
    '正印': {
      name: '正印格',
      description: '月令正印，仁慈厚道，喜官杀生印，忌财星坏印',
      xishen: ['正官', '七杀'],
      jishen: ['正财', '偏财']
    },
    '偏印': {
      name: '偏印格',
      description: '月令偏印，聪明多疑，喜官杀生印，忌食神',
      xishen: ['正官', '七杀'],
      jishen: ['食神', '正财']
    },
    '比肩': {
      name: '建禄格',
      description: '月令比肩，自立自强，喜食伤泄秀或官杀制身',
      xishen: ['食神', '伤官', '正官'],
      jishen: ['劫财', '偏印']
    },
    '劫财': {
      name: '羊刃格',
      description: '月令劫财，刚强果断，喜官杀制刃或食伤泄秀',
      xishen: ['七杀', '正官', '食神'],
      jishen: ['正财', '偏财']
    }
  };

  const geju = gejuMap[monthShishen] || {
    name: '普通格局',
    description: '以月令十神为格局',
    xishen: [],
    jishen: []
  };

  return {
    ...geju,
    type: '普通格局',
    monthShishen
  };
}

/**
 * 统计十神数量
 */
function countShishen(bazi) {
  const count = {};
  const pillars = [bazi.year, bazi.month, bazi.day, bazi.hour];

  pillars.forEach(pillar => {
    const shishen = pillar.shishen;
    count[shishen] = (count[shishen] || 0) + 1;

    // 统计藏干十神
    if (pillar.cangganShishen) {
      pillar.cangganShishen.forEach(item => {
        count[item.shishen] = (count[item.shishen] || 0) + 0.5;
      });
    }
  });

  return count;
}

/**
 * 判断日元是否得令
 */
function isDayuanDeling(bazi) {
  const rizhuWuxing = bazi.day.ganWuxing;
  const monthZhiWuxing = bazi.month.zhiWuxing;

  // 日主五行与月令相同或月令生日主
  return rizhuWuxing === monthZhiWuxing || isShengWo(rizhuWuxing, monthZhiWuxing);
}

/**
 * 五行生我判断
 */
function isShengWo(wuxing1, wuxing2) {
  const shengMap = {
    '木': '水',
    '火': '木',
    '土': '火',
    '金': '土',
    '水': '金'
  };
  return shengMap[wuxing1] === wuxing2;
}

/**
 * 分析用神喜忌（渊海子平核心）
 */
export function analyzeYongshen(bazi, geju, wuxingPower) {
  const rizhuWuxing = bazi.day.ganWuxing;
  const analysis = {
    geju: geju.name,
    yongshen: null,
    xishen: [],
    jishen: [],
    choushen: [],
    advice: []
  };

  // 根据格局确定用神
  if (geju.type === '特殊格局') {
    analysis.yongshen = geju.xishen[0];
    analysis.xishen = geju.xishen;
    analysis.jishen = geju.jishen;
  } else {
    // 普通格局：身旺身弱判断
    const rizhuStrength = getRizhuStrength(bazi, wuxingPower);

    if (rizhuStrength.strength === '身旺') {
      // 身旺用克泄耗
      analysis.yongshen = '食伤或官杀';
      analysis.xishen = ['食神', '伤官', '正官', '七杀', '正财', '偏财'];
      analysis.jishen = ['正印', '偏印', '比肩', '劫财'];
      analysis.advice.push('身旺宜克泄耗，可从事创造性工作或管理工作');
    } else if (rizhuStrength.strength === '身弱') {
      // 身弱用生扶
      analysis.yongshen = '印星或比劫';
      analysis.xishen = ['正印', '偏印', '比肩', '劫财'];
      analysis.jishen = ['正官', '七杀', '正财', '偏财', '食神', '伤官'];
      analysis.advice.push('身弱宜生扶，需要贵人相助，不宜独立创业');
    } else {
      // 中和
      analysis.yongshen = '顺其自然';
      analysis.xishen = geju.xishen;
      analysis.jishen = geju.jishen;
      analysis.advice.push('八字中和，命局平衡，顺其自然发展为佳');
    }
  }

  // 添加格局建议
  analysis.advice.push(geju.description);

  return analysis;
}

/**
 * 获取日主强弱（简化版）
 */
function getRizhuStrength(bazi, wuxingPower) {
  const rizhuWuxing = bazi.day.ganWuxing;
  const total = Object.values(wuxingPower).reduce((sum, val) => sum + val, 0);
  const rizhuPower = wuxingPower[rizhuWuxing];
  const ratio = rizhuPower / total;

  let strength = '';
  if (ratio >= 0.35) {
    strength = '身旺';
  } else if (ratio >= 0.2) {
    strength = '中和';
  } else {
    strength = '身弱';
  }

  return { strength, ratio };
}

/**
 * 分析六亲关系（渊海子平）
 */
export function analyzeLiuqin(bazi) {
  const gender = bazi.gender;
  const shishenCount = countShishen(bazi);

  const liuqin = {
    父母: analyzeFumu(bazi, shishenCount, gender),
    配偶: analyzePeiou(bazi, shishenCount, gender),
    子女: analyzeZinv(bazi, shishenCount, gender),
    兄弟: analyzeXiongdi(bazi, shishenCount)
  };

  return liuqin;
}

/**
 * 分析父母
 */
function analyzeFumu(bazi, shishenCount, gender) {
  const yinxingCount = (shishenCount['正印'] || 0) + (shishenCount['偏印'] || 0);
  const caixingCount = (shishenCount['正财'] || 0) + (shishenCount['偏财'] || 0);

  let description = '';
  if (yinxingCount >= 2) {
    description = '印星旺，母亲缘分深，得母亲照顾多';
  } else if (yinxingCount === 0) {
    description = '印星弱，与母亲缘分薄，或母亲身体欠佳';
  }

  if (caixingCount >= 2) {
    description += '；财星旺，父亲能力强，家境较好';
  } else if (caixingCount === 0) {
    description += '；财星弱，父亲缘分薄或经济一般';
  }

  return {
    yinxing: yinxingCount,
    caixing: caixingCount,
    description: description || '父母缘分正常'
  };
}

/**
 * 分析配偶
 */
function analyzePeiou(bazi, shishenCount, gender) {
  let spouseStar = '';
  let count = 0;

  if (gender === '男') {
    // 男命看财星
    count = (shishenCount['正财'] || 0) + (shishenCount['偏财'] || 0);
    spouseStar = '财星';
  } else {
    // 女命看官星
    count = (shishenCount['正官'] || 0) + (shishenCount['七杀'] || 0);
    spouseStar = '官星';
  }

  let description = '';
  if (count >= 3) {
    description = `${spouseStar}过旺，感情复杂，易有多段感情`;
  } else if (count === 0) {
    description = `${spouseStar}弱，婚姻缘分薄，宜晚婚`;
  } else if (count === 1) {
    description = `${spouseStar}适中，婚姻较为稳定`;
  } else {
    description = `${spouseStar}偏旺，感情丰富`;
  }

  // 看日支（配偶宫）
  const dayZhi = bazi.day.zhi;
  description += `；配偶宫为${dayZhi}，配偶性格${getZhiXingge(dayZhi)}`;

  return {
    spouseStar,
    count,
    dayZhi,
    description
  };
}

/**
 * 分析子女
 */
function analyzeZinv(bazi, shishenCount, gender) {
  let childStar = '';
  let count = 0;

  if (gender === '男') {
    // 男命看官杀
    count = (shishenCount['正官'] || 0) + (shishenCount['七杀'] || 0);
    childStar = '官杀';
  } else {
    // 女命看食伤
    count = (shishenCount['食神'] || 0) + (shishenCount['伤官'] || 0);
    childStar = '食伤';
  }

  let description = '';
  if (count >= 3) {
    description = `${childStar}旺，子女缘分深，子女多或子女有出息`;
  } else if (count === 0) {
    description = `${childStar}弱，子女缘分薄，宜晚育`;
  } else {
    description = `${childStar}适中，子女缘分正常`;
  }

  return {
    childStar,
    count,
    description
  };
}

/**
 * 分析兄弟姐妹
 */
function analyzeXiongdi(bazi, shishenCount) {
  const bijieCount = (shishenCount['比肩'] || 0) + (shishenCount['劫财'] || 0);

  let description = '';
  if (bijieCount >= 3) {
    description = '比劫旺，兄弟姐妹多，手足情深';
  } else if (bijieCount <= 1) {
    description = '比劫弱，兄弟姐妹少或缘分薄';
  } else {
    description = '比劫适中，兄弟姐妹缘分正常';
  }

  return {
    count: bijieCount,
    description
  };
}

/**
 * 根据地支判断性格
 */
function getZhiXingge(zhi) {
  const xinggeMap = {
    '子': '聪明灵活',
    '丑': '稳重踏实',
    '寅': '积极进取',
    '卯': '温和善良',
    '辰': '聪慧多才',
    '巳': '精明能干',
    '午': '热情开朗',
    '未': '温柔体贴',
    '申': '机智灵活',
    '酉': '细致认真',
    '戌': '忠诚可靠',
    '亥': '善良宽厚'
  };
  return xinggeMap[zhi] || '性格平和';
}
