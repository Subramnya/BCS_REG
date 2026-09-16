import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Serve frontend dist if built
app.use(express.static(path.join(__dirname, '../dist')));

// API Routes
app.use('/api', routes);

// Fallback for SPA Routing
app.get('*', (req, res) => {
  const distIndex = path.join(__dirname, '../dist/index.html');
  if (req.accepts('html') && !req.path.startsWith('/api')) {
    res.sendFile(distIndex, (err) => {
      if (err) {
        res.status(200).send('BC Creative Spectrum Server Running. Front-end is served via Vite Dev server.');
      }
    });
  } else {
    res.status(404).json({ error: 'Endpoint not found' });
  }
});

app.listen(PORT, () => {
  console.log(`================================================`);
  console.log(`BC Creative Spectrum Server listening on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
  console.log(`================================================`);
});
