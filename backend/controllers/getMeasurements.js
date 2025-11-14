import {sql} from "../config/db.js";
export const getMeasurements = async (req, res) => {
    const { user_id, customer_id } = req.params;
    try {
        const Measurements = await sql`
            SELECT m.*
            FROM measurements AS m
            INNER JOIN customers AS c
            ON c.id = m.customer_id
            WHERE c.user_id = ${user_id}
            AND m.customer_id = ${customer_id}
            ORDER BY m.created_at DESC;
        `;
        res.status(200).json({success : true, data : Measurements}); 
    } catch (error) {
        console.log("Error in getMeasurements", error);
        res.status(500).json({ success: false, message: error.message });
    }
};