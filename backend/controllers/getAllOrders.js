import { sql } from "../config/db.js";

// This function returns all orders for a user with or without specific tag
export const getAllOrders = async (req, res) => {
  const { user_id } = req.params;
  const { limit = 10, lastDate, tag } = req.query;

  try {
    let query;

    if (lastDate) {
      if(tag){
        query = await sql`
          SELECT o.*, c.name AS customer_name, c.phone, c.gender
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.user_id = ${user_id}
            AND o.order_date < ${lastDate}
            AND o.tag = ${tag}
          ORDER BY o.order_date DESC
          LIMIT ${limit};
        `;
      }
      else{
        query = await sql`
          SELECT o.*, c.name AS customer_name, c.phone, c.gender
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.user_id = ${user_id}
            AND o.order_date < ${lastDate}
          ORDER BY o.order_date DESC
          LIMIT ${limit};
        `;
      }
    } else {
      if(tag){
        query = await sql`
          SELECT o.*, c.name AS customer_name, c.phone, c.gender
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.user_id = ${user_id}
            AND o.tag = ${tag}
          ORDER BY o.order_date DESC
          LIMIT ${limit};
        `;
      }
      else {
        query = await sql`
          SELECT o.*, c.name AS customer_name, c.phone, c.gender
          FROM orders o
          JOIN customers c ON o.customer_id = c.id
          WHERE o.user_id = ${user_id}
          ORDER BY o.order_date DESC
          LIMIT ${limit};
        `;

      }
    }

    res.status(200).json({
      success: true,
      data: query,
      hasMore: query.length === parseInt(limit),
      lastDate: query.length > 0 ? query[query.length - 1].order_date : null,
    });
  } catch (error) {
    console.error("Error fetching orders", error);
    res.status(500).json({ success: false, message: error.message });
  }
};