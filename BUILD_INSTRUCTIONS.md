# 八字命理APP - Android打包说明

## 方案一：使用在线构建服务（推荐）

### 使用 Capacitor Cloud Build 或 Ionic Appflow

1. 注册账号：https://ionic.io/appflow
2. 上传项目代码
3. 在线构建APK，无需本地环境

### 使用 GitHub Actions 自动构建

1. 将代码推送到 GitHub
2. 配置 GitHub Actions 自动构建
3. 下载生成的 APK

---

## 方案二：本地构建（需要安装环境）

### 前置要求

1. **安装 Java JDK 17**
   - 下载地址：https://www.oracle.com/java/technologies/downloads/#java17
   - 或使用 OpenJDK：https://adoptium.net/
   - 安装后设置环境变量 JAVA_HOME

2. **安装 Android Studio**
   - 下载地址：https://developer.android.com/studio
   - 安装 Android SDK (API 33 或更高)
   - 设置环境变量 ANDROID_HOME

### 构建步骤

```bash
# 1. 构建 Web 应用
npm run build

# 2. 同步到 Android 项目
npx cap sync android

# 3. 打开 Android Studio 构建
npx cap open android

# 或使用命令行构建
cd android
./gradlew assembleDebug

# 生成的 APK 位置：
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 方案三：使用 PWA（最简单）

将应用部署为 PWA（渐进式 Web 应用），用户可以直接在浏览器中添加到主屏幕：

### 步骤

1. 添加 PWA 配置文件（manifest.json 和 service worker）
2. 部署到 HTTPS 服务器
3. 用户访问网址后，浏览器会提示"添加到主屏幕"

### 优点
- 无需应用商店审核
- 自动更新
- 跨平台（Android、iOS、桌面）
- 无需安装环境

---

## 当前项目状态

✅ 已完成：
- Capacitor 已初始化
- Android 平台已添加
- Web 应用已构建到 dist 目录
- Android 项目已生成在 android 目录

⚠️ 需要完成：
- 安装 Java JDK 17
- 安装 Android Studio（可选，用于签名和发布）

---

## 快速测试方案

如果只是想快速测试，可以：

1. 将 dist 目录部署到任何 Web 服务器
2. 在手机浏览器中访问
3. 点击浏览器菜单中的"添加到主屏幕"

这样就可以像原生应用一样使用了！

---

## 推荐方案

**对于个人使用或小范围分发：**
- 使用 PWA 方案，最简单快捷

**对于正式发布到应用商店：**
- 使用方案二本地构建，需要签名和优化

**对于团队协作：**
- 使用 GitHub Actions 自动构建
