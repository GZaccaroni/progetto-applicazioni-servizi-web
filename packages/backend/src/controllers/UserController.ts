import {Request, Response} from "express";
import {validateRequest} from "../model/request/validation";
import {CreateUser} from "../model/request/type/CreateUser";
import {UpdateUser} from "../model/request/type/UpdateUser";
import {User} from "../model/request/type/User";
import passport from "passport";
import UserDb from "../model/db_model/User";
import Log from "../model/db_model/Log";

export const createUser=(req,res: Response)=>{
  if(!validateRequest<CreateUser>("CreateUser",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  if(!req.user.isAdmin){
    res.status(403).send("User not authorized");
  }
  UserDb.register(req.body,req.body.password, (err,user)=>{
    if(err){
      res.status(400).send("registration error");
      return;
    }
    Log.create({username: req.user.username, action: "Create", objectId: user._id});
  });
  res.send("Add User valid");
}
export const getUsers=(req,res: Response)=>{
/*  if(!req.user.isAdmin){
    res.status(403).send("User not authorized");
  }*/
  if(!req.query.limit){
    res.status(400).send("Bad request");
  }
  let usernamePattern = "";
  if (req.query.searchName) {
    usernamePattern = req.query.searchName;
  }
  UserDb.paginate();
  const result=UserDb.find({ username: {$regex: "/"+usernamePattern+"/"}}).limit(req.query.limit)
  res.send(result)
}

export const getUserById=(req:Request,res: Response)=>{
  console.log(req.params.username);
  res.send("GetId User")
}
export const updateUser=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateUser>("UpdateUser",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Update User valid")
}
export const deleteUser=(req:Request,res: Response)=>{
  res.send("delete User")
}
export const userLogin=(req,res: Response)=>{
  if(!validateRequest<User>("User",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  passport.authenticate('local', function (err, user, info) {
    if (err) {
      console.log(err);
      return res.status(401).json(err);
    }
    if (user) {
      req.login(user,function(err) {
        if(err){
          console.log("Errore "+err);
        }
      });
      console.log(req);
      res.send(req.user);
    } else {
      res.status(400).json("Invalid username/password supplied");
    }
  })(req, res);
}
export const userLogout=(req,res:Response)=>{
  console.log(req.user)
  req.logout(function(err) {
    if(err){
      console.log("Errore "+err);
    }
  });
  res.send("logout");
}