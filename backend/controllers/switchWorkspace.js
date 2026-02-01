import { sql } from "../config/db.js";

// Switch to a different workspace (get data as if you're that user)
export const switchWorkspace = async (req, res) => {
    const { user_id, target_user_id } = req.params;

    try {
        // If switching to own workspace
        if (user_id === target_user_id) {
            return res.status(200).json({
                success: true,
                data: {
                    workspaceOwnerId: user_id,
                    isOwnWorkspace: true
                },
                message: "Switched to own workspace"
            });
        }

        // Check if user has permission to access target workspace
        const hasAccess = await sql`
            SELECT * FROM user_admins
            WHERE owner_user_id = ${target_user_id}
            AND admin_user_id = ${user_id}
            AND status = 'active'
        `;

        if (hasAccess.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You don't have access to this workspace"
            });
        }

        // Get workspace owner details
        const owner = await sql`
            SELECT id, email, first_name, last_name, image_url
            FROM users
            WHERE id = ${target_user_id}
        `;

        res.status(200).json({
            success: true,
            data: {
                workspaceOwnerId: target_user_id,
                workspaceOwner: owner[0],
                isOwnWorkspace: false,
                role: hasAccess[0].role
            },
            message: "Switched workspace successfully"
        });
    } catch (error) {
        console.error("Error switching workspace:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
