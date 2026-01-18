# Opencode2Obsidian 测试指南

## 测试环境要求

- ✅ OpenCode CLI v1.1.25 已安装并在 PATH 中
- ✅ 构建产物已准备就绪 (main.js, manifest.json, styles.css)
- ⚠️ 需要 Obsidian Desktop 应用程序
- ⚠️ 需要一个测试用 Obsidian vault

## 安装步骤

### 方式 1: 手动复制文件

```powershell
# 1. 找到你的 Obsidian vault 位置
# 例如: C:\Users\YourName\Documents\ObsidianVault

# 2. 创建插件目录
$vaultPath = "你的Vault路径"
$pluginDir = "$vaultPath\.obsidian\plugins\opencode2obsidian"
New-Item -ItemType Directory -Force -Path $pluginDir

# 3. 复制构建产物
Copy-Item "F:\MyFiles\Projects\Opencode2Obsidian\main.js" $pluginDir
Copy-Item "F:\MyFiles\Projects\Opencode2Obsidian\manifest.json" $pluginDir
Copy-Item "F:\MyFiles\Projects\Opencode2Obsidian\styles.css" $pluginDir
```

### 方式 2: 使用符号链接 (推荐开发时使用)

```powershell
# 在 vault 的 plugins 目录创建符号链接
$vaultPath = "你的Vault路径"
$pluginDir = "$vaultPath\.obsidian\plugins\opencode2obsidian"
New-Item -ItemType SymbolicLink -Path $pluginDir -Target "F:\MyFiles\Projects\Opencode2Obsidian"
```

### 方式 3: 自动安装脚本

```powershell
# 运行安装脚本 (需要先创建)
.\install-plugin.ps1 -VaultPath "你的Vault路径"
```

## 启用插件

1. 打开 Obsidian
2. 进入 Settings → Community Plugins
3. 确保 "Safe mode" 已关闭
4. 在 "Installed plugins" 中找到 "OpenCode Integration"
5. 点击开关启用插件

## 测试清单

### 1. 插件加载测试 ✅

**测试步骤:**
- [ ] 启用插件后，左侧 ribbon 出现终端图标
- [ ] 无报错信息
- [ ] 可以在 Settings → OpenCode Integration 中看到设置页面

**预期结果:**
- 插件成功加载
- 无控制台错误
- 设置页面显示正常

**实际结果:**
- 

---

### 2. 服务器启动测试 ✅

**测试步骤:**
- [ ] 点击 ribbon 图标打开 OpenCode 视图
- [ ] 观察状态从 "stopped" → "starting" → "running"
- [ ] 等待 iframe 加载完成

**预期结果:**
- 服务器在 30 秒内启动成功
- 状态显示 "OpenCode is running"
- iframe 成功加载 OpenCode UI
- 可以看到 OpenCode 欢迎界面

**实际结果:**
- 

**调试信息 (如果失败):**
```powershell
# 检查端口是否被占用
netstat -ano | findstr "14096"

# 手动测试 OpenCode CLI
opencode --port 14096 --hostname 127.0.0.1 --cwd "你的Vault路径"

# 检查健康端点
curl http://127.0.0.1:14096/global/health
```

---

### 3. UI 状态测试 ✅

**测试步骤:**
- [ ] 测试 "stopped" 状态: 关闭服务器后查看 UI
- [ ] 测试 "starting" 状态: 启动过程中查看 UI
- [ ] 测试 "running" 状态: 正常运行时查看 UI
- [ ] 测试 "error" 状态: 关闭 OpenCode CLI 再尝试启动

**预期结果:**
- 每个状态显示对应的图标和消息
- 按钮根据状态正确启用/禁用
- 状态转换流畅

**实际结果:**
- 

---

### 4. 控制功能测试 ✅

**测试步骤:**
- [ ] 点击 "Start Server" 按钮启动服务器
- [ ] 点击 "Stop Server" 按钮停止服务器
- [ ] 点击 "Reload" 按钮重新加载 iframe
- [ ] 使用快捷键 `Ctrl+Shift+O` (Windows) 或 `Cmd+Shift+O` (Mac) 切换视图

**预期结果:**
- 所有按钮功能正常
- 快捷键正常工作
- 服务器可以正常启动和停止

**实际结果:**
- 

---

### 5. 设置持久化测试 ✅

**测试步骤:**
- [ ] 修改设置 (端口号、主机名、自动启动等)
- [ ] 保存设置
- [ ] 重启 Obsidian
- [ ] 检查设置是否保留

**预期结果:**
- 设置正确保存到 `data.json`
- 重启后设置保留

**实际结果:**
- 

---

### 6. 自动启动测试 ✅

**测试步骤:**
- [ ] 启用 "Auto-start server when plugin loads" 选项
- [ ] 重启 Obsidian
- [ ] 观察服务器是否自动启动

**预期结果:**
- Obsidian 启动时自动启动 OpenCode 服务器
- 无需手动点击启动按钮

**实际结果:**
- 

---

### 7. 错误处理测试 ✅

**测试步骤:**
- [ ] 测试端口被占用: 手动运行 `opencode --port 14096`，然后尝试启动插件
- [ ] 测试 OpenCode CLI 不可用: 临时重命名 `opencode.exe`
- [ ] 测试超时: 设置极短的超时时间
- [ ] 测试进程崩溃: 启动后手动杀死 OpenCode 进程

**预期结果:**
- 每种错误显示友好的错误消息
- 状态正确切换到 "error"
- 用户可以重试

**实际结果:**
- 

---

### 8. 命令面板测试 ✅

**测试步骤:**
- [ ] 打开命令面板 (`Ctrl+P`)
- [ ] 搜索 "OpenCode"
- [ ] 测试 "Toggle OpenCode view" 命令
- [ ] 测试 "Start OpenCode server" 命令
- [ ] 测试 "Stop OpenCode server" 命令

**预期结果:**
- 所有命令出现在命令面板中
- 命令执行正常

**实际结果:**
- 

---

### 9. OpenCode 功能集成测试 ✅

**测试步骤:**
- [ ] 在 OpenCode UI 中创建一个新文件
- [ ] 在 Obsidian 中查看该文件是否出现
- [ ] 在 Obsidian 中编辑文件
- [ ] 在 OpenCode UI 中查看更改
- [ ] 测试 OpenCode 的 AI 助手功能

**预期结果:**
- OpenCode 和 Obsidian 共享同一个 vault
- 文件更改在两边实时同步
- OpenCode AI 功能正常工作

**实际结果:**
- 

---

### 10. 性能测试 ✅

**测试步骤:**
- [ ] 监控启动时间 (从 stopped → running)
- [ ] 监控内存占用
- [ ] 测试长时间运行 (1+ 小时)
- [ ] 测试多次启动/停止循环

**预期结果:**
- 启动时间 < 30 秒
- 内存占用合理 (主要由 OpenCode CLI 占用)
- 长时间运行稳定
- 多次启动/停止无内存泄漏

**实际结果:**
- 

---

## 已知问题记录

### Issue #1: [标题]
**描述:**

**重现步骤:**

**预期行为:**

**实际行为:**

**临时解决方案:**

---

## 调试技巧

### 查看控制台日志
1. 打开 Obsidian Developer Tools: `Ctrl+Shift+I` (Windows) 或 `Cmd+Option+I` (Mac)
2. 查看 Console 标签页
3. 过滤 "OpenCode" 关键字

### 查看插件数据
```powershell
# 插件配置文件位置
cat "$vaultPath\.obsidian\plugins\opencode2obsidian\data.json"
```

### 手动测试 OpenCode CLI
```powershell
# 启动 OpenCode 服务器
opencode --port 14096 --hostname 127.0.0.1 --cwd "你的Vault路径" --cors "app://obsidian.md"

# 在浏览器中打开
# http://127.0.0.1:14096/<base64编码的路径>
```

### 检查进程
```powershell
# 查找 OpenCode 进程
Get-Process | Where-Object { $_.ProcessName -like "*opencode*" }

# 杀死进程 (如果卡住)
Stop-Process -Name "opencode" -Force
```

---

## 测试报告模板

**测试时间:** 
**测试人员:** 
**Obsidian 版本:** 
**OpenCode CLI 版本:** 1.1.25
**操作系统:** 

**总体评价:**
- [ ] 通过所有核心测试
- [ ] 通过部分测试 (具体问题见下方)
- [ ] 未通过测试 (需要重大修复)

**详细结果:**
见上方各测试项的"实际结果"栏

**建议改进:**
1. 
2. 
3. 

---

## 下一步计划

根据测试结果:
- ✅ 如果所有测试通过 → 准备 v0.2.0 新功能
- ⚠️ 如果有小问题 → 修复 bug，更新文档
- ❌ 如果有重大问题 → 回到开发阶段，重新构建

