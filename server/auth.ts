import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Secret for signing JWT admin session tokens
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'portfolio-admin-fallback-secret-key-2026';

// Rate limiting map: IP -> { attempts: number, lockUntil: number }
const loginAttempts = new Map<string, { attempts: number; lockUntil: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    return { allowed: true };
  }

  if (record.lockUntil > now) {
    const waitSeconds = Math.ceil((record.lockUntil - now) / 1000);
    return { allowed: false, waitSeconds };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    // Reset after lockout expires
    loginAttempts.delete(ip);
  }

  return { allowed: true };
}

export function recordLoginFailure(ip: string): void {
  const now = Date.now();
  const record = loginAttempts.get(ip) || { attempts: 0, lockUntil: 0 };
  record.attempts += 1;

  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_PERIOD_MS;
  }

  loginAttempts.set(ip, record);
}

export function recordLoginSuccess(ip: string): void {
  loginAttempts.delete(ip);
}

export function verifyAdminPassword(password: string): boolean {
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  // If password hash is configured, verify using bcrypt
  if (passwordHash && passwordHash.trim().length > 0) {
    try {
      return bcrypt.compareSync(password, passwordHash.trim());
    } catch (err) {
      console.error('Password hash comparison error:', err);
      return false;
    }
  }

  // Fallback default password when running without env hash configured ('admin123')
  // We log a warning so the owner is prompted to set ADMIN_PASSWORD_HASH
  console.warn('⚠️ ADMIN_PASSWORD_HASH not set in .env. Using fallback admin credentials.');
  return password === 'admin123';
}

export function generateSessionToken(): string {
  return jwt.sign({ role: 'admin', iat: Math.floor(Date.now() / 1000) }, JWT_SECRET, {
    expiresIn: '7d',
  });
}

export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
    return;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { role: string };
    if (decoded.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
      return;
    }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Session expired or invalid' });
  }
}
