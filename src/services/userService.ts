import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";

const createUser = async (data: UserCreateInput) => {
    // controller에서 만들어진 newUser를 받아서 DB에 자장
    // prisma.table.create(객체) : INSERT하는메서드 => return값이 생성된 User 객체
    // prisma는 DB와 통신을 하는 ORM 이므로 당연히 비동기 함수임.  => async - await

    // create(비동기 함수)를 생성하면 USER 객체가 반환되는데, 그걸 바로 return시틸거면 await키워드 생략 가능
    // await 키워드를 생략할 거랴면, async 뺴면 안 됨/.
    return prisma.user.create({
        data,
    });
};

export default {
    createUser,
};
