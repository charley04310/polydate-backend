import express from "express";
//import { Request, Response } from "express";
//import { connect } from "../db/database";
import * as userControl from "../controllers/user.controllers";
const router = express.Router();

router.route("/user").get(userControl.find);
//.post(userControl.createUser);

/*router
  .route("/:id")
  .put(userControl.updateUser)
  .get(userControl.getUser)
  .delete(userControl.deleteUser); */

export default router;
