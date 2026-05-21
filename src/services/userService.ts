import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { LoginInputType } from "../schemas/user/login.ts";
import passwordUtil from "../utils/password/passwordUtil.ts";
import jwtUtil from "../utils/jwt/jwtUtil.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return await prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Prisma error객체 내부에서 code항복이 "P2002" 인 것이
            // 중복값이 있을떄의 에러코드임
            if (error.code === "P2002") {
                // 중복된 값이 어떤 것인지에 대한 정보는
                // 이 코드에 들어있는 데 이 코드의 프로퍼티 타입은 string[] | undefined
                const errorMessage = error.message;

                // 예시
                // target = ["username", "nickname"];
                // array의 요소 중 "이 값: 이 있는 지 확인하는 메소드는 .includes()
                // .find() 와 비슷한 역할이지만,
                // find는 조건을 걸어서 찾는 메서드이고 (리턴값은 찾은 그 요소)
                // includes는 단순하게 집어넣은 값과 완벽히 같은 것이 있는 지 true/false로 반환
                if (errorMessage.includes("username")) {
                    // 상위로 에러를 던지는데
                    // 새로운 자바스트립트 표준 에러 체를 만들어서 던빔
                    // 내용에 "ALREADY_EXISTS_USERNAME"
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (errorMessage.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (errorMessage.includes("nickName")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN ERROR");
            }
        }

        throw new Error("UNKNOWN ERROR"); // 값을 return하는 게 아니라 error를 return하는 키워드
    }
    // controller에서 만들어진 newUser를 받아서 DB에 자장
    // prisma.table.create(객체) : INSERT하는메서드 => return값이 생성된 User 객체
    // prisma는 DB와 통신을 하는 ORM 이므로 당연히 비동기 함수임.  => async - await

    // create(비동기 함수)를 생성하면 USER 객체가 반환되는데, 그걸 바로 return시틸거면 await키워드 생략 가능
    // await 키워드를 생략할 거랴면, async 뺴면 안 됨/.
};

const getUserById = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id,
        },
    });

    if (!user) {
        throw new Error("USER_NOT_FOUND");
    }
    return user;
};

const login = async (data: LoginInputType) => {
    // prisma.테이블.findUnique(조건객체) : SELECT명령 (단., unique칼럼을 통해)
    // .findUnique 라는메서드는 객체 1개만 리턴
    // find 메서드는 Array 리턴
    const user = await prisma.user.findUnique({
        where: {
            username: data.username,
        },
    });
    // 검색을 했는데 해당 냉용이 없는 건 에러가 아님
    // DB에서 조회한 내용인 user가 없거나 deletedAt의 값이 이ㅛ다면
    if (!user || user.deletedAt) {
        throw new Error("INVALID_CREDENTIALS");
    }

    const isValid = await passwordUtil.verifyPassword(data.password, user.password);
    if (!isValid) {
        throw new Error("INVALID_CREDENTIALS");
    }
    // 아이디와 비밀번호가 일치하는 정보가 있다는 뜻 => 로그인
    const token = jwtUtil.generateToken(user.id);

    // password, deletedAt라는 항목은 응답에 포함시킬 필요 없어서 그걸 제외한 나머지만 safeUserInfo 에 저장
    const { password, deletedAt, ...safeUserInfo } = user;

    return {
        user: safeUserInfo,
        token,
    };

    //createUser에서는 에러가 나는 부붑ㄴ에 에러객체 Prisma의 Error객체였끼 때문에
    // service에서는 Jacascript의 객체로 바꿔줄 필요가 있었지만
    //
};

export default {
    createUser,
    getUserById,
    login,

};
