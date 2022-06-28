import {Request, Response} from "express";
import {validateRequest} from "../schema/validation";
import {CreateUser} from "../schema/type/CreateUser";
import {UpdateUser} from "../schema/type/UpdateUser";
import {User} from "../schema/type/User";

export const createUser=(req:Request,res: Response)=>{
  if(!validateRequest<CreateUser>("CreateUser",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("Add User valid")
}
export const getUsers=(req:Request,res: Response)=>{
  res.send("Get Users")
}
export const getUserById=(req:Request,res: Response)=>{
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
export const userLogin=(req:Request,res: Response)=>{
  if(!validateRequest<User>("User",req.body)){
    res.status(400).send("Invalid Input");
    return;
  }
  res.send("login")
}
export const userLogout=(req:Request,res: Response)=>{
  res.send("logout")
}