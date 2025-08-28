import {sql} from "../config/db.js";
export const updateOrder = async (req, res) => {
    const {user_id, customer_id} = req.params;
    const { type, quantity, status, notes, tag } = req.body;

    try {
        const [order] = await sql`
        UPDATE orders (
            customer_id, user_id, type, quantity, status, notes, tag
        )
        SET (
            ${customer_id},
            ${user_id}
            ${type},
            ${quantity},
            ${status || "in_progress"},
            ${notes || null},
            ${tag || 0}
        )
        WHERE id = ${order_id};
        RETURNING *;
        `;
        res.status(200).json({success : true, data : order, message : "Order updated successfully"});   
    } catch (error) {
        console.log("Error in updateOrder", error);
        res.status(500).json({ message: error.message });
    }
};