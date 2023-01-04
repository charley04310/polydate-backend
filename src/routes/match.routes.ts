import express from "express";
import { MatchController } from "../controllers/match.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();

router.route("/start").post(checkJwtCookies, MatchController.startMatch);

router
  .route("/validation")
  .put(checkJwtCookies, MatchController.validOrRefuseMatch);

router
  .route("/obtenir/:id")
  .get(checkJwtCookies, MatchController.getAllMatches);

export default router;
