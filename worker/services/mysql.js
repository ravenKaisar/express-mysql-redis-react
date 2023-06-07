import mysql from "mysql2/promise";
import {mysqlConfig} from "./config.js";

const createCustomer = async (params) => {
    const data = JSON.parse(params)
    const query = `INSERT INTO customers (name, email) VALUES ('${data.name}', '${data.email}')`;
    const connection = await mysql.createConnection(mysqlConfig);
    return connection.execute(query);
};

export {createCustomer};