import {Request, Response} from "express";

export const createUser=(req:Request,res: Response)=>{
  res.send("Add User")
}
export const getUsers=(req:Request,res: Response)=>{
  res.send("Get Users")
}
export const getUserById=(req:Request,res: Response)=>{
  res.send("GetId User")
}
export const updateUser=(req:Request,res: Response)=>{
  res.send("Update User")
}
export const deleteUser=(req:Request,res: Response)=>{
  res.send("delete User")
}
export const userLogin=(req:Request,res: Response)=>{
  res.send("login")
}
export const userLogout=(req:Request,res: Response)=>{
  res.send("logout")
}