// ====================================================
//  MUSIC PLAYER — Con mejores momentos + letras flotantes
// ====================================================

// ---- CANCIONES con mejores momentos y metadata ----
const SONG_DATA = {
  'Axel - Te Voy A Amar.mp3': {
    display: 'Axel — Te Voy a Amar',
    artist: 'Axel',
    emoji: '🌹',
    // El coro explota alrededor del minuto 1:05
    bestMoment: 65,
    lyrics: [
      { t: 0,   text: 'Te voy a amar...' },
      { t: 4,   text: 'como nunca nadie te amó' },
      { t: 8,   text: 'con todo lo que soy' },
      { t: 13,  text: 'te voy a dar mi corazón' },
      { t: 18,  text: 'para siempre... 💕' },
    ],
    color: '#e8175d'
  },
  'JENCARLOS CANELA - Amor Quédate Video Oficial.mp3': {
    display: 'Jencarlos Canela — Amor Quédate',
    artist: 'Jencarlos Canela',
    emoji: '💗',
    // Coro principal alrededor del min 0:55
    bestMoment: 55,
    lyrics: [
      { t: 0,   text: 'Amor quédate...' },
      { t: 4,   text: 'no me dejes sin tu luz' },
      { t: 9,   text: 'te necesito aquí' },
      { t: 13,  text: 'junto a mí...' },
      { t: 17,  text: 'para siempre... 💕' },
    ],
    color: '#ff6b9d'
  },
  'Río Roma - Mi Persona Favorita.mp3': {
    display: 'Río Roma — Mi Persona Favorita',
    artist: 'Río Roma',
    emoji: '⭐',
    // Coro desde ~0:52
    bestMoment: 52,
    lyrics: [
      { t: 0,   text: 'Eres mi persona favorita...' },
      { t: 5,   text: 'la que me hace reír' },
      { t: 10,  text: 'la que cuida mi alma' },
      { t: 15,  text: 'la que quiero tener' },
      { t: 20,  text: 'siempre junto a mí 💕' },
    ],
    color: '#f5c842'
  },
  'Río Roma - Por Eso Te Amo (Reempaque (Videoclip)).mp3': {
    display: 'Río Roma — Por Eso Te Amo',
    artist: 'Río Roma',
    emoji: '💝',
    // El coro desde ~0:48
    bestMoment: 48,
    lyrics: [
      { t: 0,   text: 'Por eso te amo...' },
      { t: 5,   text: 'porque eres especial' },
      { t: 10,  text: 'porque llegas a mí' },
      { t: 15,  text: 'y me haces sentir' },
      { t: 20,  text: 'que vale la pena vivir 💕' },
    ],
    color: '#c084fc'
  }
};

let songFiles = [];
let currentIndex = 0;
let isPlaying = false;
let playerOpen = false;
let lyricsTimers = [];
let crossfadeTimer = null;
let isFadingOut = false;

const audio = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');

function getSongMeta(filename) {
  // Buscar coincidencia exacta primero
  if (SONG_DATA[filename]) return SONG_DATA[filename];

  // Buscar por coincidencia flexible de nombre
  const fileClean = filename.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of Object.keys(SONG_DATA)) {
    const keyClean = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (fileClean.includes(keyClean.substring(0, 12)) ||
        keyClean.includes(fileClean.substring(0, 12))) {
      return SONG_DATA[key];
    }
  }

  // Buscar por artista
  for (const key of Object.keys(SONG_DATA)) {
    const meta = SONG_DATA[key];
    if (filename.toLowerCase().includes(meta.artist.toLowerCase().replace(/\s/g, ''))) {
      return meta;
    }
  }

  // Fallback genérico
  return {
    display: filename.replace(/\.(mp3|wav|ogg|m4a|flac)$/i, ''),
    artist: '',
    emoji: '🎵',
    bestMoment: 0,
    lyrics: [],
    color: '#e8175d'
  };
}

function loadSong(index) {
  if (!songFiles.length) return;
  clearLyricsTimers();
  isFadingOut = false;
  currentIndex = index;

  const file = songFiles[currentIndex];
  const meta = getSongMeta(file);

  // Fade out rápido antes de cambiar
  gsap.to(audio, { volume: 0, duration: 0.4, onComplete: () => {
    audio.src = `/music/${encodeURIComponent(file)}`;
    audio.volume = 0;

    // Actualizar UI del player
    document.querySelector('.song-name').textContent = meta.display;
    document.querySelector('.song-hint').textContent = `${currentIndex + 1} / ${songFiles.length} 🎵`;
    document.querySelector('.vinyl-disc').textContent = meta.emoji;

    // Color temático del player
    const playerToggle = document.querySelector('.player-toggle');
    playerToggle.style.background = `linear-gradient(135deg, ${meta.color}, #7a0033)`;

    // Banner "now playing"
    showNowPlayingBanner(meta);

    // Actualizar playlist
    updatePlaylist();

    audio.addEventListener('canplaythrough', onSongReady, { once: true });
    audio.load();
  }});
}

function onSongReady() {
  const file = songFiles[currentIndex];
  const meta = getSongMeta(file);

  // Saltar al mejor momento
  audio.currentTime = meta.bestMoment;

  // Fade in
  gsap.to(audio, { volume: 0.75, duration: 1.2, ease: 'power2.out' });

  if (isPlaying) {
    audio.play().catch(() => {});
    document.querySelector('.vinyl-disc').classList.add('playing');
  }

  // Lanzar letras flotantes
  if (isPlaying) scheduleLyrics(meta);

  // Programar crossfade: cada ~35 segundos cambia a la siguiente
  clearTimeout(crossfadeTimer);
  crossfadeTimer = setTimeout(() => {
    crossfadeToNext();
  }, 35000);
}

function crossfadeToNext() {
  if (isFadingOut) return;
  isFadingOut = true;
  // Fade out suave en 2s
  gsap.to(audio, {
    volume: 0,
    duration: 2,
    ease: 'power2.in',
    onComplete: () => {
      const next = (currentIndex + 1) % songFiles.length;
      isPlaying = true;
      loadSong(next);
    }
  });
}

// ---- LETRAS FLOTANTES ----
function scheduleLyrics(meta) {
  clearLyricsTimers();
  if (!meta.lyrics || !meta.lyrics.length) return;

  meta.lyrics.forEach(line => {
    const timer = setTimeout(() => {
      showFloatingLyric(line.text, meta.color);
    }, line.t * 1000);
    lyricsTimers.push(timer);
  });

  // Repetir en loop después del último
  const lastTime = meta.lyrics[meta.lyrics.length - 1].t + 5;
  const loopTimer = setTimeout(() => {
    scheduleLyrics(meta);
  }, lastTime * 1000);
  lyricsTimers.push(loopTimer);
}

function clearLyricsTimers() {
  lyricsTimers.forEach(t => clearTimeout(t));
  lyricsTimers = [];
}

function showFloatingLyric(text, color = '#e8175d') {
  const el = document.createElement('div');
  el.className = 'floating-lyric';
  el.textContent = text;
  el.style.cssText = `
    position: fixed;
    left: ${10 + Math.random() * 70}%;
    bottom: ${15 + Math.random() * 30}%;
    color: ${color};
    font-family: 'Dancing Script', cursive;
    font-size: ${1.1 + Math.random() * 0.8}rem;
    text-shadow: 0 0 15px ${color}80, 0 2px 10px rgba(0,0,0,0.5);
    pointer-events: none;
    z-index: 4000;
    white-space: nowrap;
    max-width: 80vw;
    text-align: center;
    transform: translateX(-50%);
    opacity: 0;
    user-select: none;
  `;
  document.body.appendChild(el);

  gsap.timeline()
    .to(el, { opacity: 1, y: -20, duration: 0.7, ease: 'power2.out' })
    .to(el, { opacity: 0, y: -80, duration: 1.2, ease: 'power2.in', delay: 2.5,
              onComplete: () => el.remove() });
}

// ---- CONTROLES ----
function togglePlay() {
  if (!songFiles.length) return;
  const meta = getSongMeta(songFiles[currentIndex]);

  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    document.querySelector('.btn-play').textContent = '▶';
    document.querySelector('.vinyl-disc').classList.remove('playing');
    clearLyricsTimers();
    clearTimeout(crossfadeTimer);
  } else {
    audio.play().catch(() => {});
    isPlaying = true;
    document.querySelector('.btn-play').textContent = '⏸';
    document.querySelector('.vinyl-disc').classList.add('playing');
    scheduleLyrics(meta);
    // Retomar crossfade según tiempo restante (~35s desde inicio)
    clearTimeout(crossfadeTimer);
    crossfadeTimer = setTimeout(crossfadeToNext, 20000);
  }
}

function prevSong() {
  isPlaying = true;
  clearTimeout(crossfadeTimer);
  const idx = (currentIndex - 1 + songFiles.length) % songFiles.length;
  loadSong(idx);
}

function nextSong() {
  isPlaying = true;
  clearTimeout(crossfadeTimer);
  const idx = (currentIndex + 1) % songFiles.length;
  loadSong(idx);
}

function seekSong(val) {
  if (!audio.duration) return;
  audio.currentTime = (val / 100) * audio.duration;
}

function setVolume(val) {
  audio.volume = val / 100;
}

function togglePlayer() {
  playerOpen = !playerOpen;
  const body = document.querySelector('.player-body');
  body.classList.toggle('open', playerOpen);
}

// ---- PROGRESS BAR ----
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  progressBar.value = pct;
  progressBar.style.background =
    `linear-gradient(to right, #e8175d ${pct}%, rgba(255,255,255,0.15) ${pct}%)`;

  // Mostrar tiempo restante del fragmento
  const file = songFiles[currentIndex];
  if (file) {
    const meta = getSongMeta(file);
    const elapsed = audio.currentTime - meta.bestMoment;
    const remaining = Math.max(0, 35 - elapsed);
    if (remaining < 5 && !isFadingOut && isPlaying) {
      isFadingOut = true;
      crossfadeToNext();
    }
  }
});

// ---- AUTO SIGUIENTE al terminar ----
audio.addEventListener('ended', () => {
  isPlaying = true;
  const next = (currentIndex + 1) % songFiles.length;
  loadSong(next);
});

// Volumen inicial
audio.volume = 0.75;

// ---- BANNER "SONANDO AHORA" ----
function showNowPlayingBanner(meta) {
  const banner = document.getElementById('now-playing-banner');
  const npText = document.getElementById('np-text');
  if (!banner || !npText) return;

  npText.textContent = `${meta.emoji} ${meta.display}`;
  banner.style.display = 'flex';

  // Animar entrada
  gsap.fromTo(banner,
    { opacity: 0, y: -20, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
  );

  // Auto-ocultar después de 5s
  setTimeout(() => {
    gsap.to(banner, { opacity: 0, y: -10, duration: 0.5, onComplete: () => {
      banner.style.display = 'none';
    }});
  }, 5000);
}

// ---- PLAYLIST VISUAL ----
function buildPlaylist() {
  const wrap = document.getElementById('playlist-wrap');
  if (!wrap) return;
  wrap.innerHTML = '';
  songFiles.forEach((file, i) => {
    const meta = getSongMeta(file);
    const item = document.createElement('div');
    item.className = 'playlist-item' + (i === currentIndex ? ' active' : '');
    item.dataset.index = i;
    item.innerHTML = `
      <span class="pl-emoji">${meta.emoji}</span>
      <span class="pl-name">${meta.display}</span>
      ${i === currentIndex ? '<div class="pl-playing"></div>' : ''}
    `;
    item.addEventListener('click', () => {
      isPlaying = true;
      clearTimeout(crossfadeTimer);
      loadSong(i);
    });
    wrap.appendChild(item);
  });
}

function updatePlaylist() {
  const items = document.querySelectorAll('.playlist-item');
  items.forEach((item, i) => {
    const isActive = i === currentIndex;
    item.classList.toggle('active', isActive);
    const existing = item.querySelector('.pl-playing');
    if (isActive && !existing) {
      const dot = document.createElement('div');
      dot.className = 'pl-playing';
      item.appendChild(dot);
    } else if (!isActive && existing) {
      existing.remove();
    }
  });
}

// ---- INIT SONGS (llamado desde app.js) ----
async function loadSongs() {
  try {
    const res = await fetch('/api/songs');
    const data = await res.json();
    songFiles = data.songs || [];
    if (songFiles.length > 0) {
      buildPlaylist();
      loadSong(0);
    } else {
      document.querySelector('.song-name').textContent = 'Sin canciones';
      document.querySelector('.song-hint').textContent = 'Sube mp3 a /public/music/';
    }
  } catch (e) {
    console.log('Sin canciones:', e);
  }
}
