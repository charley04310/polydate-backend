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
    try {
      const userExist = await UserController.findOneUserByMail(
        emailToCheck,
        res
      );
      if (userExist === undefined) {
        throw new Error("Mail incorrect");
      }
      if (userExist.userStatId != USER_STATE.VALIDE) {
        throw new Error("Interdit");
      }
      // return true si le password et similaire
      const pwdIsSimilar = await bcrypt.compare(
        passwordToCheck,
        userExist.userPassword
      );

      if (!pwdIsSimilar) {
        throw new Error("Password incorrect");
      }

      let user: ICreateToken = {
        userEmail: emailToCheck,
        userPassword: passwordToCheck,
        userId: userExist.userId,
      };

      let token = User.generateToken(user);
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .status(200)
        .json({ message: "Logged in successfully 😊 👌" });

      console.log(token);
    } catch (err) {
      res.status(400).json(err);
    }
  }
}
