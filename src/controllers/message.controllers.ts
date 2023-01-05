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

  static getAllMessageByMatchId = async (req: Request, res: Response) => {
    const matchRepository = AppDataSource.getRepository(Message);
    const matchId = req.params.id;

    const message = await matchRepository.find({
      where: { messageMatchId: parseInt(matchId) },
    });

    if (!message) {
      res.status(400).send("No message found");
      return;
    }
    console.log(message);
    //console.log(allMatchUser);
    res.json(message);
  };
}
