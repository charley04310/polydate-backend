import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import multer from "multer";
import { Image } from "../entities/Image";
interface CustomRequest extends Request {
  files: Express.Multer.File[];
}

export class ImagesController extends BaseEntity {
  // #TODO: SE CONNECTER

  static async addImageUser(req: CustomRequest, res: Response) {
    let imageLinks = req.files;

    const images = imageLinks.map((imageLink) => {
      const image = new Image();
      image.imageUserId = req.body.userId;
      image.imageLink = imageLink.path;

      return image;
    });

    const newImages = AppDataSource.getRepository(Image).create(images);
    const imageSaving = await AppDataSource.getRepository(Image).save(
      newImages
    );
    return res.send(imageSaving);
  }
}
