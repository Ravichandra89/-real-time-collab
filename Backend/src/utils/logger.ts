import { createWriteStream } from "fs";
import { join } from "path";
import { Writable } from "stream";

// Log levels
export enum logLevels {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

export interface config {
  logFilePath: string;
  consoleOutput: boolean;
}

const defaultConfig: config = {
  logFilePath: join(__dirname, "../../logs/app.log"),
  consoleOutput: true,
};

let logStream: WritableStream;
let config: config = { ...defaultConfig };

export const initializeLogger = (
  customConfig: Partial<config> = {}
): void => {
  if (!logStream) {
    config = { ...defaultConfig, ...customConfig };
    logStream  = createWriteStream(config.logFilePath, { flags: "a" });
  }
};

/**
 * Function to write the logs for all log Levels
 */

const writeLog = (level: logLevels, message: string, ...args: any[]) : void => {
    if (!logStream) {
        initializeLogger();
    }

    const timestamp = new Date().toISOString();
    const data = args.length ? JSON.stringify(args) : "";
    const logMessage = `[${timestamp}] [${level}] ${message} ${data}\n`;

    logStream.(logMessage);

    if (config.consoleOutput) {
        console.log(logMessage.trim());
      }
};

export const logInfo = (message: string, ...args: any[]) : void => {
    writeLog(logLevels.INFO, message, ...args);
};

export const logWarn = (message: string, ...args: any[]) : void => {
    writeLog(logLevels.WARN, message, ...args);
};

export const logError = (message: string, ...args: any[]) : void => {
    writeLog(logLevels.ERROR, message, ...args);
};

export const logDebuge = (message: string, ...args: any[]) : void => {
    writeLog(logLevels.DEBUG, message, ...args);
};

