import express, { Request, Response } from "express";
import { initDB } from "./database/db";

const app = express();
app.use(express.json());

initDB();

// http://localhost:5000/users   =>  http://localhost:5000/api/v1/users
// http://localhost:5000/auth   =>  http://localhost:5000/api/v1/auth/login
app.use("/api/v1/customers", );
// app.use("/api/v1/auth", authRoute);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "This is the root route",
    path: req.path,
  });
});

app.listen(5000, () => {
  console.log("Server is running on post 5000");
});