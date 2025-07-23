import z from "zod";
import { logger } from "../utils/logger.js";
import dotenv from "dotenv";
import { rootdir } from "../common/constants.common.js";

switch (process.env.NODE_ENV) {
  case "development":
    dotenv.config({
      path: `${rootdir}/.env.development`,
    });
    logger.notice("development environment loaded");
    break;
  case "production":
    dotenv.config({
      path: `${rootdir}/.env.production`,
    });
    logger.notice("production environment loaded");
    break;
  case "testing":
    dotenv.config({
      path: `${rootdir}/.env.test`,
    });
    logger.notice("test environment loaded");
    break;
  default:
    dotenv.config();
}

const msStringValueSchema = z.string().regex(/^\d+(ms|s|m|h|d|w|y)$/, {
  message: 'Must be a valid ms string (e.g., "10h", "1d", "30m")',
});

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("127.0.0.1"),
  NODE_ENV: z
    .enum(["development", "production", "testing"])
    .default("development"),
  MONGO_DB_URI: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
  USER_ACCESS_TOKEN_EXPIRY: z.union([z.number(), msStringValueSchema]),
  ADMIN_ACCESS_TOKEN_EXPIRY: z.union([z.number(), msStringValueSchema]),
  REFRESH_TOKEN_EXPIRY: z.string(),
  SUPER_ADMIN_USERNAME: z.string(),
  SUPER_ADMIN_PASSWORD: z.string(),
  SUPER_ADMIN_EMAIL: z.string().email(),
});

const envParsed = envSchema.safeParse(process.env);
if (!envParsed.success) {
  logger.error(
    "error in parsing environment variables",
    ...envParsed.error.errors
  );
  process.exit(1);
}

const env = envParsed.data;

export default env;
