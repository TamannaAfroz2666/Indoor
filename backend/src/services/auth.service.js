import bcrypt from "bcrypt";
import { findUserByPhone, createUser, findUserByEmail, getRegisteredUsers, getLoginUsers } from "../models/auth.model.js";
import jwt from "jsonwebtoken";


// @ts-ignore
export async function registerUserService(payload) {
  const {
    name,
    phone,
    email,
    password,
    accountType,
  } = payload;

  if (email) {
    const existingEmail = await findUserByEmail(email);

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
    email,
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
  const user = await findUserByEmail(email);

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

  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing");
  }

  const token = jwt.sign(
    {
      userId: user.id,
      accountType: user.accountType,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  const { passwordHash, ...safeUser } = user;

  return {
    user: safeUser,
    token,
  };
}
