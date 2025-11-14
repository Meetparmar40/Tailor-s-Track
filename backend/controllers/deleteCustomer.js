import {sql} from "../config/db.js";

export const deleteCustomer = async (req, res) => {
    const { user_id, customer_id } = req.params;
    
    try {
        // Check if customer exists and belongs to the user
        const [customer] = await sql`
            SELECT * FROM customers
            WHERE id = ${customer_id} AND user_id = ${user_id};
        `;

        if (!customer) {
            return res.status(404).json({ 
                success: false, 
                message: "Customer not found" 
            });
        }

        // Due to CASCADE constraints in the database schema:
        // - All related orders will be automatically deleted
        // - All related measurements will be automatically deleted
        // This ensures data integrity
        await sql`
            DELETE FROM customers
            WHERE id = ${customer_id} AND user_id = ${user_id};
        `;

        res.status(200).json({ 
            success: true, 
            message: "Customer and all related data deleted successfully" 
        });
    } catch (error) {
        console.log("Error while deleting Customer:", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
