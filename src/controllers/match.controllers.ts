import { validate } from "class-validator";
import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import { Match } from "../entities/Match";

export class MatchController extends BaseEntity {
  // #TODO: SE CONNECTER

  static async startMatch(req: Request, res: Response) {
    const newMatch = new Match();
    let body = req.body;

    newMatch.matchSrcId = body.userId;
    newMatch.matchDstId = body.matchDstId;
    newMatch.matchTypeId = body.matchTypeId;

    const errors = await validate(newMatch);

    if (errors.length > 0) {
      res.status(400).send("validation failed. errors: " + errors);
    } else {
      const Image = AppDataSource.getRepository(Match).create(newMatch);
      const results = AppDataSource.getRepository(Match).save(Image);

      return res.send(results);
    }
  }
}
