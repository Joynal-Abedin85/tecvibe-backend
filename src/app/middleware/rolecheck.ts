import { Request, Response, NextFunction } from "express";

export const roleCheck = (allowedRoles: string[]) => {
  return (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized: No user data found",
        });
      }

      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: "Forbidden: You do not have permission",
        });
      }

      next();
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    }
  };
};
