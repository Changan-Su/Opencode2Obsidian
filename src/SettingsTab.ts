import { App, PluginSettingTab, Setting, Notice, setIcon } from "obsidian";
import { existsSync, statSync } from "fs";
import { homedir } from "os";
import { exec } from "child_process";
import { promisify } from "util";
import type OpenCode2ObsidianPlugin from "./main";
import { t, setLocale, getLocale, type Locale } from "./i18n";

const execAsync = promisify(exec);

/**
 * Expand tilde (~) to home directory
 */
function expandTilde(path: string): string {
  if (path === "~") {
    return homedir();
  }
  if (path.startsWith("~/")) {
    return path.replace("~", homedir());
  }
  return path;
}

/**
 * Settings tab for configuring OpenCode2Obsidian plugin
 */
export class OpenCodeSettingTab extends PluginSettingTab {
  plugin: OpenCode2ObsidianPlugin;
  private validateTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor(app: App, plugin: OpenCode2ObsidianPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;

    containerEl.empty();

    // Title
    containerEl.createEl("h2", { text: t("settingsTitle") });

    // Language setting (first, so user can change language immediately)
    new Setting(containerEl)
      .setName(t("settingsLanguage"))
      .setDesc(t("settingLanguageDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("en", "English")
          .addOption("zh-CN", "简体中文")
          .setValue(this.plugin.settings.language)
          .onChange(async (value: Locale) => {
            this.plugin.settings.language = value;
            setLocale(value);
            await this.plugin.saveSettings();
            // Refresh the settings display to show new language
            this.display();
          })
      );

    // Server Configuration section
    containerEl.createEl("h3", { text: t("settingsServerConfig") });

    // OpenCode executable path
    new Setting(containerEl)
      .setName(t("settingOpencodePath"))
      .setDesc(t("settingOpencodePathDesc"))
      .addText((text) =>
        text
          .setPlaceholder("opencode")
          .setValue(this.plugin.settings.opencodePath)
          .onChange(async (value) => {
            this.plugin.settings.opencodePath = value || "opencode";
            await this.plugin.saveSettings();
          })
      );

    // Server port
    new Setting(containerEl)
      .setName(t("settingPort"))
      .setDesc(t("settingPortDesc"))
      .addText((text) =>
        text
          .setPlaceholder("14096")
          .setValue(String(this.plugin.settings.port))
          .onChange(async (value) => {
            const port = parseInt(value);
            if (!isNaN(port) && port > 0 && port < 65536) {
              this.plugin.settings.port = port;
              await this.plugin.saveSettings();
            }
          })
      );

    // Server hostname
    new Setting(containerEl)
      .setName(t("settingHostname"))
      .setDesc(t("settingHostnameDesc"))
      .addText((text) =>
        text
          .setPlaceholder("127.0.0.1")
          .setValue(this.plugin.settings.hostname)
          .onChange(async (value) => {
            this.plugin.settings.hostname = value || "127.0.0.1";
            await this.plugin.saveSettings();
          })
      );

    // Project directory
    new Setting(containerEl)
      .setName(t("settingProjectDirectory"))
      .setDesc(t("settingProjectDirectoryDesc"))
      .addText((text) =>
        text
          .setPlaceholder(t("settingProjectDirectoryPlaceholder"))
          .setValue(this.plugin.settings.projectDirectory)
          .onChange((value) => {
            // Debounce validation
            if (this.validateTimeout) {
              clearTimeout(this.validateTimeout);
            }
            this.validateTimeout = setTimeout(async () => {
              await this.validateAndSetProjectDirectory(value);
            }, 500);
          })
      );

    // Behavior section
    containerEl.createEl("h3", { text: t("settingsBehavior") });

    // Auto-start server
    new Setting(containerEl)
      .setName(t("settingAutoStart"))
      .setDesc(t("settingAutoStartDesc"))
      .addToggle((toggle) =>
        toggle.setValue(this.plugin.settings.autoStart).onChange(async (value) => {
          this.plugin.settings.autoStart = value;
          await this.plugin.saveSettings();
        })
      );

    // Startup timeout
    new Setting(containerEl)
      .setName(t("settingStartupTimeout"))
      .setDesc(t("settingStartupTimeoutDesc"))
      .addText((text) =>
        text
          .setPlaceholder("30")
          .setValue(String(this.plugin.settings.startupTimeout / 1000))
          .onChange(async (value) => {
            const seconds = parseInt(value);
            if (!isNaN(seconds) && seconds > 0) {
              this.plugin.settings.startupTimeout = seconds * 1000;
              await this.plugin.saveSettings();
            }
          })
      );

    // Default view location
    new Setting(containerEl)
      .setName(t("settingDefaultViewLocation"))
      .setDesc(t("settingDefaultViewLocationDesc"))
      .addDropdown((dropdown) =>
        dropdown
          .addOption("right", t("locationRightSidebar"))
          .addOption("main", t("locationMainPanel"))
          .setValue(this.plugin.settings.defaultViewLocation)
          .onChange(async (value: "main" | "right") => {
            this.plugin.settings.defaultViewLocation = value;
            await this.plugin.saveSettings();
          })
      );

    // Divider
    containerEl.createEl("hr");

    // Updates section
    containerEl.createEl("h3", { text: t("settingsUpdateCheck") });
    const updateContainer = containerEl.createDiv({ cls: "opencode-update-section" });
    this.renderUpdateChecker(updateContainer);

    // Divider
    containerEl.createEl("hr");

    // Server status section
    containerEl.createEl("h3", { text: t("settingsServerStatus") });
    const statusContainer = containerEl.createDiv({ cls: "opencode-settings-status" });
    this.renderServerStatus(statusContainer);
  }

  /**
   * Validate and set project directory
   */
  private async validateAndSetProjectDirectory(value: string): Promise<void> {
    const trimmed = value.trim();

    // Empty value is valid - means use vault root
    if (!trimmed) {
      await this.plugin.updateProjectDirectory("");
      return;
    }

    // Validate absolute path (supports ~, /, and Windows drive letters)
    if (!trimmed.startsWith("/") && !trimmed.startsWith("~") && !trimmed.match(/^[A-Za-z]:\\/)) {
      new Notice(t("validationPathAbsolute"));
      return;
    }

    const expanded = expandTilde(trimmed);

    try {
      if (!existsSync(expanded)) {
        new Notice(t("validationPathNotExist"));
        return;
      }
      const stat = statSync(expanded);
      if (!stat.isDirectory()) {
        new Notice(t("validationPathNotDirectory"));
        return;
      }
    } catch (error) {
      new Notice(`${t("validationPathFailed")}: ${(error as Error).message}`);
      return;
    }

    await this.plugin.updateProjectDirectory(expanded);
  }

  /**
   * Render server status section
   */
  private renderServerStatus(container: HTMLElement): void {
    container.empty();

    const state = this.plugin.getProcessState();
    const statusText: Record<string, string> = {
      stopped: t("stateStopped"),
      starting: t("stateStarting"),
      running: t("stateRunning"),
      error: t("stateError"),
    };

    const statusClass: Record<string, string> = {
      stopped: "opencode-status-stopped",
      starting: "opencode-status-starting",
      running: "opencode-status-running",
      error: "opencode-status-error",
    };

    // Status line
    const statusEl = container.createDiv({ cls: "opencode-status-line" });
    statusEl.createSpan({ text: `${t("statusCurrentState")}: ` });
    statusEl.createSpan({
      text: statusText[state],
      cls: `opencode-status-badge ${statusClass[state]}`,
    });

    // Show URL if running
    if (state === "running") {
      const urlEl = container.createDiv({ cls: "opencode-status-line" });
      urlEl.createSpan({ text: `${t("statusUrl")}: ` });
      const linkEl = urlEl.createEl("a", {
        text: this.plugin.getServerUrl(),
        href: this.plugin.getServerUrl(),
      });
      linkEl.addEventListener("click", (e) => {
        e.preventDefault();
        window.open(this.plugin.getServerUrl(), "_blank");
      });
    }

    // Show error if any
    if (state === "error") {
      const error = this.plugin.getLastError();
      if (error) {
        container.createEl("p", {
          text: error,
          cls: "opencode-error-message",
        });
      }

      // Add diagnostics button
      const diagnosticsButton = buttonContainer.createEl("button", {
        text: t("btnRunDiagnostics"),
        cls: "mod-warning",
      });
      diagnosticsButton.addEventListener("click", async () => {
        diagnosticsButton.disabled = true;
        diagnosticsButton.setText(t("diagnosticsRunning"));
        
        const diagnostics = await this.runDiagnostics();
        
        // Show diagnostics in a modal or notice
        new Notice(t("diagnosticsComplete"), 2000);
        console.log("[OpenCode2Obsidian] Diagnostics:\n" + diagnostics);
        
        // Create diagnostics display
        const diagEl = container.createEl("pre", {
          text: diagnostics,
          cls: "opencode-diagnostics-output",
        });
        
        diagnosticsButton.disabled = false;
        diagnosticsButton.setText(t("btnRunDiagnostics"));
      });
    }

    // Control buttons
    const buttonContainer = container.createDiv({
      cls: "opencode-settings-buttons",
    });

    if (state === "stopped" || state === "error") {
      const startButton = buttonContainer.createEl("button", {
        text: t("btnStartServer"),
        cls: "mod-cta",
      });
      startButton.addEventListener("click", async () => {
        await this.plugin.startServer();
        setTimeout(() => this.renderServerStatus(container), 500);
      });
    }

    if (state === "running") {
      const stopButton = buttonContainer.createEl("button", {
        text: t("btnStopServer"),
      });
      stopButton.addEventListener("click", () => {
        this.plugin.stopServer();
        setTimeout(() => this.renderServerStatus(container), 500);
      });

      const restartButton = buttonContainer.createEl("button", {
        text: t("btnRestartServer"),
        cls: "mod-warning",
      });
      restartButton.addEventListener("click", async () => {
        this.plugin.stopServer();
        await this.plugin.startServer();
        setTimeout(() => this.renderServerStatus(container), 500);
      });
    }

    if (state === "starting") {
      buttonContainer.createSpan({
        text: t("statusPleaseWait"),
        cls: "opencode-status-waiting",
      });
    }
  }

  /**
   * Render update checker section
   */
  private renderUpdateChecker(container: HTMLElement): void {
    container.empty();

    const currentVersion = this.plugin.manifest.version;
    
    const versionInfo = container.createDiv({ cls: "opencode-version-info" });
    versionInfo.createSpan({ text: `${t("updateCurrentVersion")}: ` });
    versionInfo.createEl("strong", { text: currentVersion });

    const buttonContainer = container.createDiv({
      cls: "opencode-settings-buttons",
    });

    const checkButton = buttonContainer.createEl("button", {
      text: t("btnCheckUpdates"),
      cls: "mod-cta",
    });
    checkButton.addEventListener("click", async () => {
      await this.checkForUpdates(container, currentVersion);
    });
  }

  /**
   * Check for updates from GitHub
   */
  private async checkForUpdates(container: HTMLElement, currentVersion: string): Promise<void> {
    const resultEl = container.createDiv({ cls: "opencode-update-result" });
    resultEl.setText(t("updateChecking"));

    try {
      const response = await fetch(
        "https://api.github.com/repos/Changan-Su/Opencode2Obsidian/releases/latest",
        {
          headers: {
            "Accept": "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`GitHub API responded with status ${response.status}`);
      }

      const data = await response.json();
      const latestVersion = data.tag_name.replace(/^v/, ""); // Remove 'v' prefix if present
      const isUpToDate = this.compareVersions(currentVersion, latestVersion) >= 0;

      resultEl.empty();

      if (isUpToDate) {
        const upToDateEl = resultEl.createDiv({ cls: "opencode-update-uptodate" });
        const iconEl = upToDateEl.createSpan({ cls: "opencode-update-icon" });
        setIcon(iconEl, "check-circle");
        upToDateEl.createSpan({ text: t("updateUpToDate") });
      } else {
        const updateAvailableEl = resultEl.createDiv({ cls: "opencode-update-available" });
        const iconEl = updateAvailableEl.createSpan({ cls: "opencode-update-icon" });
        setIcon(iconEl, "download");
        updateAvailableEl.createSpan({ text: t("updateAvailable") });

        const versionCompare = resultEl.createDiv({ cls: "opencode-version-compare" });
        versionCompare.createSpan({ text: `${t("updateLatestVersion")}: ` });
        versionCompare.createEl("strong", { text: latestVersion });

        const linkContainer = resultEl.createDiv({ cls: "opencode-update-links" });
        
        const downloadLink = linkContainer.createEl("a", {
          text: t("btnDownloadUpdate"),
          href: data.html_url,
          cls: "mod-cta",
        });
        downloadLink.setAttribute("target", "_blank");
        downloadLink.setAttribute("rel", "noopener noreferrer");

        if (data.body) {
          const releaseNotesLink = linkContainer.createEl("a", {
            text: t("updateViewReleaseNotes"),
            href: data.html_url,
          });
          releaseNotesLink.setAttribute("target", "_blank");
          releaseNotesLink.setAttribute("rel", "noopener noreferrer");
        }
      }
    } catch (error) {
      resultEl.empty();
      resultEl.createDiv({ 
        text: `${t("updateCheckFailed")}: ${(error as Error).message}`,
        cls: "opencode-error-message",
      });
    }
  }

  /**
   * Compare semantic versions
   * Returns: 1 if v1 > v2, -1 if v1 < v2, 0 if equal
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split(".").map(Number);
    const parts2 = v2.split(".").map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const num1 = parts1[i] || 0;
      const num2 = parts2[i] || 0;

      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }

    return 0;
  }

  /**
   * Run diagnostics to help troubleshoot issues
   */
  async runDiagnostics(): Promise<string> {
    const diagnostics: string[] = [];
    
    diagnostics.push(`${t("diagnosticsOpenCodePath")}: ${this.plugin.settings.opencodePath}`);

    try {
      // Check if OpenCode command exists
      const { stdout: whichOutput } = await execAsync(
        process.platform === "win32" 
          ? `where ${this.plugin.settings.opencodePath}` 
          : `which ${this.plugin.settings.opencodePath}`
      );
      diagnostics.push(`${t("diagnosticsCommandCheck")}: ${t("diagnosticsCommandFound")} (${whichOutput.trim()})`);
    } catch {
      diagnostics.push(`${t("diagnosticsCommandCheck")}: ${t("diagnosticsCommandNotFound")}`);
    }

    // Check Node.js version
    try {
      const { stdout: nodeVersion } = await execAsync("node --version");
      diagnostics.push(`${t("diagnosticsNodeVersion")}: ${nodeVersion.trim()}`);
    } catch {
      diagnostics.push(`${t("diagnosticsNodeVersion")}: Not found`);
    }

    // Check npm version
    try {
      const { stdout: npmVersion } = await execAsync("npm --version");
      diagnostics.push(`${t("diagnosticsNpmVersion")}: ${npmVersion.trim()}`);
    } catch {
      diagnostics.push(`${t("diagnosticsNpmVersion")}: Not found`);
    }

    // Show PATH
    diagnostics.push(`${t("diagnosticsEnvPath")}: ${process.env.PATH || "Not set"}`);

    return diagnostics.join("\n");
  }
}
