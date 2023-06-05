export type ConfigEnvVariables = {
  PORT: number;
  MONGO_URI: string;
};
const MONGO_URI: string =
  process.env.NODE_ENV === "development"
    ? "mongodb://127.0.0.1:27017/goleconomy"
    : process.env.MONGO_URI || "";
const PORT: number = isNaN(Number(process.env.PORT))
  ? 9000
  : Number(process.env.PORT);

const config: ConfigEnvVariables = { PORT, MONGO_URI };

export default config;
