// 日常事项测算模板和智能联想

/**
 * 测算事项分类模板
 */
export const MATTER_CATEGORIES = {
  工作事业: {
    icon: '💼',
    items: [
      { value: '明日上班工作情况', label: '明日上班工作情况', directions: ['工作状态', '同事关系', '领导态度', '业绩表现'] },
      { value: '求职面试', label: '求职面试', directions: ['面试结果', '时机选择', '注意事项', '准备方向'] },
      { value: '升职加薪', label: '升职加薪', directions: ['成功概率', '最佳时机', '注意事项', '准备策略'] },
      { value: '项目合作', label: '项目合作谈判', directions: ['合作前景', '对方态度', '注意事项', '谈判策略'] },
      { value: '签约合同', label: '签约合同', directions: ['合同风险', '最佳时机', '注意条款', '对方诚意'] },
      { value: '创业开业', label: '创业开业', directions: ['成功概率', '时机选择', '注意事项', '发展方向'] }
    ]
  },

  财运投资: {
    icon: '💰',
    items: [
      { value: '投资理财', label: '投资理财', directions: ['收益情况', '风险评估', '时机选择', '注意事项'] },
      { value: '股票买卖', label: '股票买卖', directions: ['涨跌趋势', '买卖时机', '持有策略', '风险提示'] },
      { value: '购房置业', label: '购房置业', directions: ['是否合适', '价格走势', '时机选择', '注意事项'] },
      { value: '借贷还款', label: '借贷还款', directions: ['能否顺利', '最佳时机', '注意事项', '风险评估'] }
    ]
  },

  感情婚姻: {
    icon: '💕',
    items: [
      { value: '相亲约会', label: '相亲约会', directions: ['对方态度', '发展前景', '最佳时机', '注意事项'] },
      { value: '表白求婚', label: '表白求婚', directions: ['成功概率', '最佳时机', '方式选择', '注意事项'] },
      { value: '婚姻状况', label: '婚姻状况', directions: ['感情走势', '矛盾化解', '注意事项', '改善方法'] },
      { value: '复合挽回', label: '复合挽回', directions: ['成功概率', '最佳时机', '方法策略', '注意事项'] }
    ]
  },

  健康医疗: {
    icon: '🏥',
    items: [
      { value: '身体健康状况', label: '身体健康状况', directions: ['健康评估', '注意部位', '调理方向', '预防建议'] },
      { value: '病情发展', label: '病情发展情况', directions: ['病情走势', '治疗效果', '康复时间', '注意事项'] },
      { value: '手术治疗', label: '手术治疗', directions: ['手术时机', '成功概率', '恢复情况', '注意事项'] },
      { value: '体检就医', label: '体检就医', directions: ['最佳时机', '检查重点', '注意事项', '医院选择'] }
    ]
  },

  学业考试: {
    icon: '📚',
    items: [
      { value: '考试升学', label: '考试升学', directions: ['考试结果', '准备方向', '注意事项', '发挥状态'] },
      { value: '学习进修', label: '学习进修', directions: ['学习效果', '时机选择', '方向选择', '注意事项'] },
      { value: '论文答辩', label: '论文答辩', directions: ['答辩结果', '准备重点', '注意事项', '时机选择'] }
    ]
  },

  出行旅游: {
    icon: '✈️',
    items: [
      { value: '出行旅游', label: '出行旅游', directions: ['出行时间', '方位选择', '注意事项', '吉凶评估'] },
      { value: '搬家迁居', label: '搬家迁居', directions: ['最佳时机', '方位选择', '注意事项', '吉凶评估'] },
      { value: '出差办事', label: '出差办事', directions: ['出行时间', '方位选择', '事情结果', '注意事项'] }
    ]
  },

  寻物寻人: {
    icon: '🔍',
    items: [
      { value: '丢失物品寻找', label: '丢失物品寻找', directions: ['物品方位', '能否找到', '寻找时间', '详细位置'] },
      { value: '宠物走失', label: '宠物走失寻找', directions: ['宠物方位', '能否找到', '寻找时间', '详细位置'] },
      { value: '寻人寻亲', label: '寻人寻亲', directions: ['人员方位', '能否找到', '联系时机', '注意事项'] }
    ]
  },

  娱乐竞技: {
    icon: '🎮',
    items: [
      { value: '打游戏竞技', label: '打游戏竞技', directions: ['胜利路线', '方位选择', '时间选择', '策略建议'] },
      { value: '打牌打麻将', label: '打牌打麻将', directions: ['座位选择', '时间选择', '手气运势', '注意事项'] },
      { value: '体育比赛', label: '体育比赛', directions: ['比赛结果', '状态评估', '注意事项', '策略建议'] },
      { value: '竞赛竞标', label: '竞赛竞标', directions: ['成功概率', '准备方向', '注意事项', '策略建议'] }
    ]
  },

  其他事项: {
    icon: '📋',
    items: [
      { value: '诉讼官司', label: '诉讼官司', directions: ['胜诉概率', '时机选择', '注意事项', '策略建议'] },
      { value: '维权投诉', label: '维权投诉', directions: ['成功概率', '时机选择', '方法策略', '注意事项'] },
      { value: '自定义事项', label: '自定义事项', directions: ['结果如何', '时机选择', '方法策略', '注意事项'] }
    ]
  }
};

/**
 * 智能联想测算选项
 * @param {string} input - 用户输入的关键词
 * @returns {Array} 联想出的测算选项
 */
export function suggestMatters(input) {
  if (!input || input.length < 1) {
    return [];
  }

  const suggestions = [];
  const inputLower = input.toLowerCase();

  // 遍历所有分类
  for (let category in MATTER_CATEGORIES) {
    const categoryData = MATTER_CATEGORIES[category];

    categoryData.items.forEach(item => {
      // 模糊匹配
      if (item.label.includes(input) ||
          item.value.includes(input) ||
          category.includes(input)) {
        suggestions.push({
          category: category,
          icon: categoryData.icon,
          ...item,
          matchScore: calculateMatchScore(input, item.label)
        });
      }
    });
  }

  // 按匹配度排序
  suggestions.sort((a, b) => b.matchScore - a.matchScore);

  return suggestions.slice(0, 10); // 返回前10个最匹配的
}

/**
 * 计算匹配分数
 */
function calculateMatchScore(input, label) {
  let score = 0;

  // 完全匹配
  if (label === input) score += 100;

  // 开头匹配
  if (label.startsWith(input)) score += 50;

  // 包含匹配
  if (label.includes(input)) score += 30;

  // 字符匹配度
  const matchedChars = input.split('').filter(char => label.includes(char)).length;
  score += matchedChars * 5;

  return score;
}

/**
 * 获取专项测算的详细分析模板
 */
export function getSpecializedAnalysis(matter, result) {
  const templates = {
    '明日上班工作情况': analyzeWorkTomorrow,
    '丢失物品寻找': analyzeLostItem,
    '身体健康状况': analyzeHealth,
    '病情发展': analyzeIllness,
    '项目合作': analyzeCooperation,
    '打游戏竞技': analyzeGaming,
    '打牌打麻将': analyzeMahjong,
    '出行旅游': analyzeTravel
  };

  const analyzer = templates[matter];
  if (analyzer) {
    return analyzer(result);
  }

  return null;
}

/**
 * 明日上班工作情况分析
 */
function analyzeWorkTomorrow(result) {
  const score = result.综合结论.评分;

  return {
    工作状态: {
      评分: score,
      状态: score >= 70 ? '精力充沛，效率高' : score >= 50 ? '状态一般，需要调整' : '状态欠佳，容易疲劳',
      建议: score >= 70 ? '适合处理重要工作，推进关键项目' : score >= 50 ? '适合处理常规工作，避免高压任务' : '建议调整心态，避免重要决策'
    },
    同事关系: {
      评分: result.命理分析.个人运势 === '佳' ? 85 : result.命理分析.个人运势 === '差' ? 40 : 65,
      状态: result.命理分析.个人运势 === '佳' ? '人际和谐，沟通顺畅' : result.命理分析.个人运势 === '差' ? '容易产生摩擦，需要注意' : '关系平稳',
      建议: result.命理分析.个人运势 === '佳' ? '适合团队协作，可以主动沟通' : '保持低调，避免争执'
    },
    领导态度: {
      评分: result.卦象分析.吉凶 === '吉' ? 80 : result.卦象分析.吉凶 === '凶' ? 45 : 60,
      状态: result.卦象分析.吉凶 === '吉' ? '领导关注，有表现机会' : result.卦象分析.吉凶 === '凶' ? '需要谨慎，避免出错' : '态度平常',
      建议: result.卦象分析.吉凶 === '吉' ? '可以主动汇报工作，展示成果' : '做好本职工作，不要冒进'
    },
    业绩表现: {
      评分: score,
      预测: score >= 75 ? '有望超额完成' : score >= 60 ? '能够完成目标' : score >= 45 ? '需要加倍努力' : '可能遇到困难',
      建议: score >= 60 ? '保持节奏，稳步推进' : '调整策略，寻求帮助'
    },
    时辰建议: {
      最佳时段: result.时间分析.时辰,
      建议: result.时间分析.时辰建议
    }
  };
}

/**
 * 丢失物品寻找分析
 */
function analyzeLostItem(result) {
  const score = result.综合结论.评分;
  const guaYao = result.卦象分析.动爻;

  // 根据动爻判断方位
  const directionMap = {
    1: '北方或水边',
    2: '东北方或土堆',
    3: '东方或木质处',
    4: '东南方或高处',
    5: '南方或明亮处',
    6: '西南方或低处'
  };

  const direction = directionMap[guaYao] || '中央位置';

  return {
    能否找到: {
      概率: score >= 70 ? '很大' : score >= 50 ? '一般' : '较小',
      评分: score,
      说明: score >= 70 ? '物品未远离，有很大概率找到' : score >= 50 ? '物品可能被移动，需要仔细寻找' : '物品可能已经遗失或被拿走'
    },
    物品方位: {
      大方位: direction,
      详细位置: getDetailedLocation(guaYao, result.卦象分析.主卦),
      高度: guaYao <= 2 ? '低处（地面、抽屉下层）' : guaYao <= 4 ? '中等高度（桌面、柜子中层）' : '高处（柜顶、架子上层）'
    },
    寻找时间: {
      最佳时辰: result.时间分析.时辰,
      建议: result.时间分析.时辰建议,
      时间段: result.近三个月运势.关键时间点.length > 0 ? result.近三个月运势.关键时间点[0].月份 : '近期'
    },
    寻找建议: [
      `重点搜索${direction}区域`,
      `注意${guaYao <= 2 ? '低处' : guaYao <= 4 ? '中等高度' : '高处'}的位置`,
      result.卦象分析.吉凶 === '吉' ? '物品应该还在附近，仔细寻找' : '物品可能被移动，扩大搜索范围',
      `最佳寻找时间：${result.时间分析.时辰}`
    ]
  };
}

/**
 * 获取详细位置描述
 */
function getDetailedLocation(yao, guaName) {
  const locations = {
    1: ['角落', '床下', '柜子底部', '门后', '暗处'],
    2: ['抽屉', '箱子', '包里', '夹层', '折叠处'],
    3: ['桌面', '椅子上', '沙发', '床上', '台面'],
    4: ['书架', '柜子', '挂钩', '墙边', '窗台'],
    5: ['柜顶', '高架', '顶层', '吊柜', '阁楼'],
    6: ['室外', '车上', '他人处', '遗忘地', '公共区域']
  };

  const possibleLocations = locations[yao] || ['常用位置'];
  return possibleLocations.join('、');
}

/**
 * 身体健康状况分析
 */
function analyzeHealth(result) {
  const score = result.综合结论.评分;
  const wuxing = result.命理分析.命主日柱[0]; // 日干

  // 根据五行判断易患部位
  const healthMap = {
    '甲': { organ: '肝胆', element: '木', advice: '注意肝胆保养，避免熬夜' },
    '乙': { organ: '肝胆', element: '木', advice: '注意肝胆保养，保持心情舒畅' },
    '丙': { organ: '心脏', element: '火', advice: '注意心血管健康，避免过度兴奋' },
    '丁': { organ: '心脏', element: '火', advice: '注意心血管健康，保持平和心态' },
    '戊': { organ: '脾胃', element: '土', advice: '注意脾胃保养，饮食规律' },
    '己': { organ: '脾胃', element: '土', advice: '注意脾胃保养，避免暴饮暴食' },
    '庚': { organ: '肺部', element: '金', advice: '注意呼吸系统，避免受寒' },
    '辛': { organ: '肺部', element: '金', advice: '注意呼吸系统，保持空气流通' },
    '壬': { organ: '肾脏', element: '水', advice: '注意肾脏保养，避免过度劳累' },
    '癸': { organ: '肾脏', element: '水', advice: '注意肾脏保养，保持充足睡眠' }
  };

  const healthInfo = healthMap[wuxing] || { organ: '整体', element: '平衡', advice: '保持健康生活方式' };

  return {
    健康评估: {
      评分: score,
      状态: score >= 75 ? '健康状况良好' : score >= 60 ? '健康状况一般' : score >= 45 ? '需要注意调理' : '建议就医检查',
      趋势: result.近三个月运势.总体趋势.趋势
    },
    注意部位: {
      主要部位: healthInfo.organ,
      五行属性: healthInfo.element,
      说明: healthInfo.advice
    },
    调理方向: [
      healthInfo.advice,
      '保持规律作息，充足睡眠',
      '适当运动，增强体质',
      '饮食均衡，营养充足',
      '保持心情愉快，避免压力过大'
    ],
    预防建议: result.注意事项
  };
}

/**
 * 病情发展分析
 */
function analyzeIllness(result) {
  const score = result.综合结论.评分;

  return {
    病情走势: {
      评分: score,
      趋势: score >= 70 ? '好转' : score >= 50 ? '稳定' : '需要关注',
      说明: score >= 70 ? '病情有好转迹象，继续治疗' : score >= 50 ? '病情相对稳定，保持治疗' : '病情需要密切关注，及时就医'
    },
    治疗效果: {
      预期: score >= 70 ? '效果良好' : score >= 50 ? '效果一般' : '需要调整方案',
      建议: score >= 70 ? '继续当前治疗方案' : score >= 50 ? '配合医生，耐心治疗' : '建议咨询医生，调整治疗方案'
    },
    康复时间: {
      预估: result.近三个月运势.关键时间点.length > 0 ? result.近三个月运势.关键时间点[0].月份 : '需要持续观察',
      说明: '具体康复时间因人而异，需要配合医生治疗'
    },
    注意事项: result.注意事项
  };
}

/**
 * 项目合作分析
 */
function analyzeCooperation(result) {
  const score = result.综合结论.评分;

  return {
    合作前景: {
      评分: score,
      前景: score >= 75 ? '非常好' : score >= 60 ? '较好' : score >= 45 ? '一般' : '需要谨慎',
      说明: score >= 60 ? '合作条件成熟，可以推进' : '需要谨慎评估，做好风险防范'
    },
    对方态度: {
      态度: result.命理分析.个人运势 === '佳' ? '积极' : result.命理分析.个人运势 === '差' ? '消极' : '中立',
      诚意: result.卦象分析.吉凶 === '吉' ? '较高' : '一般',
      建议: result.命理分析.个人运势 === '佳' ? '对方态度积极，可以深入洽谈' : '需要进一步沟通，了解对方真实想法'
    },
    谈判策略: result.建议,
    注意事项: result.注意事项
  };
}

/**
 * 打游戏竞技分析
 */
function analyzeGaming(result) {
  const yao = result.卦象分析.动爻;

  // 根据动爻判断方位
  const directionMap = {
    1: '下路/下方',
    2: '下路/偏中',
    3: '中路/中间',
    4: '中路/偏上',
    5: '上路/上方',
    6: '上路/边缘'
  };

  const routeMap = {
    1: '稳健发育路线',
    2: '支援游走路线',
    3: '中路控制路线',
    4: '进攻推进路线',
    5: '激进压制路线',
    6: '边路带线路线'
  };

  return {
    胜利路线: {
      推荐路线: routeMap[yao],
      策略: result.卦象分析.吉凶 === '吉' ? '可以采取进攻策略' : '建议稳健发育',
      说明: result.卦象分析.卦象解读
    },
    方位选择: {
      推荐方位: directionMap[yao],
      优势: `在${directionMap[yao]}位置运势较好`,
      建议: `重点关注${directionMap[yao]}的机会`
    },
    时间选择: {
      最佳时段: result.时间分析.时辰,
      运势: result.综合结论.结论,
      建议: result.时间分析.时辰建议
    },
    策略建议: result.建议
  };
}

/**
 * 打牌打麻将分析
 */
function analyzeMahjong(result) {
  const yao = result.卦象分析.动爻;
  const score = result.综合结论.评分;

  // 根据动爻判断座位
  const seatMap = {
    1: '北位（面向南）',
    2: '东北位',
    3: '东位（面向西）',
    4: '东南位',
    5: '南位（面向北）',
    6: '西位（面向东）'
  };

  return {
    座位选择: {
      推荐座位: seatMap[yao],
      方位: yao <= 2 ? '北方' : yao <= 4 ? '东方' : '南方',
      说明: `${seatMap[yao]}运势较好，建议选择此位置`
    },
    时间选择: {
      最佳时段: result.时间分析.时辰,
      时辰特点: result.时间分析.时辰特点,
      建议: result.时间分析.时辰建议
    },
    手气运势: {
      评分: score,
      运势: score >= 75 ? '极佳' : score >= 60 ? '良好' : score >= 45 ? '一般' : '欠佳',
      说明: score >= 60 ? '手气不错，可以适当进取' : '手气一般，建议稳健为主',
      趋势: result.近三个月运势.总体趋势.描述
    },
    注意事项: [
      `选择${seatMap[yao]}`,
      `最佳时段：${result.时间分析.时辰}`,
      score >= 60 ? '手气较好，可以适当进取' : '手气一般，见好就收',
      '保持平和心态，理性娱乐',
      ...result.注意事项
    ]
  };
}

/**
 * 出行旅游分析
 */
function analyzeTravel(result) {
  const yao = result.卦象分析.动爻;
  const score = result.综合结论.评分;

  // 根据动爻判断方位
  const directionMap = {
    1: '北方',
    2: '东北方',
    3: '东方',
    4: '东南方',
    5: '南方',
    6: '西南方'
  };

  return {
    出行时间: {
      最佳时间: result.近三个月运势.关键时间点.length > 0 ? result.近三个月运势.关键时间点[0].月份 : '近期',
      最佳时辰: result.时间分析.时辰,
      建议: result.时间分析.时辰建议
    },
    方位选择: {
      推荐方位: directionMap[yao],
      吉凶: result.卦象分析.吉凶,
      说明: `${directionMap[yao]}方向运势${result.卦象分析.吉凶 === '吉' ? '较好' : '一般'}，${result.卦象分析.吉凶 === '吉' ? '适合' : '需要注意'}出行`
    },
    吉凶评估: {
      评分: score,
      评估: score >= 75 ? '非常适合' : score >= 60 ? '比较适合' : score >= 45 ? '一般' : '不太适合',
      说明: result.综合结论.说明
    },
    注意事项: result.注意事项
  };
}
