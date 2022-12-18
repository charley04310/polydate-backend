import express from "express";
import { Request, Response } from "express";
//import { connect } from "../db/database";
import { UserController } from "../controllers/user.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();
router.route("/user/:id").get(checkJwtCookies, UserController.findOneUserById);

router
  .route("/user")
  .get(UserController.findAllUser)
  .post(UserController.createUser)
  .put(checkJwtCookies, UserController.updateUser);
//.post(userControl.createUser);

/*router
  .route("/:id")
  .put(userControl.updateUser)
  .get(userControl.getUser)
  .delete(userControl.deleteUser); */

export default router;
