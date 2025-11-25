import { sql } from "../config/db.js";

export const getOrder = async (req, res) => {
    const { user_id, order_id } = req.params;

    try {
        const orders = await sql`
            SELECT o.*, 
                    c.name as customer_name, 
                    c.phone as customer_phone,
                    c.email as customer_email
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.user_id = ${user_id}
                AND o.id = ${order_id};
        `;

        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, data: orders[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("Error in getOrder", error);
    }
};
