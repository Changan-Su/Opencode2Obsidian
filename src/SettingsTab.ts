import { App, PluginSettingTab, Setting, Notice } from "obsidian";
import { existsSync, statSync } from "fs";
import { homedir } from "os";
import type OpenCode2ObsidianPlugin from "./main";
import { t, setLocale, getLocale, type Locale } from "./i18n";

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
}
