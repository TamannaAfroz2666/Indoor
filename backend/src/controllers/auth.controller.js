// @ts-nocheck
import axios from "axios";
import { getLoginUserService, getRegisterUserService, loginUserService, registerUserService } from "../services/auth.service.js";
import { findSafeUserById, findUserByEmailInsensitive, updateUserAvatar, updateUserProfile } from "../models/auth.model.js";

const sessionCookie = {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
};

// @ts-ignore
export async function registerController(req, res, next) {
    try {
        const {
            name,
            phone,
            email,
            password,
            accountType,
        } = req.body;

        const data = await registerUserService({
            name,
            phone,
            email,
            password,
            accountType,
        });

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            data,
        });
    } catch (err) {
        next(err);
    }
}

// @ts-ignore
export async function getRegisterController(req, res, next) {
    try {
        const data = await getRegisterUserService();

        return res.status(201).json({
            success: true,
            //   message: "Account created successfully",
            data,
        });
    } catch (err) {
        next(err);
    }
}

// @ts-ignore
export async function loginController(req, res, next) {
    try {
        const {
            email,
            password,
        } = req.body;

        const data = await loginUserService({
            email,
            password,
        });

        res.cookie("indoor_session", data.token, sessionCookie);

        return res.status(201).json({
            success: true,
            message: "Login successfully",
            data,

        });
    } catch (err) {
        next(err);
    }
}

// @ts-ignore
export async function getLoginController(req, res, next) {
    try {
        const data = await getLoginUserService();

        return res.status(201).json({
            success: true,
            //   message: "Account created successfully",
            data,
        });
    } catch (err) {
        next(err);
    }
}

export async function meController(req, res, next) {
    try {
        const user = await findSafeUserById(req.userId);
        if (!user) return res.status(401).json({ error: "Authentication required" });
        return res.json({ success: true, data: { user } });
    } catch (err) {
        next(err);
    }
}

export async function updateAvatarController(req, res, next) {
    try {
        const { avatar } = req.body;

        if (
            avatar !== null &&
            (typeof avatar !== "string" ||
                !/^data:image\/(jpeg|png|webp);base64,/.test(avatar))
        ) {
            return res.status(400).json({
                error: "Avatar must be a JPG, PNG, or WebP image",
            });
        }

        const user = await updateUserAvatar(req.userId, avatar);

        return res.json({
            success: true,
            data: { user },
        });
    } catch (err) {
        next(err);
    }
}

export async function updateProfileController(req, res, next) {
    try {
        const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
        const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
        const avatar = req.body.avatar;

        if (name.length < 2 || name.length > 100) {
            return res.status(400).json({ error: "Name must be between 2 and 100 characters" });
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ error: "Enter a valid email address" });
        }
        if (avatar !== null && (typeof avatar !== "string" || !/^data:image\/(jpeg|png|webp);base64,/.test(avatar))) {
            return res.status(400).json({ error: "Avatar must be a JPG, PNG, or WebP image" });
        }
   

        const existingUser = await findUserByEmailInsensitive(email);
        if (existingUser && existingUser.id !== req.userId) {
            return res.status(409).json({ error: "That email is already used by another account" });
        }

        const user = await updateUserProfile(req.userId, { name, email, avatar });
        return res.json({ success: true, data: { user } });
    } catch (err) {
        if (err?.code === "P2002") {
            return res.status(409).json({ error: "That email is already used by another account" });
        }
        next(err);
    }
}

export function logoutController(req, res) {
    res.clearCookie("indoor_session", { ...sessionCookie, maxAge: undefined });
    return res.json({ success: true, data: { message: "Logged out" } });
}
