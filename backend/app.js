import express from "express";
import { dbConnection } from "./src/config/db.js";
import dotenv from "dotenv";
import cors from "cors";
import authRouter from "./src/routes/auth.routes.js";
import postRouter from "./src/routes/post.routes.js";
import userRouter from "./src/routes/user.routes.js";
import savedRouter from "./src/routes/saved.routes.js";
import commentRouter from "./src/routes/comment.routes.js";
import likeRouter from "./src/routes/like.routes.js";
import searchRouter from "./src/routes/search.routes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(async (req, res, next) => {
  await dbConnection();
  next();
});

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postRouter);
app.use("/saves", savedRouter);
app.use("/comments", commentRouter);
app.use("/likes", likeRouter);
app.use("/user-posts", searchRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

export default app;