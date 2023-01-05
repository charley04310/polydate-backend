import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import bcrypt from "bcrypt";
import { ICreateToken, User } from "../entities/User";
import { UserController } from "./user.controllers";
import { USER_STATE } from "../enums/enums";

export class AuthController extends BaseEntity {
  // #TODO: SE CONNECTER

  static async login(req: Request, res: Response) {
    let emailToCheck: string = req.body.userEmail;
    let passwordToCheck: string = req.body.userPassword;

    const userExist = await UserController.findOneUserByMail(emailToCheck, res);
    if (userExist === false) return;

    if (userExist === undefined) {
      res.status(400).json("User not found");
      return;
    }
    if (userExist.userStatId != USER_STATE.VALIDE) {
      res.status(401).json("Pas autorisé");
      return;
    }

    const pwdIsSimilar = await bcrypt.compare(
      passwordToCheck,
      userExist.userPassword
    );

    if (!pwdIsSimilar) {
      res.status(400).json("Wrong password");
      return;
    }

    let userToken: ICreateToken = {
      userEmail: emailToCheck,
      userPassword: passwordToCheck,
      userRoleId: userExist.userRoleId,
      userId: userExist.userId,
    };

    let token = User.generateToken(userToken);
    res

      .cookie("tokenPolydate", token, {
        secure: false,
        httpOnly: true,
        expires: new Date(Date.now() + 14400000), // 4 hours in milliseconds
        sameSite: "strict",
      })

      .send({
        message: "Logged in successfully 😊 👌",
        user: {
          userId: userExist.userId,
          userEmail: userExist.userEmail,
          userFirstname: userExist.userFirstname,
          userRoleId: userExist.userRoleId,
        },
      });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie("tokenPolydate").send("Logged out successfully 😊 👌");
  }
}
