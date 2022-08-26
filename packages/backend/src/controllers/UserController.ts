import { NextFunction, Request, Response } from "express";
import { validateRequest } from "@common/validation";
import passport from "passport";
import UserDb, { UserDocument, UserProjection } from "@/model/db/User";
import Log from "@/model/db/Log";
import { io } from "@/app";
import Store from "@/model/db/Store";
import { CreateUserInputSchema } from "@common/validation/json_schema/CreateUserInput";
import { GetUsersInputSchema } from "@common/validation/json_schema/GetUsersInput";
import { UpdateUserInputSchema } from "@common/validation/json_schema/UpdateUserInput";
import { UserLoginInputSchema } from "@common/validation/json_schema/UserLoginInput";
import { callableUserFunction } from "@/utils";
import { FilterQuery } from "mongoose";
import { BackendError } from "@/model/common/BackendError";

export const createUser = callableUserFunction(async (req) => {
  if (!validateRequest(CreateUserInputSchema, req.body)) {
    throw new BackendError("invalidArgument", "Invalid input");
  }
  if (!req.user?.isAdmin) {
    throw new BackendError("notAuthorized", "User not authorized");
  }
  let existingUser: UserDocument | null;
  try {
    existingUser = await UserDb.findOne({ username: req.body.username }).lean();
  } catch (e) {
    throw new BackendError("serverError", "Persistence error");
  }
  if (existingUser) {
    throw new BackendError("nameAlreadyInUse");
  }
  let registeredUser: UserDocument;
  try {
    registeredUser = await UserDb.register(req.body as any, req.body.password);
  } catch (e) {
    throw new BackendError("serverError", "Registration error");
  }
  await Log.create({
    username: req.user.username,
    action: "create",
    object: {
      id: registeredUser._id,
      type: "user",
    },
  });
  io.emit("userChanged", { id: registeredUser._id, action: "create" });
  return {};
});
export const getUsers = callableUserFunction(async (req) => {
  if (!req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  if (!validateRequest(GetUsersInputSchema, req.query)) {
    throw new BackendError("invalidArgument");
  }
  const query: FilterQuery<UserDocument> = {};
  if (req.query.searchName) {
    query["username"] = { $regex: req.query.searchName, $options: "i" };
  }
  return await UserDb.paginate({
    query,
    paginatedField: "_id",
    sortAscending: true,
    projection: UserProjection,
    limit: req.query.limit,
    lean: true,
    cursors: {
      next: req.query.pagingNext,
      previous: req.query.pagingPrevious,
    },
  });
});

export const getUserByName = callableUserFunction(async (req) => {
  if (!req.params.username) {
    throw new BackendError("invalidArgument");
  }
  if (!req.user.isAdmin && req.params.username != req.user.username) {
    throw new BackendError("notAuthorized");
  }
  const user = await UserDb.findOne(
    { username: req.params.username },
    UserProjection
  ).lean();
  if (!user) {
    throw new BackendError("itemNotFound");
  }
  return user;
});
export const updateUser = callableUserFunction(async (req) => {
  if (
    !validateRequest(UpdateUserInputSchema, req.body) ||
    !req.params.username
  ) {
    throw new BackendError("invalidArgument");
  }
  if (
    (req.user.username != req.params.username && !req.user.isAdmin) ||
    (!req.user.isAdmin && req.body.isAdmin != undefined)
  ) {
    throw new BackendError("notAuthorized");
  }
  const user = await UserDb.findOne({ username: req.params.username });
  if (!user) {
    throw new BackendError("itemNotFound");
  }
  if (req.body.password != undefined) {
    await user.setPassword(req.body.password);
  }
  if (req.body.isAdmin != undefined) {
    user.isAdmin = req.body.isAdmin;
  }
  await user.save();
  await Log.create({
    username: req.user.username,
    action: "update",
    object: {
      id: user._id,
      type: "user",
    },
  });
});
export const deleteUser = callableUserFunction(async (req) => {
  if (!req.params.username) {
    throw new BackendError("invalidArgument");
  }
  if (req.user.username != req.params.username && !req.user.isAdmin) {
    throw new BackendError("notAuthorized");
  }
  const user = await UserDb.findOne({ username: req.params.username }).lean();
  if (user == null) {
    throw new BackendError("itemNotFound", "User not found");
  }
  await Store.updateMany(
    { "authorizations.userId": user._id },
    { $pullAll: { authorizations: user._id } }
  );
  const deleteResult = await UserDb.deleteOne({ _id: user._id });
  if (deleteResult.deletedCount < 1) {
    throw new BackendError("itemNotFound", "User not found");
  }
  if (req.user.username == user.username) {
    req.logout(function (err) {
      if (err) {
        throw err;
      }
    });
  }
  await Log.create({
    username: user.username,
    action: "delete",
    object: {
      id: user._id,
      type: "user",
    },
  });
  io.emit("userChanged", { id: user._id, action: "delete" });
});
export const userLogin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    res.json();
    return;
  }
  if (!validateRequest(UserLoginInputSchema, req.body)) {
    next(new BackendError("invalidArgument"));
    return;
  }
  passport.authenticate("local", function (err, user) {
    if (err) {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
      return;
    }
    if (user) {
      req.login(user, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json();
        }
      });
    } else {
      next(
        new BackendError(
          "invalidArgument",
          "Invalid username/password supplied"
        )
      );
    }
  })(req, res);
};
export const userLogout = (req: Request, res: Response) => {
  req.logout(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json();
    }
  });
};
