import express from "express";
import registerRoutes from "./routes/registerRoutes.js";
import { routesDefs } from "./config/routesDefs.js";
import cors from "cors";
import Container from "./container/Container.js";
import { registerComponents } from "./container/setUpComponent.container.js";
import { ComponenetsDef } from "./config/ComponentsDef.js";

let app: express.Application = express();

app.use(express.json());
app.use(cors());

const container = Container.getInstance();
registerComponents(container, ComponenetsDef);
app = registerRoutes(app, routesDefs, "/api/v2", container);

app.get("/", (req, res) => {
  res.send("hello");
});

export default app;
