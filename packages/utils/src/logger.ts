// biome-ignore lint/complexity/noStaticOnlyClass: Logger grouping
/**
 * Centralized logging utility to ensure consistent log formatting and handling.
 * Suppresses logs in test environments.
 */
export class Logger {
  /**
   * Sanitizes input to prevent log injection (CRLF injection).
   * Replaces newlines with escaped characters.
   */
  private static sanitize(input: unknown): unknown {
    if (typeof input === 'string') {
      // Use JSON.stringify to safely escape characters including newlines
      // and remove the surrounding quotes to keep it clean if possible,
      // or just keep it as a string representation.
      // Replacing CRLF directly is standard for CWE-117.
      return input.replace(/[\n\r]/g, ''); // Remove newlines entirely or escape them
    }
    return input;
  }

  /**
   * Logs a message with optional metadata.
   *
   * @param message - The primary log message.
   * @param meta - Additional context to log.
   */
  static log(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'test') {
      // biome-ignore lint/suspicious/noConsole: Centralized logging
      console.log('%s', JSON.stringify(message), meta);
    }
  }

  /**
   * Logs an error with optional error object and metadata.
   *
   * @param message - The error message.
   * @param error - The error object or unknown error.
   * @param meta - Additional context to log.
   */
  static error(
    message: string,
    error?: unknown,
    meta?: Record<string, unknown>,
  ) {
    if (process.env.NODE_ENV !== 'test') {
      // biome-ignore lint/suspicious/noConsole: Centralized logging
      console.error('%s', JSON.stringify(message), error, meta);
    }
  }

  /**
   * Logs a warning with optional metadata.
   *
   * @param message - The warning message.
   * @param meta - Additional context to log.
   */
  static warn(message: string, meta?: Record<string, unknown>) {
    if (process.env.NODE_ENV !== 'test') {
      // biome-ignore lint/suspicious/noConsole: Centralized logging
      console.warn('%s', JSON.stringify(message), meta);
    }
  }
}
