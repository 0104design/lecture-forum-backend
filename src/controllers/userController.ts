import { Request, Response } from "express";
import { UserCreateInput } from "../generated/prisma/models/User.ts";
import userService from "../services/userService.ts";

const createUser = async (req: Request, res: Response) => {
    try {
        // 프론트엔드가 요청한 정보를 꺼낸

        // JSON을 객체로 바꿀 때 가능란 건 string, boolean, number, null만 가능
        // 날짜는 JSON.parse() 해도 string임.
        const { username, password, name, nickName, email, phoneNumber, birthDate, gender, role } =
            req.body;

        const userData: UserCreateInput = {
            username,
            password,
            name,
            nickName,
            email,
            phoneNumber,
            birthDate: birthDate ? new Date(birthDate) : null,
            gender,
            role,
        };

        // newUser를 가지고 DB에 저장 -> Service로 보내야 함.

        const newUser = await userService.createUser(userData);

        // 여기서부터는 응답 처리 (response)
        // res 라는 앞으로 응답에 나갈 박스에
        // stat code를 201로 하고
        // 응답에 들어갈 string 데이처로 newUser를 json가공하야 넣는다.
        res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "유저 생성 중 오류가 발생했습니다. " });
    }
};

export default {
    createUser,
};
