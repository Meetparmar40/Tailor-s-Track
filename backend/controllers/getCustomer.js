import { sql } from "../config/db.js";

export const getCustomer = async (req, res) => {
    const { user_id, customer_id } = req.params;

    try {
        const customers = await sql`
            SELECT id, name, phone, email, notes, created_at
            FROM customers
            WHERE user_id = ${user_id}
                AND id = ${customer_id};
        `;

        if (customers.length === 0) {
            return res.status(404).json({ success: false, message: "Customer not found" });
        }

        res.status(200).json({ success: true, data: customers[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        console.log("Error in getCustomer", error);
    }
};
