import { Request, Response } from "express";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "./public/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${req.params.id}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
    files: 5,
  },
  fileFilter: fileFilter,
});
