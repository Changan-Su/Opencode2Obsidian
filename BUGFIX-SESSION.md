# Session Error Bugfix - v0.2.1

## 问题描述 / Problem Description

### English
- **Session Error**: Cannot read sessions from other directories in embedded OpenCode
- **Settings Error**: Settings interface not working properly
- **Root Cause**: Incorrect working directory and URL path encoding

### 中文
- **Session 错误**：在嵌入的 OpenCode 中无法读取其他 session
- **设置错误**：设置界面功能异常
- **根本原因**：工作目录设置错误和 URL 路径编码问题

---

## 根本原因分析 / Root Cause Analysis

### 1. URL 路径编码问题
**之前的错误实现**：
```typescript
getUrl(): string {
  const encodedPath = btoa(this.projectDirectory);
  return `http://127.0.0.1:14096/${encodedPath}`;
}
```

**问题**：
- OpenCode CLI 不支持通过 URL 路径参数指定项目目录
- Base64 编码的路径会导致 404 错误
- 正确的 URL 应该是根路径：`http://127.0.0.1:14096/`

### 2. 工作目录隔离问题
**之前的错误实现**：
```typescript
spawn("opencode", ["serve", ...], {
  cwd: this.projectDirectory,  // 使用 vault 路径
  ...
});
```

**问题**：
- 每个 vault 启动的 OpenCode 服务都绑定到不同的工作目录
- OpenCode 的 session 和设置存储在工作目录下
- 导致无法访问其他目录的 session，设置界面也无法正常工作

---

## 修复方案 / Solution

### 修改 1: 移除 URL 路径编码

**File**: `src/ProcessManager.ts` (line 62-67)

```typescript
/**
 * Get server URL (root path without project encoding)
 */
getUrl(): string {
  return `http://${this.settings.hostname}:${this.settings.port}`;
}
```

### 修改 2: 使用用户主目录作为工作目录

**File**: `src/ProcessManager.ts` (line 104-123)

```typescript
// Spawn OpenCode server process
// NOTE: Use user home directory as cwd instead of project directory
// to ensure OpenCode can access all sessions and settings globally
const os = require("os");
const homedir = os.homedir();

this.process = spawn(
  this.settings.opencodePath,
  [
    "serve",
    "--port",
    this.settings.port.toString(),
    "--hostname",
    this.settings.hostname,
    "--cors",
    "app://obsidian.md",
  ],
  {
    cwd: homedir,  // 使用主目录而不是 vault 路径
    env: { ...process.env },
    stdio: ["ignore", "pipe", "pipe"],
    detached: false,
  }
);
```

---

## 修复后的行为 / Expected Behavior After Fix

### ✅ 修复后应该可以：

1. **访问所有 Session**
   - 在 Obsidian 嵌入的 OpenCode 中可以看到所有历史 session
   - Session 列表与独立运行的 OpenCode 完全一致

2. **正常使用设置界面**
   - Settings 界面可以正常打开和使用
   - 所有配置项都能正常保存和读取

3. **全局 OpenCode 状态**
   - 无论从哪个 vault 启动，都共享同一个 OpenCode 环境
   - Session、设置、历史记录全局统一

---

## 测试步骤 / Testing Steps

### 1. 重新安装插件

```powershell
# 方法 A: 使用安装脚本
.\install-plugin.ps1 -VaultPath "C:\path\to\your\vault"

# 方法 B: 手动复制
Copy-Item main.js, manifest.json, styles.css -Destination "C:\path\to\vault\.obsidian\plugins\opencode2obsidian\"
```

### 2. 重启 Obsidian

**重要**：必须完全重启 Obsidian（不是重新加载插件）以确保加载新代码。

### 3. 测试 Session 功能

1. 打开 OpenCode 面板（点击图标或 Ctrl+Shift+O）
2. 等待服务器启动
3. 检查 Session 列表：
   - 点击左侧 Session 图标
   - 确认可以看到所有历史 session
   - 尝试切换到其他 session

### 4. 测试设置界面

1. 在 OpenCode 界面中点击设置图标
2. 确认设置界面正常打开
3. 尝试修改设置并保存

### 5. 对比独立运行的 OpenCode

```bash
# 在终端独立运行 OpenCode
opencode serve --port 14097

# 在浏览器打开
# http://127.0.0.1:14097
```

**预期结果**：Obsidian 中的 OpenCode 和独立运行的 OpenCode 应该看到相同的 session 列表和设置。

---

## 可能的副作用 / Potential Side Effects

### ⚠️ 注意事项

1. **不再自动切换项目**
   - 之前：每个 vault 启动的 OpenCode 会自动工作在该 vault 目录
   - 现在：OpenCode 工作在用户主目录，需要手动切换项目

2. **解决方案**：
   - 用户需要在 OpenCode 界面中手动选择要工作的项目目录
   - 或者通过 OpenCode 的项目管理功能切换

### 💡 未来改进建议

考虑在启动 OpenCode 后自动发送命令切换到 vault 目录：
```typescript
// 可能的未来实现
await fetch(`${this.getUrl()}/api/set-project`, {
  method: 'POST',
  body: JSON.stringify({ path: this.projectDirectory })
});
```

但需要等待 OpenCode CLI 提供相应的 API 支持。

---

## 版本变更 / Version Changes

- **v0.2.0**: 原始版本（存在 session 错误）
- **v0.2.1**: 修复 session 和设置错误

---

## 构建新版本 / Build New Version

```powershell
# 1. 构建
bun run build

# 2. 更新版本号
# 编辑 manifest.json 和 package.json，改为 "0.2.1"

# 3. 测试
.\install-plugin.ps1 -VaultPath "path\to\vault"

# 4. 创建发布包（确认测试通过后）
.\scripts\build-release.ps1
```

---

## 相关文件 / Related Files

- `src/ProcessManager.ts` - 主要修改文件
- `src/OpenCodeView.ts` - iframe URL 调用
- `src/main.ts` - 插件入口（未修改）

---

**Status**: ✅ Fix implemented, awaiting testing
**Date**: 2026-01-18
**Author**: Changan Su
