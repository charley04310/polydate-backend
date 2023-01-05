import { validate } from "class-validator";
import { Request, Response } from "express";
import { BaseEntity, Not } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import request from "request-promise";
import { Match } from "../entities/Match";
import { USER_STATE } from "../enums/enums";
export enum MATCH_STATE {
  EN_ATTENTE = 2,
  VALIDE = 1,
  REFUSER = 3,
}
export class MatchController extends BaseEntity {
  // #TODO: SE CONNECTER

  static async sendMatchRequest(req: Request, res: Response) {
    const newMatch = new Match();
    let body = req.body;
    if (body.matchStatId !== undefined)
      return res
        .status(401)
        .send("Vous ne pouvez pas envoyer un match avec un statut");
    newMatch.matchSrcId = body.userId;
    newMatch.matchDstId = body.matchDstId;
    newMatch.matchTypeId = body.matchTypeId;

    const errors = await validate(newMatch);

    if (errors.length > 0) {
      res.status(400).send("validation failed. errors: " + errors);
    } else {
      const match = AppDataSource.getRepository(Match).create(newMatch);
      AppDataSource.getRepository(Match).save(match);
      return res.send("Match sent!");
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
        console.error(err);

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
    } else {
      res.status(400).send("Match STATE not valide");
      return;
    }
  };

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

  static getMatch = async (matchDstId: number, matchSrcId: number) => {
    const matchRepository = AppDataSource.getRepository(Match);
    await matchRepository
      .findOne({
        where: [
          {
            matchDstId: matchDstId,
            matchSrcId: matchSrcId,
          },
          {
            matchSrcId: matchDstId,
            matchDstId: matchSrcId,
          },
        ],
      })
      .catch((err) => {
        return false;
      });

    return true;
  };
}
