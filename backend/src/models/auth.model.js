// @ts-nocheck
import { prisma } from "../config/prisma.js";

// import prisma from "../config/prisma.js";

export async function findUserByEmail(email) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function findUserByPhone(phone) {
  return prisma.user.findUnique({
    where: { phone },
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      phone: true,
      email: true,
      avatar: true,
      accountType: true,
      authProvider: true,
      emailVerified: true,
      phoneVerified: true,
      createdAt: true,
    },
  });
}

export async function getRegisteredUsers() {
  return prisma.user.findMany({
    omit: {
      passwordHash: true,
    },
  });
} 

export async function getLoginUsers() {
  return prisma.user.findMany();
} 

const safeUserSelect = {
  id: true,
  name: true,
  phone: true,
  email: true,
  avatar: true,
  accountType: true,
  authProvider: true,
  emailVerified: true,
  phoneVerified: true,
  createdAt: true,
  updatedAt: true,
};

export function findSafeUserById(id) {
  return prisma.user.findUnique({ where: { id }, select: safeUserSelect });
}

export function updateUserAvatar(id, avatar) {
  return prisma.user.update({
    where: { id },
    data: { avatar },
    select: safeUserSelect,
  });
}
