// Create Model
import mongoose from "mongoose";

export const User = new mongoose.Schema({
  username: String,
  isAdmin: Boolean
});