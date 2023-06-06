import { Secret } from "jsonwebtoken";

export type ConfigEnvVariables = {
  PORT: number;
  MONGO_URI: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
};
const MONGO_URI: Secret = process.env.MONGO_URI || "";
const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN_SECRET || "";
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN_SECRET || "";

const PORT: number = isNaN(Number(process.env.PORT))
  ? 9000
  : Number(process.env.PORT);

const config: ConfigEnvVariables = {
  PORT,
  MONGO_URI,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};

export default config;
