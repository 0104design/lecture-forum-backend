import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST || "",
    port: Number(process.env.DATABASE_PORT), // process.env의 port가 undefined Number(undefined)의 결과는 NaN
    user: process.env.DATABASE_USERNAME || "",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "",
    connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
