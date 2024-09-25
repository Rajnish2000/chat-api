import express from "express";
import bodyParser from "body-parser";
import mongoose, { connection } from "mongoose";
import router from "./routes/usersRoute.js";
import path from "path";
import { fileURLToPath } from "url";
import { Server } from "socket.io";

const MONGO_URI = "mongodb://127.0.0.1:27017/chat-api";

const app = express();
app.use(bodyParser.json());
// to use static file in the application.
const __dirname = path.resolve();
app.use("/public", express.static(path.join(__dirname, "public"))); // old way to configure static file.

// const __filename = fileURLToPath(import.meta.url + "/public");
// const __dirname = path.dirname(__filename)

//allowing CORS : cross-origin-resource-sharing.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // any domain can access it.
  res.setHeader("Access-Control-Allow-Method", "GET,PUT,POST,PATCH,DELETE"); // can be access via any method.
  res.setHeader("Access-Control-Allow-Headers", "*"); //any header are allow.
  next();
});

app.use("/users", router);

mongoose
  .connect(MONGO_URI)
  .then((result) => {
    let httpServer = app.listen(3300);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
      console.log("socket : ", socket);
      console.log("socket client connection established!");
    });
  })
  .catch((err) => {
    console.log(err);
  });
