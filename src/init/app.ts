import express, { Application } from "express";
import morgan from "morgan";
import { AppDataSource } from "../db/app-data-source";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user.routes";
import authRouter from "../routes/auth.routes";
import imgRouter from "../routes/images.routes";
import matchRouter from "../routes/match.routes";
import cors from "cors";
import path from "path";
import { Server } from "socket.io";
import http from "http";
import MsgRouter from "../routes/messages.routes";
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
    this.app.use(
      cors({
        credentials: true,
        origin: "https://cluster-2022-5.dopolytech.fr",
        methods: ["GET", "POST", "PUT", "DELETE"],
      })
    );
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  private routes() {
    this.app.use("/api", userRoutes);
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/images", imgRouter);
    this.app.use("/api/match", matchRouter);
    this.app.use("/api/messages", MsgRouter);
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
