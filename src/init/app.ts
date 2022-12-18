import express, { Application } from "express";
import morgan from "morgan";
import { AppDataSource } from "../db/app-data-source";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user.routes";
import authRouter from "../routes/auth.routes";

export class App {
  app: Application;
  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.connectionToDataBase();
  }

  private middlewares() {
    this.app.use(morgan("dev"));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private routes() {
    this.app.use("/api", userRoutes);
    this.app.use("/auth", authRouter);
  }
  private async connectionToDataBase() {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during the data source inti", err);
    }
  }

  async listen(port: string | number): Promise<void> {
    this.app.listen(port);
    console.log("Server on port", port);
  }
}
