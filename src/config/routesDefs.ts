import AdminRouter from "../routes/AdminRouter.routes.js";
import UserRouter from "../routes/UserRouter.routes.js";

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
];
