import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "";

export interface DecodedToken extends JwtPayload {
    id: number;
}

const generateToken = (userId: number) => {
    // jwt.sign(신분증에 들어갈 정보, 열쇠, 옵션) : 신분증을 위한, 암호화 하는 메서드 리턴 내용 (string)
    return jwt.sign({ id: userId }, SECRET_KEY, {
        expiresIn: "1d", // 하루동안 유효
    });
};


// jsonwebtoken ro발자는 "니가 만든 신분증이 튀어나올거니까 JwtPayload 수정해서 써"
const verifyToken = (token: string) => {
    // jwt.verify(토큰, 열쇠) : 암호화된 토큰을 복호화 하는 메소드 (리턴값은 jwtPayload = {빈 객체})
    return jwt.verify(token, SECRET_KEY) as DecodedToken;
};

export default {
    generateToken,
    verifyToken,
};
