import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as authModel from '../models/auth.model.js';

export class AuthError extends Error {
  /** @param {string} message @param {number} status */
  constructor(message, status = 400) { super(message); this.status = status; }
}

/** @param {string} email */
function normalizeEmail(email) { return email.trim().toLowerCase(); }

/** @param {import('@prisma/client').User} user */
function publicUser(user) {
  return {
    id: user.id, email: user.email, phone: user.phone, name: user.name,
    avatar: user.avatar, accountType: user.accountType,
    emailVerified: user.emailVerified, phoneVerified: user.phoneVerified,
  };
}

/** @param {string} userId */
export function createSessionToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '7d', issuer: 'indoor-api' });
}

/** @param {{name: string, phone: string, email: string, password: string, accountType: 'USER'|'VENUE_OWNER'}} input */
export async function register({ name, phone, email: rawEmail, password, accountType }) {
  const email = normalizeEmail(rawEmail);
  if (await authModel.findUserByEmail(email)) throw new AuthError('An account with this email already exists', 409);
  if (await authModel.findUserByPhone(phone)) throw new AuthError('An account with this phone number already exists', 409);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await authModel.createUser({ name, phone, email, passwordHash, accountType });
  return { user: publicUser(user), token: createSessionToken(user.id) };
}

/** @param {string} rawEmail @param {string} password */
export async function login(rawEmail, password) {
  const user = await authModel.findUserByEmail(normalizeEmail(rawEmail));
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new AuthError('Invalid email or password', 401);
  }
  return { user: publicUser(user), token: createSessionToken(user.id) };
}
