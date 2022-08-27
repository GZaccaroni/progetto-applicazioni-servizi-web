import { Router } from "express";
import {
  createUser,
  deleteUser,
  getCurrentUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userLogout,
} from "@/controllers/UserController";
import { isUserLoggedIn } from "@/utils";

const UserRoutes = Router();

UserRoutes.route("/login").post(userLogin);
UserRoutes.route("/logout").post(userLogout);
UserRoutes.use(isUserLoggedIn);
UserRoutes.route("/").post(createUser);
UserRoutes.route("/find").get(getUsers);
UserRoutes.route("/me").get(getCurrentUser);
UserRoutes.route("/:userId")
  .get(getUserById)
  .post(updateUser)
  .delete(deleteUser);

export default UserRoutes;
