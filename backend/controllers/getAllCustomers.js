import { sql } from "../config/db.js";

// This function returns all customers for a user with pagination
export const getAllCustomers = async (req, res) => {
  const { user_id } = req.params;
  const { limit = 10, lastDate } = req.query;

  try {
    let query;

    if (lastDate) {
      query = await sql`
        SELECT id, name, phone, email, notes, created_at
        FROM customers
        WHERE user_id = ${user_id}
          AND created_at < ${lastDate}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    } else {
      query = await sql`
        SELECT id, name, phone, email, notes, created_at
        FROM customers
        WHERE user_id = ${user_id}
        ORDER BY created_at DESC
        LIMIT ${limit};
      `;
    }

    res.status(200).json({
      success: true,
      data: query,
      hasMore: query.length === parseInt(limit),
      lastDate: query.length > 0 ? query[query.length - 1].created_at : null,
    });
  } catch (error) {
    console.error("Error fetching customers", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
