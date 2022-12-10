//import { connect } from "../db/app-data-source";
import { Request, Response } from "express";
import { resolve } from "path";
import { AppDataSource } from "../db/app-data-source";
import { User } from "../entities/User";

export const  find = async (req: Request, res: Response) => {
const userRepository = AppDataSource.getRepository(User)

const user = await userRepository.findOne({where: {userId : 1}}).catch((err)=>{
  console.log(err)
})
if(user){
  console.log(user, user.matches, user.matches2)
  res.json(user)
}
}
