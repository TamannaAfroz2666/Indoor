import axios from "axios";
import { getLoginUserService, getRegisterUserService, loginUserService, registerUserService } from "../services/auth.service.js";

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
export async function loginController (req, res, next) {
    try {
        const {
            email,
            password,
        } = req.body;

        const data = await loginUserService({
            email,
            password,
        });

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
export async function getLoginController (req, res, next) {
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