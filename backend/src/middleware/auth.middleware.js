// @ts-nocheck
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  const token = req.cookies?.indoor_session;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const payload = jwt.verify(token, secret);
    req.userId = payload.userId;
    next();
  } catch {
    return res.status(401).json({ error: "Authentication required" });
  }
}
