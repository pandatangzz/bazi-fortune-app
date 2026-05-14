<template>
  <div id="app">
    <div class="header">
      <h1>八字命理推算系统</h1>
      <p>基于易经、渊海子平、三命通会、鬼谷子两头钳</p>
      <button class="tutorial-btn" @click="showTutorial = !showTutorial">
        {{ showTutorial ? '关闭教程' : '使用教程' }}
      </button>
    </div>

    <!-- 使用教程弹窗 -->
    <div v-if="showTutorial" class="tutorial-modal" @click="showTutorial = false">
      <div class="tutorial-content" @click.stop>
        <h2>使用教程</h2>
        <div class="tutorial-section">
          <h3>1. 八字排盘</h3>
          <p>输入您的出生年月日时和性别，点击"开始推算"即可获得完整的八字命理分析。</p>
        </div>
        <div class="tutorial-section">
          <h3>2. 日常事项测算</h3>
          <p><strong>功能说明：</strong>根据您的生辰八字和当前测算时间，综合分析日常事项的发展规律。</p>
          <p><strong>使用步骤：</strong></p>
          <ul>
            <li>先完成八字排盘</li>
            <li>点击"日常事项测算"标签</li>
            <li>输入要测算的事项（如：求职、考试、投资等）</li>
            <li>选择想知道的规律方向</li>
            <li>点击"开始测算"</li>
          </ul>
          <p><strong>测算内容：</strong></p>
          <ul>
            <li>综合结论（0-100分评分）</li>
            <li>卦象分析（易经梅花易数）</li>
            <li>黄历分析（宜忌、建星、星宿）</li>
            <li>命理分析（与您命局的关系）</li>
            <li>近3个月运势预测</li>
            <li>相关影响因素分析</li>
            <li>发展规律和注意事项</li>
          </ul>
        </div>
        <div class="tutorial-section">
          <h3>3. 其他功能</h3>
          <p><strong>命理分析：</strong>查看格局、用神、五行分析</p>
          <p><strong>神煞系统：</strong>查看命中的吉神凶煞</p>
          <p><strong>大运流年：</strong>查看人生各阶段运势</p>
          <p><strong>鬼谷子断语：</strong>查看命理断语和诗词</p>
          <p><strong>易经卦象：</strong>查看卦象和吉凶预测</p>
        </div>
        <div class="tutorial-section">
          <h3>4. 注意事项</h3>
          <ul>
            <li>所有计算在本地完成，不上传服务器</li>
            <li>测算结果仅供参考，不构成决策建议</li>
            <li>命运掌握在自己手中，努力才是关键</li>
          </ul>
        </div>
        <button class="btn" @click="showTutorial = false" style="margin-top: 20px;">关闭教程</button>
      </div>
    </div>

    <div class="container">
      <h2>输入生辰信息</h2>
      <div class="form-row">
        <div class="form-group">
          <label>出生年份</label>
          <input type="number" v-model.number="birthInfo.year" placeholder="例如：1990" />
        </div>
        <div class="form-group">
          <label>出生月份</label>
          <input type="number" v-model.number="birthInfo.month" placeholder="1-12" min="1" max="12" />
        </div>
        <div class="form-group">
          <label>出生日期</label>
          <input type="number" v-model.number="birthInfo.day" placeholder="1-31" min="1" max="31" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>出生时辰</label>
          <input type="number" v-model.number="birthInfo.hour" placeholder="0-23" min="0" max="23" />
        </div>
        <div class="form-group">
          <label>出生分钟</label>
          <input type="number" v-model.number="birthInfo.minute" placeholder="0-59" min="0" max="59" />
        </div>
        <div class="form-group">
          <label>性别</label>
          <select v-model.number="birthInfo.gender">
            <option :value="1">男</option>
            <option :value="0">女</option>
          </select>
        </div>
      </div>

      <button class="btn" @click="calculateBazi">开始推算</button>
    </div>

    <div v-if="result" class="result-section">
      <div class="container">
        <div class="tabs">
          <button class="tab" :class="{ active: activeTab === 'bazi' }" @click="activeTab = 'bazi'">
            八字排盘
          </button>
          <button class="tab" :class="{ active: activeTab === 'analysis' }" @click="activeTab = 'analysis'">
            命理分析
          </button>
          <button class="tab" :class="{ active: activeTab === 'shensha' }" @click="activeTab = 'shensha'">
            神煞系统
          </button>
          <button class="tab" :class="{ active: activeTab === 'dayun' }" @click="activeTab = 'dayun'">
            大运流年
          </button>
          <button class="tab" :class="{ active: activeTab === 'guiguzi' }" @click="activeTab = 'guiguzi'">
            鬼谷子断语
          </button>
          <button class="tab" :class="{ active: activeTab === 'yijing' }" @click="activeTab = 'yijing'">
            易经卦象
          </button>
          <button class="tab" :class="{ active: activeTab === 'daily' }" @click="activeTab = 'daily'">
            日常事项测算
          </button>
        </div>

        <!-- 八字排盘 -->
        <div v-if="activeTab === 'bazi'" class="result-card">
          <h3>四柱八字</h3>
          <div class="bazi-display">
            <div class="pillar">
              <div class="pillar-title">年柱</div>
              <div class="pillar-ganzhi">{{ result.bazi.year.ganZhi }}</div>
              <div class="pillar-info">{{ result.bazi.year.shishen }}</div>
              <div class="pillar-info">{{ result.bazi.nayin.year }}</div>
            </div>
            <div class="pillar">
              <div class="pillar-title">月柱</div>
              <div class="pillar-ganzhi">{{ result.bazi.month.ganZhi }}</div>
              <div class="pillar-info">{{ result.bazi.month.shishen }}</div>
              <div class="pillar-info">{{ result.bazi.nayin.month }}</div>
            </div>
            <div class="pillar">
              <div class="pillar-title">日柱（日主）</div>
              <div class="pillar-ganzhi">{{ result.bazi.day.ganZhi }}</div>
              <div class="pillar-info">日主</div>
              <div class="pillar-info">{{ result.bazi.nayin.day }}</div>
            </div>
            <div class="pillar">
              <div class="pillar-title">时柱</div>
              <div class="pillar-ganzhi">{{ result.bazi.hour.ganZhi }}</div>
              <div class="pillar-info">{{ result.bazi.hour.shishen }}</div>
              <div class="pillar-info">{{ result.bazi.nayin.hour }}</div>
            </div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <strong>性别：</strong>{{ result.bazi.gender }}
            </div>
            <div class="info-item">
              <strong>生肖：</strong>{{ result.bazi.shengxiao }}
            </div>
            <div class="info-item">
              <strong>公历：</strong>{{ formatSolarDate(result.bazi.solar) }}
            </div>
            <div class="info-item">
              <strong>农历：</strong>{{ formatLunarDate(result.bazi.lunar) }}
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('bazi')">🤖 AI助手解读八字</button>
          </div>
        </div>

        <!-- 命理分析 -->
        <div v-if="activeTab === 'analysis'" class="result-card">
          <h3>命理分析（渊海子平）</h3>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>格局：</strong>{{ result.analysis.geju.name }}
            <p style="margin-top: 10px; color: #666;">{{ result.analysis.geju.description }}</p>
          </div>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>用神：</strong>{{ result.analysis.yongshen.yongshen }}
            <p style="margin-top: 10px; color: #666;">
              喜神：{{ result.analysis.yongshen.xishen.join('、') }}<br>
              忌神：{{ result.analysis.yongshen.jishen.join('、') }}
            </p>
          </div>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>五行分析：</strong>
            <div style="margin-top: 10px;">
              <div v-for="(value, key) in result.analysis.wuxing" :key="key" style="margin: 5px 0;">
                {{ key }}：{{ value.score }}分 ({{ value.percentage }}%) - {{ value.strength }}
              </div>
            </div>
          </div>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>建议：</strong>
            <p v-for="(advice, index) in result.analysis.yongshen.advice" :key="index"
               style="margin-top: 10px; color: #666;">
              {{ advice }}
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('analysis')">🤖 AI助手解读命理</button>
          </div>
        </div>

        <!-- 神煞系统 -->
        <div v-if="activeTab === 'shensha'" class="result-card">
          <h3>神煞系统（三命通会）</h3>

          <div v-if="result.shensha.贵人.length > 0" style="margin-bottom: 30px;">
            <h4 style="color: #667eea; margin-bottom: 15px;">贵人星</h4>
            <div class="shensha-list">
              <div v-for="(item, index) in result.shensha.贵人" :key="index" class="shensha-item jishen">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="result.shensha.吉神.length > 0" style="margin-bottom: 30px;">
            <h4 style="color: #28a745; margin-bottom: 15px;">吉神</h4>
            <div class="shensha-list">
              <div v-for="(item, index) in result.shensha.吉神" :key="index" class="shensha-item jishen">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="result.shensha.桃花.length > 0" style="margin-bottom: 30px;">
            <h4 style="color: #ff69b4; margin-bottom: 15px;">桃花星</h4>
            <div class="shensha-list">
              <div v-for="(item, index) in result.shensha.桃花" :key="index" class="shensha-item">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div v-if="result.shensha.凶煞.length > 0">
            <h4 style="color: #dc3545; margin-bottom: 15px;">凶煞</h4>
            <div class="shensha-list">
              <div v-for="(item, index) in result.shensha.凶煞" :key="index" class="shensha-item xiongshe">
                <h4>{{ item.name }}</h4>
                <p>{{ item.description }}</p>
              </div>
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('shensha')">🤖 AI助手解读神煞</button>
          </div>
        </div>

        <!-- 大运流年 -->
        <div v-if="activeTab === 'dayun'" class="result-card">
          <h3>大运流年</h3>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>起运年龄：</strong>{{ result.dayun.qiyunAge }}岁
            <strong style="margin-left: 20px;">运行方向：</strong>{{ result.dayun.direction }}
          </div>

          <h4 style="margin: 20px 0;">大运列表</h4>
          <div class="dayun-list">
            <div v-for="dayun in result.dayun.dayunList" :key="dayun.index"
                 class="dayun-item" :class="{ current: dayun.startAge <= currentAge && currentAge <= dayun.endAge }">
              <div style="font-size: 24px; font-weight: bold; color: #667eea;">{{ dayun.ganZhi }}</div>
              <div style="margin: 10px 0; color: #666;">{{ dayun.shishen }}</div>
              <div style="font-size: 14px; color: #999;">{{ dayun.ageRange }}</div>
            </div>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('dayun')">🤖 AI助手解读大运</button>
          </div>
        </div>

        <!-- 鬼谷子断语 -->
        <div v-if="activeTab === 'guiguzi'" class="result-card">
          <h3>鬼谷子两头钳</h3>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>年柱：</strong>{{ result.guiguzi.年柱 }}
            <strong style="margin-left: 20px;">时辰：</strong>{{ result.guiguzi.时辰 }}
            <strong style="margin-left: 20px;">命格：</strong>{{ result.guiguzi.命格 }}
          </div>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>命理断语：</strong>
            <p style="margin-top: 10px; line-height: 1.8; color: #666;">{{ result.guiguzi.断语 }}</p>
          </div>

          <div class="info-item">
            <strong>诗曰：</strong>
            <p style="margin-top: 10px; line-height: 1.8; color: #667eea; font-style: italic;">
              {{ result.guiguzi.诗曰 }}
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('guiguzi')">🤖 AI助手解读鬼谷子断语</button>
          </div>
        </div>

        <!-- 易经卦象 -->
        <div v-if="activeTab === 'yijing'" class="result-card">
          <h3>易经卦象</h3>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>起卦方法：</strong>{{ result.yijing.method }}
          </div>

          <div class="info-grid" style="margin-bottom: 20px;">
            <div class="info-item">
              <strong>主卦：</strong>{{ result.yijing.主卦.name }}
              <p style="margin-top: 10px; color: #666;">{{ result.yijing.主卦.description }}</p>
            </div>
            <div class="info-item">
              <strong>变卦：</strong>{{ result.yijing.变卦.name }}
              <p style="margin-top: 10px; color: #666;">{{ result.yijing.变卦.description }}</p>
            </div>
          </div>

          <div class="info-item" style="margin-bottom: 20px;">
            <strong>动爻：</strong>第{{ result.yijing.动爻 }}爻
          </div>

          <div v-if="result.yijing.分析" class="info-item">
            <strong>梅花易数分析：</strong>
            <p style="margin-top: 10px; color: #666;">
              体卦五行：{{ result.yijing.分析.体卦五行 }}<br>
              用卦五行：{{ result.yijing.分析.用卦五行 }}<br>
              体用关系：{{ result.yijing.分析.体用关系 }}<br>
              吉凶判断：{{ result.yijing.分析.吉凶判断 }}<br>
              建议：{{ result.yijing.分析.建议 }}
            </p>
          </div>

          <div style="margin-top: 20px; text-align: center;">
            <button class="btn-ai" @click="openAIChat('yijing')">🤖 AI助手解读卦象</button>
          </div>
        </div>

        <!-- 日常事项测算 -->
        <div v-if="activeTab === 'daily'" class="result-card">
          <h3>日常事项测算</h3>

          <!-- 事项分类选择 -->
          <div class="form-group" style="margin-bottom: 20px;">
            <label>选择事项分类（可选）</label>
            <div class="category-grid">
              <button v-for="(category, name) in matterCategories" :key="name"
                      @click="selectedCategory = name"
                      :class="['category-btn', { active: selectedCategory === name }]">
                {{ category.icon }} {{ name }}
              </button>
            </div>
          </div>

          <!-- 快速选择事项 -->
          <div v-if="selectedCategory" class="form-group" style="margin-bottom: 20px;">
            <label>快速选择事项</label>
            <div class="matter-grid">
              <button v-for="item in matterCategories[selectedCategory].items" :key="item.value"
                      @click="selectMatter(item)"
                      class="matter-btn">
                {{ item.label }}
              </button>
            </div>
          </div>

          <!-- 智能联想输入 -->
          <div class="form-group" style="margin-bottom: 20px; position: relative;">
            <label>要测算的事项</label>
            <input type="text" v-model="dailyMatter.matter"
                   @input="onMatterInput"
                   placeholder="输入关键词，如：上班、丢失、健康、打牌等"
                   style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;" />

            <!-- 联想建议列表 -->
            <div v-if="suggestions.length > 0" class="suggestions-list">
              <div v-for="(suggestion, index) in suggestions" :key="index"
                   @click="selectSuggestion(suggestion)"
                   class="suggestion-item">
                <span class="suggestion-icon">{{ suggestion.icon }}</span>
                <span class="suggestion-label">{{ suggestion.label }}</span>
                <span class="suggestion-category">{{ suggestion.category }}</span>
              </div>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 20px;">
            <label>想知道的规律方向</label>
            <div style="display: flex; gap: 10px;">
              <select v-model="dailyMatter.direction"
                      @change="onDirectionChange"
                      style="flex: 1; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px;">
                <option v-for="dir in availableDirections" :key="dir" :value="dir">{{ dir }}</option>
                <option value="custom">自定义...</option>
              </select>
              <input v-if="dailyMatter.direction === 'custom'"
                     v-model="customDirection"
                     placeholder="输入您想了解的方向"
                     style="flex: 1; padding: 12px; border: 2px solid #667eea; border-radius: 8px;" />
            </div>
          </div>

          <button class="btn" @click="analyzeDailyMatter" style="margin-bottom: 30px;">开始测算</button>

          <div v-if="dailyResult" style="margin-top: 20px;">
            <div class="info-item" style="margin-bottom: 20px; background: #f0f4ff;">
              <strong style="font-size: 18px; color: #667eea;">测算信息</strong>
              <p style="margin-top: 10px; color: #666;">
                测算事项：{{ dailyResult.测算事项 }}<br>
                测算方向：{{ dailyResult.测算方向 }}<br>
                测算时间：{{ dailyResult.测算时间 }}
              </p>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">综合结论</strong>
              <div style="margin-top: 15px; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                <div style="font-size: 24px; font-weight: bold; color: #667eea; margin-bottom: 10px;">
                  {{ dailyResult.综合结论.结论 }} ({{ dailyResult.综合结论.评分 }}分)
                </div>
                <p style="color: #666; line-height: 1.8;">{{ dailyResult.综合结论.说明 }}</p>
              </div>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">卦象分析</strong>
              <p style="margin-top: 10px; color: #666;">
                主卦：{{ dailyResult.卦象分析.主卦 }}<br>
                变卦：{{ dailyResult.卦象分析.变卦 }}<br>
                动爻：第{{ dailyResult.卦象分析.动爻 }}爻<br>
                吉凶：{{ dailyResult.卦象分析.吉凶 }}<br>
                体用关系：{{ dailyResult.卦象分析.体用关系 }}
              </p>
              <p style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; color: #666; line-height: 1.8;">
                {{ dailyResult.卦象分析.卦象解读 }}
              </p>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">黄历分析</strong>
              <p style="margin-top: 10px; color: #666;">
                日期：{{ dailyResult.黄历分析.日期 }}（{{ dailyResult.黄历分析.农历 }}）<br>
                建星：{{ dailyResult.黄历分析.建星 }}<br>
                星宿：{{ dailyResult.黄历分析.星宿 }}<br>
                适宜度：{{ dailyResult.黄历分析.适宜度 }}<br>
                综合评分：{{ dailyResult.黄历分析.综合评分 }}分
              </p>
              <p style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; color: #666; line-height: 1.8;">
                {{ dailyResult.黄历分析.建议 }}
              </p>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">命理分析</strong>
              <p style="margin-top: 10px; color: #666;">
                测算时刻干支：{{ dailyResult.命理分析.测算时刻干支 }}<br>
                命主日柱：{{ dailyResult.命理分析.命主日柱 }}<br>
                天干关系：{{ dailyResult.命理分析.天干关系 }}<br>
                地支关系：{{ dailyResult.命理分析.地支关系 }}<br>
                个人运势：{{ dailyResult.命理分析.个人运势 }}
              </p>
              <p style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; color: #666; line-height: 1.8;">
                {{ dailyResult.命理分析.建议 }}
              </p>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">时间分析</strong>
              <p style="margin-top: 10px; color: #666;">
                时辰：{{ dailyResult.时间分析.时辰 }}（{{ dailyResult.时间分析.时辰特点 }}）<br>
                星期：{{ dailyResult.时间分析.星期 }}（{{ dailyResult.时间分析.星期特点 }}）
              </p>
              <p style="margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 5px; color: #666; line-height: 1.8;">
                {{ dailyResult.时间分析.时辰建议 }}
              </p>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">近十二个月运势预测</strong>
              <div style="margin-top: 15px; padding: 15px; background: #f0f4ff; border-radius: 8px;">
                <div style="margin-bottom: 15px;">
                  <strong style="color: #667eea;">整体趋势：</strong>
                  <span style="color: #666;">{{ dailyResult.近十二个月运势.总体趋势.趋势 }}（平均评分：{{ dailyResult.近十二个月运势.总体趋势.平均评分 }}分）</span>
                  <p style="margin-top: 5px; color: #666;">{{ dailyResult.近十二个月运势.总体趋势.描述 }}</p>
                </div>

                <div style="margin-bottom: 15px;">
                  <strong style="color: #667eea;">月度详情：</strong>
                  <div v-for="(month, index) in dailyResult.近十二个月运势.月度详情" :key="index"
                       style="margin-top: 10px; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #667eea;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                      <strong style="color: #333;">{{ month.月份 }}（{{ month.干支 }}）</strong>
                      <span :style="{
                        padding: '2px 10px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        background: month.运势等级 === '大吉' ? '#d4edda' : month.运势等级 === '吉' ? '#d1ecf1' : month.运势等级 === '平' ? '#fff3cd' : '#f8d7da',
                        color: month.运势等级 === '大吉' ? '#155724' : month.运势等级 === '吉' ? '#0c5460' : month.运势等级 === '平' ? '#856404' : '#721c24'
                      }">{{ month.运势等级 }} {{ month.评分 }}分</span>
                    </div>
                    <p style="color: #666; font-size: 14px; margin-top: 5px;">{{ month.说明 }}</p>
                    <p style="color: #999; font-size: 12px; margin-top: 5px;">
                      天干关系：{{ month.天干关系 }} | 地支关系：{{ month.地支关系 }} | {{ month.适宜度 }}
                    </p>
                  </div>
                </div>

                <div v-if="dailyResult.近十二个月运势.关键时间点.length > 0" style="margin-bottom: 15px;">
                  <strong style="color: #667eea;">关键时间点：</strong>
                  <div v-for="(point, index) in dailyResult.近十二个月运势.关键时间点" :key="index"
                       style="margin-top: 10px; padding: 10px; background: white; border-radius: 5px;">
                    <strong :style="{ color: point.类型 === '最佳时机' ? '#28a745' : '#dc3545' }">{{ point.类型 }}</strong>
                    <p style="color: #666; margin-top: 5px;">{{ point.说明 }}</p>
                  </div>
                </div>

                <div>
                  <strong style="color: #667eea;">月度建议：</strong>
                  <ul style="margin-top: 10px; padding-left: 20px;">
                    <li v-for="(advice, index) in dailyResult.近十二个月运势.建议" :key="index"
                        style="color: #666; margin-top: 5px; line-height: 1.6;">{{ advice }}</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">相关影响因素</strong>
              <div style="margin-top: 10px;">
                <div v-for="(factor, index) in dailyResult.相关影响因素" :key="index"
                     style="padding: 15px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px; border-left: 4px solid #667eea;">
                  <div style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span style="background: #667eea; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px; margin-right: 10px;">
                      {{ factor.类型 }}
                    </span>
                    <strong style="color: #333;">{{ factor.因素 }}</strong>
                  </div>
                  <p style="color: #666; margin-bottom: 5px; line-height: 1.6;">
                    <strong>影响：</strong>{{ factor.影响 }}
                  </p>
                  <p style="color: #667eea; line-height: 1.6;">
                    <strong>建议：</strong>{{ factor.建议 }}
                  </p>
                </div>
              </div>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #667eea;">发展规律</strong>
              <div style="margin-top: 10px;">
                <div style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px;">
                  <strong style="color: #667eea;">初期：</strong>
                  <span style="color: #666;">{{ dailyResult.发展规律.初期 }}</span>
                </div>
                <div style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px;">
                  <strong style="color: #667eea;">中期：</strong>
                  <span style="color: #666;">{{ dailyResult.发展规律.中期 }}</span>
                </div>
                <div style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px;">
                  <strong style="color: #667eea;">后期：</strong>
                  <span style="color: #666;">{{ dailyResult.发展规律.后期 }}</span>
                </div>
                <div style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px;">
                  <strong style="color: #667eea;">关键节点：</strong>
                  <span style="color: #666;">{{ dailyResult.发展规律.关键节点 }}</span>
                </div>
                <div style="padding: 10px; background: #fff3cd; border-radius: 5px;">
                  <strong style="color: #856404;">整体趋势：</strong>
                  <span style="color: #856404;">{{ dailyResult.发展规律.整体趋势 }}</span>
                </div>
              </div>
            </div>

            <div class="info-item" style="margin-bottom: 20px;">
              <strong style="font-size: 18px; color: #dc3545;">⚠️ 注意事项</strong>
              <div style="margin-top: 10px;">
                <div v-for="(warning, index) in dailyResult.注意事项" :key="index"
                     style="padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 5px; margin-bottom: 10px; color: #856404; line-height: 1.8;">
                  {{ warning }}
                </div>
              </div>
            </div>

            <div class="info-item">
              <strong style="font-size: 18px; color: #667eea;">综合建议</strong>
              <div style="margin-top: 10px;">
                <div v-for="(advice, index) in dailyResult.建议" :key="index"
                     style="padding: 10px; background: #f8f9fa; border-radius: 5px; margin-bottom: 10px; color: #666; line-height: 1.8;">
                  {{ advice }}
                </div>
              </div>
            </div>

            <!-- AI对话助手按钮 -->
            <div style="margin-top: 30px; text-align: center;">
              <button class="btn" @click="openAIChat('daily')" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                🤖 AI助手解读
              </button>
            </div>
          </div>

          <!-- AI对话框 -->
          <div v-if="showAIChat" class="ai-chat-modal" @click="closeAIChat">
            <div class="ai-chat-container"
                 @click.stop
                 :style="{ transform: `translate(${chatPosition.x}px, ${chatPosition.y}px)` }">
              <div class="ai-chat-header" @mousedown="startDrag">
                <h3>🤖 AI命理助手</h3>
                <button @click="closeAIChat" class="close-btn">✕</button>
              </div>

              <div class="chat-messages">
                <div v-if="chatMessages.length === 0" class="welcome-message">
                  <p>您好！我是您的命理测算助手。</p>
                  <p>我可以帮您：</p>
                  <ul>
                    <li>📖 深入解读卦象含义</li>
                    <li>💡 详细解释测算结果</li>
                    <li>🎯 提供具体建议</li>
                    <li>📊 分析运势走向</li>
                  </ul>
                  <p>请告诉我您想了解什么？</p>
                </div>

                <div v-for="(msg, index) in chatMessages" :key="index" :class="['chat-message', msg.role]">
                  <div class="message-content" v-html="formatMessage(msg.content)"></div>
                </div>
              </div>

              <div class="chat-input-container">
                <input v-model="userQuestion"
                       @keyup.enter="askAI"
                       placeholder="输入您的问题..."
                       class="chat-input" />
                <button @click="askAI" class="send-btn">发送</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { calculateBazi, addShishenToBazi } from './core/bazi.js';
import { calculateWuxingPower, analyzeWuxingStrength, getRizhuStrength } from './core/wuxing.js';
import { analyzeGeju, analyzeYongshen, analyzeLiuqin } from './core/yuanhai-ziping.js';
import { calculateShensha } from './core/sanming-tonghui.js';
import { calculateDayun, calculateLiunian } from './core/dayun-liunian.js';
import { getGuiguziDuanyu, analyzeXingge, analyzeYunshi } from './core/guiguzi-liangtouqian.js';
import { qigua } from './core/yijing.js';
import { analyzeDailyMatter as analyzeMatter } from './core/daily-matter-enhanced.js';
import { MATTER_CATEGORIES, suggestMatters, getSpecializedAnalysis } from './core/matter-templates.js';
import { aiAssistant } from './core/ai-assistant.js';

// 引入从旧版 APP 提取的增强算法模块
import BaziDataEnhanced from './core/bazi-data-enhanced.js';
import { judgeGeju } from './core/geju-enhanced.js';
import ShenshaSystem from './core/shensha-system.js';
import DayunLiunianSystem from './core/dayun-liunian-system.js';
import ShishenDuanyu from './core/shishen-duanyu.js';
import WuxingShengke from './core/wuxing-shengke.js';

export default {
  name: 'App',
  data() {
    return {
      birthInfo: {
        year: 1990,
        month: 1,
        day: 1,
        hour: 12,
        minute: 0,
        gender: 1
      },
      result: null,
      activeTab: 'bazi',
      currentAge: 0,
      dailyMatter: {
        matter: '',
        direction: '结果'
      },
      dailyResult: null,
      showTutorial: false,
      matterCategories: MATTER_CATEGORIES,
      selectedCategory: '',
      suggestions: [],
      availableDirections: ['结果', '时机', '方法', '注意事项', '综合'],
      customDirection: '',
      specializedResult: null,
      showAIChat: false,
      aiChatContext: null,
      chatMessages: [],
      userQuestion: '',
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      chatPosition: { x: 0, y: 0 }
    };
  },
  methods: {
    onDirectionChange() {
      if (this.dailyMatter.direction !== 'custom') {
        this.customDirection = '';
      }
    },
    onMatterInput() {
      if (this.dailyMatter.matter.length >= 1) {
        this.suggestions = suggestMatters(this.dailyMatter.matter);
      } else {
        this.suggestions = [];
      }
    },
    selectMatter(item) {
      this.dailyMatter.matter = item.value;
      this.availableDirections = item.directions || ['结果', '时机', '方法', '注意事项', '综合'];
      this.dailyMatter.direction = this.availableDirections[0];
      this.suggestions = [];
    },
    selectSuggestion(suggestion) {
      this.dailyMatter.matter = suggestion.value;
      this.availableDirections = suggestion.directions || ['结果', '时机', '方法', '注意事项', '综合'];
      this.dailyMatter.direction = this.availableDirections[0];
      this.suggestions = [];
    },
    analyzeDailyMatter() {
      if (!this.result || !this.result.bazi) {
        alert('请先进行八字排盘');
        return;
      }

      if (!this.dailyMatter.matter) {
        alert('请输入要测算的事项');
        return;
      }

      try {
        const testTime = new Date();
        this.dailyResult = analyzeMatter(
          this.result.bazi,
          this.dailyMatter.matter,
          this.dailyMatter.direction,
          testTime
        );

        // 获取专项分析
        this.specializedResult = getSpecializedAnalysis(this.dailyMatter.matter, this.dailyResult);

        console.log('日常事项测算结果：', this.dailyResult);
        console.log('专项分析结果：', this.specializedResult);
      } catch (error) {
        alert('测算出错：' + error.message);
        console.error(error);
      }
    },
    askAI() {
      if (!this.userQuestion.trim()) {
        alert('请输入您的问题');
        return;
      }

      const context = this.aiChatContext === 'daily' ? this.dailyResult : this.result;
      const answer = aiAssistant.chat(this.userQuestion, context);

      this.chatMessages.push({
        role: 'user',
        content: this.userQuestion
      });

      this.chatMessages.push({
        role: 'assistant',
        content: answer
      });

      this.userQuestion = '';

      // 滚动到底部
      this.$nextTick(() => {
        const chatMessages = document.querySelector('.chat-messages');
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      });
    },
    openAIChat(context) {
      this.aiChatContext = context;
      this.showAIChat = true;
      this.chatMessages = [];
      this.chatPosition = { x: 0, y: 0 };

      // 根据不同模块生成初始问题
      let initialQuestion = '';
      switch(context) {
        case 'bazi':
          initialQuestion = '请帮我解读一下我的八字命盘，重点分析一下我的命局特点。';
          break;
        case 'analysis':
          initialQuestion = '请详细解释一下我的格局和用神，以及五行平衡情况。';
          break;
        case 'shensha':
          initialQuestion = '请解读一下我命中的神煞，哪些是吉神，哪些需要注意？';
          break;
        case 'dayun':
          initialQuestion = '请分析一下我的大运走势，当前大运如何？';
          break;
        case 'guiguzi':
          initialQuestion = '请解读一下鬼谷子断语的含义，对我有什么启示？';
          break;
        case 'yijing':
          initialQuestion = '请解释一下这个卦象的含义，吉凶如何？';
          break;
        case 'daily':
          initialQuestion = '请帮我分析一下这次测算的结果，给出具体建议。';
          break;
      }

      // 如果有初始问题，自动提问
      if (initialQuestion) {
        this.$nextTick(() => {
          this.userQuestion = initialQuestion;
          this.askAI();
        });
      }
    },
    closeAIChat() {
      this.showAIChat = false;
      this.userQuestion = '';
    },
    startDrag(e) {
      this.isDragging = true;
      this.dragStartX = e.clientX - this.chatPosition.x;
      this.dragStartY = e.clientY - this.chatPosition.y;
      document.addEventListener('mousemove', this.onDrag);
      document.addEventListener('mouseup', this.stopDrag);
    },
    onDrag(e) {
      if (this.isDragging) {
        this.chatPosition.x = e.clientX - this.dragStartX;
        this.chatPosition.y = e.clientY - this.dragStartY;
      }
    },
    stopDrag() {
      this.isDragging = false;
      document.removeEventListener('mousemove', this.onDrag);
      document.removeEventListener('mouseup', this.stopDrag);
    },
    formatMessage(content) {
      // 将换行符转换为<br>，将**加粗**转换为<strong>
      return content
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/📖|🔄|⚖️|💡|📚|📊|🎴|📅|🔮|✨|💪|⚠️|📍|🎯|📋|📈|⭐/g, '<span class="emoji">$&</span>');
    },
    calculateBazi() {
      try {
        // 计算八字
        const bazi = calculateBazi(
          this.birthInfo.year,
          this.birthInfo.month,
          this.birthInfo.day,
          this.birthInfo.hour,
          this.birthInfo.minute,
          this.birthInfo.gender
        );

        // 添加十神
        addShishenToBazi(bazi);

        // ========== 增强算法整合 ==========

        // 1. 使用增强的日柱计算验证
        const enhancedRizhu = BaziDataEnhanced.calculateRizhu(
          this.birthInfo.year,
          this.birthInfo.month,
          this.birthInfo.day
        );
        console.log('增强日柱计算:', enhancedRizhu, '原算法:', bazi.day.ganZhi);

        // 2. 使用增强的格局判断
        const shishenCount = {};
        [bazi.year, bazi.month, bazi.hour].forEach(pillar => {
          if (pillar.shishen) {
            shishenCount[pillar.shishen] = (shishenCount[pillar.shishen] || 0) + 1;
          }
        });
        const enhancedGeju = judgeGeju(bazi.day.gan, bazi.month.zhi, { shishenCount });
        console.log('增强格局判断:', enhancedGeju);

        // 3. 使用增强的神煞系统
        const enhancedShensha = ShenshaSystem.calculateAllShensha({
          nianzhu: [bazi.year.gan, bazi.year.zhi],
          yuezhu: [bazi.month.gan, bazi.month.zhi],
          rizhu: [bazi.day.gan, bazi.day.zhi],
          shizhu: [bazi.hour.gan, bazi.hour.zhi]
        });
        console.log('增强神煞系统:', enhancedShensha);

        // 4. 使用增强的大运流年计算
        const qiyunInfo = DayunLiunianSystem.calculateQiyunAge(
          bazi,
          this.birthInfo.gender,
          this.birthInfo.year,
          this.birthInfo.month,
          this.birthInfo.day
        );
        const enhancedDayun = DayunLiunianSystem.calculateBaDayun(
          bazi,
          qiyunInfo,
          this.birthInfo.year
        );
        console.log('增强大运计算:', enhancedDayun);

        // 5. 使用十神断语系统
        const sizhuShishen = {
          年柱: bazi.year.shishen || '比肩',
          月柱: bazi.month.shishen || '比肩',
          日柱: '日主',
          时柱: bazi.hour.shishen || '比肩'
        };
        const shishenDuanyu = ShishenDuanyu.getSizhuDuanyu(sizhuShishen);
        console.log('十神断语:', shishenDuanyu);

        // 6. 使用增强的五行生克分析
        const enhancedWuxingAnalysis = WuxingShengke.calculateWuxingStrength(bazi);
        const enhancedRizhuStrength = WuxingShengke.judgeRizhuStrength(bazi, enhancedWuxingAnalysis);
        const enhancedYongshen = WuxingShengke.calculateYongshen(bazi, enhancedRizhuStrength);
        console.log('增强五行分析:', enhancedWuxingAnalysis);
        console.log('增强日主强弱:', enhancedRizhuStrength);
        console.log('增强用神:', enhancedYongshen);

        // ========== 原有算法（保留兼容） ==========

        // 计算五行力量
        const wuxingPower = calculateWuxingPower(bazi);
        const wuxingStrength = analyzeWuxingStrength(wuxingPower);
        const rizhuStrength = getRizhuStrength(bazi, wuxingPower);

        // 分析格局和用神
        const geju = analyzeGeju(bazi);
        const yongshen = analyzeYongshen(bazi, geju, wuxingPower);
        const liuqin = analyzeLiuqin(bazi);

        // 计算神煞
        const shensha = calculateShensha(bazi);

        // 计算大运流年
        const dayun = calculateDayun(bazi);
        const currentYear = new Date().getFullYear();
        this.currentAge = currentYear - this.birthInfo.year + 1;
        const liunian = calculateLiunian(currentYear, this.birthInfo.year, bazi);

        // 鬼谷子断语
        const guiguzi = getGuiguziDuanyu(bazi);
        const xingge = analyzeXingge(bazi);
        const yunshi = analyzeYunshi(bazi);

        // 易经卦象
        const yijing = qigua(bazi, 'plum');

        this.result = {
          bazi,
          analysis: {
            wuxing: wuxingStrength,
            rizhuStrength,
            geju,
            yongshen,
            liuqin
          },
          shensha,
          dayun,
          liunian,
          guiguzi,
          xingge,
          yunshi,
          yijing,
          // 增强算法结果
          enhanced: {
            rizhu: enhancedRizhu,
            geju: enhancedGeju,
            shensha: enhancedShensha,
            dayun: enhancedDayun,
            qiyunInfo: qiyunInfo,
            shishenDuanyu: shishenDuanyu,
            wuxingAnalysis: enhancedWuxingAnalysis,
            rizhuStrength: enhancedRizhuStrength,
            yongshen: enhancedYongshen
          }
        };

        console.log('计算结果：', this.result);
        console.log('========== 增强算法已整合 ==========');
      } catch (error) {
        alert('计算出错：' + error.message);
        console.error(error);
      }
    },
    formatSolarDate(solar) {
      return `${solar.year}年${solar.month}月${solar.day}日 ${solar.hour}时${solar.minute}分`;
    },
    formatLunarDate(lunar) {
      return `${lunar.year}年${lunar.monthName}月${lunar.dayName}`;
    }
  }
};
</script>
