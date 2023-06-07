import mysql from "mysql2/promise";
import {mysqlConfig} from "./config.js";

const getCustomersList = async () => {
    const query = `SELECT * FROM customers`;
    const connection = await mysql.createConnection(mysqlConfig);
    return connection.execute(query);
};

export {getCustomersList};