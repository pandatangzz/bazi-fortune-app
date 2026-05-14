// 从旧版 APP 提取的五行生克算法
// 来源: com.nfbazi.Pibazi.a.c.java, com.nfbazi.Pibazi.a.g.java

/**
 * 五行生克系统
 */
export const WuxingShengke = {
  /**
   * 五行属性映射
   */
  wuxingMap: {
    // 天干五行
    tiangan: {
      '甲': '木', '乙': '木',
      '丙': '火', '丁': '火',
      '戊': '土', '己': '土',
      '庚': '金', '辛': '金',
      '壬': '水', '癸': '水'
    },

    // 地支五行
    dizhi: {
      '寅': '木', '卯': '木',
      '巳': '火', '午': '火',
      '辰': '土', '戌': '土', '丑': '土', '未': '土',
      '申': '金', '酉': '金',
      '子': '水', '亥': '水'
    }
  },

  /**
   * 五行生克关系
   */
  shengkeRelation: {
    '木': { 生: '火', 克: '土', 被生: '水', 被克: '金' },
    '火': { 生: '土', 克: '金', 被生: '木', 被克: '水' },
    '土': { 生: '金', 克: '水', 被生: '火', 被克: '木' },
    '金': { 生: '水', 克: '木', 被生: '土', 被克: '火' },
    '水': { 生: '木', 克: '火', 被生: '金', 被克: '土' }
  },

  /**
   * 获取天干或地支的五行
   */
  getWuxing(ganOrZhi) {
    return this.wuxingMap.tiangan[ganOrZhi] || this.wuxingMap.dizhi[ganOrZhi] || '';
  },

  /**
   * 判断两个五行的关系
   */
  getRelation(wuxing1, wuxing2) {
    if (wuxing1 === wuxing2) return '比和';

    const relation = this.shengkeRelation[wuxing1];
    if (!relation) return '';

    if (relation.生 === wuxing2) return '我生';
    if (relation.克 === wuxing2) return '我克';
    if (relation.被生 === wuxing2) return '生我';
    if (relation.被克 === wuxing2) return '克我';

    return '';
  },

  /**
   * 计算八字五行强弱
   */
  calculateWuxingStrength(bazi) {
    const { nianzhu, yuezhu, rizhu, shizhu } = bazi;

    // 统计五行数量
    const wuxingCount = {
      '木': 0,
      '火': 0,
      '土': 0,
      '金': 0,
      '水': 0
    };

    // 统计天干
    [nianzhu[0], yuezhu[0], rizhu[0], shizhu[0]].forEach(gan => {
      const wuxing = this.getWuxing(gan);
      if (wuxing) wuxingCount[wuxing]++;
    });

    // 统计地支（地支权重可以调整）
    [nianzhu[1], yuezhu[1], rizhu[1], shizhu[1]].forEach(zhi => {
      const wuxing = this.getWuxing(zhi);
      if (wuxing) wuxingCount[wuxing]++;
    });

    // 计算总数
    const total = Object.values(wuxingCount).reduce((sum, count) => sum + count, 0);

    // 计算百分比
    const wuxingPercent = {};
    for (const [wuxing, count] of Object.entries(wuxingCount)) {
      wuxingPercent[wuxing] = total > 0 ? Math.round((count / total) * 100) : 0;
    }

    // 判断强弱
    const wuxingStrength = {};
    for (const [wuxing, percent] of Object.entries(wuxingPercent)) {
      if (percent >= 30) {
        wuxingStrength[wuxing] = '旺';
      } else if (percent >= 20) {
        wuxingStrength[wuxing] = '相';
      } else if (percent >= 10) {
        wuxingStrength[wuxing] = '休';
      } else if (percent > 0) {
        wuxingStrength[wuxing] = '囚';
      } else {
        wuxingStrength[wuxing] = '死';
      }
    }

    return {
      五行数量: wuxingCount,
      五行百分比: wuxingPercent,
      五行强弱: wuxingStrength
    };
  },

  /**
   * 判断日主强弱
   */
  judgeRizhuStrength(bazi, wuxingAnalysis) {
    const rizhuTiangan = bazi.rizhu[0];
    const rizhuWuxing = this.getWuxing(rizhuTiangan);

    // 获取日主五行的强度
    const rizhuStrength = wuxingAnalysis.五行强弱[rizhuWuxing];

    // 计算生扶和克泄的力量
    let shengfuCount = 0;  // 生扶（生我、比和）
    let kexieCount = 0;    // 克泄（克我、我生、我克）

    const allGanzhi = [
      bazi.nianzhu[0], bazi.nianzhu[1],
      bazi.yuezhu[0], bazi.yuezhu[1],
      bazi.shizhu[0], bazi.shizhu[1]
    ];

    allGanzhi.forEach(gz => {
      const wuxing = this.getWuxing(gz);
      const relation = this.getRelation(rizhuWuxing, wuxing);

      if (relation === '生我' || relation === '比和') {
        shengfuCount++;
      } else if (relation === '克我' || relation === '我生' || relation === '我克') {
        kexieCount++;
      }
    });

    // 综合判断
    let strength = '';
    if (shengfuCount >= 4) {
      strength = '身旺';
    } else if (shengfuCount >= 2) {
      strength = '身中和';
    } else {
      strength = '身弱';
    }

    return {
      日主五行: rizhuWuxing,
      日主强度: rizhuStrength,
      生扶数量: shengfuCount,
      克泄数量: kexieCount,
      身强身弱: strength,
      说明: this.getStrengthExplanation(strength)
    };
  },

  /**
   * 获取身强身弱的说明
   */
  getStrengthExplanation(strength) {
    const explanations = {
      '身旺': '日主得令得地，生扶有力，宜泄宜克，忌再帮扶',
      '身中和': '日主不强不弱，五行平衡，顺其自然最佳',
      '身弱': '日主失令失地，克泄过重，宜生宜扶，忌再克泄'
    };

    return explanations[strength] || '';
  },

  /**
   * 推算用神喜忌
   */
  calculateYongshen(bazi, rizhuAnalysis) {
    const { 日主五行, 身强身弱 } = rizhuAnalysis;

    let yongshen = [];
    let xishen = [];
    let jishen = [];

    if (身强身弱 === '身旺') {
      // 身旺：用克泄
      const relation = this.shengkeRelation[日主五行];
      yongshen = [relation.克, relation.生];  // 我克、我生
      xishen = [relation.被克];               // 克我
      jishen = [日主五行, relation.被生];     // 比和、生我

    } else if (身强身弱 === '身弱') {
      // 身弱：用生扶
      const relation = this.shengkeRelation[日主五行];
      yongshen = [relation.被生, 日主五行];   // 生我、比和
      xishen = [relation.生];                 // 我生
      jishen = [relation.被克, relation.克];  // 克我、我克

    } else {
      // 身中和：维持平衡
      yongshen = ['平衡为贵'];
      xishen = [];
      jishen = [];
    }

    return {
      用神: yongshen,
      喜神: xishen,
      忌神: jishen,
      说明: this.getYongshenExplanation(身强身弱, yongshen, jishen)
    };
  },

  /**
   * 获取用神说明
   */
  getYongshenExplanation(strength, yongshen, jishen) {
    if (strength === '身中和') {
      return '五行平衡，无需特别补益，顺其自然即可';
    }

    const yongshenStr = yongshen.join('、');
    const jishenStr = jishen.join('、');

    return `宜补${yongshenStr}，忌见${jishenStr}。\n` +
           `在选择职业、方位、颜色等方面，应多亲近${yongshenStr}属性的事物。`;
  }
};

export default WuxingShengke;
