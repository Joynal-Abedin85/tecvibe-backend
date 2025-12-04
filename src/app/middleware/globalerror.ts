import { NextFunction, Request, Response } from "express";

import httpStatus from "http-status";

const globalerrorhandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statuscode = httpStatus.INTERNAL_SERVER_ERROR;
  let success = false;
  let message = err.message || "something went wrong";

  let error = err;

  res.status(statuscode).json({ success, message, error });
};

export default globalerrorhandler;
