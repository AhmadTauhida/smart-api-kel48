import { pool } from '../config/db.js';

export const TopBooksModel = {
  async getTopBooks(limit = 2) {
    const query = `
      SELECT b.title, COUNT(l.id)::int as total_borrowed
      FROM books b
      JOIN loans l ON b.id = l.book_id
      GROUP BY b.id, b.title
      ORDER BY total_borrowed DESC
      LIMIT $1;
    `;
    const { rows } = await pool.query(query, [limit]);
    return rows;
  }
};