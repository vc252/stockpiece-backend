import UserRouter from "../routes/userRouter.routes.js";

export const routesDefs = [
  //but this has specific requirements for that key value pair
  //we are assigning UserRouter type which has a type that takes specific arguments only due to the interface we defined
  {
    name: "userRouter",
    basePath: "users",
    RouterClass: UserRouter,
    routerOptions: ["userService"],
  },
];
