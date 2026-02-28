import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export function securityMiddleware() {
  return [
    // security headers
    helmet({
      contentSecurityPolicy: false,
    }),

    // global rate limiter
    rateLimit({
      windowMs: 60_000, // 1 minute
      max: 120, // max requests per IP per window
      standardHeaders: true,
      legacyHeaders: false,
    })
  ];
};
