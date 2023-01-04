import express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers/user.controllers";
import {
  checkJwtCookies,
  checkIsAdminJwtCookies,
} from "../middleware/cookieJwtAuth";

const router = express.Router();
router.route("/user/:id").get(checkJwtCookies, UserController.findOneUserById);

router
  .route("/user")
  .get(checkIsAdminJwtCookies, UserController.findAllUser)
  .post(UserController.createUser)
  .put(checkJwtCookies, UserController.updateUser);

router
  .route("/user/state/:id")
  .put(checkIsAdminJwtCookies, UserController.banOrUnBanUser);

router
  .route("/user/image")
  .put(checkJwtCookies, UserController.handleProfileUserImage);

router
  .route("/user/feed/:id/:iduser")
  .get(checkJwtCookies, UserController.getRandomUserByGenre);

export default router;
