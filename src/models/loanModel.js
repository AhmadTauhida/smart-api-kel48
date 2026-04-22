import { pool } from '../config/db.js';

export const LoanModel = {
  async createLoan(book_id, member_id, due_date) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const bookCheck = await client.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) throw new Error('Buku stok habis.');

      await client.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = $1', [book_id]);

      const loanQuery = `
        INSERT INTO loans (book_id, member_id, due_date, status) 
        VALUES ($1, $2, $3, 'BORROWED') RETURNING *
      `;
      const result = await client.query(loanQuery, [book_id, member_id, due_date]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async getAllLoans() {
    const query = `
      SELECT l.*, b.title as book_title, m.full_name as member_name 
      FROM loans l
      JOIN books b ON l.book_id = b.id
      JOIN members m ON l.member_id = m.id
      ORDER BY l.loan_date DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  },

  async returnBook(loan_id) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      const loanCheck = await client.query('SELECT book_id, status FROM loans WHERE id = $1', [loan_id]);
      if (loanCheck.rows.length === 0) throw new Error('Transaksi tidak ditemukan.');
      if (loanCheck.rows[0].status === 'RETURNED') throw new Error('Buku sudah dikembalikan sebelumnya.');

      const book_id = loanCheck.rows[0].book_id;
      await client.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = $1', [book_id]);
      
      const updateQuery = `
        UPDATE loans SET status = 'RETURNED', return_date = NOW() 
        WHERE id = $1 RETURNING *
      `;
      const result = await client.query(updateQuery, [loan_id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  },

  async updateLoan(loan_id, book_id, member_id, due_date) {
    const oldDataResult = await pool.query('SELECT * FROM loans WHERE id = $1', [loan_id]);
    if (oldDataResult.rows.length === 0) throw new Error("Transaksi tidak ditemukan");
    
    const oldData = oldDataResult.rows[0];
    const newBookId = book_id || oldData.book_id;
    const newMemberId = member_id || oldData.member_id;
    const newDueDate = due_date || oldData.due_date;

    if (book_id && book_id !== oldData.book_id) {
      const bookCheck = await pool.query('SELECT available_copies FROM books WHERE id = $1', [book_id]);
      if (bookCheck.rows[0].available_copies <= 0) throw new Error('Buku baru tidak tersedia.');
    }

    const query = `UPDATE loans SET book_id = $1, member_id = $2, due_date = $3 WHERE id = $4 RETURNING *`;
    const result = await pool.query(query, [newBookId, newMemberId, newDueDate, loan_id]);
    return result.rows[0];
  },

  async deleteLoan(loan_id) {
    const result = await pool.query('DELETE FROM loans WHERE id = $1', [loan_id]);
    if (result.rowCount === 0) throw new Error("Transaksi tidak ditemukan");
    return { message: "Transaksi dihapus." };
  }
};