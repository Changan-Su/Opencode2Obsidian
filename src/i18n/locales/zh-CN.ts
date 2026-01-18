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
};
