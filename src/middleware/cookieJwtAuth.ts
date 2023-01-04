import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import config from "../init/config";
import { USER_ROLE } from "../enums/enums";

export interface DecodedToken {
  [key: string]: any;
}

export const checkJwtCookies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.tokenPolydate;

  if (!token) {
    console.log("token not found");
    return res.sendStatus(403);
  }

  try {
    jwt.verify(token, config.jwt, (err: Error, decoded: DecodedToken) => {
      if (err) {
        throw new Error("Forbidden");
      }
      req.body.userId = decoded.user.userId;
      req.body.userRoleId = decoded.user.userRoleId;
    });
    /*     req.body.userId = data.userId;
    req.body.userRole = data.role; */
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

export const checkIsAdminJwtCookies = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.tokenPolydate;

  if (!token) {
    console.log("token not found");
    return res.sendStatus(403);
  }

  try {
    jwt.verify(token, config.jwt, (err: Error, decoded: DecodedToken) => {
      if (err) {
        throw new Error("Forbidden");
      }
      if (decoded.user.userRoleId === USER_ROLE.ADMIN) {
        req.body.userId = decoded.user.userId;
        req.body.userRoleId = decoded.user.userRoleId;
      } else {
        throw new Error(
          "vous de possédez pas les droits d'accés a cette route"
        );
      }
    });
    /*     req.body.userId = data.userId;
    req.body.userRole = data.role; */
    return next();
  } catch {
    return res.sendStatus(403);
  }
};
