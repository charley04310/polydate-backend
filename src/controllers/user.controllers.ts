//import { connect } from "../db/app-data-source";
import { Request, Response } from "express";
import { AppDataSource } from "../db/app-data-source";
import { User } from "../entities/User";

export const findOneById = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository
    .findOne({ where: { userId: parseInt(req.params.id) } })
    .catch((err) => {
      console.log(err);
    });
  if (user) {
    console.log(user, await user.images);
    //  const userImage = await user.images
    res.json(user);
  }
};

export const findAll = async (req: Request, res: Response) => {
  const userRepository = AppDataSource.getRepository(User);
  const allUser = await userRepository.find().catch((err) => {
    console.log(err);
  });
  if (allUser) {
    console.log(allUser);
    res.json(allUser);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const user = AppDataSource.getRepository(User).create(req.body);

  const results = await AppDataSource.getRepository(User)
    .save(user)
    .catch((err) => {
      console.log(err);
    });
  return res.send(results);
};
