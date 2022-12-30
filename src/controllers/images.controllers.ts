import { Request, Response } from "express";
import { BaseEntity } from "typeorm";
import { AppDataSource } from "../db/app-data-source";
import { User } from "../entities/User";
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
      image.imageLink = imageLink.filename;

      return image;
    });

    const newImages = AppDataSource.getRepository(Image).create(images);
    const imageSaving = await AppDataSource.getRepository(Image).save(
      newImages
    );
    return res.send(imageSaving);
  }

  static async getImagesUser(req: Request, res: Response) {
    const imageId = req.params.id;
    res.sendFile(
      `/home/charley/polytech/woa/polydate/Polydate-API/public/images/${imageId}`
    );
  }

  static async deleteImageUser(req: Request, res: Response) {
    const imageId = req.params.id;
    const image = await AppDataSource.getRepository(Image).findOne({
      where: { imageLink: imageId },
    });
    if (image) {
      const imageDeleting = await AppDataSource.getRepository(Image).delete({
        imageLink: imageId,
      });
      return res.send(imageDeleting);
    } else {
      return res.status(400).json("image does'not exist");
    }
  }
}
