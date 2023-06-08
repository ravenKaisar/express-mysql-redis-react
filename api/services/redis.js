import {createClient} from "redis";

import {customerInfoDeleteChannel, customerInfoStoreChannel, redisConfig} from "./config.js";

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
    const subscriberCount = await redisClient.publish(customerInfoStoreChannel, data);
    await redisClient.disconnect();
    console.log(`Total Consumer Count From ${customerInfoStoreChannel} channel is: ${subscriberCount}`)
};

const customerDeletePublishForConsumer = async (id) => {
    await redisClient.connect();
    const subscriberCount = await redisClient.publish(customerInfoDeleteChannel, id);
    await redisClient.disconnect();
    console.log(`Total Consumer Count From ${customerInfoDeleteChannel} channel is: ${subscriberCount}`)
};
export {
    setCacheCustomerList,
    getCacheCustomerList,
    deleteCacheCustomerList,
    customerInfoPublishForConsumer,
    customerDeletePublishForConsumer
};