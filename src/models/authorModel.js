import { pool } from '../config/db.js';

export const AuthorModel = {
  async getAll(name = '') {
  let query = 'SELECT * FROM authors';
  let params = [];

  if (name) {
    query += ' WHERE name ILIKE $1';
    params = [`%${name}%`];
  }

  query += ' ORDER BY name ASC'; 

  const result = await pool.query(query, params);
  return result.rows;
  },
  async create(name, nationality) {
    const query = 'INSERT INTO authors (name, nationality) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, nationality]);
    return result.rows[0];
  },

  
  async update(id, name, nationality) {
    const query = 'UPDATE authors SET name = $1, nationality = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [name, nationality, id]);
    return result.rows[0];
  },

  // Delete: Menghapus penulis berdasarkan ID
  async delete(id) {
    const query = 'DELETE FROM authors WHERE id = $1';
    await pool.query(query, [id]);
    return { message: "Penulis berhasil dihapus." };
  }
};