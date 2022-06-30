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
import {isUserLoggedIn} from "../utils";

const UserRoutes = Router();


UserRoutes.route("/login").post(userLogin);
UserRoutes.route("/logout").get(userLogout);
UserRoutes.use(isUserLoggedIn);
UserRoutes.route("/").post(createUser);
UserRoutes.route("/find").get(getUsers);
UserRoutes.route("/:username").get(getUserById)
                                    .put(updateUser)
                                    .delete(deleteUser);

export default UserRoutes;