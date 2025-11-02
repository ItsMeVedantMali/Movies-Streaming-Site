import {db} from "../config/db.js";

export const createUserTable = () => {
    const query =`create table if not exists users(
    id int auto_increment primary key,
    fullname varchar(100) not null,
    email varchar(50) unique not null,
    password varchar(255) not null,
    role enum('user','admin') default 'user'
    )`;

    db.query(query,(error) =>{
        if(error) console.log("Error creating users table:", error.message);
        else console.log("Users table is creatd Successfully");
    });
};