"use strict";
import {createClient} from "redis";

import {createCustomer} from './services/mysql.js'
import {redisChannel, redisConfig} from './services/config.js'

(function () {
    const subscriber = createClient({url: redisConfig});
    subscriber.connect();

    // redis status logger
    subscriber.on("error", (error) => console.log("Redis Connection Error", error));
    subscriber.on("connect", () => console.log("Successfully Connected to Redis"));
    subscriber.on("reconnecting", () => {
        console.log("Trying Reconnecting to Redis.");
    });
    subscriber.on("ready", () => {
        console.log("Yahoo! Redis Service ready for action!");
        // call back fn is required
        subscriber.subscribe(redisChannel, async (message) => {
            console.log(`Data Received From Publisher: ${message}`);
            try {
                await createCustomer(message);
            } catch (error) {
                console.log(`Error From Subscribe: ${error}`);
            }
        });
    });
})();
