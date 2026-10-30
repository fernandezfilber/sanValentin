const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Mapeo fijo y seguro de canciones por sección
const SECTION_SONGS = {
  hero: 'Axel - Te Voy A Amar.mp3',
  carta: 'Río Roma - Por Eso Te Amo (Reempaque (Videoclip)).mp3',
  galeria: 'Río Roma - Mi Persona Favorita.mp3',
  momentos: 'JENCARLOS CANELA - Amor Quédate Video Oficial.mp3',
  secreto: 'Río Roma - Por Eso Te Amo (Reempaque (Videoclip)).mp3'
};

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para obtener lista de canciones con metadata
app.get('/api/songs', (req, res) => {
  const musicDir = path.join(__dirname, 'public', 'music');
  try {
    const files = fs.readdirSync(musicDir).filter(f =>
      f.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
    );
    res.json({
      songs: files,
      sectionMap: SECTION_SONGS
    });
  } catch (e) {
    res.json({ songs: [], sectionMap: SECTION_SONGS });
  }
});

// Endpoint seguro por clave de sección (ej. /music/section/carta)
app.get('/music/section/:sec', (req, res) => {
  const sec = req.params.sec.toLowerCase();
  const target = SECTION_SONGS[sec] || SECTION_SONGS.hero;
  serveMusicFile(target, res);
});

// Endpoint por índice (ej. /music/track/0)
app.get('/music/track/:index', (req, res) => {
  const idx = parseInt(req.params.index, 10);
  const musicDir = path.join(__dirname, 'public', 'music');
  try {
    const files = fs.readdirSync(musicDir).filter(f => f.match(/\.(mp3|wav|ogg|m4a|flac)$/i));
    if (files[idx]) {
      return res.sendFile(path.join(musicDir, files[idx]));
    }
  } catch (e) {}
  res.status(404).send('Not found');
});

// Endpoint tradicional por nombre con búsqueda inteligente
app.get('/music/:filename', (req, res) => {
  const filename = decodeURIComponent(req.params.filename);
  serveMusicFile(filename, res);
});

function serveMusicFile(filename, res) {
  const musicDir = path.join(__dirname, 'public', 'music');
  const exactPath = path.join(musicDir, filename);

  if (fs.existsSync(exactPath)) {
    return res.sendFile(exactPath);
  }

  // Búsqueda flexible por similitud si fallan tildes o codificación
  try {
    const files = fs.readdirSync(musicDir);
    const cleanTarget = filename.toLowerCase().replace(/[^a-z0-9]/g, '');
    const found = files.find(f => {
      const cleanF = f.toLowerCase().replace(/[^a-z0-9]/g, '');
      return cleanF.includes(cleanTarget.substring(0, 8)) || cleanTarget.includes(cleanF.substring(0, 8));
    });
    if (found) {
      return res.sendFile(path.join(musicDir, found));
    }
  } catch (e) {}

  res.status(404).json({ error: 'Canción no encontrada' });
}

app.listen(PORT, () => {
  console.log(`💕 Servidor corriendo en http://localhost:${PORT}`);
});
