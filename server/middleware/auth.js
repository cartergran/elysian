import { BEARER_PREFIX, tokenStore } from '../routes/auth.js';
import { MESSAGES } from '../constants/messages.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
    return res.status(401).json({ detail: MESSAGES.UNAUTHORIZED });
  }
  const token = authHeader.slice(BEARER_PREFIX.length);
  if (!tokenStore.has(token)) {
    return res.status(401).json({ detail: MESSAGES.UNAUTHORIZED });
  }
  next();
};

export default authMiddleware;
