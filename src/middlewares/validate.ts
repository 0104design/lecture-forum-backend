import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

// middleware: express가 데이터를 전송하는데 중간에 가로채서 무언가를 할 함수
// middleware목적의 함수는 반환값이 (req.  res, next) => {} 의 모양.
export const validate = (schema: ZodType) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // 실제 검증 처리를 한 코드
        // .safeParseAsync : (검증 할 데이터) : 내가 작성한 조건에 부합하는 지 확인하는 메서드(비동기 함수)
        const result = await schema.safeParseAsync(req.body);

        if (!result.success) {
            // result.success가 false의 경우가 여기서 실행

            // 에러난 이유를 클라이언트에게 알려줘야 함.
            const errorMessage = result.error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message,
            }));

            res.status(400).json({ message: "잘못된 입력값입니다", errors: errorMessage });
            return;
        }
        // result.success의 결과가 true일 경우 여기서 실행됨 => 이 함수를 끝내고컨트롤러로 전송
        req.body = result.data;
        next();
    };
};
