import express, { Application } from "express";
import morgan from "morgan";
import { AppDataSource } from "../db/app-data-source";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import http from "http";

export class SocketServer {
  app: Application;
  httpServer: http.Server;
  io: Server;

  constructor() {
    this.app = express();
    this.socket();
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
      })
    );
  }

  private socket() {
    this.httpServer = http.createServer(this.app);
    this.io = new Server(this.httpServer, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    this.io.on("connection", (socket) => {
      console.log("a user connected");
      console.log(socket.id);

      socket.use(([event, ...args], next) => {
        // do something with the packet (logging, authorization, rate limiting...)
        // do not forget to call next() at the end
        next();
      });

      socket.on("error", (err) => {
        if (err && err.message === "unauthorized event") {
          socket.disconnect();
        }
      });

      socket.on("join", async (conversation) => {
        console.log("join: " + JSON.stringify(conversation));
        // si la conversation match pas en base return un truck
        socket.join(conversation.matchId);
      });

      socket.on("message", (msg) => {
        console.log("message: " + JSON.stringify(msg));

        // const message = Message.create(data);
        // await Message.save(message);

        socket.to(msg.matchId).emit("message", msg);
      });
      socket.on("disconnect", () => {
        console.log("user disconnected");
      });
    });
    console.log("socket server running");
  }

  private routes() {
    this.app.get("/api/socket");
  }
  private async connectionToDataBase() {
    try {
      await AppDataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (err) {
      console.error("Error during the data source inti", err);
    }
  }

  async listen(): Promise<void> {
    this.httpServer.listen(3000);

    console.log("Socket on port 3000");
  }
}
