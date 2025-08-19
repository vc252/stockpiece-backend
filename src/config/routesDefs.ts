import AdminRouter from "../router/AdminRouter.js";
import StockRouter from "../router/StockRouter.js";
import UserRouter from "../router/UserRouter.js";

export const routesDefs = [
  //this is the top level component and it won't be used
  //anywhere else so we don't need to register it or anything
  {
    name: "userRouter",
    basePath: "user",
    RouterClass: UserRouter,
  },
  {
    name: "adminRouter",
    basePath: "admin",
    RouterClass: AdminRouter,
  },
  {
    name: "stockRouter",
    basePath: "stock",
    RouterClass: StockRouter,
  },
];
