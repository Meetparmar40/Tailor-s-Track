import {sql} from "../config/db.js";

export const updateCustomer = async (req, res) => {
    const {user_id, customer_id} = req.params;
    const { name, phone, email, notes } = req.body;

    try {
        const [customer] = await sql`
            UPDATE customers
            SET 
                name = COALESCE(${name}, name),
                phone = COALESCE(${phone}, phone),
                email = COALESCE(${email}, email),
                notes = COALESCE(${notes}, notes)
            WHERE user_id = ${user_id} AND id = ${customer_id}
            RETURNING *;
        `;

        if (!customer) {
            return res.status(404).json({ 
                success: false, 
                message: "Customer not found" 
            });
        }

        res.status(200).json({
            success: true, 
            data: customer, 
            message: "Customer updated successfully"
        });
    } catch (error) {
        console.log("Error in updateCustomer", error);
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};
