//import { connect } from "../db/app-data-source";
import { Request, Response } from "express";
import { Any, BaseEntity, In, Not } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import { User } from "../entities/User";
import { notContains, validate } from "class-validator";

let userRandomIndex: number | undefined = undefined;
export class UserController extends BaseEntity {
  static findOneUserById = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userId: parseInt(req.params.id) } })
      .catch((err) => {
        res.status(400).json(err);
      });
    if (user) {
      const image = await user.images;
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
      //console.log(user);
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
      //console.log(allUser);

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
    newUser.userDescription = body.userDescription;
    newUser.userPassword = User.setPassword(body.userPassword);
    newUser.userGenreId = parseInt(body.userGenreId);
    newUser.userSchoolId = parseInt(body.userSchoolId);
    newUser.userIciPourId = parseInt(body.userIciPourId);
    const errors = await validate(newUser);

    if (errors.length > 0) {
      console.log("errors: ", errors);
      return res.status(400).send(errors);
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
      res.status(400).json("User not found");
      return;
    }

    user.userFirstname = body.userFirstname;
    user.userLastname = body.userLastname;
    user.userCity = body.userCity;
    user.userEmail = body.userEmail;
    user.userDescription = body.userDescription;
    user.userGenreId = parseInt(body.userGenreId);
    user.userSchoolId = parseInt(body.userSchoolId);
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
    return;
  };

  static banOrUnBanUser = async (req: Request, res: Response) => {
    const body = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userId: parseInt(req.params.id) } })
      .catch((err) => {
        res.status(400).json(err);
      });

    if (!user) {
      console.error("User not found");
      return;
    }
    user.userStatId = body.userStatId;
    await userRepository.save(user);

    console.log("User state updated successfully");
    res.json("User state updated successfully");
    return;
  };

  static handleProfileUserImage = async (req: Request, res: Response) => {
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

    //user.userProfilImage = body.userImageLink;
    await userRepository.save(user);
    res.json("Image updated successfully");
  };

  static getRandomUserByGenre = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.params.iduser;
    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.userId != :userId", { userId })
      .andWhere("user.userGenreId = :userGenreId", {
        userGenreId: parseInt(req.params.id),
      })
      .andWhere(
        "user.user_id NOT IN (SELECT match.match_dst_id FROM `match` WHERE match.match_src_id = :matchSrcId)",
        { matchSrcId: userId }
      )
      .orderBy("RAND()") // order the results randomly
      .take(1) // only take one result
      .getOne();

    /* 
    if (user.length === 0) {
      res
        .status(404)
        .json({ message: "No users with the desired genre found" });
      return;
    } */

    /*     let randomIndex = Math.floor(Math.random() * user.length);

    if (userRandomIndex === randomIndex) {
      if (randomIndex === user.length) {
        randomIndex = randomIndex - 1;
      } else {
        randomIndex = randomIndex + 1;
      }
    }
    const randomUser = user[randomIndex]; */
    await user.images;

    //const image = await user[randomIndex].images;
    //console.log(user);
    res.json(user);
  };
}
