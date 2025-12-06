import express, { Request, Response } from "express";
import { initDB } from "./database/db";
import { logger } from "./middleware/logged";
import config from "./config";
// import { userRoute } from "./modules/users/users.route";

const app = express();
app.use(express.json());
console.log("db connect",config.port);
initDB();


// app.use("/api/v1/auth/signup", userRoute);
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
app.listen(config.port, () => {
  console.log("Server is running on post 5000");
});