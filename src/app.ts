import express from "express";
import registerRoutes from "./routes/registerRoutes.js";
import { routesDefs } from "./config/routesDefs.js";
import cors from "cors";
import Container from "./container/Container.js";
import { registerComponents } from "./container/setUpComponent.container.js";
import { ComponenetsDef } from "./config/ComponentsDef.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";

let app: express.Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
//gives the original client ip instead of proxy
//we need to do this because if we see the proxy ip then the req might be interpreted as http
//which might create problems with secure cookies
app.set("trust proxy", true);

const container = Container.getInstance();
registerComponents(container, ComponenetsDef);
app = registerRoutes(app, routesDefs, "/api/v2", container);

app.get("/", (req, res) => {
  res.send("hello");
});

app.use(errorHandler);

export default app;
