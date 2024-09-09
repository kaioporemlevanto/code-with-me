import 'express-async-errors';
import express from "express";
import { AppDataSource } from "./data-source";
import { errorMiddleware } from "./middlewares/error";

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());
  app.get("/", (req, res) => {
    return res.json("Hello World!");
  });
  app.use(errorMiddleware);
  return app.listen(process.env.PORT);
});
