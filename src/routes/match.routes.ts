import express from "express";
import { MatchController } from "../controllers/match.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();

router.route("/start").post(checkJwtCookies, MatchController.startMatch);

export default router;
