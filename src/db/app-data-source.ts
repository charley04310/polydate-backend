import "reflect-metadata";
import { DataSource } from "typeorm";
//import { User } from "./entity/User"

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "172.19.0.2",
  port: 3306,
  username: "root",
  password: "charley",
  database: "Polydate",
  synchronize: true,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});
