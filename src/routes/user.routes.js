import { Router } from "express";
const router = Router();
import * as usercontoller from "../controllers/user.controller.js";
import * as userMiddleware from "../middlewares/user.middleware.js"
import { body } from "express-validator";
router.post(
  "/register",
  userMiddleware.registerUserValidation
  ,usercontoller.creatUserController
);
router.post('/login',userMiddleware.loginUserValidator,usercontoller.logincontroler)
export default router;
router.get('/profile',userMiddleware.authUser,(req,res)=>{
    res.json(req.user)
})
router.get('/logout',userMiddleware.authUser,usercontoller.logoutcontroller)