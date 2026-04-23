import { pool } from '../config/db.js';

export const BookModel = {
  
  
  async getAll(title = '') {
    let query = `
      SELECT b.*, a.name as author_name, c.name as category_name 
      FROM books b
      LEFT JOIN authors a ON b.author_id = a.id
      LEFT JOIN categories c ON b.category_id = c.id
    `;
    
    const values = [];

    
    if (title) {
      query += ` WHERE b.title ILIKE $1`;
      values.push(`%${title}%`); 
    }

    query += ` ORDER BY b.title ASC`;
    
    const result = await pool.query(query, values);
    return result.rows;
  },

  async create (data) {
    const { isbn, title, author_id, category_id, total_copies } = data;
    const query = `
      INSERT INTO books (isbn, title, author_id, category_id, total_copies, available_copies)
      VALUES ($1, $2, $3, $4, $5, $5) RETURNING *
    `;
    const result = await pool.query(query, [isbn, title, author_id, category_id, total_copies]);
    return result.rows[0];
  },


  async delete(id) {
    const query = 'DELETE FROM books WHERE id = $1';
    await pool.query(query, [id]);
    return { message: "Buku berhasil dihapus dari sistem." };
  },

  async update(id, data) {
 
    const oldDataResult = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    if (oldDataResult.rows.length === 0) throw new Error("Buku tidak ditemukan");
  
    const oldData = oldDataResult.rows[0];


    const isbn = data.isbn || oldData.isbn;
    const title = data.title || oldData.title;
    const author_id = data.author_id || oldData.author_id;
    const category_id = data.category_id || oldData.category_id;
    const total_copies = data.total_copies !== undefined ? data.total_copies : oldData.total_copies;

  
    const query = `
      UPDATE books 
      SET isbn = $1, title = $2, author_id = $3, category_id = $4, total_copies = $5, available_copies = $5
      WHERE id = $6 RETURNING *
      `;
    const result = await pool.query(query, [isbn, title, author_id, category_id, total_copies, id]);
      return result.rows[0];
    }
  };

