import type { Locale } from "./i18n";

/**
 * Settings interface for OpenCode2Obsidian plugin
 */
export interface OpenCodeSettings {
  /** Path to OpenCode executable */
  opencodePath: string;
  /** Port number for OpenCode server */
  port: number;
  /** Hostname for OpenCode server */
  hostname: string;
  /** Automatically start OpenCode server when Obsidian loads */
  autoStart: boolean;
  /** Timeout in milliseconds to wait for server startup */
  startupTimeout: number;
  /** Project directory (vault path). If empty, uses vault root */
  projectDirectory: string;
  /** Default location for OpenCode view */
  defaultViewLocation: "main" | "right";
  /** Display language */
  language: Locale;
}

/**
 * Default settings for the plugin
 */
export const DEFAULT_SETTINGS: OpenCodeSettings = {
  opencodePath: "opencode",
  port: 14096,
  hostname: "127.0.0.1",
  autoStart: false,
  startupTimeout: 30000,
  projectDirectory: "",
  defaultViewLocation: "right",
  language: "en",
};

/**
 * Unique identifier for the OpenCode view type
 */
export const OPENCODE_VIEW_TYPE = "opencode-view";
