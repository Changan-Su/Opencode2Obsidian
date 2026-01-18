import { addIcon } from "obsidian";

/**
 * Icon name for OpenCode
 */
export const OPENCODE_ICON_NAME = "opencode";

/**
 * SVG icon for OpenCode (terminal/code style)
 */
const OPENCODE_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor">
  <path d="M20 30 L40 50 L20 70" stroke="currentColor" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <line x1="50" y1="65" x2="80" y2="65" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>
</svg>`;

/**
 * Register custom OpenCode icons with Obsidian
 */
export function registerOpenCodeIcons(): void {
  addIcon(OPENCODE_ICON_NAME, OPENCODE_ICON_SVG);
}
