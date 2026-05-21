import dotenv from "dotenv";
import express from "express";
import userRouter from "./routes/userRouter.ts";
import cors from "cors";
import adminRouter from "./routes/admin/adminRouter.ts";
import { authenticate, requiredAdmin } from "./middlewares/auth.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

// 기능을 확장 할 떄는 app.use() 라는 메서드 사용

// 데이터 교차 출처 리소스 공유(CORS)를 허용하는 건 백엔드에서 증명하여 해야 함
// cors() 만 사용하면 모든 프론트엔드 주소에 대해 허용 증명을 하는 것
/// cors({ origin: 주소 }) 를 하면 특정 주소에 대해서만 허용 증명
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
// express.json() : 요청의 본문에서 JSON형태를 객체로 변환하여 request.body에 저장
app.use(express.json());

// 요청의 본문에서 URL-encoded 데이터를 객체로 변환하여  request.body에 저장
// URL은 한글을 원래 포함할 수 없기 때문에 변환을 하게 되는데, 그것을 한글로 받아들일 수 있도록 하는 기눙
app.use(express.urlencoded({ extended: true }));

// 프론트엔드가 하는 요청에 대하여 경로 Routing 등록
app.use("/user", userRouter);
app.use("/admin", authenticate, requiredAdmin, adminRouter);

app.listen(8000, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
