# Changelog / 更新日志

All notable changes to this project will be documented in this file.

本项目所有重要变更都将记录在此文件中。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.2.1] - 2026-01-18

### Fixed / 修复
- **CRITICAL: Session Access Bug** - Fixed issue where embedded OpenCode could not access sessions from other directories
- **关键修复：Session 访问错误** - 修复了嵌入式 OpenCode 无法访问其他目录 session 的问题
- **Settings Interface Bug** - Fixed settings interface malfunction caused by incorrect working directory
- **设置界面错误** - 修复了由于工作目录错误导致的设置界面功能异常
- **URL Path Encoding** - Removed incorrect base64 path encoding from URL (OpenCode CLI doesn't support path parameters)
- **URL 路径编码** - 移除了错误的 base64 路径编码（OpenCode CLI 不支持路径参数）
- **Working Directory** - Changed from vault-specific directory to user home directory for global session/settings access
- **工作目录** - 从特定 vault 目录改为用户主目录，以实现全局 session/设置访问

### Technical Details / 技术细节
- **Before**: `http://127.0.0.1:14096/QzpcVXNlcnNc...` (base64-encoded vault path)
- **After**: `http://127.0.0.1:14096/` (root path only)
- **Working Directory**: Changed `cwd: this.projectDirectory` to `cwd: os.homedir()`
- See `BUGFIX-SESSION.md` for detailed analysis

---

## [0.2.0] - 2026-01-18

### Added / 新增
- **i18n Support** - Full internationalization with English and Chinese (简体中文) support
- **i18n 支持** - 完整的国际化支持，包含英文和简体中文
- **Theme Adaptation** - Completely rewritten CSS using Obsidian's CSS variables for perfect theme integration
- **主题适配** - 完全重写 CSS，使用 Obsidian 的 CSS 变量实现完美的主题集成
- **One-Click Installers** - New easy installation scripts:
  - `install-windows.bat` - Windows double-click installer with drag & drop support
  - `install-macos.command` - macOS double-click installer with vault auto-detection
- **一键安装脚本** - 新增简易安装脚本：
  - `install-windows.bat` - Windows 双击安装程序，支持拖拽路径
  - `install-macos.command` - macOS 双击安装程序，支持自动检测 Vault
- **Path Validation** - Added project directory validation with user-friendly error messages
- **路径验证** - 新增项目目录验证和友好的错误提示
- **Restart Server** - Added restart button in settings for quick server restart
- **重启服务器** - 设置中新增重启按钮，方便快速重启服务器

### Changed / 变更
- **Author Info** - Updated author to Changan Su (https://github.com/Changan-Su)
- **作者信息** - 更新作者为 Changan Su (https://github.com/Changan-Su)
- **UI Improvements** - Enhanced visual design with better spacing, animations, and accessibility
- **UI 改进** - 优化视觉设计，改进间距、动画和无障碍访问
- **Settings Layout** - Reorganized settings page with clear sections
- **设置布局** - 重新组织设置页面，分类更清晰
- **Version Bump** - Updated to version 0.2.0
- **版本更新** - 升级到 0.2.0 版本

### Fixed / 修复
- **CSS Variables** - Fixed hardcoded colors, now uses Obsidian theme variables
- **CSS 变量** - 修复硬编码颜色，现在使用 Obsidian 主题变量
- **High Contrast Mode** - Added support for Obsidian's high contrast mode
- **高对比度模式** - 新增对 Obsidian 高对比度模式的支持

---

## [0.1.0] - 2026-01-18

### Added / 新增

#### Core Features / 核心功能
- **Plugin Initialization** - Complete Obsidian plugin lifecycle management
  - Settings system with load/save functionality
  - Command registration (toggle, start, stop)
  - Ribbon icon integration
  - Keyboard shortcut: `Ctrl/Cmd+Shift+O` to toggle panel
  - Auto-start server option
- **插件初始化** - 完整的 Obsidian 插件生命周期管理
  - 设置系统的加载/保存功能
  - 命令注册（切换、启动、停止）
  - 侧边栏图标集成
  - 键盘快捷键：`Ctrl/Cmd+Shift+O` 切换面板
  - 服务器自动启动选项

- **OpenCode Service Management** - Full process lifecycle control
  - Spawn and manage OpenCode server process
  - Health check mechanism via `/global/health` endpoint
  - Graceful shutdown (SIGTERM with SIGKILL fallback)
  - State machine: stopped → starting → running → error
  - Automatic port reuse detection
- **OpenCode 服务管理** - 完整的进程生命周期控制
  - 生成和管理 OpenCode 服务进程
  - 通过 `/global/health` 端点进行健康检查
  - 优雅关闭（SIGTERM 带 SIGKILL 后备）
  - 状态机：stopped → starting → running → error
  - 自动端口复用检测

- **Obsidian View Integration** - Custom sidebar/main panel view
  - State-driven UI (4 states: stopped, starting, running, error)
  - iframe embedding of OpenCode Web UI
  - Lazy loading on view open
  - Reload and stop controls
- **Obsidian 视图集成** - 自定义侧边栏/主面板视图
  - 状态驱动的 UI（4 种状态：已停止、启动中、运行中、错误）
  - 通过 iframe 嵌入 OpenCode Web UI
  - 打开视图时懒加载
  - 刷新和停止控制

#### Technical Implementation / 技术实现
- TypeScript strict mode with full type safety
- Detailed JSDoc comments throughout
- Clean separation of concerns (ProcessManager / View / Settings)
- Event-based state change notifications
- Cross-platform path handling
- Base64-encoded project paths in URLs
- CORS configuration for `app://obsidian.md`

---

## Roadmap / 路线图

### v0.3.0 (Planned / 计划中)
- [ ] AGENTS.md auto-initialization / AGENTS.md 自动初始化
- [ ] Skills integration / Skills 集成
- [ ] More keyboard shortcuts / 更多快捷键

### v1.0.0 (Future / 未来)
- [ ] Community plugin submission / 提交社区插件
- [ ] Comprehensive test coverage / 全面测试覆盖
- [ ] Performance optimizations / 性能优化

---

[0.2.1]: https://github.com/Changan-Su/opencode2obsidian/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/Changan-Su/opencode2obsidian/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/Changan-Su/opencode2obsidian/releases/tag/v0.1.0
