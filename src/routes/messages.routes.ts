import express from "express";
import { MessageControllers } from "../controllers/message.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";

const MsgRouter = express.Router();
MsgRouter.route("/envoyer").post(
  checkJwtCookies,
  MessageControllers.sendMessage
);

export default MsgRouter;
