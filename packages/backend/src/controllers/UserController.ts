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
import Store from "../model/db_model/Store";

export const createUser = (req, res: Response) => {
  if (!validateRequest<CreateUser>("CreateUser", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  if (!req.user.isAdmin) {
    res.status(403).json({errCode: "notAuthorized", message: "User not authorized"});
    return;
  }
  UserDb.findOne({username:req.body.username}).then(user=>{
    if(user){
      throw {
        code:400,
        error: {errCode: "nameAlreadyinUse", message: "Invalid Username"}
      }
    }
  }).then(()=>{
    UserDb.register(req.body, req.body.password, (err, user) => {
      if (err) {
        throw {
          code: 400,
          error: {
            errCode: "invalidArgument",
            message: "Registration error"
          }
        }
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
      });
    });
  }).catch(err => {
    if(err.code && err.error){
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const getUsers = (req, res: Response) => {
  if (!req.user.isAdmin) {
    res.status(403).json({errCode: "notAuthorized", message: "User not authorized"});
    return;
  }
  if (!validateRequest<CreateUser>("CreateUser", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  const query = {};
  if (req.query.searchName) {
    query["username"] = {$regex: req.query.searchName, $options: "i"};
  }
  const options = paginateOptions(query, UserProjection, {}, req.query.limit, req.query.pagingNext, req.query.pagingPrevious)
  UserDb.paginate(options, err => res.status(500).json(err)).then((result) => {
    res.json(paginateResponse(result));
  });
}

export const getUserByName = (req, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Username supplied"
    });
    return;
  }
  if (!req.user.isAdmin && req.params.username != req.user.username) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized"
    });
    return;
  }
  UserDb.findOne({username: req.params.username}, UserProjection, (err, user) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (!user) {
        res.status(404).json({errCode: "itemNotFound", message: "User not found"});
      } else {
        res.json(user);
      }
    }
  });
}
export const updateUser = (req, res: Response) => {
  if (!validateRequest<UpdateUser>("UpdateUser", req.body) || !req.params.username) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid user supplied"
    });
    return;
  }
  if (!req.params.username) {
    res.status(400).json({
      errCode: "notAuthorized",
      message: "Invalid Username supplied"
    });
    return;
  }
  if (req.user.username != req.params.username && !req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized"
    });
    return;
  }
  UserDb.findOne({username: req.params.username}, (err, user) => {
    if (err) {
      res.status(500).json(err);
    } else {
      if (!user) {
        res.status(404).json({errCode: "itemNotFound", message: "User not found"});
      } else {
        user.setPassword(req.body.password, (err, user) => {
          if (err) {
            res.status(500).json(err);
          } else {
            user.save();
            Log.create({
              username: req.user.username,
              action: "Update",
              object: {
                id: user._id,
                type: "User"
              }
            }).then(() => res.json({message: "User password updated"}), err => res.status(500).json(err));
          }
        });
      }
    }
  })
}
export const deleteUser = (req, res: Response) => {
  if (!req.params.username) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Username supplied"
    });
    return;
  }
  if (req.user.username != req.params.username && !req.user.isAdmin) {
    res.status(403).json({
      errCode: "notAuthorized",
      message: "User not authorized"
    });
    return;
  }
  UserDb.findOne({username: req.params.username}).then(user => {
    if(user == null){
      throw {
        code: 400,
        error:{errCode: "itemNotFound", message: "User not found"}
      }
    }
    Store.updateMany({"authorizations.userId":user._id},{$pullAll:{authorizations:user._id}}).then(()=>{
      UserDb.deleteOne({_id:user._id}).then(result=>{
        if(result.deletedCount<1){
          throw {
            code: 400,
            error:{errCode: "itemNotFound", message: "User not found"}
          }
        }
        if (req.user.username == user.username) {
          req.logout();
        }
        Log.create({
          username: user.username,
          action: "Delete",
          object: {
            id: user._id,
            type: "User"
          }
        }).then(() => {
          io.emit("userChanged", {id: user._id, action: "delete"});
          res.json({message: "User deleted"})
        });
      })
    })
  }).catch(err => {
    if(err.code && err.error){
      res.status(err.code).json(err.error)
    } else {
      res.status(500).json(err);
    }
  });
}
export const userLogin = (req, res: Response) => {
  if (req.isAuthenticated()) {
    res.json({message: "User already authenticated"});
    return;
  }
  if (!validateRequest<User>("User", req.body)) {
    res.status(400).json({
      errCode: "invalidArgument",
      message: "Invalid Input"
    });
    return;
  }
  passport.authenticate('local', function (err, user) {
    if (err) {
      res.status(500).json(err);
      return;
    }
    if (user) {
      req.login(user, function (err) {
        if (err) {
          res.status(500).json(err);
        } else {
          res.json({message: "Logged In"});
        }
      });
    } else {
      res.status(400).json({
        errCode: "invalidArgument",
        message: "Invalid username/password supplied"
      });
    }
  })(req, res);
}
export const userLogout = (req, res: Response) => {
  req.logout(function (err) {
    if (err) {
      res.status(500).json(err);
    } else {
      res.json({message: "logout"});
    }
  });
}