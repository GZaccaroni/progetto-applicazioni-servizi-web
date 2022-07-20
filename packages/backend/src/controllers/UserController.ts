import {Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateUser} from "../model/request/type/CreateUser";
import {UpdateUser} from "../model/request/type/UpdateUser";
import {User} from "../model/request/type/User";
import passport from "passport";
import UserDb, {UserProjection} from "../model/db_model/User";
import Log from "../model/db_model/Log";
import {paginateOptions, paginateResponse} from "../paginationUtils";
import {io} from "../app";

export const createUser = (req, res: Response) => {
  if (!validateRequest<CreateUser>("CreateUser", req.body)) {
    res.status(400).json({message: "Invalid Input"});
    return;
  }
  if (!req.user.isAdmin) {
    res.status(403).json({message: "User not authorized"});
    return;
  }
  UserDb.register(req.body, req.body.password, (err, user) => {
    if (err) {
      res.status(400).json({message: "registration error"});
      return;
    }
    Log.create({
      username: req.user.username,
      action: "Create",
      object: {
        id: user._id,
        type: "User"
      }
    }).then(() => {
      io.emit("userChanged", {id: user._id, action: "create"});
      res.json({message: "User added"})
    }, err => res.json(err));
  });
}
export const getUsers = (req, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({message: "User not authorized"});
    return;
  }
  if (!req.query.limit) {
    res.status(400).json({message: "Bad request"});
    return;
  }

  const query = {};
  if (req.query.searchName) {
    query["username"] = {$regex: req.query.searchName, $options: "i"};
  }
  const options = paginateOptions(query,
                                  UserProjection,
                                  req.query.limit,
                                  req.query.pagingNext,
                                  req.query.pagingPrevious)
  UserDb.paginate(options, err => res.json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const getUserByName = (req, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({message: "Invalid Username supplied"});
    return;
  }
  if (!req.user.isAdmin && req.params.username != req.user.username) {
    res.status(403).json({message: "User not authorized"});
    return;
  }
  UserDb.findOne({username: req.params.username}, UserProjection, (err, user) => {
    if (err) {
      res.json(err);
    } else {
      if (!user) {
        res.status(404).json({message: "User not found"});
      } else {
        res.json(user);
      }
    }
  });
}
export const updateUser = (req, res: Response) => {
  if (!validateRequest<UpdateUser>("UpdateUser", req.body) || !req.params.username) {
    res.status(400).json({message: "Invalid user supplied"});
    return;
  }
  if (!req.params.username) {
    res.status(400).json("Invalid Username supplied");
    return;
  }
  if (req.user.username != req.params.username) {
    res.status(403).json({message: "User not authorized"});
    return;
  }
  UserDb.findOne({username: req.params.username}, (err, user) => {
    if (err) {
      res.json(err);
    } else {
      if (!user) {
        res.status(404).json({message: "User not found"});
      } else {
        user.setPassword(req.body.password, (err, user) => {
          if (err) {
            res.json(err);
          } else {
            user.save();
            Log.create({
              username: req.user.username,
              action: "Update",
              object: {
                id: user._id,
                type: "User"
              }
            }).then(() => res.json({message: "User password updated"}), err => res.json(err));
          }
        });
      }
    }
  })
}
export const deleteUser = (req, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({message: "Invalid Username supplied"});
    return;
  }
  if (req.user.username != req.params.username  && !req.user.isAdmin) {
    res.status(403).json({message: "User not authorized"});
    return;
  }
  UserDb.findOneAndDelete({username: req.params.username}, (err, user) => {
    if (err)
      res.json(err);
    else {
      if (user == null) {
        res.status(404).json({message: "User not found"});
      } else {
        const username= req.user.username;
        req.logout(function (err) {
          if (err) {
            res.json(err);
            return;
          } else {
            Log.create({
              username: username,
              action: "Delete",
              object: {
                id: user._id,
                type: "User"
              }
            }).then(() => {
              io.emit("userChanged", {id: user._id, action: "delete"});
              res.json({message: "User deleted"})
            }, err => res.json(err));
          }
        });
      }
    }
  });
}
export const userLogin = (req, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({message: "User already authenticated"});
    return;
  }
  if (!validateRequest<User>("User", req.body)) {
    res.status(400).json({message: "Invalid Input"});
    return;
  }
  passport.authenticate('local', function (err, user) {
    if (err) {
      res.status(401).json(err);
      return;
    }
    if (user) {
      req.login(user, function (err) {
        if (err) {
          res.json(err);
        } else {
          res.json({message: "Logged In"});
        }
      });
    } else {
      res.status(400).json({message: "Invalid username/password supplied"});
    }
  })(req, res);
}
export const userLogout = (req, res: Response) => {
  req.logout(function (err) {
    if (err) {
      res.json(err);
    } else {
      res.json({message: "logout"});
    }
  });
}