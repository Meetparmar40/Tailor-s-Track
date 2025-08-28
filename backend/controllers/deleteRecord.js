import {sql} from "../config/db.js";
export const deleteRecord = async (req, res) => {
    const { user_id, customer_id, measurement_id } = req.params;
    try {
        await sql`
            DELETE FROM measurements
            WHERE id = ${measurement_id};
        `;
        const measurements = await sql`
            SELECT * FROM measurements
            WHERE customer_id = ${customer_id};
        `;
        if(measurements.length === 0){
            await sql`
                DELETE FROM customers
                WHERE id = ${customer_id};
            `;
        }
        res.status(200).json({ success: true, message: "Record deleted successfully" });
    } catch (error) {
        console.log("Error while deleting Record : ", error);
        res.status(500).json({ success: false, message: error.message });
    }
};