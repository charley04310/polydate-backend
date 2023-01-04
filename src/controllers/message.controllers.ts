import { validate } from "class-validator";
import { Request, Response } from "express";
import { BaseEntity, Not } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import request from "request-promise";
import { Match } from "../entities/Match";
import { USER_STATE } from "../enums/enums";
import { Message } from "../entities/Message";
import { MatchController } from "./match.controllers";
export class MessageControllers extends BaseEntity {
  // #TODO: SE CONNECTER

  static async sendMessage(req: Request, res: Response) {
    const newMessage = new Message();
    const body = req.body;
    const isMatch = await MatchController.getMatch(
      parseInt(body.userId),
      parseInt(body.userDstId)
    );

    if (!isMatch) {
      res.status(400).send("User doesn't have match not found");
      console.error("User doesn't have match not found");
      return;
    }

    newMessage.messageUserId = body.userId;
    newMessage.messageContent = body.message;
    newMessage.messageMatchId = body.matchId;

    const errors = await validate(newMessage);

    if (errors.length > 0) {
      res.status(400).send("validation failed. errors: " + errors);
    } else {
      const message = AppDataSource.getRepository(Message).create(newMessage);
      const results = AppDataSource.getRepository(Message).save(message);
      results
        ? res.status(200).send("Message sent !")
        : res.status(500).send("Internal server error");
    }
  }

  static getAllMatches = async (req: Request, res: Response) => {
    const matchRepository = AppDataSource.getRepository(Match);
    const userId = req.params.id;

    const match = await matchRepository
      .createQueryBuilder("match")
      .innerJoinAndSelect("match.matchSrc", "srcUser")
      // SELECTION particulière ne marche pas...
      .innerJoinAndSelect("match.matchDst", "dstUser")
      .where([
        { matchDstId: parseInt(userId), matchStatId: Not(USER_STATE.REFUSED) },
        { matchSrcId: parseInt(userId), matchStatId: USER_STATE.VALIDE },
      ])
      .getMany();

    let allMatchUser = [];

    for (let i = 0; i < match.length; i++) {
      let matchUser = {
        matchId: match[i].matchId,
        matchTypeId: match[i].matchTypeId,
        matchStatId: match[i].matchStatId,
        matchDate: match[i].matchDate,
        matchSrcId: {
          userId: match[i].matchSrc.userId,
          userFirstname: match[i].matchSrc.userFirstname,
          userLastname: match[i].matchSrc.userLastname,
          userImage: await match[i].matchDst.images,
        },
        matchDstId: {
          userId: match[i].matchDst.userId,
          userFirstname: match[i].matchDst.userFirstname,
          userLastname: match[i].matchDst.userLastname,
          userImage: await match[i].matchDst.images,
        },
      };

      allMatchUser.push(matchUser);
    }
    //console.log(allMatchUser);
    res.json(allMatchUser);
  };
}
