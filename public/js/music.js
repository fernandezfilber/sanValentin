// ====================================================
//  MUSIC PLAYER — Automático por Sección + Mejores Momentos
// ====================================================

const SECTION_CONFIG = {
  hero: {
    sectionName: 'Inicio',
    filename: 'Axel - Te Voy A Amar.mp3',
    display: 'Axel — Te Voy a Amar',
    artist: 'Axel',
    emoji: '🌹',
    bestMoment: 65, // Coro principal
    color: '#e8175d',
    lyrics: [
      { t: 0,  text: 'Te voy a amar...' },
      { t: 4,  text: 'como nunca nadie te amó' },
      { t: 8,  text: 'con todo lo que soy' },
      { t: 13, text: 'te voy a dar mi corazón' },
      { t: 18, text: 'para siempre... 💕' }
    ]
  },
  carta: {
    sectionName: 'La Carta',
    filename: 'Río Roma - Por Eso Te Amo (Reempaque (Videoclip)).mp3',
    display: 'Río Roma — Por Eso Te Amo',
    artist: 'Río Roma',
    emoji: '💌',
    bestMoment: 48, // Coro
    color: '#ff6b9d',
    lyrics: [
      { t: 0,  text: 'Por eso te amo...' },
      { t: 4,  text: 'porque eres especial' },
      { t: 9,  text: 'porque llegas a mí' },
      { t: 14, text: 'y me haces sentir' },
      { t: 18, text: 'que vale la pena vivir 💕' }
    ]
  },
  galeria: {
    sectionName: 'Tú',
    filename: 'Río Roma - Mi Persona Favorita.mp3',
    display: 'Río Roma — Mi Persona Favorita',
    artist: 'Río Roma',
    emoji: '🌸',
    bestMoment: 52, // Coro
    color: '#f5c842',
    lyrics: [
      { t: 0,  text: 'Eres mi persona favorita...' },
      { t: 5,  text: 'la que me hace reír' },
      { t: 9,  text: 'la que cuida mi alma' },
      { t: 14, text: 'la que quiero tener' },
      { t: 18, text: 'siempre junto a mí 💕' }
    ]
  },
  momentos: {
    sectionName: 'Nosotros',
    filename: 'JENCARLOS CANELA - Amor Quédate Video Oficial.mp3',
    display: 'Jencarlos Canela — Amor Quédate',
    artist: 'Jencarlos Canela',
    emoji: '✨',
    bestMoment: 55, // Coro
    color: '#a855f7',
    lyrics: [
      { t: 0,  text: 'Amor quédate...' },
      { t: 4,  text: 'no me dejes sin tu luz' },
      { t: 8,  text: 'te necesito aquí' },
      { t: 13, text: 'junto a mí...' },
      { t: 17, text: 'para siempre... 💕' }
    ]
  },
  contador: {
    alias: 'carta'
  },
  razones: {
    alias: 'galeria'
  },
  secreto: {
    alias: 'carta'
  }
};

let currentSectionKey = '';
let currentTrackFile = '';
let isPlaying = false;
let playerOpen = false;
let lyricsTimers = [];
let audioUnlocked = false;
let userManuallyPaused = false;
let pendingCrossfade = null;

const audio = document.getElementById('audio-player');
const progressBar = document.getElementById('progress-bar');
const volumeBar = document.getElementById('volume-bar');

// Inicializar audio
audio.volume = 0.75;

// Desbloquear audio con el primer toque (crítico en móviles)
function unlockAudioContext() {
  if (audioUnlocked) return;
  audio.play().then(() => {
    audio.pause();
    audioUnlocked = true;
  }).catch(() => {});
}
document.addEventListener('touchstart', unlockAudioContext, { once: true, passive: true });
document.addEventListener('click', unlockAudioContext, { once: true });

// Obtener configuración canónica de una sección
function getSectionConfig(sectionId) {
  const cfg = SECTION_CONFIG[sectionId] || SECTION_CONFIG.hero;
  if (cfg.alias && SECTION_CONFIG[cfg.alias]) {
    return SECTION_CONFIG[cfg.alias];
  }
  return cfg;
}

// Reproducir automáticamente la música asignada a una sección
function playSectionMusic(sectionId, force = false) {
  if (userManuallyPaused && !force) return;

  const config = getSectionConfig(sectionId);
  if (!config) return;

  // Si ya está sonando la canción de esta sección, no reiniciar
  if (currentTrackFile === config.filename && isPlaying && !force) {
    currentSectionKey = sectionId;
    updateActiveNavIndicator(sectionId);
    return;
  }

  currentSectionKey = sectionId;
  currentTrackFile = config.filename;
  updateActiveNavIndicator(sectionId);

  // Crossfade suave
  if (pendingCrossfade) clearTimeout(pendingCrossfade);

  if (isPlaying && audio.currentTime > 0) {
    // Fade out de 0.6s
    gsap.to(audio, {
      volume: 0,
      duration: 0.6,
      ease: 'power2.in',
      onComplete: () => {
        startTrackWithConfig(config);
      }
    });
  } else {
    startTrackWithConfig(config);
  }
}

function startTrackWithConfig(config) {
  clearLyricsTimers();
  audio.src = `/music/${encodeURIComponent(config.filename)}`;

  // Actualizar UI del player
  const songNameEl = document.querySelector('.song-name');
  const songHintEl = document.querySelector('.song-hint');
  const vinylDisc = document.querySelector('.vinyl-disc');
  const miniBarText = document.getElementById('mini-now-playing-title');

  if (songNameEl) songNameEl.textContent = config.display;
  if (songHintEl) songHintEl.textContent = `Sección: ${config.sectionName || ''} 💕`;
  if (vinylDisc) vinylDisc.textContent = config.emoji;
  if (miniBarText) miniBarText.textContent = `${config.emoji} ${config.display}`;

  showNowPlayingBanner(config);

  const onReady = () => {
    try {
      audio.currentTime = config.bestMoment || 0;
    } catch (e) {}

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        isPlaying = true;
        userManuallyPaused = false;
        updatePlayButtons(true);
        // Fade in a 0.75
        gsap.to(audio, { volume: 0.75, duration: 1.2, ease: 'power2.out' });
        scheduleLyrics(config);
      }).catch(err => {
        console.log('Esperando interacción para audio:', err);
      });
    }
  };

  audio.addEventListener('canplaythrough', onReady, { once: true });
  audio.load();
}

function updatePlayButtons(playing) {
  const btnPlay = document.querySelector('.btn-play');
  const vinyl = document.querySelector('.vinyl-disc');
  const bottomMusicIcon = document.getElementById('bottom-nav-music-icon');

  if (btnPlay) btnPlay.textContent = playing ? '⏸' : '▶';
  if (vinyl) {
    if (playing) vinyl.classList.add('playing');
    else vinyl.classList.remove('playing');
  }
  if (bottomMusicIcon) {
    if (playing) bottomMusicIcon.classList.add('pulse-glow');
    else bottomMusicIcon.classList.remove('pulse-glow');
  }
}

// Control Manual: Play / Pause
function togglePlay() {
  if (isPlaying) {
    audio.pause();
    isPlaying = false;
    userManuallyPaused = true;
    updatePlayButtons(false);
    clearLyricsTimers();
  } else {
    userManuallyPaused = false;
    audio.play().then(() => {
      isPlaying = true;
      updatePlayButtons(true);
      const cfg = getSectionConfig(currentSectionKey || 'hero');
      scheduleLyrics(cfg);
    }).catch(() => {});
  }
}

// Siguiente / Anterior sección musical
const SECTION_KEYS = ['hero', 'carta', 'galeria', 'momentos'];

function nextSong() {
  let idx = SECTION_KEYS.indexOf(currentSectionKey);
  idx = (idx + 1) % SECTION_KEYS.length;
  playSectionMusic(SECTION_KEYS[idx], true);
}

function prevSong() {
  let idx = SECTION_KEYS.indexOf(currentSectionKey);
  idx = (idx - 1 + SECTION_KEYS.length) % SECTION_KEYS.length;
  playSectionMusic(SECTION_KEYS[idx], true);
}

function seekSong(val) {
  if (!audio.duration) return;
  audio.currentTime = (val / 100) * audio.duration;
}

function setVolume(val) {
  audio.volume = val / 100;
}

// Abrir / Cerrar el panel del reproductor
function togglePlayer() {
  if (playerOpen) {
    closePlayer();
  } else {
    openPlayer();
  }
}

function openPlayer() {
  playerOpen = true;
  const body = document.querySelector('.player-body');
  if (body) {
    body.classList.add('open');
    // Soporte para botón "Atrás" de Android/móvil
    window.history.pushState({ modal: 'musicPlayer' }, '');
  }
}

function closePlayer() {
  playerOpen = false;
  const body = document.querySelector('.player-body');
  if (body) body.classList.remove('open');
}

// Banner "Sonando ahora"
function showNowPlayingBanner(config) {
  const banner = document.getElementById('now-playing-banner');
  const npText = document.getElementById('np-text');
  if (!banner || !npText) return;

  npText.textContent = `${config.emoji} ${config.display}`;
  banner.style.display = 'flex';

  gsap.fromTo(banner,
    { opacity: 0, y: -25, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'back.out(1.7)' }
  );

  setTimeout(() => {
    gsap.to(banner, {
      opacity: 0,
      y: -15,
      duration: 0.5,
      onComplete: () => { banner.style.display = 'none'; }
    });
  }, 4000);
}

// Letras flotantes en pantalla
function scheduleLyrics(config) {
  clearLyricsTimers();
  if (!config.lyrics || !config.lyrics.length) return;

  config.lyrics.forEach(line => {
    const timer = setTimeout(() => {
      showFloatingLyric(line.text, config.color);
    }, line.t * 1000);
    lyricsTimers.push(timer);
  });
}

function clearLyricsTimers() {
  lyricsTimers.forEach(t => clearTimeout(t));
  lyricsTimers = [];
}

function showFloatingLyric(text, color = '#ff6b9d') {
  const el = document.createElement('div');
  el.className = 'floating-lyric';
  el.textContent = text;
  el.style.cssText = `
    position: fixed;
    left: 50%;
    bottom: 95px;
    transform: translateX(-50%);
    color: ${color};
    font-family: 'Dancing Script', cursive;
    font-size: clamp(1.2rem, 4vw, 1.8rem);
    text-shadow: 0 0 15px ${color}90, 0 2px 8px rgba(0,0,0,0.8);
    pointer-events: none;
    z-index: 8500;
    white-space: nowrap;
    opacity: 0;
    user-select: none;
  `;
  document.body.appendChild(el);

  gsap.timeline()
    .to(el, { opacity: 1, y: -10, duration: 0.5, ease: 'power2.out' })
    .to(el, { opacity: 0, y: -50, duration: 1, ease: 'power2.in', delay: 2.2, onComplete: () => el.remove() });
}

// Actualizar barra de progreso del audio
audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const pct = (audio.currentTime / audio.duration) * 100;
  if (progressBar) {
    progressBar.value = pct;
    progressBar.style.background = `linear-gradient(to right, #e8175d ${pct}%, rgba(255,255,255,0.15) ${pct}%)`;
  }
});

// Auto-loop si la canción termina
audio.addEventListener('ended', () => {
  const cfg = getSectionConfig(currentSectionKey || 'hero');
  audio.currentTime = cfg.bestMoment || 0;
  audio.play().catch(() => {});
});

// Indicador visual en la barra de navegación activa
function updateActiveNavIndicator(sectionId) {
  document.querySelectorAll('.bottom-nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === `#${sectionId}`) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}
