import {sql} from "../config/db.js";
export const getRecord = async (req, res) => {
    const { user_id, customer_id, measurement_id } = req.params;
    try {
        const records = await sql`
            SELECT * FROM customers AS c
            INNER JOIN measurements AS m
            ON c.id = m.customer_id
            WHERE c.user_id = ${user_id} AND c.id = ${customer_id} AND m.id = ${measurement_id}
        `;
        res.status(200).json({success : true, data : records[0]});
    } catch (error) {
        console.log("Error in getRecord", error);
        res.status(500).json({ success: false, message: error.message });
    }
};