import express from "express";
import { AuthController } from "../controllers/auth.controller";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();

router.route("/login").post(AuthController.login);
router.route("/logout").post(AuthController.logout);

router.route("/:id");

export default router;
