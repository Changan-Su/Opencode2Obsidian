# 快速测试参考卡

## 安装命令

```powershell
# 方式 1: 自动安装脚本
.\install-plugin.ps1 -VaultPath "C:\path\to\your\vault"

# 方式 2: 自动安装 + 覆盖旧版本
.\install-plugin.ps1 -VaultPath "C:\path\to\your\vault" -Force

# 方式 3: 使用符号链接 (开发模式)
.\install-plugin.ps1 -VaultPath "C:\path\to\your\vault" -UseSymlink -Force
```

## 重新构建

```powershell
cd F:\MyFiles\Projects\Opencode2Obsidian
bun run build
# 如果使用符号链接，重启 Obsidian
# 如果使用复制模式，重新运行安装脚本
```

## 核心测试流程

### 1️⃣ 基础功能 (5 分钟)
- [ ] 启用插件，看到 ribbon 图标
- [ ] 点击图标打开视图
- [ ] 服务器自动启动 (30 秒内)
- [ ] iframe 加载 OpenCode UI

### 2️⃣ 控制功能 (5 分钟)
- [ ] 停止服务器按钮
- [ ] 启动服务器按钮  
- [ ] 重载按钮
- [ ] 快捷键 `Ctrl+Shift+O`

### 3️⃣ 设置功能 (5 分钟)
- [ ] 修改设置并保存
- [ ] 重启 Obsidian 验证持久化
- [ ] 测试自动启动选项

### 4️⃣ OpenCode 集成 (10 分钟)
- [ ] 在 OpenCode 中创建文件
- [ ] 在 Obsidian 中查看文件
- [ ] 测试 AI 助手功能
- [ ] 测试双向同步

## 调试命令

```powershell
# 检查端口占用
netstat -ano | findstr "14096"

# 查找 OpenCode 进程
Get-Process | Where-Object { $_.ProcessName -like "*opencode*" }

# 杀死卡住的进程
Stop-Process -Name "opencode" -Force

# 手动启动 OpenCode
opencode --port 14096 --hostname 127.0.0.1 --cwd "你的Vault路径" --cors "app://obsidian.md"

# 测试健康端点
curl http://127.0.0.1:14096/global/health
```

## 查看日志

```powershell
# 1. 在 Obsidian 中按 Ctrl+Shift+I 打开开发者工具
# 2. 查看 Console 标签页
# 3. 过滤 "OpenCode" 关键字
```

## 常见问题快速修复

### 问题: 端口被占用
```powershell
# 找到占用 14096 端口的进程
netstat -ano | findstr "14096"
# 杀死进程 (PID 在最后一列)
taskkill /PID <PID> /F
```

### 问题: 服务器启动超时
- 检查 OpenCode CLI 是否可用: `opencode --version`
- 增加超时时间 (设置页面)
- 检查 vault 路径是否正确

### 问题: iframe 不加载
- 检查 CORS 设置是否为 `app://obsidian.md`
- 检查浏览器控制台错误
- 尝试重载按钮

### 问题: 插件无法启用
- 确保关闭了 Safe mode
- 检查是否有其他插件冲突
- 查看控制台错误信息

## 性能基准

| 指标 | 目标值 | 实际值 |
|------|--------|--------|
| 启动时间 | < 30s | ___ s |
| 内存占用 (插件) | < 50MB | ___ MB |
| 内存占用 (OpenCode) | < 200MB | ___ MB |
| CPU 占用 (空闲) | < 5% | ___ % |

## 测试通过标准

✅ **可以发布 v0.1.0** 如果:
- 所有核心功能正常工作
- 无阻塞性 bug
- 启动时间 < 30 秒
- 无内存泄漏

⚠️ **需要修复** 如果:
- 有小 bug 但不影响主要功能
- 性能略低于预期
- UI 有小瑕疵

❌ **需要重构** 如果:
- 服务器无法启动
- 频繁崩溃
- 数据丢失或损坏

## 下一步行动

根据测试结果选择:

1. **测试通过** → 更新文档 → 准备 v0.2.0
2. **小问题** → 修复 bug → 重新测试 → 更新文档
3. **大问题** → 分析原因 → 重新开发 → 重新测试

## 文件位置快速参考

| 文件 | 路径 |
|------|------|
| 项目目录 | `F:\MyFiles\Projects\Opencode2Obsidian\` |
| 构建产物 | `main.js`, `manifest.json`, `styles.css` |
| 测试指南 | `TESTING.md` |
| 安装脚本 | `install-plugin.ps1` |
| 插件安装位置 | `<vault>\.obsidian\plugins\opencode2obsidian\` |
| 插件配置 | `<vault>\.obsidian\plugins\opencode2obsidian\data.json` |
