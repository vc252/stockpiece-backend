import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootdir = resolve(__dirname, "../../");

const DB_NAME = "stockpiece";

const collections = {
  LOG_ERRORS: "log",
  ADMIN: "admins",
  USERS: "users",
} as const;

const UPLOAD_PATH = join(__dirname, "../public/temp");
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const permissions = {
  MARKET_CONTROL: "market_control", // can open/close market and toggle next chapter release
  CHANGE_STOCK_PRICE: "change_stock_price",
  GENERATE_COUPON: "generate_coupon",
  VIEW_FUTURE_PRICE: "view_future_price",
  VIEW_USER_INFO: "view_user_info",
  VIEW_CHAPTER_INFO: "view_chapter_info",
  IMPERSONATE_USER: "impersonate_user",
  ADD_STOCK: "add_stock",
  DELETE_STOCK: "delete_stock",
} as const;

const roles = {
  USER: "USER",
  ADMIN: "ADMIN",
};

type PermissionType = (typeof permissions)[keyof typeof permissions];
type RoleType = (typeof roles)[keyof typeof roles];

export {
  __filename,
  __dirname,
  rootdir,
  DB_NAME,
  collections,
  permissions,
  PermissionType,
  roles,
  RoleType,
  UPLOAD_PATH,
  MAX_FILE_SIZE,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
};
