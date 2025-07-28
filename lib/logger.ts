type LogLevel = 'info' | 'warn' | 'error' | 'debug';

export const logger = {
  info: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[INFO] ${message}`, data || '');
    }
  },

  warn: (message: string, data?: any) => {
    console.warn(`[WARN] ${message}`, data || '');
  },

  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error || '');

    // In production, you might want to send to external service
    if (process.env.NODE_ENV === 'production') {
      // Send to logging service like Sentry, LogRocket, etc.
    }
  },

  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '');
    }
  },
};
