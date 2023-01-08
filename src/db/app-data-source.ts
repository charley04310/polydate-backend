import "reflect-metadata";
import { DataSource } from "typeorm";
//import { User } from "./entity/User"

export const AppDataSource = new DataSource({
  type: "mysql",
  url: "mysql://root:root@mysql:3306/Polydate",
  database: "Polydate",
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migration/**/*.ts"],
  subscribers: ["src/subscribers/**/*.ts"],
});
