import { AuthorModel } from '../models/authorModel.js';

export const AuthorController = {
  async getAuthors(req, res) {
    try {
      console.log("Parameter yang diterima:", req.query.name);
      const name = req.query.name || '';
      const authors = await AuthorModel.getAll(name);
      res.json(authors);
    } 
catch (err) {
  if (err.message === "Penulis tidak ditemukan.") {
    res.status(404).json({ error: err.message });
  } else {
    res.status(400).json({ error: err.message });
  }
}
  },

  async addAuthor(req, res) {
    try {
      const { name, nationality } = req.body;
      const author = await AuthorModel.create(name, nationality);
      res.status(201).json(author);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async updateAuthor(req, res) {
    try {
      const { id } = req.params; 
      const { name, nationality } = req.body;
      const updatedAuthor = await AuthorModel.update(id, name, nationality);  
      res.json(updatedAuthor);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  async deleteAuthor(req, res) {
    try {
      const { id } = req.params; 
      const result = await AuthorModel.delete(id);  
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

};
