import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import dotenv from "dotenv";

dotenv.config();

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Signup validation

export const signup = async (request, response) => {
    const { fullName, email, password } = request.body;

    if (!fullName || !email || !password) {
        return response.status(400).json({ message: "All fields are required" });
    }
    if (!emailRegex.test(email)) {
        return response.status(400).json({ message: "Invalid email format." });
    }
    if (!passwordRegex.test(password)) {
        return response.status(400).json({ message: "A password should contain atleast eight characters, at least one uppercase letter, one lowercase letter, one number, and one special character" })
    }

    try {
        const [existing] = await db
            .promise().query("select * from users where email = ?", [email]);

        if (existing.length > 0) {
            return response.status(400).json({ message: "User already exists" });
        }
        const hashing = await bcrypt.hash(password, 10);

        await db.promise().query("insert into users (fullName , email , password) values (?, ? ,? )", [fullName, email, hashing]);
        response.json({ success: true, message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        response.status(500).json({ message: "Error during signup", error: err.message });
    }
};

// Login Page Validation

export const login = async (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        return response.status(400).json({ message: "Email and Password are required." });
    }

    try {
        const [users] = await db.promise().query("select * from users where email =?", [email]);

        if (users.length === 0) {
            return response.status(400).json({ message: "User not found" });
        }
        const user = users[0];

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return response.status(400).json({message:"Invalid Password"});
        }

        const token = jwt.sign(
            {
                id: user.id, role: user.role
            }, process.env.JWT_SECRET,
            { expiresIn:"1d" }
        )

        response.json({
            success : true ,
            message: "Login successful",
            token,
            user: {id: user.id, fullName:user.fullName,role:user.role },
        });
    } catch(err){
        console.error(err);
        response.status(500).json({message:"Error during login", error: err.message});
    }
}