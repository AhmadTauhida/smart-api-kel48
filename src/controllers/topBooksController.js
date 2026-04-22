import { TopBooksModel } from '../models/topBooksModel.js';

export const TopBooksController = {
  // Mendapatkan daftar 2 buku yang paling sering dipinjam
  async getReportTopBooks(req, res) {
    try {
      // Mengambil data dari model
      const topBooks = await TopBooksModel.getTopBooks(2);
      
      res.status(200).json({
        message: "Berhasil mengambil data top 2 buku",
        data: topBooks
      });
    } catch (err) {
      // Menangani error jika terjadi masalah pada database
      res.status(500).json({ 
        message: "Terjadi kesalahan saat mengambil laporan",
        error: err.message 
      });
    }
  }
};