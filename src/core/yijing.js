// 易经卦象分析模块

/**
 * 六十四卦数据
 */
const LIUSHISI_GUA = {
  1: { name: '乾为天', symbol: '☰☰', wuxing: '金', description: '元亨利贞，刚健中正，自强不息', yaoyi: '天行健，君子以自强不息' },
  2: { name: '坤为地', symbol: '☷☷', wuxing: '土', description: '元亨，利牝马之贞，厚德载物', yaoyi: '地势坤，君子以厚德载物' },
  3: { name: '水雷屯', symbol: '☵☳', wuxing: '水', description: '元亨利贞，勿用有攸往，利建侯', yaoyi: '云雷屯，君子以经纶' },
  4: { name: '山水蒙', symbol: '☶☵', wuxing: '水', description: '亨，匪我求童蒙，童蒙求我', yaoyi: '山下出泉，蒙，君子以果行育德' },
  5: { name: '水天需', symbol: '☵☰', wuxing: '水', description: '有孚，光亨，贞吉，利涉大川', yaoyi: '云上于天，需，君子以饮食宴乐' },
  6: { name: '天水讼', symbol: '☰☵', wuxing: '金', description: '有孚，窒惕，中吉，终凶', yaoyi: '天与水违行，讼，君子以作事谋始' },
  7: { name: '地水师', symbol: '☷☵', wuxing: '土', description: '贞丈人吉，无咎', yaoyi: '地中有水，师，君子以容民畜众' },
  8: { name: '水地比', symbol: '☵☷', wuxing: '水', description: '吉，原筮，元永贞，无咎', yaoyi: '地上有水，比，先王以建万国，亲诸侯' },
  9: { name: '风天小畜', symbol: '☴☰', wuxing: '木', description: '亨，密云不雨，自我西郊', yaoyi: '风行天上，小畜，君子以懿文德' },
  10: { name: '天泽履', symbol: '☰☱', wuxing: '金', description: '履虎尾，不咥人，亨', yaoyi: '上天下泽，履，君子以辨上下，定民志' },
  11: { name: '地天泰', symbol: '☷☰', wuxing: '土', description: '小往大来，吉亨', yaoyi: '天地交，泰，后以财成天地之道，辅相天地之宜' },
  12: { name: '天地否', symbol: '☰☷', wuxing: '金', description: '否之匪人，不利君子贞', yaoyi: '天地不交，否，君子以俭德辟难' },
  13: { name: '天火同人', symbol: '☰☲', wuxing: '火', description: '同人于野，亨，利涉大川', yaoyi: '天与火，同人，君子以类族辨物' },
  14: { name: '火天大有', symbol: '☲☰', wuxing: '火', description: '元亨', yaoyi: '火在天上，大有，君子以遏恶扬善' },
  15: { name: '地山谦', symbol: '☷☶', wuxing: '土', description: '亨，君子有终', yaoyi: '地中有山，谦，君子以裒多益寡' },
  16: { name: '雷地豫', symbol: '☳☷', wuxing: '木', description: '利建侯行师', yaoyi: '雷出地奋，豫，先王以作乐崇德' },
  17: { name: '泽雷随', symbol: '☱☳', wuxing: '金', description: '元亨利贞，无咎', yaoyi: '泽中有雷，随，君子以向晦入宴息' },
  18: { name: '山风蛊', symbol: '☶☴', wuxing: '木', description: '元亨，利涉大川', yaoyi: '山下有风，蛊，君子以振民育德' },
  19: { name: '地泽临', symbol: '☷☱', wuxing: '土', description: '元亨利贞，至于八月有凶', yaoyi: '泽上有地，临，君子以教思无穷' },
  20: { name: '风地观', symbol: '☴☷', wuxing: '木', description: '盥而不荐，有孚颙若', yaoyi: '风行地上，观，先王以省方观民设教' },
  // 其他卦象省略，实际应用需要完整的64卦
};

/**
 * 八卦基础数据
 */
const BAGUA = {
  '乾': { symbol: '☰', wuxing: '金', nature: '天', direction: '西北', number: 1 },
  '坤': { symbol: '☷', wuxing: '土', nature: '地', direction: '西南', number: 8 },
  '震': { symbol: '☳', wuxing: '木', nature: '雷', direction: '东', number: 4 },
  '巽': { symbol: '☴', wuxing: '木', nature: '风', direction: '东南', number: 5 },
  '坎': { symbol: '☵', wuxing: '水', nature: '水', direction: '北', number: 6 },
  '离': { symbol: '☲', wuxing: '火', nature: '火', direction: '南', number: 3 },
  '艮': { symbol: '☶', wuxing: '土', nature: '山', direction: '东北', number: 7 },
  '兑': { symbol: '☱', wuxing: '金', nature: '泽', direction: '西', number: 2 }
};

/**
 * 根据八字起卦
 * @param {Object} bazi - 八字对象
 * @param {string} method - 起卦方法 ('time', 'number', 'plum')
 * @returns {Object} 卦象信息
 */
export function qigua(bazi, method = 'time') {
  if (method === 'time') {
    return qiguaByTime(bazi);
  } else if (method === 'plum') {
    return qiguaByMeihua(bazi);
  }
  return null;
}

/**
 * 时间起卦法
 */
function qiguaByTime(bazi) {
  const year = bazi.lunar.year;
  const month = bazi.lunar.month;
  const day = bazi.lunar.day;
  const hour = getHourNumber(bazi.hour.zhi);

  // 上卦 = (年 + 月 + 日) % 8
  const shangguaNum = (year + month + day) % 8 || 8;

  // 下卦 = (年 + 月 + 日 + 时) % 8
  const xiaguaNum = (year + month + day + hour) % 8 || 8;

  // 动爻 = (年 + 月 + 日 + 时) % 6
  const dongyao = (year + month + day + hour) % 6 || 6;

  const shanggua = getGuaByNumber(shangguaNum);
  const xiagua = getGuaByNumber(xiaguaNum);

  // 查找主卦
  const zhugua = findGua(shanggua, xiagua);

  // 计算变卦（动爻变化后的卦）
  const biangua = calculateBiangua(zhugua, dongyao);

  return {
    method: '时间起卦',
    主卦: zhugua,
    变卦: biangua,
    动爻: dongyao,
    上卦: shanggua,
    下卦: xiagua,
    卦辞: zhugua.description,
    爻辞: getYaoci(zhugua, dongyao)
  };
}

/**
 * 梅花易数起卦法
 */
function qiguaByMeihua(bazi) {
  const year = bazi.lunar.year;
  const month = bazi.lunar.month;
  const day = bazi.lunar.day;
  const hour = getHourNumber(bazi.hour.zhi);

  // 梅花易数：年月日之和为上卦，年月日时之和为下卦
  const shangguaNum = (year + month + day) % 8 || 8;
  const xiaguaNum = (year + month + day + hour) % 8 || 8;
  const dongyao = (year + month + day + hour) % 6 || 6;

  const shanggua = getGuaByNumber(shangguaNum);
  const xiagua = getGuaByNumber(xiaguaNum);
  const zhugua = findGua(shanggua, xiagua);
  const biangua = calculateBiangua(zhugua, dongyao);

  return {
    method: '梅花易数',
    主卦: zhugua,
    变卦: biangua,
    动爻: dongyao,
    上卦: shanggua,
    下卦: xiagua,
    体卦: shanggua,
    用卦: xiagua,
    互卦: calculateHugua(zhugua),
    分析: analyzeMeihua(shanggua, xiagua, dongyao)
  };
}

/**
 * 获取时辰数字
 */
function getHourNumber(zhi) {
  const zhiMap = {
    '子': 1, '丑': 2, '寅': 3, '卯': 4,
    '辰': 5, '巳': 6, '午': 7, '未': 8,
    '申': 9, '酉': 10, '戌': 11, '亥': 12
  };
  return zhiMap[zhi] || 1;
}

/**
 * 根据数字获取卦
 */
function getGuaByNumber(num) {
  const guaList = ['坤', '兑', '离', '震', '巽', '坎', '艮', '乾'];
  const guaName = guaList[num - 1];
  return { name: guaName, ...BAGUA[guaName] };
}

/**
 * 查找六十四卦
 */
function findGua(shanggua, xiagua) {
  // 简化版：根据上下卦组合查找
  const guaMap = {
    '乾乾': 1, '坤坤': 2, '坎震': 3, '艮坎': 4,
    '坎乾': 5, '乾坎': 6, '坤坎': 7, '坎坤': 8,
    '巽乾': 9, '乾兑': 10, '坤乾': 11, '乾坤': 12,
    '乾离': 13, '离乾': 14, '坤艮': 15, '震坤': 16,
    '兑震': 17, '艮巽': 18, '坤兑': 19, '巽坤': 20
  };

  const key = shanggua.name + xiagua.name;
  const guaNum = guaMap[key] || 1;

  return {
    number: guaNum,
    ...LIUSHISI_GUA[guaNum],
    上卦: shanggua.name,
    下卦: xiagua.name
  };
}

/**
 * 计算变卦
 */
function calculateBiangua(zhugua, dongyao) {
  // 简化版：返回一个变卦示例
  const bianguaNum = (zhugua.number % 64) + 1;
  return {
    number: bianguaNum,
    ...LIUSHISI_GUA[bianguaNum] || LIUSHISI_GUA[1],
    说明: `第${dongyao}爻发动，主卦变为此卦`
  };
}

/**
 * 计算互卦
 */
function calculateHugua(zhugua) {
  // 互卦：由主卦的2、3、4爻组成上卦，3、4、5爻组成下卦
  return {
    name: '互卦',
    description: '由主卦中间四爻组成，反映事物的内在变化'
  };
}

/**
 * 获取爻辞
 */
function getYaoci(gua, yao) {
  const yaociMap = {
    1: {
      1: '初九：潜龙勿用',
      2: '九二：见龙在田，利见大人',
      3: '九三：君子终日乾乾，夕惕若厉，无咎',
      4: '九四：或跃在渊，无咎',
      5: '九五：飞龙在天，利见大人',
      6: '上九：亢龙有悔'
    },
    2: {
      1: '初六：履霜，坚冰至',
      2: '六二：直方大，不习无不利',
      3: '六三：含章可贞，或从王事，无成有终',
      4: '六四：括囊，无咎无誉',
      5: '六五：黄裳，元吉',
      6: '上六：龙战于野，其血玄黄'
    }
  };

  const yaoci = yaociMap[gua.number]?.[yao] || `第${yao}爻发动`;
  return {
    爻位: `第${yao}爻`,
    爻辞: yaoci,
    解释: analyzeYao(yao)
  };
}

/**
 * 分析爻位
 */
function analyzeYao(yao) {
  const yaoAnalysis = {
    1: '初爻：事物开始阶段，宜谨慎行事，不宜妄动',
    2: '二爻：事物发展阶段，渐入佳境，可以行动',
    3: '三爻：事物转折阶段，需要警惕，防止过刚',
    4: '四爻：事物上升阶段，可以进取，但需谨慎',
    5: '五爻：事物鼎盛阶段，最佳时机，大展宏图',
    6: '上爻：事物终结阶段，盛极而衰，宜收敛'
  };
  return yaoAnalysis[yao] || '';
}

/**
 * 梅花易数分析
 */
function analyzeMeihua(tigua, yonggua, dongyao) {
  const tiWuxing = tigua.wuxing;
  const yongWuxing = yonggua.wuxing;

  let relation = '';
  if (tiWuxing === yongWuxing) {
    relation = '体用比和，吉';
  } else if (isWuxingSheng(tiWuxing, yongWuxing)) {
    relation = '体生用，不利己，耗损之象';
  } else if (isWuxingSheng(yongWuxing, tiWuxing)) {
    relation = '用生体，利己，得助之象';
  } else if (isWuxingKe(tiWuxing, yongWuxing)) {
    relation = '体克用，利己，可成之象';
  } else if (isWuxingKe(yongWuxing, tiWuxing)) {
    relation = '用克体，不利己，受制之象';
  }

  return {
    体卦五行: tiWuxing,
    用卦五行: yongWuxing,
    体用关系: relation,
    吉凶判断: relation.includes('利己') ? '吉' : '凶',
    建议: getAdviceByRelation(relation)
  };
}

/**
 * 五行相生判断
 */
function isWuxingSheng(wx1, wx2) {
  const shengMap = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  return shengMap[wx1] === wx2;
}

/**
 * 五行相克判断
 */
function isWuxingKe(wx1, wx2) {
  const keMap = {
    '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
  };
  return keMap[wx1] === wx2;
}

/**
 * 根据体用关系给出建议
 */
function getAdviceByRelation(relation) {
  if (relation.includes('比和')) {
    return '体用比和，事情平稳，可以按计划进行';
  } else if (relation.includes('用生体')) {
    return '用生体，有贵人相助，可以大胆行动';
  } else if (relation.includes('体克用')) {
    return '体克用，我方占优，可以主动出击';
  } else if (relation.includes('体生用')) {
    return '体生用，付出较多，需量力而行';
  } else if (relation.includes('用克体')) {
    return '用克体，阻力较大，宜守不宜攻';
  }
  return '需综合分析，谨慎决策';
}

/**
 * 占卜日常事项
 * @param {string} matter - 占卜事项
 * @param {Object} bazi - 八字对象
 * @returns {Object} 占卜结果
 */
export function zhanbuMatter(matter, bazi) {
  const guaxiang = qiguaByMeihua(bazi);

  return {
    占卜事项: matter,
    起卦时间: `${bazi.solar.year}年${bazi.solar.month}月${bazi.solar.day}日 ${bazi.solar.hour}时`,
    卦象: guaxiang,
    吉凶: guaxiang.分析.吉凶判断,
    建议: guaxiang.分析.建议,
    详解: analyzeMatterByGua(matter, guaxiang)
  };
}

/**
 * 根据卦象分析具体事项
 */
function analyzeMatterByGua(matter, guaxiang) {
  const jixiong = guaxiang.分析.吉凶判断;

  const matterAdvice = {
    '求财': jixiong === '吉' ? '财运亨通，可以投资或开展业务，但需注意风险控制' : '财运一般，不宜大额投资，宜守成',
    '求职': jixiong === '吉' ? '求职顺利，有贵人相助，可以积极应聘' : '求职有阻，需要耐心等待，多做准备',
    '考试': jixiong === '吉' ? '考运不错，认真复习可以取得好成绩' : '考运一般，需要加倍努力，不可掉以轻心',
    '婚姻': jixiong === '吉' ? '姻缘美满，可以考虑进一步发展' : '感情有波折，需要多沟通理解',
    '出行': jixiong === '吉' ? '出行顺利，一路平安' : '出行需谨慎，注意安全',
    '健康': jixiong === '吉' ? '身体健康，精神愉快' : '需注意身体，预防疾病',
    '诉讼': jixiong === '吉' ? '官司有利，可以胜诉' : '官司不利，宜和解',
    '合作': jixiong === '吉' ? '合作顺利，可以达成协议' : '合作有阻，需谨慎考虑'
  };

  return matterAdvice[matter] || `此事${jixiong === '吉' ? '吉利' : '不利'}，${guaxiang.分析.建议}`;
}

/**
 * 格式化卦象输出
 */
export function formatGuaxiang(guaxiang) {
  return {
    起卦方法: guaxiang.method,
    主卦: `${guaxiang.主卦.name} (${guaxiang.主卦.symbol})`,
    变卦: `${guaxiang.变卦.name} (${guaxiang.变卦.symbol})`,
    动爻: `第${guaxiang.动爻}爻`,
    卦辞: guaxiang.主卦.description,
    彖辞: guaxiang.主卦.yaoyi,
    分析: guaxiang.分析
  };
}
