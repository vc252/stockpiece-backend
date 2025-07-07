import { CookieOptions } from "express";

const crossSiteSafeCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
};

export { crossSiteSafeCookieOptions };
