import { Router } from "express";
import { getHome, postUser, Login, getAllUsers, getSingleUser, deleteSingle, logOut} from "../controllers/userControllers.js";
import { checkToken } from "../middleWare/authMiddleware.js";

const router = Router();
router.get("/", getHome)
router.post("/post-user", postUser)
router.post("/Login", Login) 
router.post("/Users/:id", checkToken, getAllUsers, getSingleUser)
router.delete("/delete-user/:id", checkToken, deleteSingle)
router.get("/logout", checkToken, logOut)


export default router