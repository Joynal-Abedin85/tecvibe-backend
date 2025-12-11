import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

export const auth = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token; 
    if (!token) throw new Error("Unauthorized not token");
        // console.log("🟦 Cookie Token:", token);


    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    //  console.log("🟩 Decoded Token:", decoded);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) throw new Error("User not found");
    // console.log("🟨 Found User:", user);

    req.user = user;
    next();
  } catch (err: any) {
     console.log("❌ Auth Error:", err.message);
    res.status(401).json({ success: false, message: err.message });
  }
};
