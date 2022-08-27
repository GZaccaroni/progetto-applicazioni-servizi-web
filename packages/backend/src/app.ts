/* eslint:disable no-var-requires */
import sourceMapSupport = require("source-map-support");
sourceMapSupport.install();
import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import User from "./model/db/User";
import cors from "cors";
import routes from "@/routes/Routes";
import mongoose from "mongoose";
import { Server } from "socket.io";
import * as http from "http";
import { queryParser } from "express-query-parser";
import passport from "passport";
import { BackendError } from "@/model/common/BackendError";

const app = express();
const port = 3000;
const server = http.createServer(app);
export const io = new Server(server, {
  cors: { credentials: true, origin: true },
});

app.use(cors({ credentials: true, origin: true }));

app.use(express.json());
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  })
);

app.use(
  session({
    secret: "r8q,+&1LM3)CD*zAGpx1xm{Pusadnstrc;#",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/", routes);
app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof BackendError) {
    res.status(err.httpStatusCode()).json({
      error: {
        code: err.errorCode,
        message: err.errorMessage,
      },
    });
  }
});

server.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});

// connect to database
mongoose
  .connect(
    "mongodb+srv://admin:C0W6J0tA3jl8X4Cb@maincolturecloud.fujik.mongodb.net/main"
  )
  .then(() => {
    console.log("Db connected");
  });
