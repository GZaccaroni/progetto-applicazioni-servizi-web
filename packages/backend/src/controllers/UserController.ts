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
  //UserDb.paginate();
  UserDb.find({ username: {$regex: "/"+usernamePattern+"/"}}).limit(req.query.limit);
  res.send("User");
}

export const getUserByName=(req:Request, res: Response)=>{
  //TODO Not authorized
  if(!req.params.username){
    res.status(400).send("Invalid Username supplied");
    return;
  }
  UserDb.findOne({username: req.params.username},["username", "isAdmin"],(err, user)=>{
    if(err){
      res.send(err);
    }
    else {
      if(user==null){
        res.status(404).send('User not found');
      } else {
        res.json(user);
      }
    }
  });
}
export const updateUser=(req:Request,res: Response)=>{
  if(!validateRequest<UpdateUser>("UpdateUser",req.body) || !req.params.username){
    res.status(400).send("Invalid user supplied");
    return;
  }
  if(!req.params.username){
    res.status(400).send("Invalid Username supplied");
    return;
  }
  res.send("Update User valid")
}
export const deleteUser=(req,res: Response)=>{
  if(!req.params.username){
    res.status(400).send("Invalid Username supplied");
    return;
  }
  if(req.user.username!=req.params.username){
    res.status(403).send("User not authorized");
    return;
  }
  UserDb.deleteOne({username:req.params.username},(err, result)=> {
    if (err)
      res.send(err);
    else{
      if(result.deletedCount==0){
        res.status(404).send("User not found");
      }
      else{
        req.user.logout(function(err) {
          if(err){
            console.log("Errore "+err);
          }
        });
        res.json("User deleted");
      }
    }
  });
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