import dotenv from "dotenv";

import {createClient} from "redis";
import {redisConfig, redisChannel} from "./config.js";

dotenv.config();

const redisClient = createClient({url: redisConfig});

const setCacheCustomerList = async (jsonData) => {
    const value = JSON.stringify(jsonData);
    await redisClient.connect();
    await redisClient.set("customers", value);
    return redisClient.disconnect();
};

const getCacheCustomerList = async () => {
    await redisClient.connect();
    const cachedData = await redisClient.get("customers");
    await redisClient.disconnect();
    return cachedData;
};

const deleteCacheCustomerList = async () => {
    await redisClient.connect();
    await redisClient.del("customers");
    return redisClient.disconnect();
};

const customerInfoPublishForConsumer = async (data) => {
    await redisClient.connect();
    const subscriberCount = await redisClient.publish(redisChannel, data);
    await redisClient.disconnect();
    console.log(`Total Subscribe Count From ${redisChannel} is: ${subscriberCount}`)
};
export {setCacheCustomerList, getCacheCustomerList, deleteCacheCustomerList, customerInfoPublishForConsumer};