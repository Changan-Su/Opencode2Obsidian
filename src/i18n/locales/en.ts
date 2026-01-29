/**
 * English locale strings
 */
export const en = {
  // Plugin info
  pluginName: "OpenCode2Obsidian",
  pluginDescription: "Embed OpenCode AI assistant in Obsidian",

  // View
  viewTitle: "OpenCode",
  
  // States
  stateStopped: "OpenCode is stopped",
  stateStarting: "Starting OpenCode...",
  stateRunning: "Running",
  stateError: "Error",
  
  // Messages
  msgClickToStart: "Click the button below to start the OpenCode server.",
  msgPleaseWait: "Please wait while the server starts up.",
  msgFailedToStart: "Failed to start OpenCode",
  msgGenericError: "There was an error starting the OpenCode server.",
  msgServerStarted: "OpenCode server started",
  msgServerStopped: "OpenCode server stopped",
  
  // Buttons
  btnStart: "Start OpenCode",
  btnStop: "Stop",
  btnRetry: "Retry",
  btnOpenSettings: "Open Settings",
  btnReload: "Reload",
  btnStartServer: "Start Server",
  btnStopServer: "Stop Server",
  btnRestartServer: "Restart Server",
  
  // Settings
  settingsTitle: "OpenCode2Obsidian Settings",
  settingsServerConfig: "Server Configuration",
  settingsBehavior: "Behavior",
  settingsServerStatus: "Server Status",
  settingsLanguage: "Language",
  
  // Setting items
  settingOpencodePath: "OpenCode path",
  settingOpencodePathDesc: "Path to the OpenCode executable (e.g., 'opencode' or '/usr/local/bin/opencode')",
  settingPort: "Port",
  settingPortDesc: "Port number for the OpenCode server (default: 14096)",
  settingHostname: "Hostname",
  settingHostnameDesc: "Hostname for the OpenCode server (default: 127.0.0.1)",
  settingAutoStart: "Auto-start server",
  settingAutoStartDesc: "Automatically start the OpenCode server when Obsidian opens",
  settingStartupTimeout: "Startup timeout",
  settingStartupTimeoutDesc: "Maximum time to wait for server startup, in seconds (default: 30)",
  settingProjectDirectory: "Project directory",
  settingProjectDirectoryDesc: "Custom project directory for OpenCode. Leave empty to use the vault root. Changes require server restart.",
  settingProjectDirectoryPlaceholder: "Leave empty for vault root",
  settingDefaultViewLocation: "Default view location",
  settingDefaultViewLocationDesc: "Where to open the OpenCode view by default",
  settingLanguageDesc: "Select display language / 选择显示语言",
  
  // View locations
  locationRightSidebar: "Right sidebar",
  locationMainPanel: "Main panel (tab)",
  
  // Status
  statusCurrentState: "Current state",
  statusUrl: "URL",
  statusPleaseWait: "Please wait...",

  // Validation
  validationPathAbsolute: "Project directory must be an absolute path",
  validationPathNotExist: "Project directory does not exist",
  validationPathNotDirectory: "Project directory path is not a directory",
  validationPathFailed: "Failed to validate path",

  // Update checking
  settingsUpdateCheck: "Check for Updates",
  btnCheckUpdates: "Check for Updates",
  updateCheckTitle: "Plugin Updates",
  updateCurrentVersion: "Current version",
  updateLatestVersion: "Latest version",
  updateUpToDate: "You are using the latest version",
  updateAvailable: "A new version is available!",
  updateChecking: "Checking for updates...",
  updateCheckFailed: "Failed to check for updates",
  btnDownloadUpdate: "Download Update",
  updateViewReleaseNotes: "View Release Notes",

  // Error troubleshooting
  errorTroubleshooting: "Troubleshooting",
  errorCommonCauses: "Common causes and solutions:",
  errorCauseNotInstalled: "OpenCode is not installed",
  errorSolutionNotInstalled: "Install OpenCode: npm install -g @anthropics/opencode",
  errorCauseWrongPath: "OpenCode executable path is incorrect",
  errorSolutionWrongPath: "Check the 'OpenCode path' setting. Try 'opencode' or the full path.",
  errorCausePortInUse: "Port is already in use",
  errorSolutionPortInUse: "Change the port number in settings or stop the conflicting process.",
  errorCausePermission: "Permission denied",
  errorSolutionPermission: "Ensure you have permission to execute OpenCode and bind to the port.",
  errorViewLogs: "Check console logs (Ctrl/Cmd+Shift+I) for more details.",
  errorCheckInstallation: "Verify OpenCode installation",
  btnRunDiagnostics: "Run Diagnostics",
  diagnosticsTitle: "Diagnostics Information",
  diagnosticsRunning: "Running diagnostics...",
  diagnosticsComplete: "Diagnostics complete",
  diagnosticsOpenCodePath: "OpenCode path",
  diagnosticsCommandCheck: "Command executable",
  diagnosticsCommandFound: "Found",
  diagnosticsCommandNotFound: "Not found",
  diagnosticsEnvPath: "PATH environment",
  diagnosticsNodeVersion: "Node.js version",
  diagnosticsNpmVersion: "npm version",
};
