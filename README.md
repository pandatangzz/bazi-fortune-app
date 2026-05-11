# 八字命理推算系统

基于传统命理学经典著作开发的八字推算应用：
- 《易经》- 卦象分析
- 《渊海子平》- 子平命理
- 《三命通会》- 神煞系统
- 《鬼谷子两头钳》- 命运断语

## 功能特性

1. **八字排盘** - 根据生辰计算四柱八字
2. **大运流年** - 推算人生运势走向
3. **命理分析** - 五行强弱、格局判断
4. **神煞系统** - 三命通会神煞体系
5. **两头钳断语** - 鬼谷子命理断语
6. **卦象分析** - 易经六十四卦推演
7. **日常事项测算** - 综合分析日常事项发展规律，包含12个月运势预测
8. **AI智能助手** - 各模块智能解读，可拖动对话框

## 安装运行

```bash
npm install
npm run dev
```

## 构建生产版本

```bash
npm run build
```

## 打包为 Android 应用

详见 [BUILD_INSTRUCTIONS.md](BUILD_INSTRUCTIONS.md)

### 使用 GitHub Actions 自动构建 APK

1. 将代码推送到 GitHub 仓库
2. GitHub Actions 会自动构建 Android APK
3. 在 Actions 页面下载构建好的 APK
4. 或在 Releases 页面下载发布版本

## 技术栈

- Vue 3
- Vite
- Capacitor（移动应用打包）
- lunar-javascript（农历库）

## 项目结构

```
bazi-fortune-app/
├── src/
│   ├── App.vue           # 主应用组件
│   ├── main.js           # 入口文件
│   ├── style.css         # 全局样式
│   └── core/             # 核心算法模块
│       ├── bazi.js                    # 八字排盘
│       ├── wuxing.js                  # 五行分析
│       ├── yuanhai-ziping.js          # 渊海子平
│       ├── sanming-tonghui.js         # 三命通会
│       ├── dayun-liunian.js           # 大运流年
│       ├── guiguzi-liangtouqian.js    # 鬼谷子两头钳
│       ├── yijing.js                  # 易经卦象
│       ├── daily-matter-enhanced.js   # 日常事项测算
│       ├── matter-templates.js        # 事项模板
│       └── ai-assistant.js            # AI助手
├── android/              # Android 项目
├── .github/workflows/    # GitHub Actions 配置
└── dist/                 # 构建输出
```

## 许可证

MIT

## 免责声明

本应用仅供娱乐和参考，不构成任何决策建议。命运掌握在自己手中，努力才是关键。
