import express from "express";
//import { Request, Response } from "express";
//import { connect } from "../db/database";
import AuthControl from "../controllers/auth.controller";
const router = express.Router();

router.route("/").get();
//.post(AuthControl.createUser);

router.route("/:id");
/*   .put(AuthControl.updateUser)
  .get(AuthControl.getUser)
  .delete(AuthControl.deleteUser); */

export default router;
