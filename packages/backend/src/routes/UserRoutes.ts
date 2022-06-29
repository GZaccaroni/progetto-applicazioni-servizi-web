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

UserRoutes.route("/login").post(userLogin);
UserRoutes.route("/logout").get(userLogout);


UserRoutes.route("/:username").get(getUserById)
                                    .put(updateUser)
                                    .delete(deleteUser);

export default UserRoutes;