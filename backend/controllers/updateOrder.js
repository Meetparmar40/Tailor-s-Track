import {sql} from "../config/db.js";

export const updateOrder = async (req, res) => {
    const {user_id, order_id} = req.params;
    const { type , quantity, status, notes, tag } = req.body;

    try {
        // First update the order
        const [order] = await sql`
            UPDATE orders
            SET 
                type = COALESCE(${type}, type),
                quantity = COALESCE(${quantity}, quantity),
                status = COALESCE(${status}, status),
                notes = COALESCE(${notes}, notes),
                tag = COALESCE(${tag}, tag),
                updated_at = NOW()
            WHERE id = ${order_id} AND user_id = ${user_id}
            RETURNING *;
        `;

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        const [completeOrder] = await sql`
            SELECT o.*, c.name AS customer_name, c.phone, c.gender
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.id = ${order_id} AND o.user_id = ${user_id};
        `;

        res.status(200).json({
            success: true, 
            data: completeOrder, 
            message: "Order updated successfully"
        });   
    } catch (error) {
        console.log("Error in updateOrder", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};