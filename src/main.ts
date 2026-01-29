import { Plugin, WorkspaceLeaf, Notice } from "obsidian";
import { OpenCodeSettings, DEFAULT_SETTINGS, OPENCODE_VIEW_TYPE } from "./types";
import { OpenCodeView } from "./OpenCodeView";
import { OpenCodeSettingTab } from "./SettingsTab";
import { ProcessManager, ProcessState } from "./ProcessManager";
import { registerOpenCodeIcons, OPENCODE_ICON_NAME } from "./icons";
import { initI18n, setLocale, t } from "./i18n";

/**
 * Main plugin class for OpenCode2Obsidian
 * Manages the plugin lifecycle, settings, and coordinates between components
 * 
 * @author Changan Su (https://github.com/Changan-Su)
 */
export default class OpenCode2ObsidianPlugin extends Plugin {
  settings: OpenCodeSettings = DEFAULT_SETTINGS;
  private processManager: ProcessManager;
  private stateChangeCallbacks: Array<(state: ProcessState) => void> = [];

  async onload(): Promise<void> {
    console.log("Loading OpenCode2Obsidian plugin");

    // Register custom icons
    registerOpenCodeIcons();

    // Load settings
    await this.loadSettings();

    // Initialize i18n with saved language or auto-detect
    initI18n();
    if (this.settings.language) {
      setLocale(this.settings.language);
    }

    // Get project directory
    const projectDirectory = this.getProjectDirectory();

    // Initialize process manager
    this.processManager = new ProcessManager(
      this.settings,
      projectDirectory,
      (state) => this.notifyStateChange(state)
    );

    console.log("[OpenCode2Obsidian] Configured with project directory:", projectDirectory);

    // Register view
    this.registerView(OPENCODE_VIEW_TYPE, (leaf) => new OpenCodeView(leaf, this));

    // Add settings tab
    this.addSettingTab(new OpenCodeSettingTab(this.app, this));

    // Add ribbon icon
    this.addRibbonIcon(OPENCODE_ICON_NAME, "OpenCode", () => {
      this.activateView();
    });

    // Register commands
    this.addCommand({
      id: "toggle-opencode-view",
      name: "Toggle OpenCode panel",
      callback: () => {
        this.toggleView();
      },
      hotkeys: [
        {
          modifiers: ["Mod", "Shift"],
          key: "o",
        },
      ],
    });

    this.addCommand({
      id: "start-opencode-server",
      name: "Start OpenCode server",
      callback: () => {
        this.startServer();
      },
    });

    this.addCommand({
      id: "stop-opencode-server",
      name: "Stop OpenCode server",
      callback: () => {
        this.stopServer();
      },
    });

    // Auto-start server if enabled
    if (this.settings.autoStart) {
      this.app.workspace.onLayoutReady(async () => {
        await this.startServer();
      });
    }

    console.log("OpenCode2Obsidian plugin loaded");
  }

  async onunload(): Promise<void> {
    console.log("Unloading OpenCode2Obsidian plugin");
    this.stopServer();
    this.app.workspace.detachLeavesOfType(OPENCODE_VIEW_TYPE);
  }

  /**
   * Load plugin settings
   */
  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * Save plugin settings
   */
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
    this.processManager.updateSettings(this.settings);
  }

  /**
   * Update project directory and restart server if running
   */
  async updateProjectDirectory(directory: string): Promise<void> {
    this.settings.projectDirectory = directory;
    await this.saveData(this.settings);

    this.processManager.updateProjectDirectory(this.getProjectDirectory());

    if (this.getProcessState() === "running") {
      this.stopServer();
      await this.startServer();
    }
  }

  /**
   * Get existing OpenCode view leaf if it exists
   */
  private getExistingLeaf(): WorkspaceLeaf | null {
    const leaves = this.app.workspace.getLeavesOfType(OPENCODE_VIEW_TYPE);
    return leaves.length > 0 ? leaves[0] : null;
  }

  /**
   * Activate (show/create) the OpenCode view
   */
  async activateView(): Promise<void> {
    const existingLeaf = this.getExistingLeaf();

    if (existingLeaf) {
      this.app.workspace.revealLeaf(existingLeaf);
      return;
    }

    // Create new leaf based on defaultViewLocation setting
    let leaf: WorkspaceLeaf | null = null;
    if (this.settings.defaultViewLocation === "main") {
      leaf = this.app.workspace.getLeaf("tab");
    } else {
      leaf = this.app.workspace.getRightLeaf(false);
    }

    if (leaf) {
      await leaf.setViewState({
        type: OPENCODE_VIEW_TYPE,
        active: true,
      });
      this.app.workspace.revealLeaf(leaf);
    }
  }

  /**
   * Toggle the OpenCode view (show/hide)
   */
  async toggleView(): Promise<void> {
    const existingLeaf = this.getExistingLeaf();

    if (existingLeaf) {
      // Check if the view is in the sidebar or main area
      const isInSidebar = existingLeaf.getRoot() === this.app.workspace.rightSplit;

      if (isInSidebar) {
        // For sidebar views, check if sidebar is collapsed
        const rightSplit = this.app.workspace.rightSplit;
        if (rightSplit && !rightSplit.collapsed) {
          existingLeaf.detach();
        } else {
          this.app.workspace.revealLeaf(existingLeaf);
        }
      } else {
        // For main area views, just detach (close the tab)
        existingLeaf.detach();
      }
    } else {
      await this.activateView();
    }
  }

  /**
   * Start the OpenCode server
   */
  async startServer(): Promise<boolean> {
    const success = await this.processManager.start();
    if (success) {
      new Notice(t("msgServerStarted"));
    }
    return success;
  }

  /**
   * Stop the OpenCode server
   */
  stopServer(): void {
    this.processManager.stop();
    new Notice(t("msgServerStopped"));
  }

  /**
   * Get current process state
   */
  getProcessState(): ProcessState {
    return this.processManager?.getState() ?? "stopped";
  }

  /**
   * Get last error message
   */
  getLastError(): string | null {
    return this.processManager.getLastError() ?? null;
  }

  /**
   * Get server URL
   */
  getServerUrl(): string {
    return this.processManager.getUrl();
  }

  /**
   * Subscribe to process state changes
   * Returns unsubscribe function
   */
  onProcessStateChange(callback: (state: ProcessState) => void): () => void {
    this.stateChangeCallbacks.push(callback);
    return () => {
      const index = this.stateChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.stateChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * Notify all state change subscribers
   */
  private notifyStateChange(state: ProcessState): void {
    for (const callback of this.stateChangeCallbacks) {
      callback(state);
    }
  }

  /**
   * Get project directory (vault path or custom directory)
   */
  getProjectDirectory(): string {
    if (this.settings.projectDirectory) {
      console.log(
        "[OpenCode2Obsidian] Using project directory from settings:",
        this.settings.projectDirectory
      );
      return this.settings.projectDirectory;
    }
    const adapter = this.app.vault.adapter as any;
    const vaultPath = adapter.basePath || "";
    if (!vaultPath) {
      console.warn("[OpenCode2Obsidian] Warning: Could not determine vault path");
    }
    console.log("[OpenCode2Obsidian] Using vault path as project directory:", vaultPath);
    return vaultPath;
  }
}
