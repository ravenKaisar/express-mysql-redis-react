import dotenv from "dotenv";

dotenv.config();
const mysqlConfig = {
    host: process.env.MYSQL_HOST || "",
    user: process.env.MYSQL_USERNAME || "",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "",
    port: process.env.MYSQL_PORT || ""
}

const redisConfig = `redis://${process.env.REDIS_USER || ""}:${process.env.REDIS_PASSWORD || ""}@${process.env.REDIS_HOST || ""}:${process.env.REDIS_PORT || ""}`;

const customerInfoDeleteChannel = process.env.REDIS_CUSTOMER_INFO_DELETE_CHANNEL || ""
const customerInfoStoreChannel = process.env.REDIS_CUSTOMER_INFO_STORE_CHANNEL || ""

export {mysqlConfig, redisConfig, customerInfoDeleteChannel, customerInfoStoreChannel};