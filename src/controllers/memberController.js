import { MemberModel } from '../models/memberModel.js';

export const MemberController = {
  // Mendapatkan semua daftar anggota
  async getAllMembers(req, res) {
    try {
      const members = await MemberModel.getAll();
      res.json(members);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  // Mendaftarkan anggota baru
  async registerMember(req, res) {
    try {
      const newMember = await MemberModel.create(req.body);
      res.status(201).json({
        message: "Anggota berhasil didaftarkan!",
        data: newMember
      });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  
  async deleteMember(req, res) {
    try {
      const { id } = req.params;
      const result = await MemberModel.delete(id); 
      res.json(result); 
    } catch (err) {
      // 23503 adalah kode error PostgreSQL untuk Foreign Key Constraint Violation
      if (err.code === '23503') { 
        res.status(400).json({ error: "Gagal menghapus! Member ini tidak bisa dihapus karena masih memiliki riwayat peminjaman buku." });
      } else {
        res.status(500).json({ error: err.message });
      }
    }
  },
  // Memperbarui informasi anggota berdasarkan ID
  async updateMember(req, res) {
    try {
      const { id } = req.params; 
      const updatedMember = await MemberModel.update(id, req.body);  
      res.json(updatedMember);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
};
