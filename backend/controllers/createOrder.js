import {sql} from "../config/db.js";
export const createOrder = async (req, res) => {
    const {user_id, customer_id} = req.params;
    const { type, quantity, status, notes, tag } = req.body;

    try {
        const [order] = await sql`
        INSERT INTO orders (
            customer_id, user_id, type, quantity, status, order_date, notes, tag
        )
        VALUES (
            ${customer_id},
            ${user_id}
            ${type},
            ${quantity},
            ${status || "in_progress"},
            NOW(),
            ${notes || null},
            ${tag || 0}
        )
        RETURNING *;
        `;
        res.status(201).json({success : true, data : order, message : "Order created successfully"});
    } catch (error) {
        console.log("Error in createOrder", error);
        res.status(500).json({ message: error.message });
    }
};