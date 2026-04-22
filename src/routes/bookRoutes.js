import express from 'express';
import { BookController } from '../controllers/bookController.js';

const router = express.Router();

router.get('/', BookController.getAllBooks);
router.post('/', BookController.createBook);
router.delete('/:id', BookController.deleteBook);
router.put('/:id', BookController.updateBook);

export default router;
