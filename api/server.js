"use strict";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {getCacheCustomerList, setCacheCustomerList, deleteCacheCustomerList, customerInfoPublishForConsumer} from "./services/redis.js";
import {getCustomersList} from "./services/mysql.js";


dotenv.config();
// environment variables
const expressPort = process.env.PORT || 6006;
const sqlTable = process.env.MYSQL_TABLE || "";

//express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// express endpoints
app.get("/", (_, res) => res.status(200).json({message: 'asdasd',}));

app.get("/api/v1/customers", async (req, res) => {
    try {
        // await deleteRedisCache();
        const cachedData = await getCacheCustomerList();
        if (cachedData) {
            res.status(200).json({message: "success", "data": JSON.parse(cachedData)});
            return;
        }

        const [data] = await getCustomersList();
        await setCacheCustomerList(data);

        res.status(200).json({message: "success", "data": data});
    } catch (error) {
        res.status(500).json({message: "error", error});
    }
});

app.post("/api/v1/customers", async (req, res) => {
    const body = req.body;
    try {
        await customerInfoPublishForConsumer(JSON.stringify(body));
        await deleteCacheCustomerList();
        res.status(200).json({message: "success"});
    } catch (error) {
        console.log({error});
        res.status(500).json({message: "error", error});
    }
});

app.listen(expressPort, () => console.log(`served on port ${expressPort}`));
