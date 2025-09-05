import {sql} from "../config/db.js";

// This returns orders for specific customer
export const getOrders = async (req, res) => {
    const {user_id, customer_id} = req.params;
    
    try {
        const orders = await sql`
            SELECT o.*, 
                    c.name, 
                    c.phone,  
                    c.gender
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.user_id = ${user_id}
                AND o.customer_id = ${customer_id}
            ORDER BY o.order_date DESC;
        `;
        if (orders.length === 0) {
            return res.status(404).json({ success: false, message: "Orders for the customer not found"});
        }

        res.status(200).json({ success: true, data: orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("Error in getOrders", error);
    }
};