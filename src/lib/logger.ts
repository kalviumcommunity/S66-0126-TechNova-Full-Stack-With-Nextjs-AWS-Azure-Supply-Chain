/**
 * Structured Logging Utility
 * Module 2.22 - Error Handling Middleware
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export interface LogContext {
  userId?: string
  requestId?: string
  method?: string
  path?: string
  statusCode?: number
  duration?: number
  [key: string]: unknown
}

export interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  error?: {
    name: string
    message: string
    stack?: string
    code?: string
  }
}

class Logger {
  private isDevelopment: boolean

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  /**
   * Format log entry for structured logging
   */
  private formatLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
    }

    if (error) {
      logEntry.error = {
        name: error.name,
        message: error.message,
        code: (error as any).code,
        // Only include stack traces in development
        stack: this.isDevelopment ? error.stack : undefined,
      }
    }

    return logEntry
  }

  /**
   * Output log to console (development) or structured log service (production)
   */
  private output(logEntry: LogEntry): void {
    if (this.isDevelopment) {
      // Pretty print in development
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[logEntry.level]

      console.log(
        `${emoji} [${logEntry.level.toUpperCase()}] ${logEntry.message}`
      )

      if (logEntry.context) {
        console.log('Context:', logEntry.context)
      }

      if (logEntry.error) {
        console.error('Error:', logEntry.error)
      }
    } else {
      // Structured JSON logging for production (CloudWatch, etc.)
      console.log(JSON.stringify(logEntry))
    }
  }

  /**
   * Log debug message (development only)
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      const logEntry = this.formatLogEntry(LogLevel.DEBUG, message, context)
      this.output(logEntry)
    }
  }

  /**
   * Log info message
   */
  info(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.INFO, message, context)
    this.output(logEntry)
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: LogContext): void {
    const logEntry = this.formatLogEntry(LogLevel.WARN, message, context)
    this.output(logEntry)
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, context?: LogContext): void {
    const logEntry = this.formatLogEntry(
      LogLevel.ERROR,
      message,
      context,
      error
    )
    this.output(logEntry)
  }

  /**
   * Log HTTP request
   */
  request(method: string, path: string, context?: LogContext): void {
    this.info(`${method} ${path}`, {
      method,
      path,
      ...context,
    })
  }

  /**
   * Log HTTP response
   */
  response(
    method: string,
    path: string,
    statusCode: number,
    duration: number,
    context?: LogContext
  ): void {
    const level =
      statusCode >= 500
        ? LogLevel.ERROR
        : statusCode >= 400
          ? LogLevel.WARN
          : LogLevel.INFO

    const message = `${method} ${path} ${statusCode} - ${duration}ms`

    const logEntry = this.formatLogEntry(level, message, {
      method,
      path,
      statusCode,
      duration,
      ...context,
    })

    this.output(logEntry)
  }

  /**
   * Log database query (development only)
   */
  query(query: string, duration?: number, context?: LogContext): void {
    if (this.isDevelopment) {
      this.debug(`DB Query: ${query}`, {
        duration,
        ...context,
      })
    }
  }
}

// Export singleton instance
export const logger = new Logger()

// Export default
export default logger
