import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../init/config";

export interface DecodedToken {
  [key: string]: any;
}

export const checkJwtCookies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;

  if (!token) {
    return res.sendStatus(403);
  }

  try {
    jwt.verify(token, config.jwt, (err: Error, decoded: DecodedToken) => {
      if (err) {
        throw new Error("Forbidden");
      }
      req.body.userId = decoded.user.userId;
    });
    /*     req.body.userId = data.userId;
    req.body.userRole = data.role; */
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
