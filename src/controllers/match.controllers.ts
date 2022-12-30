import { validate } from "class-validator";
import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import request from "request-promise";
import { Match } from "../entities/Match";
import { USER_STATE } from "../enums/enums";

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

  static validOrRefuseMatch = async (req: Request, res: Response) => {
    const body = req.body;
    const matchRepository = AppDataSource.getRepository(Match);
    const match = await matchRepository
      .findOne({
        where: {
          matchDstId: parseInt(body.userId),
          matchSrcId: parseInt(body.matchSrcId),
        },
      })
      .catch((err) => {
        res.status(400).send(err);
        return;
      });

    if (!match) {
      res.status(400).send("User doesn't have match not found");
      console.error("User doesn't have match not found");
      return;
    }

    if (
      body.matchStatId === USER_STATE.VALIDE ||
      body.matchStatId === USER_STATE.REFUSED
    ) {
      match.matchStatId = body.matchStatId;
      matchRepository.save(match);
      res.send("Match updated !");

      /*       const webhookUrl = `http://localhost:8090/notifications/webhook/${match.matchSrcId}`;
      const options = {
        method: "POST",
        uri: webhookUrl,
        body: {
          message: () => {
            if (body.matchStatId === USER_STATE.VALIDE) {
              return "Votre match a été validé";
            } else {
              return "Votre match a été refusé";
            }
          },
          userId: match.matchSrcId,
        },
        json: true,
      };

       await request
        .post(options)
        .then((response) => {
          res.send("Notification sent successfully");
          console.log("Notification sent successfully");
        })
        .catch((err) => {
          res.json(err);
          console.error(err);
        });
      return;  */
    } else {
      res.status(400).send("Match STATE not valide");
      return;
    }
  };
}
