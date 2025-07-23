import { CookieOptions } from "express";

const crossSiteSafeCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: "none",
};

export { crossSiteSafeCookieOptions };
