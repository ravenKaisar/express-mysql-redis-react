"use strict";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import {
    customerDeletePublishForConsumer,
    customerInfoPublishForConsumer,
    deleteCacheCustomerList,
    getCacheCustomerList,
    setCacheCustomerList
} from "./services/redis.js";
import {getCustomerInfoById, getCustomersList} from "./services/mysql.js";


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
app.get("/", (_, res) => res.status(200).json({message: 'success',}));

app.get("/api/v1/customers", async (req, res) => {
    try {
        // await deleteRedisCache();
        const cachedData = await getCacheCustomerList();
        if (cachedData) {
            res.status(200).json({message: "Success", "cached": true, "data": JSON.parse(cachedData)});
            return;
        }

        const [data] = await getCustomersList();
        await setCacheCustomerList(data);

        res.status(200).json({message: "Success", "cached": false, "data": data});
    } catch (error) {
        res.status(500).json({message: "Error", error});
    }
});

app.post("/api/v1/customers", async (req, res) => {
    const body = req.body;
    try {
        await customerInfoPublishForConsumer(JSON.stringify(body));
        await deleteCacheCustomerList();
        res.status(200).json({message: "Success"});
    } catch (error) {
        res.status(500).json({message: "Error", error});
    }
});

app.get("/api/v1/customers/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [data] = await getCustomerInfoById(id);
        if (data.length == 0) {
            res.status(404).json({message: "Resource not found"});
        }
        res.status(200).json({message: "Success", data: data[0]});
    } catch (error) {
        res.status(500).json({message: "Error", error});
    }
});
app.delete("/api/v1/customers/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const [data] = await getCustomerInfoById(id);
        if (data.length == 0) {
            res.status(404).json({message: "Resource not found"});
        }
        await customerDeletePublishForConsumer(id);
        await deleteCacheCustomerList();
        res.status(204).json({message: "Success"});
    } catch (error) {
        res.status(500).json({message: "Error", error});
    }
});

app.listen(expressPort, () => console.log(`served on port ${expressPort}`));
