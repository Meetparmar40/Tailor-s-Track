import {sql} from "../config/db.js";

export const deleteOrder = async (req, res) => {
    const { user_id, order_id } = req.params;
    
    try {
        // Check if order exists and belongs to the user
        const [order] = await sql`
            SELECT * FROM orders
            WHERE id = ${order_id} AND user_id = ${user_id};
        `;

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: "Order not found" 
            });
        }

        // Delete the order
        await sql`
            DELETE FROM orders
            WHERE id = ${order_id} AND user_id = ${user_id};
        `;

        res.status(200).json({ 
            success: true, 
            message: "Order deleted successfully" 
        });
    } catch (error) {
        console.log("Error while deleting Order:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
