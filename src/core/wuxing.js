// 五行相生相克模块

// 五行
export const WUXING = ['木', '火', '土', '金', '水'];

// 五行相生关系
export const WUXING_SHENG = {
  '木': '火',
  '火': '土',
  '土': '金',
  '金': '水',
  '水': '木'
};

// 五行相克关系
export const WUXING_KE = {
  '木': '土',
  '火': '金',
  '土': '水',
  '金': '木',
  '水': '火'
};

// 五行对应的天干
export const WUXING_TIANGAN = {
  '木': ['甲', '乙'],
  '火': ['丙', '丁'],
  '土': ['戊', '己'],
  '金': ['庚', '辛'],
  '水': ['壬', '癸']
};

// 五行对应的地支
export const WUXING_DIZHI = {
  '木': ['寅', '卯'],
  '火': ['巳', '午'],
  '土': ['辰', '戌', '丑', '未'],
  '金': ['申', '酉'],
  '水': ['子', '亥']
};

// 五行强弱评分标准
export const WUXING_SCORE = {
  '天干': 3,
  '地支本气': 3,
  '地支中气': 2,
  '地支余气': 1,
  '月令': 2  // 月令加倍
};

/**
 * 判断五行相生关系
 */
export function isWuxingSheng(wuxing1, wuxing2) {
  return WUXING_SHENG[wuxing1] === wuxing2;
}

/**
 * 判断五行相克关系
 */
export function isWuxingKe(wuxing1, wuxing2) {
  return WUXING_KE[wuxing1] === wuxing2;
}

/**
 * 获取五行生我的五行
 */
export function getShengWo(wuxing) {
  for (let key in WUXING_SHENG) {
    if (WUXING_SHENG[key] === wuxing) {
      return key;
    }
  }
  return null;
}

/**
 * 获取我生的五行
 */
export function getWoSheng(wuxing) {
  return WUXING_SHENG[wuxing];
}

/**
 * 获取克我的五行
 */
export function getKeWo(wuxing) {
  for (let key in WUXING_KE) {
    if (WUXING_KE[key] === wuxing) {
      return key;
    }
  }
  return null;
}

/**
 * 获取我克的五行
 */
export function getWoKe(wuxing) {
  return WUXING_KE[wuxing];
}

/**
 * 计算五行力量
 * @param {Object} bazi - 八字对象
 * @returns {Object} 五行力量分布
 */
export function calculateWuxingPower(bazi) {
  const power = {
    '木': 0,
    '火': 0,
    '土': 0,
    '金': 0,
    '水': 0
  };

  // 计算天干力量
  [bazi.year.gan, bazi.month.gan, bazi.day.gan, bazi.hour.gan].forEach(gan => {
    const wuxing = getGanWuxing(gan);
    power[wuxing] += WUXING_SCORE['天干'];
  });

  // 计算地支力量（含藏干）
  const zhiList = [
    { zhi: bazi.year.zhi, isYueLing: false },
    { zhi: bazi.month.zhi, isYueLing: true },
    { zhi: bazi.day.zhi, isYueLing: false },
    { zhi: bazi.hour.zhi, isYueLing: false }
  ];

  zhiList.forEach(item => {
    const canggan = getCanggan(item.zhi);
    const multiplier = item.isYueLing ? WUXING_SCORE['月令'] : 1;

    // 本气
    const benqi = canggan[0];
    const benqiWuxing = getGanWuxing(benqi);
    power[benqiWuxing] += WUXING_SCORE['地支本气'] * multiplier;

    // 中气
    if (canggan.length > 1) {
      const zhongqi = canggan[1];
      const zhongqiWuxing = getGanWuxing(zhongqi);
      power[zhongqiWuxing] += WUXING_SCORE['地支中气'] * multiplier;
    }

    // 余气
    if (canggan.length > 2) {
      const yuqi = canggan[2];
      const yuqiWuxing = getGanWuxing(yuqi);
      power[yuqiWuxing] += WUXING_SCORE['地支余气'] * multiplier;
    }
  });

  return power;
}

/**
 * 获取天干五行
 */
function getGanWuxing(gan) {
  for (let wuxing in WUXING_TIANGAN) {
    if (WUXING_TIANGAN[wuxing].includes(gan)) {
      return wuxing;
    }
  }
  return null;
}

/**
 * 获取地支藏干
 */
function getCanggan(zhi) {
  const cangganMap = {
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
  return cangganMap[zhi] || [];
}

/**
 * 判断五行旺衰
 */
export function analyzeWuxingStrength(power) {
  const total = Object.values(power).reduce((sum, val) => sum + val, 0);
  const result = {};

  for (let wuxing in power) {
    const percentage = (power[wuxing] / total * 100).toFixed(1);
    let strength = '';

    if (percentage >= 30) {
      strength = '旺';
    } else if (percentage >= 20) {
      strength = '相';
    } else if (percentage >= 10) {
      strength = '休';
    } else if (percentage >= 5) {
      strength = '囚';
    } else {
      strength = '死';
    }

    result[wuxing] = {
      score: power[wuxing],
      percentage: parseFloat(percentage),
      strength: strength
    };
  }

  return result;
}

/**
 * 获取日主强弱
 */
export function getRizhuStrength(bazi, wuxingPower) {
  const rizhuGan = bazi.day.gan;
  const rizhuWuxing = getGanWuxing(rizhuGan);
  const rizhuPower = wuxingPower[rizhuWuxing];

  // 计算生扶日主的力量
  const shengWuxing = getShengWo(rizhuWuxing);
  const shengPower = wuxingPower[shengWuxing];
  const tongbiPower = rizhuPower;

  const helpPower = shengPower + tongbiPower;

  // 计算克泄耗日主的力量
  const total = Object.values(wuxingPower).reduce((sum, val) => sum + val, 0);
  const weakenPower = total - helpPower;

  let strength = '';
  const ratio = helpPower / total;

  if (ratio >= 0.5) {
    strength = '身旺';
  } else if (ratio >= 0.35) {
    strength = '中和';
  } else {
    strength = '身弱';
  }

  return {
    rizhuWuxing,
    helpPower,
    weakenPower,
    ratio: (ratio * 100).toFixed(1),
    strength
  };
}
