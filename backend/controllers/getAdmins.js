import { sql } from "../config/db.js";

// Get all admins for a user's workspace
export const getAdmins = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Get all admins that share the same workspace as the user
        const admins = await sql`
            SELECT 
                u.id,
                u.email,
                u.first_name,
                u.last_name,
                u.image_url,
                ua.role,
                ua.status,
                ua.created_at as joined_at
            FROM user_admins ua
            JOIN users u ON ua.admin_user_id = u.id
            WHERE ua.owner_user_id = ${user_id}
            ORDER BY ua.created_at DESC
        `;

        // Also get the owner's info
        const owner = await sql`
            SELECT 
                id,
                email,
                first_name,
                last_name,
                image_url,
                'owner' as role,
                'active' as status,
                created_at as joined_at
            FROM users
            WHERE id = ${user_id}
        `;

        res.status(200).json({
            success: true,
            data: {
                owner: owner[0] || null,
                admins: admins
            }
        });
    } catch (error) {
        console.error("Error fetching admins:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get workspaces the user has access to (either as owner or admin)
export const getUserWorkspaces = async (req, res) => {
    const { user_id } = req.params;

    try {
        // Get workspaces where user is an admin
        const adminWorkspaces = await sql`
            SELECT 
                u.id as owner_id,
                u.email as owner_email,
                u.first_name as owner_first_name,
                u.last_name as owner_last_name,
                u.image_url as owner_image,
                ua.role,
                ua.status,
                'admin' as access_type
            FROM user_admins ua
            JOIN users u ON ua.owner_user_id = u.id
            WHERE ua.admin_user_id = ${user_id}
            AND ua.status = 'active'
        `;

        // Check if user has their own workspace
        const ownWorkspace = await sql`
            SELECT 
                id as owner_id,
                email as owner_email,
                first_name as owner_first_name,
                last_name as owner_last_name,
                image_url as owner_image,
                'owner' as role,
                'active' as status,
                'owner' as access_type
            FROM users
            WHERE id = ${user_id}
        `;

        res.status(200).json({
            success: true,
            data: {
                ownWorkspace: ownWorkspace[0] || null,
                sharedWorkspaces: adminWorkspaces
            }
        });
    } catch (error) {
        console.error("Error fetching user workspaces:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
