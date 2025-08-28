import {sql} from "../config/db.js";
export const getRecords = async (req, res) => {
    const { user_id, customer_id } = req.params;
    try {
        const records = await sql`
            SELECT m.*
            FROM measurements AS m
            INNER JOIN customers AS c
            ON c.id = m.customer_id
            WHERE c.user_id = ${user_id}
            AND m.customer_id = ${customer_id}
            ORDER BY m.created_at DESC;
        `;
        res.status(200).json({success : true, data : records}); 
    } catch (error) {
        console.log("Error in getRecords", error);
        res.status(500).json({ success: false, message: error.message });
    }
};