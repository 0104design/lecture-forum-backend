import { z } from "zod";
import { GenderType } from "../../generated/prisma/enums.ts";

// zod를 통해 Input값에 대한 객체모양
export const createUserSchema = z.object({
    username: z.string().min(4),
    password: z.string().min(6),
    name: z.string().min(2),
    nickName: z.string().min(2).max(50),
    email: z.email(),
    phoneNumber: z.string().optional(),
    birthday: z.string().optional(),
    gender: z.enum(GenderType),
});

// 위에서 만든 createUserSchema는 조건을 건 "객체"를 만든 일이라, 앞으로 다른 곳에서 사용할 타입을 만들줘어야 함.
export type CreateUserInputType = z.infer<typeof createUserSchema>;
