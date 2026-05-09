import { getAuth } from "@clerk/express";
import { sql } from "../config/db.js";

export const requireAuthenticatedUser = (req, res, next) => {
    const { isAuthenticated, userId } = getAuth(req);

    if (!isAuthenticated || !userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
    }

    req.authUserId = userId;
    next();
};

export const requireSelf = (req, res, next) => {
    if (req.params.user_id !== req.authUserId) {
        return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
};

export const requireWorkspaceAccess = async (req, res, next) => {
    const { user_id } = req.params;

    if (user_id === req.authUserId) {
        return next();
    }

    try {
        const access = await sql`
            SELECT 1
            FROM user_admins
            WHERE owner_user_id = ${user_id}
            AND admin_user_id = ${req.authUserId}
            AND status = 'active'
            LIMIT 1
        `;

        if (access.length === 0) {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        next();
    } catch (error) {
        console.error("Workspace authorization error:", error);
        res.status(500).json({ success: false, message: "Authorization failed" });
    }
};
