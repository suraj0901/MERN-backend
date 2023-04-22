import express from "express";
import path, { dirname } from "node:path";
import routes from "./routes/root.js";
import { fileURLToPath } from "node:url";
import { logEvents, logger } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import cors from "cors"
import corsOptions from "./config/corsOptions.js";
import { config } from "dotenv";
import connectDB from "./config/dbConn.js";
import mongoose from "mongoose";
import userRoutes from "./routes/userRoutes.js"
import notesRoutes from "./routes/notesRoutes.js"

config()
connectDB()

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3500;

app.use(logger)
app.use(cors())
app.use(express.json())
app.use(cookieParser())


app.use("/", express.static(path.join(__dirname, "/public")));

app.use("/", routes);
app.use('/users', userRoutes)
app.use('/notes', notesRoutes)

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("text").send("404 Not Found");
  }
});

app.use(errorHandler)

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB")
  app.listen(port, () => console.log(`Server runnnig on port ${port}`));
})

mongoose.connection.on("error", err => {
  console.log(err)
  logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrorLog.log")
})