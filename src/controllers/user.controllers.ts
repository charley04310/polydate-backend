//import { connect } from "../db/app-data-source";
import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import { UpdateUserDTO, User } from "../entities/User";
import { validate } from "class-validator";
import { USER_ROLE } from "../enums/enums";

export class UserController extends BaseEntity {
  static findOneUserById = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userId: parseInt(req.params.id) } })
      .catch((err) => {
        res.status(400).json(err);
      });
    if (user) {
      res.json(user);
    } else {
      res.status(400).json("user does'not exist");
    }
  };

  static findOneUserByMail = async (email: string, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userEmail: email } })
      .catch((err) => {
        res.status(400).json(err);
      });
    if (user) {
      console.log(user);
      //console.log(user.userEmail, user.userPassword);
      //  const userImage = await user.images
      return user;
    } else {
      res.status(400).json("user does'not exist");
    }
  };
  static findAllUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const allUser = await userRepository.find().catch((err) => {
      console.log(err);
    });
    if (allUser) {
      console.log(allUser);
      res.json(allUser);
    }
  };
  static createUser = async (req: Request, res: Response) => {
    const newUser = new User();
    let body = req.body;

    newUser.userFirstname = body.userFirstname;
    newUser.userLastname = body.userLastname;
    newUser.userCity = body.userCity;
    newUser.userEmail = body.userEmail;
    newUser.userPassword = User.setPassword(body.userPassword);
    newUser.userGenreId = parseInt(body.userGenreId);
    newUser.userIciPourId = parseInt(body.userIciPourId);

    const errors = await validate(newUser);

    if (errors.length > 0) {
      res.status(401).send("validation failed. errors: " + errors);
    } else {
      const user = AppDataSource.getRepository(User).create(newUser);
      const results = AppDataSource.getRepository(User).save(user);

      return res.send(results);
    }
  };
  static updateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userId: parseInt(body.userId) } })
      .catch((err) => {
        res.status(400).json(err);
      });

    if (!user) {
      console.error("User not found");
      return;
    }
    user.userFirstname = body.userFirstname;
    user.userLastname = body.userLastname;
    user.userCity = body.userCity;
    user.userGenreId = parseInt(body.userGenreId);
    user.userIciPourId = parseInt(body.userIciPourId);

    const errors = await validate(user);
    if (errors.length > 0) {
      // There are validation errors
      res.status(400).json(errors);
      return;
    }
    await userRepository.save(user);

    console.log("User updated successfully");
    res.json("User updated successfully");
  };
}
