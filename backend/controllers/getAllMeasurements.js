import {sql} from "../config/db.js";

export const getAllMeasurements = async (req, res) => {
    const { user_id } = req.params;
    const { limit = 1000, lastDate } = req.query;

    try {
        let Measurements;
        
        if (lastDate) {
            Measurements = await sql`
                SELECT m.*
                FROM measurements AS m
                INNER JOIN customers AS c
                ON c.id = m.customer_id
                WHERE c.user_id = ${user_id}
                AND m.created_at < ${lastDate}
                ORDER BY m.created_at DESC
                LIMIT ${limit};
            `;
        } else {
            Measurements = await sql`
                SELECT m.*
                FROM measurements AS m
                INNER JOIN customers AS c
                ON c.id = m.customer_id
                WHERE c.user_id = ${user_id}
                ORDER BY m.created_at DESC
                LIMIT ${limit};
            `;
        }

        const hasMore = Measurements.length === parseInt(limit);
        const newLastDate = hasMore && Measurements.length > 0 
            ? Measurements[Measurements.length - 1].created_at 
            : null;

        res.status(200).json({
            success: true,
            data: Measurements,
            hasMore,
            lastDate: newLastDate
        });
    } catch (error) {
        console.log("Error in getAllMeasurements", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
