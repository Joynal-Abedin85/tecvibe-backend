import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma";

export const auth = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  (async () => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      if (!token) throw new Error("Unauthorized");

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) throw new Error("User not found");

      req.user = user;
      next();
    } catch (err: any) {
      res.status(401).json({ success: false, message: err.message });
    }
  })();
};

