import { NextFunction, Request, Response } from "express";
import { UserDocument } from "./model/db/User";
import { RequestHandler } from "express-serve-static-core";
import { BackendError } from "@/model/common/BackendError";
import { Error as MongooseError, Types } from "mongoose";

export const isUserLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    next(new BackendError("notLoggedIn"));
    return;
  }
  next();
};

export function callableUserFunction<ResBody>(
  handler: (request: UserRequest) => Promise<ResBody>
): RequestHandler {
  return async (req, res, next) => {
    try {
      const resBody = await handler(req as UserRequest);
      res.json(resBody);
    } catch (e) {
      console.error("Error: ", e);
      if (e instanceof MongooseError) {
        next(new BackendError("persistenceError", e.message));
      } else {
        next(e);
      }
    }
  };
}
export interface UserRequest extends Request {
  user: UserDocument & Express.User;
}

export type DbIdentifiable = {
  _id: Types.ObjectId;
};
