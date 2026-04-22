import express from 'express';
import { TopBooksController } from '../controllers/topBooksController.js';

const router = express.Router();

router.get('/top-books', TopBooksController.getReportTopBooks);

export default router;