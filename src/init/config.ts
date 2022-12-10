import dotenv from "dotenv";
dotenv.config();
export default {
  port: process.env.PORT,
  host: process.env.HOST,
  db: process.env.DB,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  jwt: process.env.ACCESS_TOKEN_SECRET,
};
