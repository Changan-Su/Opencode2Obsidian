/**
 * Chinese (Simplified) locale strings
 * 简体中文语言包
 */
export const zhCN = {
  // Plugin info
  pluginName: "OpenCode2Obsidian",
  pluginDescription: "在 Obsidian 中嵌入 OpenCode AI 助手",

  // View
  viewTitle: "OpenCode",
  
  // States
  stateStopped: "OpenCode 已停止",
  stateStarting: "正在启动 OpenCode...",
  stateRunning: "运行中",
  stateError: "错误",
  
  // Messages
  msgClickToStart: "点击下方按钮启动 OpenCode 服务器。",
  msgPleaseWait: "请稍候，服务器正在启动中。",
  msgFailedToStart: "启动 OpenCode 失败",
  msgGenericError: "启动 OpenCode 服务器时发生错误。",
  msgServerStarted: "OpenCode 服务器已启动",
  msgServerStopped: "OpenCode 服务器已停止",
  
  // Buttons
  btnStart: "启动 OpenCode",
  btnStop: "停止",
  btnRetry: "重试",
  btnOpenSettings: "打开设置",
  btnReload: "刷新",
  btnStartServer: "启动服务器",
  btnStopServer: "停止服务器",
  btnRestartServer: "重启服务器",
  
  // Settings
  settingsTitle: "OpenCode2Obsidian 设置",
  settingsServerConfig: "服务器配置",
  settingsBehavior: "行为设置",
  settingsServerStatus: "服务器状态",
  settingsLanguage: "语言",
  
  // Setting items
  settingOpencodePath: "OpenCode 路径",
  settingOpencodePathDesc: "OpenCode 可执行文件路径（如 'opencode' 或 '/usr/local/bin/opencode'）",
  settingPort: "端口",
  settingPortDesc: "OpenCode 服务器端口号（默认：14096）",
  settingHostname: "主机名",
  settingHostnameDesc: "OpenCode 服务器主机名（默认：127.0.0.1）",
  settingAutoStart: "自动启动服务器",
  settingAutoStartDesc: "Obsidian 启动时自动启动 OpenCode 服务器",
  settingStartupTimeout: "启动超时",
  settingStartupTimeoutDesc: "等待服务器启动的最长时间（秒），默认：30",
  settingProjectDirectory: "项目目录",
  settingProjectDirectoryDesc: "OpenCode 的自定义项目目录。留空则使用 Vault 根目录。更改后需重启服务器。",
  settingProjectDirectoryPlaceholder: "留空则使用 Vault 根目录",
  settingDefaultViewLocation: "默认视图位置",
  settingDefaultViewLocationDesc: "OpenCode 视图默认打开的位置",
  settingLanguageDesc: "选择显示语言 / Select display language",
  
  // View locations
  locationRightSidebar: "右侧边栏",
  locationMainPanel: "主面板（标签页）",
  
  // Status
  statusCurrentState: "当前状态",
  statusUrl: "URL",
  statusPleaseWait: "请稍候...",

  // Validation
  validationPathAbsolute: "项目目录必须是绝对路径",
  validationPathNotExist: "项目目录不存在",
  validationPathNotDirectory: "项目目录路径不是一个目录",
  validationPathFailed: "路径验证失败",

  // Update checking
  settingsUpdateCheck: "检查更新",
  btnCheckUpdates: "检查更新",
  updateCheckTitle: "插件更新",
  updateCurrentVersion: "当前版本",
  updateLatestVersion: "最新版本",
  updateUpToDate: "您正在使用最新版本",
  updateAvailable: "发现新版本！",
  updateChecking: "正在检查更新...",
  updateCheckFailed: "检查更新失败",
  btnDownloadUpdate: "下载更新",
  updateViewReleaseNotes: "查看发布说明",

  // Error troubleshooting
  errorTroubleshooting: "故障排除",
  errorCommonCauses: "常见原因及解决方案：",
  errorCauseNotInstalled: "OpenCode 未安装",
  errorSolutionNotInstalled: "安装 OpenCode：npm install -g @anthropics/opencode",
  errorCauseWrongPath: "OpenCode 可执行文件路径不正确",
  errorSolutionWrongPath: "检查'OpenCode 路径'设置。尝试使用 'opencode' 或完整路径。",
  errorCausePortInUse: "端口已被占用",
  errorSolutionPortInUse: "在设置中更改端口号，或停止占用端口的进程。",
  errorCausePermission: "权限不足",
  errorSolutionPermission: "确保您有权限执行 OpenCode 并绑定到该端口。",
  errorViewLogs: "查看控制台日志（Ctrl/Cmd+Shift+I）获取更多详细信息。",
  errorCheckInstallation: "验证 OpenCode 安装",
  btnRunDiagnostics: "运行诊断",
  diagnosticsTitle: "诊断信息",
  diagnosticsRunning: "正在运行诊断...",
  diagnosticsComplete: "诊断完成",
  diagnosticsOpenCodePath: "OpenCode 路径",
  diagnosticsCommandCheck: "命令可执行性",
  diagnosticsCommandFound: "已找到",
  diagnosticsCommandNotFound: "未找到",
  diagnosticsEnvPath: "PATH 环境变量",
  diagnosticsNodeVersion: "Node.js 版本",
  diagnosticsNpmVersion: "npm 版本",
};
