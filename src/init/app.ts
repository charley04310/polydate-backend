import express, { Application } from "express";
import morgan from "morgan";
import { AppDataSource } from "../db/app-data-source";
import cookieParser from "cookie-parser";
import userRoutes from "../routes/user.routes";
import authRouter from "../routes/auth.routes";
import imgRouter from "../routes/images.routes";
import matchRouter from "../routes/match.routes";
import { Server } from "socket.io";
import cors from "cors";
import http from "http";
import path from "path";

export class App {
  app: Application;
  httpServer: http.Server;
  io: Server;
  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });
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
        origin: "http://localhost:8010",
      })
    );
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  private routes() {
    this.app.use("/api", userRoutes);
    this.app.use("/auth", authRouter);
    this.app.use("/images", imgRouter);
    this.app.use("/match", matchRouter);
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
    this.httpServer.listen(3000);

    console.log("Server on port", port);
    console.log("Server Socket on port 3000");
  }
}
