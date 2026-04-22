import { LoanModel } from '../models/loanModel.js';

export const LoanController = {
  async createLoan(req, res) {
    try {
      const loan = await LoanModel.createLoan(req.body.book_id, req.body.member_id, req.body.due_date);
      res.status(201).json({ message: "Peminjaman dicatat!", data: loan });
    } catch (err) { res.status(400).json({ error: err.message }); }
  },

  async getLoans(req, res) {
    try { res.json(await LoanModel.getAllLoans()); } 
    catch (err) { res.status(500).json({ error: err.message }); }
  },

  async returnLoan(req, res) {
    try {
      const updatedLoan = await LoanModel.returnBook(req.params.id);
      res.json({ message: "Buku berhasil dikembalikan!", data: updatedLoan });
    } catch (err) { res.status(400).json({ error: err.message }); }
  },

  async updateLoan(req, res) {
    try {
      const updated = await LoanModel.updateLoan(req.params.id, req.body.book_id, req.body.member_id, req.body.due_date);
      res.json(updated);
    } catch (err) { res.status(400).json({ error: err.message }); }
  },

  async deleteLoan(req, res) {
    try { res.json(await LoanModel.deleteLoan(req.params.id)); } 
    catch (err) { res.status(400).json({ error: err.message }); }
  }
};