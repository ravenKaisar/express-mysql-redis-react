"use strict";
import {createClient} from "redis";

import {createCustomer, deleteCustomerById} from './services/mysql.js'
import { redisConfig, customerInfoDeleteChannel, customerInfoStoreChannel} from './services/config.js'

(function () {
    const subscriber = createClient({url: redisConfig});
    subscriber.connect();

    subscriber.on("error", (error) => console.log("Redis Connection Error", error));
    subscriber.on("connect", () => console.log("Successfully Connected to Redis"));
    subscriber.on("reconnecting", () => {
        console.log("Trying Reconnecting to Redis.");
    });
    subscriber.on("ready", () => {
        console.log("Yahoo! Redis Service ready for action!");
        subscriber.subscribe(customerInfoStoreChannel, async (message) => {
            console.log(`Data Received From Producer via ${customerInfoStoreChannel} channel: ${message}`);
            try {
                await createCustomer(message);
            } catch (error) {
                console.log(`Error From Producer via ${customerInfoStoreChannel} channel: ${error}`);
            }
        });

        subscriber.subscribe(customerInfoDeleteChannel, async (message) => {
            console.log(`Data Received From Producer via ${customerInfoDeleteChannel} channel: ${message}`);
            try {
                await deleteCustomerById(message);
            } catch (error) {
                console.log(`Error From Producer via ${customerInfoDeleteChannel} channel: ${error}`);
            }
        });
    });
})();
