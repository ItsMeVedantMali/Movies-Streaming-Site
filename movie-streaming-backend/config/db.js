import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

export const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
});

db.connect((error)=>{
    if(error) console.error("MySQL Connection failed:",error.message)
    else console.log("Connected to MySQL Database")
})