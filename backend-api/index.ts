import cors from "cors";
import express from "express";
import boards from "./controllers/boards";
import login from "./controllers/login";
import posts from "./controllers/posts";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", posts);
app.use("/api", boards);
app.use("/api", login);

export default app;
