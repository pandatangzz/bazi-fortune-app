// 八字排盘核心算法
import { Solar, Lunar } from 'lunar-javascript';
import { TIANGAN, DIZHI, TIANGAN_WUXING, DIZHI_WUXING, DIZHI_CANGGAN } from './tiangan-dizhi.js';

/**
 * 根据出生日期计算八字
 * @param {number} year - 年
 * @param {number} month - 月
 * @param {number} day - 日
 * @param {number} hour - 时
 * @param {number} minute - 分
 * @param {number} gender - 性别 (0:女, 1:男)
 * @returns {Object} 八字信息
 */
export function calculateBazi(year, month, day, hour, minute, gender) {
  const solar = Solar.fromYmdHms(year, month, day, hour, minute, 0);
  const lunar = solar.getLunar();

  // 获取四柱
  const yearGanZhi = lunar.getYearInGanZhiExact();
  const monthGanZhi = lunar.getMonthInGanZhiExact();
  const dayGanZhi = lunar.getDayInGanZhi();
  const hourGanZhi = lunar.getTimeInGanZhi();

  // 解析干支
  const yearPillar = parseGanZhi(yearGanZhi);
  const monthPillar = parseGanZhi(monthGanZhi);
  const dayPillar = parseGanZhi(dayGanZhi);
  const hourPillar = parseGanZhi(hourGanZhi);

  // 构建八字对象
  const bazi = {
    solar: {
      year,
      month,
      day,
      hour,
      minute
    },
    lunar: {
      year: lunar.getYear(),
      month: lunar.getMonth(),
      day: lunar.getDay(),
      monthName: lunar.getMonthInChinese(),
      dayName: lunar.getDayInChinese()
    },
    gender: gender === 1 ? '男' : '女',
    year: yearPillar,
    month: monthPillar,
    day: dayPillar,
    hour: hourPillar,
    shengxiao: lunar.getYearShengXiao(),
    nayin: {
      year: lunar.getYearNaYin(),
      month: lunar.getMonthNaYin(),
      day: lunar.getDayNaYin(),
      hour: lunar.getTimeNaYin()
    }
  };

  return bazi;
}

/**
 * 解析干支字符串
 */
function parseGanZhi(ganZhi) {
  const gan = ganZhi[0];
  const zhi = ganZhi[1];

  return {
    ganZhi,
    gan,
    zhi,
    ganWuxing: TIANGAN_WUXING[gan],
    zhiWuxing: DIZHI_WUXING[zhi],
    canggan: DIZHI_CANGGAN[zhi],
    ganYinyang: getGanYinyang(gan),
    zhiYinyang: getZhiYinyang(zhi)
  };
}

/**
 * 获取天干阴阳
 */
function getGanYinyang(gan) {
  const yangGan = ['甲', '丙', '戊', '庚', '壬'];
  return yangGan.includes(gan) ? '阳' : '阴';
}

/**
 * 获取地支阴阳
 */
function getZhiYinyang(zhi) {
  const yangZhi = ['子', '寅', '辰', '午', '申', '戌'];
  return yangZhi.includes(zhi) ? '阳' : '阴';
}

/**
 * 获取十神
 * @param {string} rizhuGan - 日主天干
 * @param {string} targetGan - 目标天干
 * @returns {string} 十神名称
 */
export function getShishen(rizhuGan, targetGan) {
  if (rizhuGan === targetGan) {
    return '比肩';
  }

  const rizhuWuxing = TIANGAN_WUXING[rizhuGan];
  const targetWuxing = TIANGAN_WUXING[targetGan];
  const rizhuYinyang = getGanYinyang(rizhuGan);
  const targetYinyang = getGanYinyang(targetGan);
  const sameYinyang = rizhuYinyang === targetYinyang;

  // 同五行
  if (rizhuWuxing === targetWuxing) {
    return sameYinyang ? '比肩' : '劫财';
  }

  // 我生者为食伤
  if (isWoSheng(rizhuWuxing, targetWuxing)) {
    return sameYinyang ? '食神' : '伤官';
  }

  // 我克者为财
  if (isWoKe(rizhuWuxing, targetWuxing)) {
    return sameYinyang ? '偏财' : '正财';
  }

  // 克我者为官杀
  if (isKeWo(rizhuWuxing, targetWuxing)) {
    return sameYinyang ? '七杀' : '正官';
  }

  // 生我者为印
  if (isShengWo(rizhuWuxing, targetWuxing)) {
    return sameYinyang ? '偏印' : '正印';
  }

  return '未知';
}

/**
 * 五行相生判断
 */
function isWoSheng(wuxing1, wuxing2) {
  const shengMap = {
    '木': '火',
    '火': '土',
    '土': '金',
    '金': '水',
    '水': '木'
  };
  return shengMap[wuxing1] === wuxing2;
}

/**
 * 五行相克判断
 */
function isWoKe(wuxing1, wuxing2) {
  const keMap = {
    '木': '土',
    '火': '金',
    '土': '水',
    '金': '木',
    '水': '火'
  };
  return keMap[wuxing1] === wuxing2;
}

/**
 * 克我判断
 */
function isKeWo(wuxing1, wuxing2) {
  return isWoKe(wuxing2, wuxing1);
}

/**
 * 生我判断
 */
function isShengWo(wuxing1, wuxing2) {
  return isWoSheng(wuxing2, wuxing1);
}

/**
 * 为八字添加十神信息
 */
export function addShishenToBazi(bazi) {
  const rizhuGan = bazi.day.gan;

  // 为年月时柱添加十神
  bazi.year.shishen = getShishen(rizhuGan, bazi.year.gan);
  bazi.month.shishen = getShishen(rizhuGan, bazi.month.gan);
  bazi.day.shishen = '日主';
  bazi.hour.shishen = getShishen(rizhuGan, bazi.hour.gan);

  // 为藏干添加十神
  ['year', 'month', 'day', 'hour'].forEach(pillar => {
    bazi[pillar].cangganShishen = bazi[pillar].canggan.map(gan => ({
      gan,
      shishen: getShishen(rizhuGan, gan)
    }));
  });

  return bazi;
}

/**
 * 获取月令
 */
export function getYueLing(bazi) {
  return {
    zhi: bazi.month.zhi,
    wuxing: bazi.month.zhiWuxing,
    canggan: bazi.month.canggan,
    description: `月令为${bazi.month.zhi}，五行属${bazi.month.zhiWuxing}`
  };
}

/**
 * 判断是否得令
 */
export function isDeLing(bazi) {
  const rizhuWuxing = bazi.day.ganWuxing;
  const yueLingWuxing = bazi.month.zhiWuxing;

  // 日主五行与月令五行相同，或月令生日主
  if (rizhuWuxing === yueLingWuxing) {
    return { deLing: true, reason: '日主与月令同五行，得令' };
  }

  if (isShengWo(rizhuWuxing, yueLingWuxing)) {
    return { deLing: true, reason: '月令生日主，得令' };
  }

  return { deLing: false, reason: '不得月令' };
}

/**
 * 格式化八字输出
 */
export function formatBazi(bazi) {
  return {
    四柱: {
      年柱: `${bazi.year.ganZhi} (${bazi.year.shishen})`,
      月柱: `${bazi.month.ganZhi} (${bazi.month.shishen})`,
      日柱: `${bazi.day.ganZhi} (日主)`,
      时柱: `${bazi.hour.ganZhi} (${bazi.hour.shishen})`
    },
    纳音: {
      年: bazi.nayin.year,
      月: bazi.nayin.month,
      日: bazi.nayin.day,
      时: bazi.nayin.hour
    },
    基本信息: {
      性别: bazi.gender,
      生肖: bazi.shengxiao,
      公历: `${bazi.solar.year}年${bazi.solar.month}月${bazi.solar.day}日 ${bazi.solar.hour}时${bazi.solar.minute}分`,
      农历: `${bazi.lunar.year}年${bazi.lunar.monthName}月${bazi.lunar.dayName}`
    }
  };
}
