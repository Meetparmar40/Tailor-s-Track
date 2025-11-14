import {sql} from "../config/db.js";
export const updateMeasurement = async (req, res) => {
    const { user_id, customer_id, measurement_id } = req.params;
    const { type, measurement } = req.body;
    
    try {
        // Verify the measurement belongs to the customer and user
        const [existingMeasurement] = await sql`
            SELECT m.* FROM measurements m
            JOIN customers c ON m.customer_id = c.id
            WHERE m.id = ${measurement_id} 
            AND m.customer_id = ${customer_id}
            AND c.user_id = ${user_id};
        `;

        if (!existingMeasurement) {
            return res.status(404).json({ 
                success: false, 
                message: "Measurement not found" 
            });
        }

        const [updatedMeasurement] = await sql`
            UPDATE measurements
            SET 
                type = COALESCE(${type}, type), 
                data = COALESCE(${measurement}, data), 
                updated_at = NOW()
            WHERE id = ${measurement_id}
            RETURNING *;
        `;

        res.status(200).json({ 
            success: true, 
            data: updatedMeasurement,
            message: "Measurement updated successfully" 
        });
    } catch (error) {
        console.log("Error in updateMeasurement", error);
        res.status(500).json({ success: false, message: error.message });
    }
};