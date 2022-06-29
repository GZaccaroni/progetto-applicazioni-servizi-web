import {Request, Response} from "express";

export const getAnalytics=(req:Request,res: Response)=>{
  res.send("get ANalytics");
}