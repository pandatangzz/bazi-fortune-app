// AI对话助手 - 用于解读卦象和深入分析测算结果

/**
 * AI对话助手类
 */
export class AIAssistant {
  constructor() {
    this.conversationHistory = [];
  }

  /**
   * 处理用户问题
   * @param {string} question - 用户问题
   * @param {Object} context - 测算结果上下文
   * @returns {string} AI回答
   */
  chat(question, context) {
    // 添加到对话历史
    this.conversationHistory.push({
      role: 'user',
      content: question,
      timestamp: new Date()
    });

    // 分析问题类型
    const questionType = this.analyzeQuestionType(question);

    // 生成回答
    let answer = '';
    switch (questionType) {
      case 'gua_interpretation':
        answer = this.interpretGua(question, context);
        break;
      case 'result_explanation':
        answer = this.explainResult(question, context);
        break;
      case 'advice_request':
        answer = this.giveAdvice(question, context);
        break;
      case 'detail_inquiry':
        answer = this.provideDetails(question, context);
        break;
      case 'fortune_inquiry':
        answer = this.analyzeFortune(question, context);
        break;
      default:
        answer = this.generalResponse(question, context);
    }

    // 添加到对话历史
    this.conversationHistory.push({
      role: 'assistant',
      content: answer,
      timestamp: new Date()
    });

    return answer;
  }

  /**
   * 分析问题类型
   */
  analyzeQuestionType(question) {
    const keywords = {
      gua_interpretation: ['卦象', '卦', '爻', '主卦', '变卦', '什么意思', '如何理解'],
      result_explanation: ['为什么', '怎么', '原因', '解释', '说明'],
      advice_request: ['建议', '怎么办', '如何做', '应该', '该不该'],
      detail_inquiry: ['详细', '具体', '更多', '深入', '细节'],
      fortune_inquiry: ['运势', '吉凶', '好不好', '顺利吗', '成功率']
    };

    for (let type in keywords) {
      if (keywords[type].some(keyword => question.includes(keyword))) {
        return type;
      }
    }

    return 'general';
  }

  /**
   * 解读卦象
   */
  interpretGua(question, context) {
    if (!context.卦象分析) {
      return '抱歉，当前没有卦象信息可供解读。请先进行测算。';
    }

    const gua = context.卦象分析;
    let response = `让我为您解读这个卦象：\n\n`;

    response += `📖 **${gua.主卦}卦**\n`;
    response += `这是一个${gua.吉凶 === '吉' ? '吉利' : '需要注意'}的卦象。`;
    response += `${gua.主卦}卦在易经中代表着特定的含义和启示。\n\n`;

    response += `🔄 **变化**\n`;
    response += `第${gua.动爻}爻发动，主卦变为${gua.变卦}卦。`;
    response += `动爻的位置告诉我们事情发展的阶段和关键点。\n\n`;

    response += `⚖️ **体用关系**\n`;
    response += `${gua.体用关系}\n`;
    response += `这种关系反映了您与所测事项之间的互动状态。\n\n`;

    response += `💡 **具体解读**\n`;
    response += `${gua.卦象解读}\n\n`;

    if (question.includes('详细') || question.includes('深入')) {
      response += this.getDetailedGuaAnalysis(gua);
    }

    return response;
  }

  /**
   * 详细卦象分析
   */
  getDetailedGuaAnalysis(gua) {
    let analysis = `📚 **深入分析**\n\n`;

    // 动爻分析
    const yaoAnalysis = {
      1: '初爻发动，表示事情刚刚开始，处于萌芽阶段。此时宜谨慎观察，不宜急进。',
      2: '二爻发动，事情进入发展阶段，开始显现端倪。此时可以适当行动，但仍需谨慎。',
      3: '三爻发动，事情到达转折点，是关键时刻。此时需要特别注意，防止过刚。',
      4: '四爻发动，事情进入上升阶段，可以积极推进。此时是行动的好时机。',
      5: '五爻发动，事情达到鼎盛阶段，是最佳时机。此时应该把握机会，大展宏图。',
      6: '上爻发动，事情接近尾声，盛极而衰。此时宜收敛，不宜过度进取。'
    };

    analysis += `**动爻含义**：${yaoAnalysis[gua.动爻]}\n\n`;

    // 吉凶分析
    if (gua.吉凶 === '吉') {
      analysis += `**吉象分析**：\n`;
      analysis += `- 天时：当前时机有利，可以顺势而为\n`;
      analysis += `- 地利：环境条件支持，有助于事情发展\n`;
      analysis += `- 人和：人际关系和谐，容易得到帮助\n\n`;
    } else {
      analysis += `**凶象警示**：\n`;
      analysis += `- 需要注意可能出现的阻碍和困难\n`;
      analysis += `- 建议调整策略，避免强行推进\n`;
      analysis += `- 可以考虑另择时机或改变方法\n\n`;
    }

    return analysis;
  }

  /**
   * 解释测算结果
   */
  explainResult(question, context) {
    let response = `让我为您解释测算结果：\n\n`;

    // 综合评分解释
    if (context.综合结论) {
      response += `📊 **综合评分：${context.综合结论.评分}分**\n`;
      response += `评分结果为"${context.综合结论.结论}"，`;

      if (context.综合结论.评分 >= 80) {
        response += `这是一个非常好的分数，说明各方面条件都很有利。\n\n`;
        response += `**为什么评分这么高？**\n`;
        response += `- 卦象显示吉利\n`;
        response += `- 黄历适宜此事\n`;
        response += `- 您的个人运势良好\n`;
        response += `- 时间选择合适\n\n`;
      } else if (context.综合结论.评分 >= 60) {
        response += `这是一个比较好的分数，说明大部分条件有利。\n\n`;
        response += `**评分的依据：**\n`;
        response += `- 卦象、黄历、命理等多方面综合评估\n`;
        response += `- 虽有小的不利因素，但不影响大局\n`;
        response += `- 整体来说是可以进行的\n\n`;
      } else if (context.综合结论.评分 >= 40) {
        response += `这个分数偏低，说明存在一些不利因素。\n\n`;
        response += `**评分较低的原因：**\n`;
        response += `- 可能卦象显示不利\n`;
        response += `- 或黄历不宜此事\n`;
        response += `- 或与您的命局有冲克\n`;
        response += `- 建议谨慎评估或另择时机\n\n`;
      } else {
        response += `这个分数很低，说明当前条件很不利。\n\n`;
        response += `**评分低的主要原因：**\n`;
        response += `- 多个方面都显示不利\n`;
        response += `- 强烈建议暂缓或放弃\n`;
        response += `- 如果必须进行，需要做好充分准备\n\n`;
      }
    }

    // 具体因素解释
    if (question.includes('卦象')) {
      response += this.explainGuaFactor(context);
    } else if (question.includes('黄历')) {
      response += this.explainHuangliFactor(context);
    } else if (question.includes('命理')) {
      response += this.explainMingLiFactor(context);
    } else {
      response += `如果您想了解某个具体方面的原因，可以问我：\n`;
      response += `- "为什么卦象是这样的？"\n`;
      response += `- "黄历为什么这样说？"\n`;
      response += `- "命理分析是什么意思？"\n`;
    }

    return response;
  }

  /**
   * 解释卦象因素
   */
  explainGuaFactor(context) {
    if (!context.卦象分析) return '';

    let explanation = `🎴 **卦象因素解释**\n\n`;
    explanation += `卦象是通过易经梅花易数起卦得出的，它反映了事情的内在规律和发展趋势。\n\n`;
    explanation += `您得到的是${context.卦象分析.主卦}卦，这个卦象${context.卦象分析.吉凶 === '吉' ? '吉利' : '不利'}的原因是：\n\n`;
    explanation += `${context.卦象分析.卦象解读}\n\n`;
    explanation += `体用关系显示：${context.卦象分析.体用关系}\n`;
    explanation += `这种关系直接影响了事情的发展方向和结果。\n\n`;

    return explanation;
  }

  /**
   * 解释黄历因素
   */
  explainHuangliFactor(context) {
    if (!context.黄历分析) return '';

    let explanation = `📅 **黄历因素解释**\n\n`;
    explanation += `黄历是中国传统的择吉工具，根据天文历法和阴阳五行理论编制。\n\n`;
    explanation += `今日（${context.黄历分析.日期}）的情况：\n`;
    explanation += `- 建星：${context.黄历分析.建星}\n`;
    explanation += `- 星宿：${context.黄历分析.星宿}\n`;
    explanation += `- 适宜度：${context.黄历分析.适宜度}\n\n`;
    explanation += `${context.黄历分析.建议}\n\n`;

    return explanation;
  }

  /**
   * 解释命理因素
   */
  explainMingLiFactor(context) {
    if (!context.命理分析) return '';

    let explanation = `🔮 **命理因素解释**\n\n`;
    explanation += `命理分析是将测算时刻的干支与您的八字进行对比，看两者之间的关系。\n\n`;
    explanation += `- 测算时刻：${context.命理分析.测算时刻干支}\n`;
    explanation += `- 您的日柱：${context.命理分析.命主日柱}\n\n`;
    explanation += `**天干关系**：${context.命理分析.天干关系}\n`;
    explanation += `**地支关系**：${context.命理分析.地支关系}\n\n`;
    explanation += `这些关系决定了当前时刻对您个人的影响：${context.命理分析.个人运势}\n\n`;
    explanation += `${context.命理分析.建议}\n\n`;

    return explanation;
  }

  /**
   * 给出建议
   */
  giveAdvice(question, context) {
    let response = `💡 **我的建议**\n\n`;

    if (context.综合结论 && context.综合结论.评分 >= 70) {
      response += `根据测算结果，当前是比较好的时机，我建议：\n\n`;
      response += `✅ **可以进行**\n`;
      response += `- 各方面条件都比较有利\n`;
      response += `- 可以按计划推进\n`;
      response += `- 保持积极心态\n\n`;
    } else if (context.综合结论 && context.综合结论.评分 >= 50) {
      response += `根据测算结果，当前时机一般，我建议：\n\n`;
      response += `⚠️ **谨慎进行**\n`;
      response += `- 做好充分准备\n`;
      response += `- 注意可能的风险\n`;
      response += `- 保持灵活应对\n\n`;
    } else {
      response += `根据测算结果，当前时机不太理想，我建议：\n\n`;
      response += `❌ **暂缓或调整**\n`;
      response += `- 考虑另择时机\n`;
      response += `- 或调整策略方法\n`;
      response += `- 做好风险防范\n\n`;
    }

    // 添加具体建议
    if (context.建议 && context.建议.length > 0) {
      response += `**具体建议：**\n`;
      context.建议.forEach((advice, index) => {
        response += `${index + 1}. ${advice}\n`;
      });
      response += `\n`;
    }

    // 添加注意事项
    if (context.注意事项 && context.注意事项.length > 0) {
      response += `**特别注意：**\n`;
      context.注意事项.slice(0, 3).forEach(warning => {
        response += `- ${warning}\n`;
      });
    }

    return response;
  }

  /**
   * 提供详细信息
   */
  provideDetails(question, context) {
    let response = `📋 **详细信息**\n\n`;

    if (question.includes('运势') && context.近三个月运势) {
      response += this.detailFortune(context.近三个月运势);
    } else if (question.includes('影响') && context.相关影响因素) {
      response += this.detailFactors(context.相关影响因素);
    } else if (question.includes('发展') && context.发展规律) {
      response += this.detailDevelopment(context.发展规律);
    } else {
      response += `我可以为您详细解释以下方面：\n\n`;
      response += `- 近三个月运势预测\n`;
      response += `- 相关影响因素\n`;
      response += `- 事情发展规律\n`;
      response += `- 卦象深入解读\n\n`;
      response += `请告诉我您想了解哪个方面的详细信息。`;
    }

    return response;
  }

  /**
   * 详细运势分析
   */
  detailFortune(fortune) {
    let detail = `**未来三个月运势详解**\n\n`;
    detail += `📈 整体趋势：${fortune.总体趋势.趋势}（平均${fortune.总体趋势.平均评分}分）\n`;
    detail += `${fortune.总体趋势.描述}\n\n`;

    fortune.月度详情.forEach((month, index) => {
      detail += `**${month.月份}**（${month.干支}）\n`;
      detail += `- 运势等级：${month.运势等级}（${month.评分}分）\n`;
      detail += `- 天干关系：${month.天干关系}\n`;
      detail += `- 地支关系：${month.地支关系}\n`;
      detail += `- ${month.说明}\n\n`;
    });

    if (fortune.关键时间点.length > 0) {
      detail += `⭐ **关键时间点**\n`;
      fortune.关键时间点.forEach(point => {
        detail += `- ${point.说明}\n`;
      });
    }

    return detail;
  }

  /**
   * 详细影响因素
   */
  detailFactors(factors) {
    let detail = `**影响因素详解**\n\n`;

    factors.forEach((factor, index) => {
      detail += `${index + 1}. **${factor.类型}**\n`;
      detail += `   因素：${factor.因素}\n`;
      detail += `   影响：${factor.影响}\n`;
      detail += `   建议：${factor.建议}\n\n`;
    });

    return detail;
  }

  /**
   * 详细发展规律
   */
  detailDevelopment(development) {
    let detail = `**发展规律详解**\n\n`;
    detail += `📍 **初期阶段**\n${development.初期}\n\n`;
    detail += `📍 **中期阶段**\n${development.中期}\n\n`;
    detail += `📍 **后期阶段**\n${development.后期}\n\n`;
    detail += `🎯 **关键节点**\n${development.关键节点}\n\n`;
    detail += `📊 **整体趋势**\n${development.整体趋势}\n`;

    return detail;
  }

  /**
   * 分析运势
   */
  analyzeFortune(question, context) {
    let response = `🔮 **运势分析**\n\n`;

    if (context.综合结论) {
      const score = context.综合结论.评分;

      response += `根据测算，您的运势评分为 **${score}分**，`;

      if (score >= 80) {
        response += `这是非常好的运势！\n\n`;
        response += `✨ **运势特点**\n`;
        response += `- 天时地利人和，各方面都很顺利\n`;
        response += `- 容易得到贵人相助\n`;
        response += `- 做事容易成功\n`;
        response += `- 心情愉快，精力充沛\n\n`;
        response += `💪 **行动建议**\n`;
        response += `- 把握机会，积极进取\n`;
        response += `- 可以推进重要事项\n`;
        response += `- 适合开展新项目\n`;
      } else if (score >= 60) {
        response += `运势良好。\n\n`;
        response += `✨ **运势特点**\n`;
        response += `- 整体平稳，小有波折\n`;
        response += `- 努力会有回报\n`;
        response += `- 需要耐心和坚持\n\n`;
        response += `💪 **行动建议**\n`;
        response += `- 稳步推进，不要急躁\n`;
        response += `- 做好准备，应对变化\n`;
        response += `- 保持积极心态\n`;
      } else if (score >= 40) {
        response += `运势一般，需要注意。\n\n`;
        response += `⚠️ **运势特点**\n`;
        response += `- 阻力较大，进展缓慢\n`;
        response += `- 容易遇到困难\n`;
        response += `- 需要付出更多努力\n\n`;
        response += `💪 **行动建议**\n`;
        response += `- 谨慎行事，避免冒进\n`;
        response += `- 做好风险防范\n`;
        response += `- 寻求帮助和支持\n`;
      } else {
        response += `运势较差，需要特别注意。\n\n`;
        response += `⚠️ **运势特点**\n`;
        response += `- 诸事不顺，阻碍重重\n`;
        response += `- 容易出现意外\n`;
        response += `- 心情低落，压力大\n\n`;
        response += `💪 **行动建议**\n`;
        response += `- 暂缓重要决策\n`;
        response += `- 调整心态，休养生息\n`;
        response += `- 等待时机转好\n`;
      }
    }

    // 添加近期运势
    if (context.近三个月运势) {
      response += `\n📅 **近期运势走向**\n`;
      response += `${context.近三个月运势.总体趋势.描述}\n`;
    }

    return response;
  }

  /**
   * 通用回答
   */
  generalResponse(question, context) {
    let response = `您好！我是您的命理测算助手。\n\n`;

    response += `我可以帮您：\n`;
    response += `- 📖 解读卦象含义\n`;
    response += `- 💡 解释测算结果\n`;
    response += `- 🎯 提供具体建议\n`;
    response += `- 📊 分析运势走向\n`;
    response += `- 📋 提供详细信息\n\n`;

    response += `您可以问我：\n`;
    response += `- "这个卦象是什么意思？"\n`;
    response += `- "为什么评分是这样的？"\n`;
    response += `- "我应该怎么做？"\n`;
    response += `- "运势好不好？"\n`;
    response += `- "能详细说说吗？"\n\n`;

    response += `请告诉我您想了解什么，我会尽力为您解答。`;

    return response;
  }

  /**
   * 清空对话历史
   */
  clearHistory() {
    this.conversationHistory = [];
  }

  /**
   * 获取对话历史
   */
  getHistory() {
    return this.conversationHistory;
  }
}

// 导出单例
export const aiAssistant = new AIAssistant();
