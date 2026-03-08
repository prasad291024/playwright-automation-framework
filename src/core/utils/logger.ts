/**
 * Structured Logger Utility
 * Provides consistent logging across the test framework
 */

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  PASS = 'PASS',
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: Record<string, unknown>;
}

class Logger {
  private logs: LogEntry[] = [];
  private minLevel: LogLevel = LogLevel.INFO;

  constructor(minLevel: LogLevel = LogLevel.INFO) {
    this.minLevel = minLevel;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private log(level: LogLevel, message: string, context?: string, data?: Record<string, unknown>): void {
    const entry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      context,
      data,
    };

    this.logs.push(entry);
    this.printLog(entry);
  }

  private printLog(entry: LogEntry): void {
    const timestamp = entry.timestamp.split('T')[1].split('.')[0];
    const contextStr = entry.context ? ` [${entry.context}]` : '';
    const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';

    const logMessage = `[${timestamp}] ${entry.level}${contextStr} - ${entry.message}${dataStr}`;

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(`❌ ${logMessage}`);
        break;
      case LogLevel.WARN:
        console.warn(`⚠️  ${logMessage}`);
        break;
      case LogLevel.PASS:
        console.log(`✅ ${logMessage}`);
        break;
      case LogLevel.DEBUG:
        console.debug(`🔍 ${logMessage}`);
        break;
      default:
        console.log(`ℹ️  ${logMessage}`);
    }
  }

  error(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context, data);
  }

  warn(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context, data);
  }

  info(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context, data);
  }

  debug(message: string, context?: string, data?: Record<string, unknown>): void {
    if (process.env.DEBUG === 'true') {
      this.log(LogLevel.DEBUG, message, context, data);
    }
  }

  pass(message: string, context?: string, data?: Record<string, unknown>): void {
    this.log(LogLevel.PASS, message, context, data);
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }

  exportAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

// Create singleton instance
export const logger = new Logger();
