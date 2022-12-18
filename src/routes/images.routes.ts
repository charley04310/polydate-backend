import express from "express";
import { upload } from "../middleware/uploadImages";
//import { UserController } from "../controllers/user.controllers";
import { checkJwtCookies } from "../middleware/cookieJwtAuth";
import { ImagesController } from "../controllers/images.controllers";
const router = express.Router();

router
  .route("/upload/:id")
  .post(
    checkJwtCookies,
    upload.array("images"),
    checkJwtCookies,
    ImagesController.addImageUser
  );

export default router;
