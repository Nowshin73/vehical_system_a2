import express, { Request, Response } from "express";
import { initDB } from "./database/db";
import { logger } from "./middleware/logged";
import config from "./config";
import { userRoute } from "./modules/users/users.route";
import { authRoute } from "./modules/auth/auth.route";


const app = express();
app.use(express.json());
const port = config.port;
 initDB();


app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
// app.use("/api/v1/auth", authRoute);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route",
    path: req.path,
  });
});
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});
app.listen(port, () => {
  console.log(`server is running on ${port}`);
});