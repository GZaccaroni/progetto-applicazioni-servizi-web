import { NextFunction, Request, Response } from "express";
import { UserDocument } from "./model/db/User";

export const isUserLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    res.status(401).send("User not authenticated");
    return;
  }
  next();
};

export interface UserRequest extends Request {
  user: UserDocument & Express.User;
}
