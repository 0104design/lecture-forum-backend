import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

// 기능을 확장 할 떄는 app.use() 라는 메서드 사용
// express.json() : 요청의 본문에서 JSON형태를 객체로 변환하여 request.body에 저장
app.use(express.json());

// 요청의 본문에서 URL-encoded 데이터를 객체로 변환하여  request.body에 저장
// URL은 한글을 원래 포함할 수 없기 때문에 변환을 하게 되는데, 그것을 한글로 받아들일 수 있도록 하는 기눙
app.use(express.urlencoded({extended: true}));

app.listen(8000, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
