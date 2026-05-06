import { Request, Response } from "express";

const createUser = (req: Request, res: Response) => {
    // 프론트엔드가 요청한 정보를 꺼낸

    // JSON을 객체로 바꿀 때 가능란 건 string, boolean, number, null만 가능
    // 날짜는 JSON.parse() 해도 string임.
    const { username, password, name, nickName, email, phoneNumber, birthDate, gender, role } =
        req.body;

    const newUser = {
        username,
        password,
        name,
        nickName,
        email,
        phoneNumber: birthDate ? new Date(birthDate) : null,
        birthDate,
        gender,
        role,
    };

    // newUser를 가지고 DB에 저장 -> Service로 보내야 함.
};

export default {
    createUser,
};
