import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');
if (!fs.existsSync(PUBLIC_DIR)) {
  fs.mkdirSync(PUBLIC_DIR, { recursive: true });
}

function resolveStaticImagePath(candidates: string[]): string | null {
  for (const relPath of candidates) {
    const fullPath = path.join(__dirname, relPath);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '25mb' }));

  // Serve static images directory
  app.use('/images', express.static(path.join(PUBLIC_DIR, 'images')));
  app.use(express.static(PUBLIC_DIR));

  // Serve images/elvio.jpeg directly without any modification
  app.get('/images/elvio.jpeg', (_req, res) => {
    const file = resolveStaticImagePath([
      'public/images/elvio.jpeg',
      'src/assets/images/elvio.jpeg',
      'public/elvio.jpeg',
    ]);
    if (file) {
      res.sendFile(file);
    } else {
      res.status(404).end();
    }
  });

  // Serve images/jorge.jpeg directly without any modification
  app.get('/images/jorge.jpeg', (_req, res) => {
    const file = resolveStaticImagePath([
      'public/images/jorge.jpeg',
      'src/assets/images/jorge.jpeg',
      'public/jorge.jpeg',
    ]);
    if (file) {
      res.sendFile(file);
    } else {
      res.status(404).end();
    }
  });

  // Serve static elvio.jpg directly from /public/elvio.jpg, /elvio.jpg, or /perfil me.jpeg without any modification
  app.get('/elvio.jpg', (_req, res) => {
    const file = resolveStaticImagePath([
      'public/images/elvio.jpeg',
      'src/assets/images/elvio.jpeg',
      'public/elvio.jpg',
      'elvio.jpg',
      'public/perfil me.jpeg',
      'perfil me.jpeg',
      'public/perfil-elvio.jpeg',
      'src/assets/elvio.jpg',
    ]);
    if (file) {
      res.sendFile(file);
    } else {
      res.status(404).end();
    }
  });

  // Serve static jorge.jpg directly from /public/jorge.jpg, /jorge.jpg, or /perfil peton.jpeg without any modification
  app.get('/jorge.jpg', (_req, res) => {
    const file = resolveStaticImagePath([
      'public/images/jorge.jpeg',
      'src/assets/images/jorge.jpeg',
      'public/jorge.jpg',
      'jorge.jpg',
      'public/perfil peton.jpeg',
      'perfil peton.jpeg',
      'public/perfil-jorge.jpeg',
      'src/assets/jorge.jpg',
    ]);
    if (file) {
      res.sendFile(file);
    } else {
      res.status(404).end();
    }
  });

  // GET /api/founder-photos: checks if static local files exist
  app.get('/api/founder-photos', (_req, res) => {
    const elvioFile = resolveStaticImagePath([
      'public/elvio.jpg',
      'elvio.jpg',
      'public/perfil me.jpeg',
      'perfil me.jpeg',
      'public/perfil-elvio.jpeg',
    ]);
    const jorgeFile = resolveStaticImagePath([
      'public/jorge.jpg',
      'jorge.jpg',
      'public/perfil peton.jpeg',
      'perfil peton.jpeg',
      'public/perfil-jorge.jpeg',
    ]);

    res.json({
      elvioPhotoUrl: elvioFile ? `/elvio.jpg?t=${fs.statSync(elvioFile).mtimeMs}` : null,
      jorgePhotoUrl: jorgeFile ? `/jorge.jpg?t=${fs.statSync(jorgeFile).mtimeMs}` : null,
    });
  });

  // POST /api/founder-photos: saves the exact unmodified binary file as /public/elvio.jpg or /public/jorge.jpg
  app.post('/api/founder-photos', (req, res) => {
    try {
      const { founder, dataUrl } = req.body as {
        founder: 'elvio' | 'jorge';
        dataUrl: string;
      };
      if (!founder || !dataUrl || !dataUrl.startsWith('data:image/')) {
        res.status(400).json({ error: 'Invalid image payload' });
        return;
      }

      const base64Part = dataUrl.split(',')[1];
      if (!base64Part) {
        res.status(400).json({ error: 'Invalid base64 data' });
        return;
      }

      const buffer = Buffer.from(base64Part, 'base64');
      const targetFilename = founder === 'elvio' ? 'elvio.jpg' : 'jorge.jpg';
      const targetPath = path.join(PUBLIC_DIR, targetFilename);

      fs.writeFileSync(targetPath, buffer);
      res.json({ ok: true, savedAs: `/${targetFilename}` });
    } catch (err) {
      console.error('Error saving founder photo:', err);
      res.status(500).json({ error: 'Failed to save image' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SysTex Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
