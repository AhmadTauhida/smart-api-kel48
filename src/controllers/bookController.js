import { BookModel } from '../models/bookModel.js';

export const BookController = {
  async getAllBooks(req, res) {
    try {
      const title = req.query.title || '';
      const books = await BookModel.getAll(title);
      res.json(books);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  async createBook(req, res) {
    try {
      const newBook = await BookModel.create(req.body);
      res.status(201).json(newBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
  ,
  async deleteBook(req, res) {
    try {
      const { id } = req.params;
      const result = await BookModel.delete(id);
      res.json(result);
    } catch (err) {
      // Menangkap error foreign key constraint PostgreSQL (kode: 23503)
      if (err.code === '23503') {
        res.status(400).json({ 
          error: "Buku tidak bisa dihapus karena masih ada dalam data transaksi peminjaman (masih dipinjam atau pernah dipinjam)." 
        });
      } else if (err.message === "Buku tidak ditemukan.") {
        // Asumsi kamu juga menerapkan pengecekan rowCount di Model seperti sebelumnya
        res.status(404).json({ error: err.message });
      } else {
        res.status(400).json({ error: err.message });
      }
    }
  },
  async updateBook(req, res) {
    try {
      const { id } = req.params; 
      const updatedBook = await BookModel.update(id, req.body);  
      res.json(updatedBook);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
}
};
