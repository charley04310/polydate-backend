import express from "express";
import { MessageControllers } from "../controllers/message.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";

const MsgRouter = express.Router();
MsgRouter.route("/envoyer").post(
  checkJwtCookies,
  MessageControllers.sendMessage
);

MsgRouter.route("/otenir/:id").get(
  checkJwtCookies,
  MessageControllers.getAllMessageByMatchId
);

export default MsgRouter;
