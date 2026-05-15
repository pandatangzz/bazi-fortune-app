# Android 闪退修复说明

## 已完成的修复

### 1. Java 版本统一
- 将所有配置统一为 Java 17
- 修复了 `capacitor.build.gradle` 中 Java 21 与其他配置不一致的问题

### 2. 应用 ID 和命名空间统一
- 统一为 `com.xuankong.fengshui`
- 更新了 `build.gradle` 和 `MainActivity.java` 的包名

### 3. Android SDK 版本降级
- 从 API 36 降级到 API 34，提高兼容性
- minSdkVersion: 24
- compileSdkVersion: 34
- targetSdkVersion: 34

### 4. 构建配置优化
- 修复了 Capacitor 入口文件问题（需要 index.html）
- 配置了 Vite 构建输出

## 使用 GitHub Actions 构建 APK

由于本地没有安装 Android SDK，已配置 GitHub Actions 自动构建：

### 使用步骤：

1. **提交代码到 GitHub**
   ```bash
   git add .
   git commit -m "fix: 修复 Android 闪退问题"
   git push origin main
   ```

2. **触发构建**
   - 推送代码后自动触发
   - 或在 GitHub 仓库的 Actions 标签页手动触发

3. **下载 APK**
   - 构建完成后，在 Actions 页面找到对应的 workflow run
   - 下载 `app-debug` artifact
   - 解压后得到 `app-debug.apk`

### Workflow 文件位置
`.github/workflows/android-build.yml`

## 本地构建（需要先安装 Android SDK）

如果以后需要本地构建：

1. 安装 Android Studio 或 Android SDK
2. 更新 `android/local.properties` 中的 SDK 路径
3. 运行构建命令：
   ```bash
   npm run build
   cp dist/xuankong.html dist/index.html
   npx cap sync android
   cd android && ./gradlew assembleDebug
   ```

## 可能的闪退原因及修复

1. ✅ **Java 版本不一致** - 已修复
2. ✅ **包名/命名空间不匹配** - 已修复
3. ✅ **SDK 版本过高** - 已降级到 API 34
4. ✅ **缺少 index.html 入口** - 已配置自动复制

## 测试建议

安装 APK 后，如果仍然闪退，请检查：
- 使用 `adb logcat` 查看崩溃日志
- 确认设备 Android 版本 >= 7.0 (API 24)
- 检查是否缺少必要的权限
