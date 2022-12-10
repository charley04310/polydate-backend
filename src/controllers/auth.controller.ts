import * as jwt from "jsonwebtoken";
import config from "../init/config";
//import { connect } from "../db/app-data-source";
import { Request, Response } from "express";

export class AuthControl {
  // #TODO: SE CONNECTER

  static async login(req: Request, res: Response) {
    /*  const conn = await connect();
    const [rows, field] = await conn.query(
      "SELECT `user_email`, `user_password` FROM `user` WHERE `user_id`= 1"
    );

    console.log(rows);
 */
    /*    if(Array.isArray(rows) && rows.length == 0) {
        if (rows.user_email && rows[0].user_password) {
          const token = this.generateToken(user);
          console.log(token);
      } */
    /*        for (let i=0; i < rows.length; i++) {
      if (rows.res.user_email && user.user_password) {
        const token = this.generateToken(user);
        console.log(token);
    } 
 */
    /*  if (rows.user_email && user.user_password) {
      const token = this.generateToken(user);
      console.log(token);
    } */
  }
  /* 
  static changePassword = async (req: Request, res: Response) => {
    const conn = await connect();
    const users = await conn.query("SELECT * FROM `user`");
    res.json(users);
  }; */

  static generateToken(user: any) {
    return jwt.sign(user, this.isSecretKeyDefined(), { expiresIn: 86400 });
  }

  static isSecretKeyDefined(): string {
    if (config.jwt != undefined) {
      return config.jwt;
    }
    return "M?Y@R%!#!ES:%C#UE@SECR#IIET!";
  }
}

export default AuthControl;
