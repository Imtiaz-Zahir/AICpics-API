import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import routes from "./routes";
import { CustomError } from "./utils/error";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use("/v1", routes);

app.use(
  (
    error: CustomError,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    console.error(error);

    if (error.status) {
      response.status(error.status).json({ message: error.message });
    } else {
      response.status(500).json({ message: "Internal Server Error" });
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
