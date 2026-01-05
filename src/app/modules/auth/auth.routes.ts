import express from "express"
import { authcontroller } from "./auth.controller"
import { auth } from "../../middleware/auth"
import { authservice } from "./auth.service"
import { upload } from "../../middleware/multer"


const router = express.Router()

router.post("/register",upload.single("image"),  authcontroller.register)
router.post("/login", authcontroller.login)
router.post("/google", authcontroller.googlelogin) 
router.get("/get" ,auth, authcontroller.getMe)
router.post("/logout", auth, authcontroller.logoutUser);




export const authroute = router