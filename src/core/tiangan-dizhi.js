// 天干地支核心模块

// 十天干
export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];

// 十二地支
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 天干五行属性
export const TIANGAN_WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水'
};

// 天干阴阳
export const TIANGAN_YINYANG = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴'
};

// 地支五行属性
export const DIZHI_WUXING = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水'
};

// 地支阴阳
export const DIZHI_YINYANG = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴'
};

// 地支藏干
export const DIZHI_CANGGAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 天干相合
export const TIANGAN_HE = {
  '甲': '己', '己': '甲',
  '乙': '庚', '庚': '乙',
  '丙': '辛', '辛': '丙',
  '丁': '壬', '壬': '丁',
  '戊': '癸', '癸': '戊'
};

// 天干相冲
export const TIANGAN_CHONG = {
  '甲': '庚', '庚': '甲',
  '乙': '辛', '辛': '乙',
  '丙': '壬', '壬': '丙',
  '丁': '癸', '癸': '丁'
};

// 地支六合
export const DIZHI_LIUHE = {
  '子': '丑', '丑': '子',
  '寅': '亥', '亥': '寅',
  '卯': '戌', '戌': '卯',
  '辰': '酉', '酉': '辰',
  '巳': '申', '申': '巳',
  '午': '未', '未': '午'
};

// 地支三合
export const DIZHI_SANHE = {
  '申子辰': '水局',
  '亥卯未': '木局',
  '寅午戌': '火局',
  '巳酉丑': '金局'
};

// 地支六冲
export const DIZHI_LIUCHONG = {
  '子': '午', '午': '子',
  '丑': '未', '未': '丑',
  '寅': '申', '申': '寅',
  '卯': '酉', '酉': '卯',
  '辰': '戌', '戌': '辰',
  '巳': '亥', '亥': '巳'
};

// 地支相刑
export const DIZHI_XING = {
  '子': ['卯'], '卯': ['子'],
  '寅': ['巳'], '巳': ['申'], '申': ['寅'],
  '丑': ['戌'], '戌': ['未'], '未': ['丑'],
  '辰': ['辰'], '午': ['午'], '酉': ['酉'], '亥': ['亥']
};

// 地支相害
export const DIZHI_HAI = {
  '子': '未', '未': '子',
  '丑': '午', '午': '丑',
  '寅': '巳', '巳': '寅',
  '卯': '辰', '辰': '卯',
  '申': '亥', '亥': '申',
  '酉': '戌', '戌': '酉'
};

// 十二生肖
export const SHENGXIAO = {
  '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兔',
  '辰': '龙', '巳': '蛇', '午': '马', '未': '羊',
  '申': '猴', '酉': '鸡', '戌': '狗', '亥': '猪'
};

/**
 * 获取天干索引
 */
export function getTianganIndex(gan) {
  return TIANGAN.indexOf(gan);
}

/**
 * 获取地支索引
 */
export function getDizhiIndex(zhi) {
  return DIZHI.indexOf(zhi);
}

/**
 * 根据索引获取天干
 */
export function getTianganByIndex(index) {
  return TIANGAN[index % 10];
}

/**
 * 根据索引获取地支
 */
export function getDizhiByIndex(index) {
  return DIZHI[index % 12];
}

/**
 * 组合天干地支成干支
 */
export function getGanZhi(ganIndex, zhiIndex) {
  return getTianganByIndex(ganIndex) + getDizhiByIndex(zhiIndex);
}

/**
 * 判断天干是否相合
 */
export function isTianganHe(gan1, gan2) {
  return TIANGAN_HE[gan1] === gan2;
}

/**
 * 判断天干是否相冲
 */
export function isTianganChong(gan1, gan2) {
  return TIANGAN_CHONG[gan1] === gan2;
}

/**
 * 判断地支是否六合
 */
export function isDizhiLiuhe(zhi1, zhi2) {
  return DIZHI_LIUHE[zhi1] === zhi2;
}

/**
 * 判断地支是否六冲
 */
export function isDizhiLiuchong(zhi1, zhi2) {
  return DIZHI_LIUCHONG[zhi1] === zhi2;
}

/**
 * 判断地支是否相刑
 */
export function isDizhiXing(zhi1, zhi2) {
  return DIZHI_XING[zhi1]?.includes(zhi2);
}

/**
 * 判断地支是否相害
 */
export function isDizhiHai(zhi1, zhi2) {
  return DIZHI_HAI[zhi1] === zhi2;
}
