# OpenCode2Obsidian

[English](#english) | [简体中文](#简体中文)

---

## English

> Embed OpenCode AI assistant seamlessly in Obsidian for AI-powered note management and knowledge work.

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](https://github.com/Changan-Su/opencode2obsidian)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.4.0+-purple.svg)](https://obsidian.md)

### Features

- **Seamless Integration** - Embed OpenCode Web UI directly in Obsidian via iframe
- **i18n Support** - Full English and Chinese language support
- **Theme Adaptation** - Automatically adapts to Obsidian's dark/light themes
- **Process Management** - Auto-start and manage OpenCode server process
- **Status Monitoring** - Real-time server status and health checks
- **Flexible Configuration** - Complete settings interface with customizable paths, ports, and more
- **One-Click Install** - Simple installation scripts for Windows and macOS

### Quick Installation

#### Windows
1. Download or clone this repository
2. Double-click `install-windows.bat`
3. Enter or drag your Obsidian vault path
4. Enable the plugin in Obsidian settings

#### macOS
1. Download or clone this repository
2. Double-click `install-macos.command`
3. Select or enter your Obsidian vault path
4. Enable the plugin in Obsidian settings

#### Manual Installation
```bash
# Clone and build
git clone https://github.com/Changan-Su/opencode2obsidian.git
cd opencode2obsidian
bun install
bun run build

# Copy to your vault
cp main.js manifest.json styles.css /path/to/vault/.obsidian/plugins/opencode2obsidian/
```

### Requirements

- [Obsidian](https://obsidian.md) Desktop v1.4.0+
- [OpenCode CLI](https://opencode.ai) - Install with `npm install -g @anthropics/opencode`
- [Bun](https://bun.sh) (for building from source)

### Usage

1. Click the OpenCode icon in the ribbon, or press `Ctrl/Cmd+Shift+O`
2. The plugin will automatically start the OpenCode server
3. Use OpenCode AI assistant directly within Obsidian

### Configuration

Go to **Settings > OpenCode2Obsidian** to configure:

| Setting | Description | Default |
|---------|-------------|---------|
| Language | Display language (English/中文) | Auto-detect |
| OpenCode Path | Path to OpenCode executable | `opencode` |
| Port | Server port number | `14096` |
| Hostname | Server hostname | `127.0.0.1` |
| Auto-start | Start server when Obsidian opens | Off |
| Default View | Where to open the panel | Right sidebar |

### Author

**Changan Su** - [@Changan-Su](https://github.com/Changan-Su)

### License

MIT License - see [LICENSE](LICENSE) for details.

---

## 简体中文

> 在 Obsidian 中无缝嵌入 OpenCode AI 助手，为笔记管理和知识工作提供 AI 赋能。

[![版本](https://img.shields.io/badge/版本-0.2.0-blue.svg)](https://github.com/Changan-Su/opencode2obsidian)
[![许可证](https://img.shields.io/badge/许可证-MIT-green.svg)](LICENSE)
[![Obsidian](https://img.shields.io/badge/Obsidian-1.4.0+-purple.svg)](https://obsidian.md)

### 功能特性

- **无缝集成** - 通过 iframe 直接在 Obsidian 中嵌入 OpenCode Web UI
- **国际化支持** - 完整的中英文双语支持
- **主题适配** - 自动适配 Obsidian 的明暗主题
- **进程管理** - 自动启动和管理 OpenCode 服务进程
- **状态监控** - 实时显示服务状态和健康检查
- **灵活配置** - 完整的设置界面，支持自定义路径、端口等
- **一键安装** - 简单易用的 Windows 和 macOS 安装脚本

### 快速安装

#### Windows
1. 下载或克隆此仓库
2. 双击运行 `install-windows.bat`
3. 输入或拖拽您的 Obsidian Vault 路径
4. 在 Obsidian 设置中启用插件

#### macOS
1. 下载或克隆此仓库
2. 双击运行 `install-macos.command`
3. 选择或输入您的 Obsidian Vault 路径
4. 在 Obsidian 设置中启用插件

#### 手动安装
```bash
# 克隆并构建
git clone https://github.com/Changan-Su/opencode2obsidian.git
cd opencode2obsidian
bun install
bun run build

# 复制到您的 vault
cp main.js manifest.json styles.css /path/to/vault/.obsidian/plugins/opencode2obsidian/
```

### 系统要求

- [Obsidian](https://obsidian.md) 桌面版 v1.4.0+
- [OpenCode CLI](https://opencode.ai) - 使用 `npm install -g @anthropics/opencode` 安装
- [Bun](https://bun.sh)（仅从源码构建时需要）

### 使用方法

1. 点击侧边栏的 OpenCode 图标，或按 `Ctrl/Cmd+Shift+O`
2. 插件将自动启动 OpenCode 服务器
3. 直接在 Obsidian 中使用 OpenCode AI 助手

### 配置说明

进入 **设置 > OpenCode2Obsidian** 进行配置：

| 设置项 | 说明 | 默认值 |
|--------|------|--------|
| 语言 | 显示语言（English/中文） | 自动检测 |
| OpenCode 路径 | OpenCode 可执行文件路径 | `opencode` |
| 端口 | 服务器端口号 | `14096` |
| 主机名 | 服务器主机名 | `127.0.0.1` |
| 自动启动 | Obsidian 启动时自动启动服务器 | 关闭 |
| 默认视图 | 面板打开位置 | 右侧边栏 |

### 作者

**Changan Su** - [@Changan-Su](https://github.com/Changan-Su)

### 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE)

---

## Project Structure / 项目结构

```
opencode2obsidian/
├── src/
│   ├── main.ts           # Plugin entry point
│   ├── OpenCodeView.ts   # View component
│   ├── ProcessManager.ts # Server process management
│   ├── SettingsTab.ts    # Settings UI
│   ├── types.ts          # Type definitions
│   ├── icons.ts          # Custom icons
│   └── i18n/             # Internationalization
│       ├── index.ts
│       └── locales/
│           ├── en.ts     # English strings
│           └── zh-CN.ts  # Chinese strings
├── styles.css            # Theme-adaptive styles
├── manifest.json         # Plugin manifest
├── install-windows.bat   # Windows installer
├── install-macos.command # macOS installer
└── Documents/            # Project documentation
```

## Changelog / 更新日志

See [CHANGELOG.md](CHANGELOG.md) for version history.

查看 [CHANGELOG.md](CHANGELOG.md) 了解版本历史。

---

**Made with love for the Obsidian community**

**为 Obsidian 社区用心打造**
