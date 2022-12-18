import express from "express";
import { Request, Response } from "express";
import multer from "multer";
import path from "path";
//import { UserController } from "../controllers/user.controllers";
//import { checkJwtCookies } from "../middleware/cookieJwtAuth";
const router = express.Router();

const storage = multer.diskStorage({
  destination: "./images",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

// Initialiser le middleware multer avec la configuration de stockage
/* const fileFilter = (req, file, cb) => {
  // Accepte seulement les fichiers de type image
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
}; */

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  //  fileFilter: fileFilter,
});

router
  .route("/upload")
  .post(upload.single("image"), (req: Request, res: Response) => {
    res.send(req.file);
    return;
  });
//.post(userControl.createUser);

/*router
  .route("/:id")
  .put(userControl.updateUser)
  .get(userControl.getUser)
  .delete(userControl.deleteUser); */

export default router;
