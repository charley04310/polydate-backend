import express from "express";
import { Request, Response } from "express";
//import { connect } from "../db/database";
import * as userControl from "../controllers/user.controllers";
const router = express.Router();

router.route("/user/:id").get(userControl.findOneById);

router.route("/user").get(userControl.findAll).post(userControl.createUser);
//.post(userControl.createUser);

/*router
  .route("/:id")
  .put(userControl.updateUser)
  .get(userControl.getUser)
  .delete(userControl.deleteUser); */

export default router;
