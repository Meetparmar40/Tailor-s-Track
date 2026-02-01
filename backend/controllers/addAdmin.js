 import { sql } from "../config/db.js";

// Add a new admin by email
export const addAdmin = async (req, res) => {
    const { user_id } = req.params;
    const { email, role = 'admin' } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        // Check if the user being added exists
        const targetUser = await sql`
            SELECT id, email, first_name, last_name, image_url
            FROM users
            WHERE email = ${email.toLowerCase()}
        `;

        if (targetUser.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "User with this email not found. They need to sign up first." 
            });
        }

        const adminUserId = targetUser[0].id;

        // Can't add yourself as admin
        if (adminUserId === user_id) {
            return res.status(400).json({ 
                success: false, 
                message: "You cannot add yourself as an admin" 
            });
        }

        // Check if already an admin
        const existingAdmin = await sql`
            SELECT * FROM user_admins
            WHERE owner_user_id = ${user_id}
            AND admin_user_id = ${adminUserId}
        `;

        if (existingAdmin.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "This user is already an admin" 
            });
        }

        // Add the admin
        const result = await sql`
            INSERT INTO user_admins (owner_user_id, admin_user_id, role, status)
            VALUES (${user_id}, ${adminUserId}, ${role}, 'active')
            RETURNING *
        `;

        res.status(201).json({
            success: true,
            data: {
                ...result[0],
                admin: targetUser[0]
            },
            message: "Admin added successfully"
        });
    } catch (error) {
        console.error("Error adding admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update admin role or status
export const updateAdmin = async (req, res) => {
    const { user_id, admin_id } = req.params;
    const { role, status } = req.body;

    try {
        const result = await sql`
            UPDATE user_admins
            SET 
                role = COALESCE(${role}, role),
                status = COALESCE(${status}, status),
                updated_at = NOW()
            WHERE owner_user_id = ${user_id}
            AND admin_user_id = ${admin_id}
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        res.status(200).json({
            success: true,
            data: result[0],
            message: "Admin updated successfully"
        });
    } catch (error) {
        console.error("Error updating admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Remove an admin
export const removeAdmin = async (req, res) => {
    const { user_id, admin_id } = req.params;

    try {
        const result = await sql`
            DELETE FROM user_admins
            WHERE owner_user_id = ${user_id}
            AND admin_user_id = ${admin_id}
            RETURNING *
        `;

        if (result.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Admin not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: "Admin removed successfully"
        });
    } catch (error) {
        console.error("Error removing admin:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
