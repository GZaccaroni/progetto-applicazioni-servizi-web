import {Router} from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userLogout
} from "../controllers/UserController";

const UserRoutes = Router();

UserRoutes.route("/").post(createUser);

UserRoutes.route("/find").get(getUsers);

UserRoutes.route("/:id").get(getUserById)
                              .put(updateUser)
                              .delete(deleteUser);

UserRoutes.route("/login").post(userLogin);
UserRoutes.route("/logout").get(userLogout);

export default UserRoutes;