import { sql } from "../config/db.js";

// Clerk Webhook handler for user events
export const clerkWebhook = async (req, res) => {
    const { type, data } = req.body;

    try {
        switch (type) {
            case 'user.created':
                await handleUserCreated(data);
                break;
            case 'user.updated':
                await handleUserUpdated(data);
                break;
            case 'user.deleted':
                await handleUserDeleted(data);
                break;
            default:
                console.log(`Unhandled webhook event type: ${type}`);
        }

        res.status(200).json({ success: true, message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing Clerk webhook:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

async function handleUserCreated(data) {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const primaryEmail = email_addresses?.[0]?.email_address || '';

    await sql`
        INSERT INTO users (id, email, first_name, last_name, image_url)
        VALUES (${id}, ${primaryEmail}, ${first_name || null}, ${last_name || null}, ${image_url || null})
        ON CONFLICT (id) DO UPDATE SET
            email = ${primaryEmail},
            first_name = ${first_name || null},
            last_name = ${last_name || null},
            image_url = ${image_url || null},
            updated_at = NOW()
    `;

    console.log(`User created/synced: ${id}`);
}

async function handleUserUpdated(data) {
    const { id, email_addresses, first_name, last_name, image_url } = data;
    const primaryEmail = email_addresses?.[0]?.email_address || '';

    await sql`
        UPDATE users
        SET email = ${primaryEmail},
            first_name = ${first_name || null},
            last_name = ${last_name || null},
            image_url = ${image_url || null},
            updated_at = NOW()
        WHERE id = ${id}
    `;

    console.log(`User updated: ${id}`);
}

async function handleUserDeleted(data) {
    const { id } = data;

    await sql`
        DELETE FROM users WHERE id = ${id}
    `;

    console.log(`User deleted: ${id}`);
}

// Sync user on first API request (fallback if webhook wasn't received)
export const syncUser = async (req, res) => {
    const { userId, email, firstName, lastName, imageUrl } = req.body;

    if (!userId || !email) {
        return res.status(400).json({ success: false, message: "userId and email are required" });
    }

    try {
        const result = await sql`
            INSERT INTO users (id, email, first_name, last_name, image_url)
            VALUES (${userId}, ${email}, ${firstName || null}, ${lastName || null}, ${imageUrl || null})
            ON CONFLICT (id) DO UPDATE SET
                email = ${email},
                first_name = ${firstName || null},
                last_name = ${lastName || null},
                image_url = ${imageUrl || null},
                updated_at = NOW()
            RETURNING *
        `;

        res.status(200).json({ success: true, data: result[0], message: "User synced successfully" });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get current user info0
export const getUser = async (req, res) => {
    const { user_id } = req.params;

    try {
        const user = await sql`
            SELECT * FROM users WHERE id = ${user_id}
        `;

        if (user.length === 0) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, data: user[0] });
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};