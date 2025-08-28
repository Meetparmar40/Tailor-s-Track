import {sql} from "../config/db.js";
export const createUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const newUser = await sql`
            INSERT INTO users (email, password_hash)
            VALUES (${email}, ${password})
            RETURNING *;
        `;
        res.status(201).json({ success: true, data: newUser[0], message: "User created successfully" });
    } catch (error) {
        console.log("Error in createUser", error);
        res.status(500).json({ success: false, message: error.message });
    }
};