import { sql } from "../config/db.js";

export const createCustomer = async (req, res) => {
    const { user_id } = req.params;
    const { name, phone, email, notes } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    if (!name) {
        return res.status(400).json({ success: false, message: "Customer name is required" });
    }

    try {
        const newCustomer = await sql`
            INSERT INTO customers (user_id, name, phone, email, notes)
            VALUES (${user_id}, ${name}, ${phone || null}, ${email || null}, ${notes || null})
            RETURNING *;
        `;
        res.status(201).json({ success: true, data: newCustomer[0], message: "Customer created successfully" });
    } catch (error) {
        console.log("Error in createCustomer", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
