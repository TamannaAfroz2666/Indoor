import bcrypt from "bcrypt";
import { findUserByPhone, createUser, findUserByEmailInsensitive, getRegisteredUsers, getLoginUsers } from "../models/auth.model.js";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { SESSION_DURATION_SECONDS } from "../config/auth-session.js";


// @ts-ignore
export async function registerUserService(payload) {
  const {
    name,
    phone,
    email,
    password,
    accountType,
  } = payload;
  const normalizedEmail = email?.trim().toLowerCase();

  if (normalizedEmail) {
    const existingEmail = await findUserByEmailInsensitive(normalizedEmail);

    if (existingEmail) {
      const error = new Error("Email already registered");
      // @ts-ignore
      error.statusCode = 409;
      throw error;
    }
  }

  if (phone) {
    const existingPhone = await findUserByPhone(phone);

    if (existingPhone) {
      const error = new Error("Phone number already registered");
      // @ts-ignore
      error.statusCode = 409;
      throw error;
    }
  }

  const passwordHash = await bcrypt.hash(password, 12);

  return createUser({
    name,
    phone,
    email: normalizedEmail,
    passwordHash,
    accountType,
    authProvider: "EMAIL",
  });
}


export async function getRegisterUserService() {
  const users = await getRegisteredUsers();

  return users;
}
export async function getLoginUserService() {
  const users = await getLoginUsers();

  return users;
}





// @ts-ignore

export async function loginUserService({ email, password }) {
  const user = await findUserByEmailInsensitive(email.trim().toLowerCase());

  if (!user) {
    const error = new Error("Invalid email or password");
    // @ts-ignore
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    // @ts-ignore
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    {
      userId: user.id,
      accountType: user.accountType,
    },
    env.jwtSecret,
    {
      expiresIn: SESSION_DURATION_SECONDS,
    }
  );

  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}
