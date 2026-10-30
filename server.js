const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API para obtener lista de canciones
app.get('/api/songs', (req, res) => {
  const fs = require('fs');
  const musicDir = path.join(__dirname, 'public', 'music');
  try {
    const files = fs.readdirSync(musicDir).filter(f =>
      f.match(/\.(mp3|wav|ogg|m4a|flac)$/i)
    );
    res.json({ songs: files });
  } catch (e) {
    res.json({ songs: [] });
  }
});

// Servir archivos de música con soporte de nombres especiales
app.get('/music/:filename', (req, res) => {
  const fs = require('fs');
  const musicDir = path.join(__dirname, 'public', 'music');
  // Decodificar el nombre del archivo
  const filename = decodeURIComponent(req.params.filename);
  const filePath = path.join(musicDir, filename);

  // Verificar que el archivo existe
  if (!fs.existsSync(filePath)) {
    // Intentar buscar por coincidencia parcial
    const files = fs.readdirSync(musicDir);
    const match = files.find(f =>
      f.toLowerCase().includes(filename.toLowerCase().substring(0, 10))
    );
    if (match) {
      return res.sendFile(path.join(musicDir, match));
    }
    return res.status(404).json({ error: 'Canción no encontrada' });
  }

  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`💕 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`   Abre tu navegador y ve a http://localhost:${PORT}`);
});
