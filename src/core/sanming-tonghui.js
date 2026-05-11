// 三命通会神煞系统

/**
 * 计算神煞
 * @param {Object} bazi - 八字对象
 * @returns {Object} 神煞列表
 */
export function calculateShensha(bazi) {
  const shensha = {
    吉神: [],
    凶煞: [],
    贵人: [],
    桃花: []
  };

  // 天乙贵人
  const tianyiGuiren = getTianyiGuiren(bazi);
  if (tianyiGuiren.length > 0) {
    shensha.贵人.push({
      name: '天乙贵人',
      zhi: tianyiGuiren,
      description: '遇难呈祥，逢凶化吉，得贵人相助'
    });
  }

  // 天德贵人
  const tiande = getTiande(bazi);
  if (tiande) {
    shensha.贵人.push({
      name: '天德贵人',
      info: tiande,
      description: '天降福德，逢凶化吉，一生少灾'
    });
  }

  // 月德贵人
  const yuede = getYuede(bazi);
  if (yuede) {
    shensha.贵人.push({
      name: '月德贵人',
      info: yuede,
      description: '月中福德，性格温和，多得人助'
    });
  }

  // 文昌贵人
  const wenchang = getWenchang(bazi);
  if (wenchang.length > 0) {
    shensha.吉神.push({
      name: '文昌贵人',
      zhi: wenchang,
      description: '聪明好学，利于考试功名，文采出众'
    });
  }

  // 学堂
  const xuetang = getXuetang(bazi);
  if (xuetang) {
    shensha.吉神.push({
      name: '学堂',
      zhi: xuetang,
      description: '天资聪颖，学业有成，记忆力强'
    });
  }

  // 桃花（咸池）
  const taohua = getTaohua(bazi);
  if (taohua.length > 0) {
    shensha.桃花.push({
      name: '桃花',
      zhi: taohua,
      description: '异性缘佳，容貌出众，但需防感情纠葛'
    });
  }

  // 红艳
  const hongyan = getHongyan(bazi);
  if (hongyan) {
    shensha.桃花.push({
      name: '红艳',
      gan: hongyan,
      description: '容貌艳丽，异性缘强，易有桃花之事'
    });
  }

  // 驿马
  const yima = getYima(bazi);
  if (yima.length > 0) {
    shensha.吉神.push({
      name: '驿马',
      zhi: yima,
      description: '奔波走动，利于外出发展，变动多'
    });
  }

  // 华盖
  const huagai = getHuagai(bazi);
  if (huagai.length > 0) {
    shensha.吉神.push({
      name: '华盖',
      zhi: huagai,
      description: '聪明孤高，喜欢艺术玄学，有宗教缘分'
    });
  }

  // 将星
  const jiangxing = getJiangxing(bazi);
  if (jiangxing.length > 0) {
    shensha.吉神.push({
      name: '将星',
      zhi: jiangxing,
      description: '有领导才能，威严果断，适合管理'
    });
  }

  // 金舆
  const jinyu = getJinyu(bazi);
  if (jinyu.length > 0) {
    shensha.吉神.push({
      name: '金舆',
      zhi: jinyu,
      description: '富贵之象，财运亨通，生活富足'
    });
  }

  // 羊刃
  const yangren = getYangren(bazi);
  if (yangren.length > 0) {
    shensha.凶煞.push({
      name: '羊刃',
      zhi: yangren,
      description: '性格刚烈，易有血光之灾，需制化得当'
    });
  }

  // 劫煞
  const jiesha = getJiesha(bazi);
  if (jiesha.length > 0) {
    shensha.凶煞.push({
      name: '劫煞',
      zhi: jiesha,
      description: '易遭劫夺，破财损物，需谨慎理财'
    });
  }

  // 灾煞
  const zaisha = getZaisha(bazi);
  if (zaisha.length > 0) {
    shensha.凶煞.push({
      name: '灾煞',
      zhi: zaisha,
      description: '易遇灾祸，需注意安全，多行善事'
    });
  }

  // 孤辰寡宿
  const guchenguasu = getGuchenGuasu(bazi);
  if (guchenguasu.length > 0) {
    shensha.凶煞.push({
      name: '孤辰寡宿',
      zhi: guchenguasu,
      description: '性格孤僻，六亲缘薄，婚姻不顺'
    });
  }

  // 亡神
  const wangshen = getWangshen(bazi);
  if (wangshen.length > 0) {
    shensha.凶煞.push({
      name: '亡神',
      zhi: wangshen,
      description: '易有损失，需防小人，谨慎行事'
    });
  }

  return shensha;
}

/**
 * 天乙贵人
 * 口诀：甲戊庚牛羊，乙己鼠猴乡，丙丁猪鸡位，壬癸兔蛇藏，六辛逢马虎，此是贵人方
 */
function getTianyiGuiren(bazi) {
  const ganZhiMap = {
    '甲': ['丑', '未'],
    '戊': ['丑', '未'],
    '庚': ['丑', '未'],
    '乙': ['子', '申'],
    '己': ['子', '申'],
    '丙': ['亥', '酉'],
    '丁': ['亥', '酉'],
    '壬': ['卯', '巳'],
    '癸': ['卯', '巳'],
    '辛': ['午', '寅']
  };

  const rizhuGan = bazi.day.gan;
  const targetZhi = ganZhiMap[rizhuGan] || [];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => targetZhi.includes(zhi));
}

/**
 * 天德贵人
 * 正月生者见丁，二月生者见申，三月生者见壬...
 */
function getTiande(bazi) {
  const monthMap = {
    1: '丁', 2: '申', 3: '壬', 4: '辛',
    5: '亥', 6: '甲', 7: '癸', 8: '寅',
    9: '丙', 10: '乙', 11: '巳', 12: '庚'
  };

  const month = bazi.lunar.month;
  const target = monthMap[month];
  const allGanZhi = [
    bazi.year.gan, bazi.year.zhi,
    bazi.month.gan, bazi.month.zhi,
    bazi.day.gan, bazi.day.zhi,
    bazi.hour.gan, bazi.hour.zhi
  ];

  return allGanZhi.includes(target) ? target : null;
}

/**
 * 月德贵人
 * 寅午戌月在丙，申子辰月在壬，亥卯未月在甲，巳酉丑月在庚
 */
function getYuede(bazi) {
  const zhiGanMap = {
    '寅': '丙', '午': '丙', '戌': '丙',
    '申': '壬', '子': '壬', '辰': '壬',
    '亥': '甲', '卯': '甲', '未': '甲',
    '巳': '庚', '酉': '庚', '丑': '庚'
  };

  const monthZhi = bazi.month.zhi;
  const target = zhiGanMap[monthZhi];
  const ganList = [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan];

  return ganList.includes(target) ? target : null;
}

/**
 * 文昌贵人
 * 甲乙巳午报君知，丙戊申宫丁己鸡，庚猪辛鼠壬逢虎，癸人见卯入云梯
 */
function getWenchang(bazi) {
  const ganZhiMap = {
    '甲': '巳', '乙': '午',
    '丙': '申', '戊': '申',
    '丁': '酉', '己': '酉',
    '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };

  const rizhuGan = bazi.day.gan;
  const target = ganZhiMap[rizhuGan];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 学堂
 * 以日干查，甲见巳，乙见午，丙见申...
 */
function getXuetang(bazi) {
  const ganZhiMap = {
    '甲': '巳', '乙': '午', '丙': '申', '丁': '酉',
    '戊': '申', '己': '酉', '庚': '亥', '辛': '子',
    '壬': '寅', '癸': '卯'
  };

  const rizhuGan = bazi.day.gan;
  const target = ganZhiMap[rizhuGan];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.includes(target) ? target : null;
}

/**
 * 桃花（咸池）
 * 申子辰在酉，寅午戌在卯，巳酉丑在午，亥卯未在子
 */
function getTaohua(bazi) {
  const sanheMap = {
    '申': '酉', '子': '酉', '辰': '酉',
    '寅': '卯', '午': '卯', '戌': '卯',
    '巳': '午', '酉': '午', '丑': '午',
    '亥': '子', '卯': '子', '未': '子'
  };

  const yearZhi = bazi.year.zhi;
  const dayZhi = bazi.day.zhi;
  const target = sanheMap[yearZhi] || sanheMap[dayZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 红艳
 * 多春多情，易有桃花
 */
function getHongyan(bazi) {
  const ganMap = {
    '甲': '午', '乙': '申', '丙': '寅', '丁': '未',
    '戊': '辰', '己': '辰', '庚': '戌', '辛': '酉',
    '壬': '子', '癸': '申'
  };

  const rizhuGan = bazi.day.gan;
  const target = ganMap[rizhuGan];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.includes(target) ? rizhuGan : null;
}

/**
 * 驿马
 * 申子辰马在寅，寅午戌马在申，巳酉丑马在亥，亥卯未马在巳
 */
function getYima(bazi) {
  const sanheMap = {
    '申': '寅', '子': '寅', '辰': '寅',
    '寅': '申', '午': '申', '戌': '申',
    '巳': '亥', '酉': '亥', '丑': '亥',
    '亥': '巳', '卯': '巳', '未': '巳'
  };

  const yearZhi = bazi.year.zhi;
  const dayZhi = bazi.day.zhi;
  const target = sanheMap[yearZhi] || sanheMap[dayZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 华盖
 * 申子辰见辰，寅午戌见戌，巳酉丑见丑，亥卯未见未
 */
function getHuagai(bazi) {
  const sanheMap = {
    '申': '辰', '子': '辰', '辰': '辰',
    '寅': '戌', '午': '戌', '戌': '戌',
    '巳': '丑', '酉': '丑', '丑': '丑',
    '亥': '未', '卯': '未', '未': '未'
  };

  const yearZhi = bazi.year.zhi;
  const dayZhi = bazi.day.zhi;
  const target = sanheMap[yearZhi] || sanheMap[dayZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 将星
 * 申子辰见子，寅午戌见午，巳酉丑见酉，亥卯未见卯
 */
function getJiangxing(bazi) {
  const sanheMap = {
    '申': '子', '子': '子', '辰': '子',
    '寅': '午', '午': '午', '戌': '午',
    '巳': '酉', '酉': '酉', '丑': '酉',
    '亥': '卯', '卯': '卯', '未': '卯'
  };

  const yearZhi = bazi.year.zhi;
  const dayZhi = bazi.day.zhi;
  const target = sanheMap[yearZhi] || sanheMap[dayZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 金舆
 * 甲龙乙蛇丙戊羊，丁己猴歌庚犬方，辛猪壬鼠癸逢牛，凡人遇此福气昌
 */
function getJinyu(bazi) {
  const ganZhiMap = {
    '甲': '辰', '乙': '巳', '丙': '未', '丁': '申',
    '戊': '未', '己': '申', '庚': '戌', '辛': '亥',
    '壬': '子', '癸': '丑'
  };

  const rizhuGan = bazi.day.gan;
  const target = ganZhiMap[rizhuGan];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 羊刃
 * 甲见卯，乙见寅，丙戊见午，丁己见巳，庚见酉，辛见申，壬见子，癸见亥
 */
function getYangren(bazi) {
  const ganZhiMap = {
    '甲': '卯', '乙': '寅', '丙': '午', '丁': '巳',
    '戊': '午', '己': '巳', '庚': '酉', '辛': '申',
    '壬': '子', '癸': '亥'
  };

  const rizhuGan = bazi.day.gan;
  const target = ganZhiMap[rizhuGan];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 劫煞
 * 申子辰见巳，寅午戌见亥，巳酉丑见申，亥卯未见寅
 */
function getJiesha(bazi) {
  const sanheMap = {
    '申': '巳', '子': '巳', '辰': '巳',
    '寅': '亥', '午': '亥', '戌': '亥',
    '巳': '申', '酉': '申', '丑': '申',
    '亥': '寅', '卯': '寅', '未': '寅'
  };

  const yearZhi = bazi.year.zhi;
  const target = sanheMap[yearZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 灾煞
 * 申子辰见午，寅午戌见子，巳酉丑见卯，亥卯未见酉
 */
function getZaisha(bazi) {
  const sanheMap = {
    '申': '午', '子': '午', '辰': '午',
    '寅': '子', '午': '子', '戌': '子',
    '巳': '卯', '酉': '卯', '丑': '卯',
    '亥': '酉', '卯': '酉', '未': '酉'
  };

  const yearZhi = bazi.year.zhi;
  const target = sanheMap[yearZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 孤辰寡宿
 * 亥子丑人，见寅为孤，见戌为寡
 */
function getGuchenGuasu(bazi) {
  const yearZhi = bazi.year.zhi;
  const result = [];

  const guchenMap = {
    '亥': '寅', '子': '寅', '丑': '寅',
    '寅': '巳', '卯': '巳', '辰': '巳',
    '巳': '申', '午': '申', '未': '申',
    '申': '亥', '酉': '亥', '戌': '亥'
  };

  const guasuMap = {
    '亥': '戌', '子': '戌', '丑': '戌',
    '寅': '丑', '卯': '丑', '辰': '丑',
    '巳': '辰', '午': '辰', '未': '辰',
    '申': '未', '酉': '未', '戌': '未'
  };

  const guchen = guchenMap[yearZhi];
  const guasu = guasuMap[yearZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  if (zhiList.includes(guchen)) result.push('孤辰');
  if (zhiList.includes(guasu)) result.push('寡宿');

  return result;
}

/**
 * 亡神
 * 申子辰见亥，寅午戌见巳，巳酉丑见申，亥卯未见寅
 */
function getWangshen(bazi) {
  const sanheMap = {
    '申': '亥', '子': '亥', '辰': '亥',
    '寅': '巳', '午': '巳', '戌': '巳',
    '巳': '申', '酉': '申', '丑': '申',
    '亥': '寅', '卯': '寅', '未': '寅'
  };

  const yearZhi = bazi.year.zhi;
  const target = sanheMap[yearZhi];
  const zhiList = [bazi.year.zhi, bazi.month.zhi, bazi.day.zhi, bazi.hour.zhi];

  return zhiList.filter(zhi => zhi === target);
}

/**
 * 格式化神煞输出
 */
export function formatShensha(shensha) {
  const result = [];

  if (shensha.贵人.length > 0) {
    result.push('【贵人星】');
    shensha.贵人.forEach(item => {
      result.push(`${item.name}：${item.description}`);
    });
  }

  if (shensha.吉神.length > 0) {
    result.push('\n【吉神】');
    shensha.吉神.forEach(item => {
      result.push(`${item.name}：${item.description}`);
    });
  }

  if (shensha.桃花.length > 0) {
    result.push('\n【桃花星】');
    shensha.桃花.forEach(item => {
      result.push(`${item.name}：${item.description}`);
    });
  }

  if (shensha.凶煞.length > 0) {
    result.push('\n【凶煞】');
    shensha.凶煞.forEach(item => {
      result.push(`${item.name}：${item.description}`);
    });
  }

  return result.join('\n');
}
