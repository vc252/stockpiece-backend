import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootdir = resolve(__dirname, "../../");

const DB_NAME = "stockpiece";

const collections = {
  LOG_ERRORS: "log",
  ADMIN: "admins",
  USERS: "users",
} as const;

const defaultAvatarUrl = "";

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
  defaultAvatarUrl,
  permissions,
  PermissionType,
  roles,
  RoleType,
};
