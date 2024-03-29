import dotenv from "dotenv";
dotenv.config();

const utilities = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET as string,
  REDIS_URI: process.env.REDIS_URI as string,
};

export default utilities;
