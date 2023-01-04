import express from "express";
import { AuthController } from "../controllers/auth.controller";
const router = express.Router();

router.route("/login").post(AuthController.login);

router.route("/:id");

export default router;
