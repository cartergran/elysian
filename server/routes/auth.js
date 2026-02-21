import { Router } from 'express';
import { randomUUID } from 'crypto';

import { MESSAGES } from '../constants/messages.js';

export const tokenStore = new Set();
export const BEARER_PREFIX = 'Bearer ';

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const validUsername = process.env.AUTH_USERNAME;
  const validPassword = process.env.AUTH_PASSWORD;

  if (!validUsername || !validPassword) {
    console.error('AUTH_USERNAME or AUTH_PASSWORD environment variables are not set.');
    return res.status(500).json({ detail: MESSAGES.SERVER_AUTH_CONFIG_ERROR });
  }

  if (username !== validUsername || password !== validPassword) {
    return res.status(401).json({ detail: MESSAGES.INVALID_USERNAME_OR_PASSWORD });
  }

  const token = randomUUID();
  tokenStore.add(token);
  return res.json({ token });
});

router.post('/logout', (req, res) => {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith(BEARER_PREFIX)) {
    const token = authHeader.slice(BEARER_PREFIX.length);
    tokenStore.delete(token);
  }
  return res.status(200).json({ message: MESSAGES.LOGGED_OUT });
});

export default router;
