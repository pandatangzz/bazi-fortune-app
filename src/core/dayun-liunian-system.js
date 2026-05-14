// 从旧版 APP 提取的大运流年计算算法
// 来源: BaziToShengri.java, com.nfbazi.Pibazi.a.g.java

/**
 * 大运流年计算系统
 */
export const DayunLiunianSystem = {
  /**
   * 计算起运年龄
   * 基于出生日期和性别计算何时开始行大运
   *
   * @param {Object} bazi - 八字信息
   * @param {string} gender - 性别 ('男' 或 '女')
   * @param {number} birthYear - 出生年份
   * @param {number} birthMonth - 出生月份
   * @param {number} birthDay - 出生日期
   * @returns {Object} 起运信息
   */
  calculateQiyunAge(bazi, gender, birthYear, birthMonth, birthDay) {
    const { nianzhu, yuezhu } = bazi;

    // 判断阴阳年（年干的阴阳）
    const nianganIndex = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'].indexOf(nianzhu[0]);
    const isYangYear = nianganIndex % 2 === 0; // 甲丙戊庚壬为阳

    // 顺逆判断
    // 阳年男命、阴年女命 → 顺行
    // 阴年男命、阳年女命 → 逆行
    const isShunxing = (isYangYear && gender === '男') || (!isYangYear && gender === '女');

    // 计算到下一个节气的天数（简化算法）
    // 实际应该精确计算到节气的时间差
    const daysToNextJieqi = this.calculateDaysToJieqi(birthYear, birthMonth, birthDay, isShunxing);

    // 3天折1年，计算起运岁数
    const qiyunYears = Math.floor(daysToNextJieqi / 3);
    const qiyunMonths = Math.floor((daysToNextJieqi % 3) * 4);
    const qiyunDays = (daysToNextJieqi % 3) * 120 % 30;

    return {
      起运岁数: qiyunYears,
      起运月数: qiyunMonths,
      起运天数: qiyunDays,
      顺逆: isShunxing ? '顺行' : '逆行',
      说明: `命主从${qiyunYears}岁${qiyunMonths}月${qiyunDays}天开始行大运`
    };
  },

  /**
   * 计算到节气的天数（简化版）
   */
  calculateDaysToJieqi(year, month, day, isShunxing) {
    // 简化算法：假设每月15日为节气
    // 实际应该使用精确的节气时间表
    const jieqiDay = 15;

    if (isShunxing) {
      // 顺行：计算到下一个节气
      if (day < jieqiDay) {
        return jieqiDay - day;
      } else {
        // 下个月的节气
        const daysInMonth = this.getDaysInMonth(year, month);
        return (daysInMonth - day) + jieqiDay;
      }
    } else {
      // 逆行：计算到上一个节气
      if (day > jieqiDay) {
        return day - jieqiDay;
      } else {
        // 上个月的节气
        const prevMonth = month === 1 ? 12 : month - 1;
        const prevYear = month === 1 ? year - 1 : year;
        const daysInPrevMonth = this.getDaysInMonth(prevYear, prevMonth);
        return day + (daysInPrevMonth - jieqiDay);
      }
    }
  },

  /**
   * 获取某月的天数
   */
  getDaysInMonth(year, month) {
    const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // 闰年2月29天
    if (month === 2) {
      const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
      return isLeapYear ? 29 : 28;
    }

    return daysInMonth[month];
  },

  /**
   * 计算八步大运
   * 每步大运10年
   *
   * @param {Object} bazi - 八字信息
   * @param {Object} qiyunInfo - 起运信息
   * @param {number} birthYear - 出生年份
   * @returns {Array} 八步大运数组
   */
  calculateBaDayun(bazi, qiyunInfo, birthYear) {
    const { yuezhu } = bazi;
    const { 顺逆 } = qiyunInfo;
    const isShunxing = 顺逆 === '顺行';

    const dayunList = [];
    const tiangan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    const dizhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

    // 月柱的天干地支索引
    let tianganIndex = tiangan.indexOf(yuezhu[0]);
    let dizhiIndex = dizhi.indexOf(yuezhu[1]);

    // 计算8步大运
    for (let i = 0; i < 8; i++) {
      // 顺行或逆行
      if (isShunxing) {
        tianganIndex = (tianganIndex + 1) % 10;
        dizhiIndex = (dizhiIndex + 1) % 12;
      } else {
        tianganIndex = (tianganIndex - 1 + 10) % 10;
        dizhiIndex = (dizhiIndex - 1 + 12) % 12;
      }

      const dayunGanzhi = tiangan[tianganIndex] + dizhi[dizhiIndex];
      const startAge = qiyunInfo.起运岁数 + (i * 10);
      const startYear = birthYear + startAge;

      dayunList.push({
        序号: i + 1,
        干支: dayunGanzhi,
        天干: tiangan[tianganIndex],
        地支: dizhi[dizhiIndex],
        起始年龄: startAge,
        结束年龄: startAge + 9,
        起始年份: startYear,
        结束年份: startYear + 9
      });
    }

    return dayunList;
  },

  /**
   * 计算流年
   * 从出生年开始，每年的干支
   *
   * @param {number} birthYear - 出生年份
   * @param {number} years - 要计算的年数（默认80年）
   * @returns {Array} 流年数组
   */
  calculateLiunian(birthYear, years = 80) {
    const liunianList = [];
    const jiazi = [
      '甲子', '乙丑', '丙寅', '丁卯', '戊辰', '己巳', '庚午', '辛未', '壬申', '癸酉',
      '甲戌', '乙亥', '丙子', '丁丑', '戊寅', '己卯', '庚辰', '辛巳', '壬午', '癸未',
      '甲申', '乙酉', '丙戌', '丁亥', '戊子', '己丑', '庚寅', '辛卯', '壬辰', '癸巳',
      '甲午', '乙未', '丙申', '丁酉', '戊戌', '己亥', '庚子', '辛丑', '壬寅', '癸卯',
      '甲辰', '乙巳', '丙午', '丁未', '戊申', '己酉', '庚戌', '辛亥', '壬子', '癸丑',
      '甲寅', '乙卯', '丙辰', '丁巳', '戊午', '己未', '庚申', '辛酉', '壬戌', '癸亥'
    ];

    // 计算出生年的甲子索引
    // 简化算法：1984年为甲子年（索引0）
    const jiaziBase = 1984;
    const yearOffset = birthYear - jiaziBase;
    const startIndex = ((yearOffset % 60) + 60) % 60;

    for (let i = 0; i < years; i++) {
      const jiaziIndex = (startIndex + i) % 60;
      const year = birthYear + i;
      const age = i;

      liunianList.push({
        年份: year,
        年龄: age,
        干支: jiazi[jiaziIndex],
        天干: jiazi[jiaziIndex][0],
        地支: jiazi[jiaziIndex][1]
      });
    }

    return liunianList;
  },

  /**
   * 计算大运流年组合
   * 将大运和流年结合，分析每年的运势
   *
   * @param {Array} dayunList - 大运列表
   * @param {Array} liunianList - 流年列表
   * @returns {Array} 大运流年组合
   */
  combineDayunLiunian(dayunList, liunianList) {
    const combined = [];

    for (const liunian of liunianList) {
      // 找到对应的大运
      const dayun = dayunList.find(d =>
        liunian.年龄 >= d.起始年龄 && liunian.年龄 <= d.结束年龄
      );

      if (dayun) {
        combined.push({
          年份: liunian.年份,
          年龄: liunian.年龄,
          流年干支: liunian.干支,
          大运干支: dayun.干支,
          大运序号: dayun.序号,
          大运范围: `${dayun.起始年龄}-${dayun.结束年龄}岁`
        });
      }
    }

    return combined;
  },

  /**
   * 计算两个日期之间的天数差
   * 来源: g.java 的 a() 方法
   */
  calculateDaysBetween(year1, month1, day1, year2, month2, day2) {
    let isReverse = false;

    // 确保日期1早于日期2
    if (year1 > year2 || (year1 === year2 && month1 > month2) ||
        (year1 === year2 && month1 === month2 && day1 > day2)) {
      [year1, month1, day1, year2, month2, day2] = [year2, month2, day2, year1, month1, day1];
      isReverse = true;
    }

    let days = day2 - day1;
    let currentYear = year1;
    let currentMonth = month1;

    // 累加月份的天数
    while (!(currentYear === year2 && currentMonth === month2)) {
      days += this.getDaysInMonth(currentYear, currentMonth);

      if (currentMonth === 12) {
        currentYear++;
        currentMonth = 1;
      } else {
        currentMonth++;
      }
    }

    return isReverse ? -days : days;
  }
};

export default DayunLiunianSystem;
