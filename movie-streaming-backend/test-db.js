import { createUserTable } from "./models/userModel.js";
import { db } from "./config/db.js";

createUserTable();

setTimeout(() => db.end(), 1000);

