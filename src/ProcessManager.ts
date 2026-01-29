import { spawn, ChildProcess } from "child_process";
import { OpenCodeSettings } from "./types";

/**
 * Process state machine states
 */
export type ProcessState = "stopped" | "starting" | "running" | "error";

/**
 * Manages the OpenCode server process lifecycle
 * - Spawns and stops the OpenCode server process
 * - Monitors health and state transitions
 * - Provides state change notifications via callbacks
 */
export class ProcessManager {
  private process: ChildProcess | null = null;
  private state: ProcessState = "stopped";
  private lastError: string | null = null;
  private earlyExitCode: number | null = null;
  private stderrBuffer: string = ""; // Collect stderr output for error messages
  private settings: OpenCodeSettings;
  private projectDirectory: string;
  private onStateChange: (state: ProcessState) => void;

  constructor(
    settings: OpenCodeSettings,
    projectDirectory: string,
    onStateChange: (state: ProcessState) => void
  ) {
    this.settings = settings;
    this.projectDirectory = projectDirectory;
    this.onStateChange = onStateChange;
  }

  /**
   * Update settings (e.g., after user changes them)
   */
  updateSettings(settings: OpenCodeSettings): void {
    this.settings = settings;
  }

  /**
   * Update project directory and restart if running
   */
  updateProjectDirectory(directory: string): void {
    this.projectDirectory = directory;
  }

  /**
   * Get current process state
   */
  getState(): ProcessState {
    return this.state;
  }

  /**
   * Get last error message
   */
  getLastError(): string | null {
    return this.lastError;
  }

  /**
   * Get server URL (root path without project encoding)
   */
  getUrl(): string {
    return `http://${this.settings.hostname}:${this.settings.port}`;
  }

  /**
   * Start the OpenCode server process
   * Returns true if successful, false otherwise
   */
  async start(): Promise<boolean> {
    // Already running or starting
    if (this.state === "running" || this.state === "starting") {
      return true;
    }

    this.setState("starting");
    this.lastError = null;
    this.earlyExitCode = null;
    this.stderrBuffer = ""; // Reset stderr buffer

    // Validate project directory
    if (!this.projectDirectory) {
      return this.setError("Project directory (vault) not configured");
    }

    // Check if server is already running on this port
    if (await this.checkServerHealth()) {
      console.log("[OpenCode2Obsidian] Server already running on port", this.settings.port);
      this.setState("running");
      return true;
    }

    // Check if port is in use by another process
    const portInUse = await this.checkPortInUse(this.settings.hostname, this.settings.port);
    if (portInUse) {
      return this.setError(
        `Port ${this.settings.port} is already in use by another process.\n` +
        `Please:\n` +
        `1. Stop the process using port ${this.settings.port}, or\n` +
        `2. Change the port number in settings (e.g., 14097, 14098)`
      );
    }

    console.log("[OpenCode2Obsidian] Starting server:", {
      opencodePath: this.settings.opencodePath,
      port: this.settings.port,
      hostname: this.settings.hostname,
      cwd: this.projectDirectory,
      projectDirectory: this.projectDirectory,
    });

    // Spawn OpenCode server process
    // NOTE: Use user home directory as cwd instead of project directory
    // to ensure OpenCode can access all sessions and settings globally
    const os = require("os");
    const homedir = os.homedir();
    
    this.process = spawn(
      this.settings.opencodePath,
      [
        "serve",
        "--port",
        this.settings.port.toString(),
        "--hostname",
        this.settings.hostname,
        "--cors",
        "app://obsidian.md",
      ],
      {
        cwd: homedir,
        env: { ...process.env },
        stdio: ["ignore", "pipe", "pipe"],
        detached: false,
      }
    );

    console.log("[OpenCode2Obsidian] Process spawned with PID:", this.process.pid);

    // Attach event handlers
    this.process.stdout?.on("data", (data) => {
      console.log("[OpenCode2Obsidian]", data.toString().trim());
    });

    this.process.stderr?.on("data", (data) => {
      const errorText = data.toString().trim();
      console.error("[OpenCode2Obsidian Error]", errorText);
      // Collect stderr output for error messages
      if (errorText) {
        this.stderrBuffer += (this.stderrBuffer ? "\n" : "") + errorText;
      }
    });

    this.process.on("exit", (code, signal) => {
      console.log(`[OpenCode2Obsidian] Process exited with code ${code}, signal ${signal}`);
      this.process = null;

      // Record early exit during startup
      if (this.state === "starting" && code !== null && code !== 0) {
        this.earlyExitCode = code;
      }

      // Update state if was running
      if (this.state === "running") {
        this.setState("stopped");
      }
    });

    this.process.on("error", (err: NodeJS.ErrnoException) => {
      console.error("[OpenCode2Obsidian] Failed to start process:", err);
      this.process = null;

      if (err.code === "ENOENT") {
        this.setError(`Executable not found at '${this.settings.opencodePath}'`);
      } else {
        this.setError(`Failed to start: ${err.message}`);
      }
    });

    // Wait for server to become ready or exit
    const ready = await this.waitForServerOrExit(this.settings.startupTimeout);
    if (ready) {
      this.setState("running");
      return true;
    }

    // Server failed to start
    if (this.state === "error") {
      return false;
    }

    this.stop();
    if (this.earlyExitCode !== null) {
      // Include stderr output if available for better error diagnosis
      let errorMsg = `Process exited unexpectedly (exit code ${this.earlyExitCode})`;
      
      // Check for specific error patterns and provide helpful suggestions
      if (this.stderrBuffer) {
        const stderrLower = this.stderrBuffer.toLowerCase();
        
        // Port conflict detection
        if (stderrLower.includes("failed to start server on port") || 
            stderrLower.includes("port") && stderrLower.includes("already in use")) {
          errorMsg = `Port ${this.settings.port} is already in use.\n\n` +
            `Solutions:\n` +
            `1. Stop the process using port ${this.settings.port}\n` +
            `   (Check with: netstat -ano | findstr "${this.settings.port}")\n` +
            `2. Change the port number in settings (e.g., 14097, 14098)\n` +
            `3. Check if another OpenCode instance is running`;
        } else {
          // Extract the last few lines of stderr for context
          const stderrLines = this.stderrBuffer.split("\n").filter(line => line.trim());
          const lastLines = stderrLines.slice(-3).join("\n");
          if (lastLines) {
            errorMsg += `\n\nError output:\n${lastLines}`;
            
            // Check if log file is mentioned
            const logFileMatch = this.stderrBuffer.match(/log file at ([^\s]+)/i);
            if (logFileMatch) {
              errorMsg += `\n\nFor more details, check the log file:\n${logFileMatch[1]}`;
            }
          }
        }
      }
      
      return this.setError(errorMsg);
    }
    if (!this.process) {
      return this.setError("Process exited before server became ready");
    }
    return this.setError("Server failed to start within timeout");
  }

  /**
   * Stop the OpenCode server process
   * Uses SIGTERM for graceful shutdown, SIGKILL as fallback
   */
  stop(): void {
    if (!this.process) {
      this.setState("stopped");
      return;
    }

    const proc = this.process;
    console.log("[OpenCode2Obsidian] Stopping process with PID:", proc.pid);

    this.setState("stopped");
    this.process = null;

    proc.kill("SIGTERM");

    // Force kill after 2 seconds if still running
    setTimeout(() => {
      if (proc.exitCode === null && proc.signalCode === null) {
        console.log("[OpenCode2Obsidian] Process still running, sending SIGKILL");
        proc.kill("SIGKILL");
      }
    }, 2000);
  }

  /**
   * Set state and notify listeners
   */
  private setState(state: ProcessState): void {
    this.state = state;
    this.onStateChange(state);
  }

  /**
   * Set error state and return false
   */
  private setError(message: string): false {
    this.lastError = message;
    console.error("[OpenCode2Obsidian Error]", message);
    this.setState("error");
    return false;
  }

  /**
   * Check if server is responding to health checks
   */
  private async checkServerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.getUrl()}/global/health`, {
        method: "GET",
        signal: AbortSignal.timeout(2000),
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check if port is in use by attempting to connect
   */
  private async checkPortInUse(hostname: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const net = require("net");
      const socket = new net.Socket();
      
      socket.setTimeout(1000);
      socket.once("connect", () => {
        socket.destroy();
        resolve(true); // Port is in use
      });
      socket.once("timeout", () => {
        socket.destroy();
        resolve(false); // Port is not in use
      });
      socket.once("error", () => {
        resolve(false); // Port is not in use
      });
      
      socket.connect(port, hostname);
    });
  }

  /**
   * Wait for server to become healthy or process to exit
   * Returns true if server is healthy, false if timeout or exit
   */
  private async waitForServerOrExit(timeoutMs: number): Promise<boolean> {
    const startTime = Date.now();
    const pollInterval = 500;

    while (Date.now() - startTime < timeoutMs) {
      // Check if process exited prematurely
      if (!this.process) {
        console.log("[OpenCode2Obsidian] Process exited before server became ready");
        return false;
      }

      // Check server health
      if (await this.checkServerHealth()) {
        return true;
      }

      await this.sleep(pollInterval);
    }

    return false;
  }

  /**
   * Sleep helper for polling
   */
  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
