import { Router } from "express";
import userController from "../controllers/userController.ts";

const router = Router();


//  /user/create라고 post방식 요청이 도착하면 이 아래둘이 실행.
router.post("/create", userController.createUser);

export default router;
