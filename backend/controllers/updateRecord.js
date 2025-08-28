import {sql} from "../config/db.js";
export const updateRecord = async (req, res) => {
    const { user_id, customer_id, measurement_id } = req.params;
    const { name, phone, notes, type, measurement} = req.body;
    try {
        try {
            await sql`BEGIN`;
            await sql`
                UPDATE customers
                SET name = ${name}, phone = ${phone}, notes = ${notes}
                WHERE user_id = ${user_id} AND id = ${customer_id};
            `;
            await sql`
                UPDATE measurements
                SET type = ${type}, data = ${measurement}, updated_at = NOW()
                WHERE id = ${measurement_id};
            `;
            await sql`COMMIT`;
        } catch (error) {
            await sql`ROLLBACK`;
            throw error;
        }
        res.status(200).json({ success: true, message: "Record updated successfully" });
    } catch (error) {
        console.log("Error in updateRecord", error);
        res.status(500).json({ success: false, message: error.message });
    }
};