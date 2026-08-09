import { prisma } from '../config/prisma.js';

/** @param {string} email */
export function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

/** @param {string} phone */
export function findUserByPhone(phone) {
  return prisma.user.findUnique({ where: { phone } });
}

/** @param {{email: string, phone: string, name: string, passwordHash: string, accountType: 'USER'|'VENUE_OWNER'}} data */
export function createUser(data) {
  return prisma.user.create({
    data: {
      email: data.email,
      phone: data.phone,
      name: data.name,
      passwordHash: data.passwordHash,
      accountType: data.accountType,
      authProvider: 'EMAIL',
    },
  });
}
