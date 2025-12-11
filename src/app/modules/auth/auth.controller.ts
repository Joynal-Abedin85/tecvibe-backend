import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchasync";
import { authservice } from "./auth.service";
import { success } from "zod";
import sendResponse from "../../middleware/sendresponse";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.register(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Register successful",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authservice.login(req.body);

    res.cookie("token", result.token, {
    httpOnly: true,
    secure: false, // production এ true
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "login success",
    data: result,
  });
});

const googlelogin = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  const result = await authservice.googlelogin(token);

    // Cookie set
  res.cookie("token",result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "success google login",
    data: result,
  });
});

export const getMe = catchAsync(async (req: any, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "success  get",
    data: req.user,
  });
});

export const logoutUser = catchAsync(async (req: Request, res: Response) => {

    res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Logout successful",
  });
});


export const authcontroller = {
  register,
  login,
  googlelogin,
  getMe,
  logoutUser
};
