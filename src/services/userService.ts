import { UserCreateInput } from "../generated/prisma/models/User.ts";
import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";

const createUser = async (data: UserCreateInput) => {
    try {
        return prisma.user.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Prisma error객체 내부에서 code항복이 "P2002" 인 것이
            // 중복값이 있을떄의 에러코드임
            if (error.code === "P2002") {
                // 중복된 값이 어떤 것인지에 대한 정보는
                // 이 코드에 들어있는 데 이 코드의 프로퍼티 타입은 string[] | undefined
                const target = error.meta?.targert as string[];

                // 예시
                // target = ["username", "nickname"];
                // array의 요소 중 "이 값: 이 있는 지 확인하는 메소드는 .includes()
                // .find() 와 비슷한 역할이지만,
                // find는 조건을 걸어서 찾는 메서드이고 (리턴값은 찾은 그 요소)
                // includes는 단순하게 집어넣은 값과 완벽히 같은 것이 있는 지 true/false로 반환
                if (target?.includes("username")) {
                    // 상위로 에러를 던지는데
                    // 새로운 자바스트립트 표준 에러 체를 만들어서 던빔
                    // 내용에 "ALREADY_EXISTS_USERNAME"
                    throw new Error("ALREADY_EXISTS_USERNAME");
                }
                if (target.includes("email")) {
                    throw new Error("ALREADY_EXISTS_EMAIL");
                }
                if (target.includes("nickName")) {
                    throw new Error("ALREADY_EXISTS_NICKNAME");
                }
                throw new Error("UNKNOWN ERROR");
            }
        }

        throw new Error("UNKNOWN ERROR");// 값을 return하는 게 아니라 error를 return하는 키워드
    }
    // controller에서 만들어진 newUser를 받아서 DB에 자장
    // prisma.table.create(객체) : INSERT하는메서드 => return값이 생성된 User 객체
    // prisma는 DB와 통신을 하는 ORM 이므로 당연히 비동기 함수임.  => async - await

    // create(비동기 함수)를 생성하면 USER 객체가 반환되는데, 그걸 바로 return시틸거면 await키워드 생략 가능
    // await 키워드를 생략할 거랴면, async 뺴면 안 됨/.
};

export default {
    createUser,
};
