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