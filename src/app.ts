import express from "express";
import registerRoutes from "./routes/registerRoutes.js";
import { routesDefs } from "./config/routesDefs.js";
import cors from "cors";

let app: express.Application = express();

app.use(express.json());
app.use(cors());

app = registerRoutes(app, routesDefs, "/api/v2");

app.get("/", (req, res) => {
  res.send("hello");
});

export default app;
