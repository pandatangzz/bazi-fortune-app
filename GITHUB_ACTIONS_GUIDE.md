# 使用 GitHub Actions 自动构建 Android APK 完整指南

## 步骤一：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `bazi-fortune-app`（或其他名称）
   - Description: `八字命理推算系统`
   - 选择 Public 或 Private
3. 点击 "Create repository"

## 步骤二：推送代码到 GitHub

在项目目录中执行以下命令：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/bazi-fortune-app.git

# 推送代码
git branch -M main
git push -u origin main
```

## 步骤三：等待自动构建

1. 推送完成后，访问你的 GitHub 仓库
2. 点击顶部的 "Actions" 标签
3. 你会看到 "Build Android APK" 工作流正在运行
4. 等待约 5-10 分钟，构建完成

## 步骤四：下载 APK

### 方法 1：从 Actions 下载

1. 在 Actions 页面，点击最新的构建记录
2. 滚动到底部的 "Artifacts" 部分
3. 点击 "app-debug" 下载 APK

### 方法 2：从 Releases 下载

1. 访问仓库的 "Releases" 页面
2. 找到最新的 Release
3. 下载 `app-debug.apk`

## 步骤五：安装到 Android 手机

1. 将下载的 APK 传输到手机
2. 在手机上打开文件管理器
3. 找到 APK 文件并点击安装
4. 如果提示"未知来源"，需要在设置中允许安装未知来源的应用

## 常见问题

### Q: 构建失败怎么办？

A: 点击失败的构建记录，查看详细日志。常见原因：
- Gradle 版本问题
- 依赖下载失败
- 配置文件错误

### Q: 如何修改应用名称和图标？

A: 编辑以下文件：
- 应用名称：`android/app/src/main/res/values/strings.xml`
- 应用图标：替换 `android/app/src/main/res/mipmap-*/` 目录下的图标文件

### Q: 如何生成正式版 APK？

A: 需要：
1. 创建签名密钥
2. 配置 GitHub Secrets
3. 修改 workflow 使用 `assembleRelease`

详细步骤见：https://developer.android.com/studio/publish/app-signing

## 后续更新

每次修改代码后：

```bash
git add .
git commit -m "更新说明"
git push
```

GitHub Actions 会自动构建新的 APK。

## 本地测试（可选）

如果想在本地测试：

```bash
npm run dev
```

然后用手机浏览器访问显示的地址。

---

**提示：** 如果不想使用 GitHub Actions，也可以直接将 `dist` 目录部署为 PWA，用户在浏览器中访问后可以"添加到主屏幕"。
