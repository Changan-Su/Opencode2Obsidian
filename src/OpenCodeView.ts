import { ItemView, WorkspaceLeaf, setIcon } from "obsidian";
import { OPENCODE_VIEW_TYPE } from "./types";
import { OPENCODE_ICON_NAME } from "./icons";
import type OpenCode2ObsidianPlugin from "./main";
import { ProcessState } from "./ProcessManager";
import { t } from "./i18n";

/**
 * Custom view for displaying OpenCode interface in Obsidian
 * Embeds the OpenCode web UI via iframe and manages state-based UI
 */
export class OpenCodeView extends ItemView {
  plugin: OpenCode2ObsidianPlugin;
  private iframeEl: HTMLIFrameElement | null = null;
  private currentState: ProcessState = "stopped";
  private unsubscribeStateChange: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: OpenCode2ObsidianPlugin) {
    super(leaf);
    this.plugin = plugin;
  }

  getViewType(): string {
    return OPENCODE_VIEW_TYPE;
  }

  getDisplayText(): string {
    return t("viewTitle");
  }

  getIcon(): string {
    return OPENCODE_ICON_NAME;
  }

  async onOpen(): Promise<void> {
    this.contentEl.empty();
    this.contentEl.addClass("opencode-container");

    // Subscribe to state changes
    this.unsubscribeStateChange = this.plugin.onProcessStateChange((state) => {
      this.currentState = state;
      this.updateView();
    });

    // Initial render
    this.currentState = this.plugin.getProcessState();
    this.updateView();

    // Start server if not running (lazy start) - don't await to avoid blocking view open
    if (this.currentState === "stopped") {
      this.plugin.startServer();
    }
  }

  async onClose(): Promise<void> {
    // Unsubscribe from state changes to prevent memory leak
    if (this.unsubscribeStateChange) {
      this.unsubscribeStateChange();
      this.unsubscribeStateChange = null;
    }

    // Clean up iframe
    if (this.iframeEl) {
      this.iframeEl.src = "about:blank";
      this.iframeEl = null;
    }
  }

  /**
   * Update view based on current state
   */
  private updateView(): void {
    switch (this.currentState) {
      case "stopped":
        this.renderStoppedState();
        break;
      case "starting":
        this.renderStartingState();
        break;
      case "running":
        this.renderRunningState();
        break;
      case "error":
        this.renderErrorState();
        break;
    }
  }

  /**
   * Render UI for stopped state
   */
  private renderStoppedState(): void {
    this.contentEl.empty();

    const statusContainer = this.contentEl.createDiv({
      cls: "opencode-status-container",
    });

    const iconEl = statusContainer.createDiv({ cls: "opencode-status-icon" });
    setIcon(iconEl, "power-off");

    statusContainer.createEl("h3", { text: t("stateStopped") });
    statusContainer.createEl("p", {
      text: t("msgClickToStart"),
      cls: "opencode-status-message",
    });

    const startButton = statusContainer.createEl("button", {
      text: t("btnStart"),
      cls: "mod-cta opencode-btn-primary",
    });
    startButton.addEventListener("click", () => {
      this.plugin.startServer();
    });
  }

  /**
   * Render UI for starting state
   */
  private renderStartingState(): void {
    this.contentEl.empty();

    const statusContainer = this.contentEl.createDiv({
      cls: "opencode-status-container",
    });

    const loadingEl = statusContainer.createDiv({ cls: "opencode-loading" });
    loadingEl.createDiv({ cls: "opencode-spinner" });

    statusContainer.createEl("h3", { text: t("stateStarting") });
    statusContainer.createEl("p", {
      text: t("msgPleaseWait"),
      cls: "opencode-status-message",
    });
  }

  /**
   * Render UI for running state (with iframe)
   */
  private renderRunningState(): void {
    this.contentEl.empty();

    const headerEl = this.contentEl.createDiv({ cls: "opencode-header" });

    const titleSection = headerEl.createDiv({ cls: "opencode-header-title" });
    const iconEl = titleSection.createSpan({ cls: "opencode-header-icon" });
    setIcon(iconEl, OPENCODE_ICON_NAME);
    titleSection.createSpan({ text: t("viewTitle"), cls: "opencode-header-text" });

    const actionsEl = headerEl.createDiv({ cls: "opencode-header-actions" });

    const reloadButton = actionsEl.createEl("button", {
      cls: "opencode-action-btn",
      attr: { "aria-label": t("btnReload") },
    });
    setIcon(reloadButton, "refresh-cw");
    reloadButton.addEventListener("click", () => {
      this.reloadIframe();
    });

    const stopButton = actionsEl.createEl("button", {
      cls: "opencode-action-btn opencode-action-btn-danger",
      attr: { "aria-label": t("btnStop") },
    });
    setIcon(stopButton, "square");
    stopButton.addEventListener("click", () => {
      this.plugin.stopServer();
    });

    const iframeContainer = this.contentEl.createDiv({
      cls: "opencode-iframe-container",
    });

    console.log("[OpenCode2Obsidian] Loading iframe with URL:", this.plugin.getServerUrl());

    this.iframeEl = iframeContainer.createEl("iframe", {
      cls: "opencode-iframe",
      attr: {
        src: this.plugin.getServerUrl(),
        frameborder: "0",
        allow: "clipboard-read; clipboard-write",
      },
    });

    this.iframeEl.addEventListener("error", () => {
      console.error("Failed to load OpenCode iframe");
    });
  }

  /**
   * Render UI for error state
   */
  private renderErrorState(): void {
    this.contentEl.empty();

    const statusContainer = this.contentEl.createDiv({
      cls: "opencode-status-container opencode-error",
    });

    const iconEl = statusContainer.createDiv({ cls: "opencode-status-icon" });
    setIcon(iconEl, "alert-circle");

    statusContainer.createEl("h3", { text: t("msgFailedToStart") });

    const errorMessage = this.plugin.getLastError();
    if (errorMessage) {
      statusContainer.createEl("p", {
        text: errorMessage,
        cls: "opencode-status-message opencode-error-message",
      });
    } else {
      statusContainer.createEl("p", {
        text: t("msgGenericError"),
        cls: "opencode-status-message",
      });
    }

    const buttonContainer = statusContainer.createDiv({
      cls: "opencode-button-group",
    });

    const retryButton = buttonContainer.createEl("button", {
      text: t("btnRetry"),
      cls: "mod-cta opencode-btn-primary",
    });
    retryButton.addEventListener("click", () => {
      this.plugin.startServer();
    });

    const settingsButton = buttonContainer.createEl("button", {
      text: t("btnOpenSettings"),
      cls: "opencode-btn-secondary",
    });
    settingsButton.addEventListener("click", () => {
      (this.app as any).setting.open();
      (this.app as any).setting.openTabById("opencode2obsidian");
    });
  }

  /**
   * Reload the iframe
   */
  private reloadIframe(): void {
    if (this.iframeEl) {
      const src = this.iframeEl.src;
      this.iframeEl.src = "about:blank";
      setTimeout(() => {
        if (this.iframeEl) {
          this.iframeEl.src = src;
        }
      }, 100);
    }
  }
}
