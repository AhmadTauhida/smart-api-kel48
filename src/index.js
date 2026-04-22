import express from 'express';
import dotenv from 'dotenv';
import bookRoutes from './routes/bookRoutes.js';
import loanRoutes from './routes/loanRoutes.js';
import memberRoutes from './routes/memberRoutes.js'; 
import authorRoutes from './routes/authorRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import topBooksRoutes from './routes/topBooksRoutes.js';
import reportRoutes from './routes/reportRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

// Grouping Routes
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reports', reportRoutes);

// Diubah dari /api/topBooks menjadi /api/reports
// Dengan asumsi di dalam topBooksRoutes.js routenya adalah '/' 
// maka aksesnya nanti menjadi /api/reports/top-books
app.use('/api/reports', topBooksRoutes);

app.get('/', (req, res) => res.send('Smart Library API is Running...'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});