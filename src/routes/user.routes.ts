import express from "express";
import { Request, Response } from "express";
import { UserController } from "../controllers/user.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();
router.route("/user/:id").get(checkJwtCookies, UserController.findOneUserById);

router
  .route("/user")
  .get(checkJwtCookies, UserController.findAllUser)
  .post(UserController.createUser)
  .put(checkJwtCookies, UserController.updateUser);
//.post(userControl.createUser);

router
  .route("/user/image")
  .put(checkJwtCookies, UserController.handleProfileUserImage);

router.route("/user/feed/:id/:iduser").get(UserController.getRandomUserByGenre);

export default router;
