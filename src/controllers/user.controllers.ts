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
        res.status(500).json(err);
      });
    if (user) {
      await user.images;
      console.log(user);
      return res.json(user);
    } else {
      res.status(404).json("user does'not exist");
    }
  };
  static findOneUserByMail = async (email: string, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { userEmail: email } });

    if (user instanceof User) {
      return user;
    } else {
      return false;
    }
  };

  static findAllUser = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const allUser = await userRepository.find().catch((err) => {
      res.status(500).json(err);
    });
    if (allUser) {
      res.status(200).json(allUser);
    }
  };

  static createUser = async (req: Request, res: Response) => {
    const newUser = new User();
    let body = req.body;
    if (body.userRoleId) return res.status(401).send("pas autorisé");
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

    const isStudentMail = (val: string) => {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@etu\.montpellier\.fr$/;
      return regex.test(val);
    };

    if (!isStudentMail(newUser.userEmail)) {
      return res
        .status(401)
        .send(
          "Vous devez utiliser une adresse mail étudiante pour vous inscrire"
        );
    }
    if (errors.length > 0) {
      console.log("errors: ", errors);
      res.status(401).send(errors);
    } else {
      const user = AppDataSource.getRepository(User).create(newUser);
      AppDataSource.getRepository(User).save(user);
      res.status(200).send("user created");
    }
  };
  static updateUser = async (req: Request, res: Response) => {
    const body = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository
      .findOne({ where: { userId: parseInt(body.userId) } })
      .catch((err) => {
        console.log(err);
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
    res.status(200).json("User updated successfully");
    return;
  };

  static banOrUnBanUser = async (req: Request, res: Response) => {
    const body = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { userId: parseInt(req.params.id) },
    });
    if (!user) {
      res.status(400).json("User not found");
    }
    user.userStatId = body.userStatId;
    await userRepository.save(user);

    res.json("User state updated successfully");
  };

  static handleProfileUserImage = async (req: Request, res: Response) => {
    const body = req.body;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { userId: parseInt(body.userId) },
    });

    if (!user) {
      res.status(400).json("User images not found");
      return;
    }
    await userRepository.save(user);
    res.json("Image updated successfully");
  };

  static getRandomUserByGenre = async (req: Request, res: Response) => {
    const userRepository = AppDataSource.getRepository(User);
    const userId = req.params.iduser;
    const user = await userRepository
      .createQueryBuilder("user")
      .select([
        "user.userId",
        "user.userFirstname",
        "user.userLastname",
        "user.userCity",
        "user.userDescription",
        "user.userSchoolId",
        "user.userIciPourId",
        "user.userGenreId",
      ])
      .where("user.userId != :userId", { userId })
      .andWhere("user.userGenreId = :userGenreId", {
        userGenreId: parseInt(req.params.id),
      })
      .andWhere(
        "user.user_id NOT IN (SELECT match.match_dst_id FROM `match` WHERE match.match_src_id = :matchSrcId)",
        { matchSrcId: userId }
      )
      .andWhere(
        "user.user_id NOT IN (SELECT match.match_src_id FROM `match` WHERE match.match_dst_id = :matchDstId)",
        { matchDstId: userId }
      )
      .orderBy("RAND()")
      .take(1)
      .getOne();

    try {
      const images = await user.images;
      if (images) {
        await user.images;
      }
      console.log(user);
      res.json(user);
    } catch (e) {}
  };
}
