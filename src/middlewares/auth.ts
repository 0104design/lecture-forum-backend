import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwtUtil from "../utils/jwt/jwtUtil.ts";
import prisma from "../config/prisma.ts";
import { RoleType, User } from "../generated/prisma/client.ts";

interface AuthRequest extends Request {
    user?: User;
}

//  middleware로 상요할 녀석의 함수 매개변수는
// req: 외부에서 들어온 정보가 있는 바스
// res: 외부로 나갈 정보를 담은 박스
// next : 다음 기능으로 넘겨줄 수 있는 기능(메서드)
// 그래서 이 미들웨어에서 return을 치면 미들웨어 종료
// 다음 함수 실행 => next()

// 원래 req자리에 들어와야되는 인터페이스는 Request 이므로
// Request를 살행하려면 AuthRequest가 그 자리에 들어갈 수 있음
export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        // 들어온 Request에서 헤더의 내용을 꺼네 Authorization중 갑이 있는 지 확인하고
        const authHeader = req.headers.authorization;
        // express가 자동으로 Authorization을 키에 존재하는 값을 authorizatio 프로퍼티에 담아줌

        // 그 Authorization 값이 Bearer의 ###의 값으로 들와오는지, ###이 있으면 그 값을 받아옴
        // authorization 프로퍼티의 값 타입은 string이기 때문에 stratsWith() 메서드를 통해 확인
        if (!authHeader || !authHeader.startsWith("bearer ")) {
            res.status(401).json({ message: "로그인이 필요한 서비스입니다. (토큰 없음)" });
            return;
        }
        // split메서드는  string타입에 사용하고 매개변수에 넣은 문자열로 값을 나누는 메서드
        //              : "Bearer ###"를 split으로 나눈 결과 값은 ["Bearer", "###"]로 리턴
        const token = authHeader.split(" ")[1];

        // 들어온 값이 "Bearer "일 수도 있음
        if (!token) {
            res.status(401).json({ message: "토큰이 비어있거나 형식이 올바르지 않습니다." });
            return;
        }

        // 그 ###가 내가 발급한 토큰이 맞는 지 검증
        const decoded = jwtUtil.verifyToken(token); // decoded = { id: #### }

        // 그 token안에 있는 내용을 끼 봐서 그 기록된 사용자가 현재 살아있는 사용자인 지 확인하고 (DB와의 통신 필요)
        const user = await prisma.user.findUnique({
            where: {
                id: decoded.id,
            },
        });

        if (!user || user.deletedAt) {
            res.status(401).json({ message: "유효하지 않은 사용자이거나 탈퇴한 계정입니다." });
            return;
        }
        req.user = user;
        // 살아있는 사용자라면 허용
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "토큰이 만료되었습니다. 다시 로그인해주세요" });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "유효하지 않은 토큰입니다. 다시 르그인해주세요." });
            return;
        }
        console.log(error);
        res.status(500).json({ message: "인증 처리 중 에러가 발생되었습니다." });
    }
};

export const requiredAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    // 그렇게 확인해 온 user정보 중, user.role === "ADMIN" 인가만 판별하는 기능만 탑재
    // 이대로 구현하기 위해서 user정보를 꺼내야 하는데 지금은 가져올 곳이 곳이 없음
    // requiredAdmin 이라는 함수는 다른 정보에는 접근이 불가하지만 req, res, next는 쓸 수 있음
    // 근데 res는 밖으로 나갈 박스니까 낙서 X
    // next는 다음으로 진행하는 기능이니까 낙서 X
    // req는 외부에서 들어오는 내용이 담기는 박스이지만 낙서를 해도 상관없음
    // 그럼 authenticate를 할 때 사용자 정보(user)를 req에 넣자.
    if (!req.user) {
        res.status(401).json({ message: "인증 정보가 없습니다. 먼저 로그인해주세요" });
        return;
    }
    if (req.user.role !== RoleType.ADMIN) {
        res.status(403).json({ message: "해당 기능에 접근할 수 있는 관리자 권한이 없습니다." });
        return;
    }
    next();
};
