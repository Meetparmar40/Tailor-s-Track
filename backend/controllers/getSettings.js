import { sql } from "../config/db.js";

export const getSettings = async (req, res) => {
    const { user_id } = req.params;
    
    try {
        const settings = await sql`
            SELECT * FROM user_settings WHERE user_id = ${user_id}
        `;

        if (settings.length === 0) {
            // Return default settings if none exist
            return res.status(200).json({
                user_id,
                theme: 'light',
                font_size: 'medium',
                sidebar_collapsed: false,
                notifications_enabled: true,
                compact_mode: false,
                created_at: new Date(),
                updated_at: new Date()
            });
        }
        res.status(200).json(settings[0]);
    } catch (error) {
        console.error("Error fetching settings:", error);
        res.status(500).json({ error: "Failed to fetch settings" });
    }
};