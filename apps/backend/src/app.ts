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
import connect_mongodb_session from "connect-mongodb-session";
import {
  MONGODB_CONNECTION_STRING,
  SESSION_MAX_AGE,
  SESSION_SECRET,
  SESSIONS_COLLECTION,
} from "@/config";

const MongoDBStore = connect_mongodb_session(session);

const app = express();
const port = 3000;
const server = http.createServer(app);
const store = new MongoDBStore({
  uri: MONGODB_CONNECTION_STRING,
  collection: SESSIONS_COLLECTION,
});
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
const sessionMiddleware = session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: SESSION_MAX_AGE }, // 1 hour,
  store,
});
app.use(sessionMiddleware);

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
mongoose.connect(MONGODB_CONNECTION_STRING).then(() => {
  console.log("Db connected");
});
