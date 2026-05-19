import { Router } from "express";
import adminCategoryController from "../../../controllers/admin/adminCategoryController.ts";
import { adminCreateCategorySchema } from "../../../schemas/admin/category/createCategory.ts";
import { validate } from "../../../middlewares/validate.ts";

const router = Router();

// 이 create라는 건 프론트엔드에서 값을 답아와야 함 => 검증 필요
router.post("/create", validate(adminCreateCategorySchema), adminCategoryController.createCategory);
router.get("/list", adminCategoryController.getCategoryList);

router.patch("/:id/status", adminCategoryController.toggleCategoryStatus);

export default router;
