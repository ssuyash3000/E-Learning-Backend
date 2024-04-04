import "./env.js";
import express from "express";
import UserRouter from "./src/features/users/user.routes.js";
import createReqTables from "./src/config/tableGeneration.js";

const server = express();
server.use(express.json());
server.get("/", (req, res) => {
  res.send("Welcome to  this project");
});

server.use("/api/user", UserRouter);

server.listen("3400", () => {
  createReqTables();
  console.log("Server has started at port 3400");
});
