import { sql } from "../config/db.js";

export const updateSettings = async (req, res) => {
    const { user_id } = req.params;
    const { 
        theme, 
        font_size, 
        sidebar_collapsed, 
        notifications_enabled,
        compact_mode
    } = req.body;
    
    try {
        // Try to update existing settings, or insert if not exists (upsert)
        const result = await sql`
            INSERT INTO user_settings (
                user_id, 
                theme, 
                font_size, 
                sidebar_collapsed, 
                notifications_enabled,
                compact_mode,
                updated_at
            )
            VALUES (
                ${user_id}, 
                ${theme || 'light'}, 
                ${font_size || 'medium'}, 
                ${sidebar_collapsed || false}, 
                ${notifications_enabled !== false},
                ${compact_mode || false},
                NOW()
            )
            ON CONFLICT (user_id) 
            DO UPDATE SET
                theme = COALESCE(${theme}, user_settings.theme),
                font_size = COALESCE(${font_size}, user_settings.font_size),
                sidebar_collapsed = COALESCE(${sidebar_collapsed}, user_settings.sidebar_collapsed),
                notifications_enabled = COALESCE(${notifications_enabled}, user_settings.notifications_enabled),
                compact_mode = COALESCE(${compact_mode}, user_settings.compact_mode),
                updated_at = NOW()
            RETURNING *
        `;
        
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error updating settings:", error);
        res.status(500).json({ error: "Failed to update settings" });
    }
};
