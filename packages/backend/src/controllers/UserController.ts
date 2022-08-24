import { Request, Response } from "express";
import { validateRequest } from "@common/validation";
import passport from "passport";
import UserDb, { UserDocument, UserProjection } from "@/model/db/User";
import Log from "@/model/db/Log";
import { paginateOptions, paginateResponse } from "@/paginationUtils";
import { io } from "@/app";
import Store from "@/model/db/Store";
import { CreateUserInputSchema } from "@common/validation/json_schema/CreateUserInput";
import { GetUsersInputSchema } from "@common/validation/json_schema/GetUsersInput";
import { UpdateUserInputSchema } from "@common/validation/json_schema/UpdateUserInput";
import { UserLoginInputSchema } from "@common/validation/json_schema/UserLoginInput";
import { UserRequest } from "@/utils";
import { FilterQuery } from "mongoose";

export const createUser = (req: UserRequest, res: Response) => {
  if (!validateRequest(CreateUserInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  if (!req.user?.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  UserDb.findOne({ username: req.body.username })
    .then((user) => {
      if (user) {
        throw {
          code: 400,
          error: {
            errCode: "nameAlreadyInUse",
            message: "Invalid Username",
          },
        };
      }
    })
    .then(() => {
      UserDb.register(req.body, req.body.password).then(
        (user) => {
          Log.create({
            username: req.user.username,
            action: "Create",
            object: {
              id: user._id,
              type: "User",
            },
          }).then(() => {
            io.emit("userChanged", { id: user._id, action: "create" });
            res.json({ message: "User added" });
          });
        },
        () => {
          throw {
            code: 400,
            error: {
              errCode: "invalidArgument",
              message: "Registration error",
            },
          };
        }
      );
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const getUsers = (req: UserRequest, res: Response) => {
  if (!req.user.isAdmin) {
    res
      .status(403)
      .json({ errCode: "notAuthorized", message: "User not authorized" });
    return;
  }
  if (!validateRequest(GetUsersInputSchema, req.query)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
    return;
  }
  const query: FilterQuery<UserDocument> = {};
  if (req.query.searchName) {
    query["username"] = { $regex: req.query.searchName, $options: "i" };
  }
  const options = paginateOptions(
    query,
    UserProjection,
    {},
    req.query.limit,
    req.query.pagingNext,
    req.query.pagingPrevious
  );
  UserDb.paginate(options, (err) => res.status(500).json(err)).then(
    (result) => {
      res.json(paginateResponse(result));
    }
  );
};

export const getUserByName = (req: UserRequest, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Username supplied",
    });
    return;
  }
  if (!req.user.isAdmin && req.params.username != req.user.username) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  UserDb.findOne({ username: req.params.username }, UserProjection)
    .then((user) => {
      if (!user) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "User not found",
          },
        };
      } else {
        res.json(user);
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const updateUser = (req: UserRequest, res: Response) => {
  if (
    !validateRequest(UpdateUserInputSchema, req.body) ||
    !req.params.username
  ) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid input",
    });
    return;
  }
  if (!req.params.username) {
    res.status(400).json({
      errCode: "notAuthorized",
      message: "Invalid Username supplied",
    });
    return;
  }
  if (req.user.username != req.params.username && !req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  UserDb.findOne({ username: req.params.username })
    .then((user) => {
      if (!user) {
        throw {
          code: 404,
          error: {
            errCode: "itemNotFound",
            message: "User not found",
          },
        };
      } else {
        user.setPassword(req.body.password).then((user) => {
          user.save();
          Log.create({
            username: req.user.username,
            action: "Update",
            object: {
              id: user._id,
              type: "User",
            },
          }).then(() => res.json({ message: "User password updated" }));
        });
      }
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const deleteUser = (req: UserRequest, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Username supplied",
    });
    return;
  }
  if (req.user.username != req.params.username && !req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized",
    });
    return;
  }
  UserDb.findOne({ username: req.params.username })
    .then((user) => {
      if (user == null) {
        throw {
          code: 400,
          error: {
            errCode: "itemNotFound",
            message: "User not found",
          },
        };
      }
      Store.updateMany(
        { "authorizations.userId": user._id },
        { $pullAll: { authorizations: user._id } }
      ).then(() => {
        UserDb.deleteOne({ _id: user._id }).then((result) => {
          if (result.deletedCount < 1) {
            throw {
              code: 400,
              error: {
                errCode: "itemNotFound",
                message: "User not found",
              },
            };
          }
          if (req.user.username == user.username) {
            req.logout(function (err) {
              if (err) {
                throw err;
              }
            });
          }
          Log.create({
            username: user.username,
            action: "Delete",
            object: {
              id: user._id,
              type: "User",
            },
          }).then(() => {
            io.emit("userChanged", { id: user._id, action: "delete" });
            res.json({ message: "User deleted" });
          });
        });
      });
    })
    .catch((err) => {
      if (err.code && err.error) {
        res.status(err.code).json(err.error);
      } else {
        res.status(500).json(err);
      }
    });
};
export const userLogin = (req: Request, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({ message: "User already authenticated" });
    return;
  }
  if (!validateRequest(UserLoginInputSchema, req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input",
    });
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
          res.json({ message: "Logged In" });
        }
      });
    } else {
      throw {
        code: 400,
        error: {
          errCode: "invalidArgument",
          message: "Invalid username/password supplied",
        },
      };
    }
  })(req, res);
};
export const userLogout = (req: Request, res: Response) => {
  req.logout(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({ message: "logout" });
    }
  });
};
