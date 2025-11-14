import {sql} from "../config/db.js";
export const createMeasurement = async (req, res) => {
    const { user_id, customer_id } = req.params;
    const { type, measurement } = req.body;

    try {
        // Ensure the provided customer belongs to the user
        const customer = await sql`
            SELECT id FROM customers
            WHERE user_id = ${user_id} AND id = ${customer_id};
        `;

        if (customer.length === 0) {
            return res.status(404).json({ success: false, message: "Customer not found for this user" });
        }

        const [newMeasurement] = await sql`
            INSERT INTO measurements (customer_id, type, data)
            VALUES (${customer_id}, ${type}, ${measurement})
            RETURNING *;
        `;
        
        res.status(201).json({ 
            success: true, 
            data: newMeasurement,
            message: "Measurement created successfully" 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("Error in createMeasurement", error);
    }
};