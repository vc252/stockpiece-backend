import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootdir = resolve(__dirname, "../../");

const DB_NAME = "stockpiece";

const collections = {
  LOG_ERRORS: "log",
} as const;

const defaultAvatarUrl = "";

export {
  __filename,
  __dirname,
  rootdir,
  DB_NAME,
  collections,
  defaultAvatarUrl,
};
