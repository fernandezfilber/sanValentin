// ====================================================
//  APP.JS — Controlador Principal y Experiencia Móvil
// ====================================================

// ---- ENTRAR AL SITIO DESDE LA INTRO ----
function enterSite() {
  const intro = document.getElementById('intro-screen');
  const main = document.getElementById('main-site');
  const player = document.getElementById('music-player');
  const bottomNav = document.getElementById('bottom-nav');

  // Transición suave
  gsap.to(intro, {
    opacity: 0,
    scale: 1.05,
    duration: 1.0,
    ease: 'power3.inOut',
    onComplete: () => {
      intro.style.display = 'none';
      if (main) main.classList.remove('hidden');
      if (player) player.classList.remove('hidden');
      if (bottomNav) bottomNav.classList.remove('hidden');

      // Iniciar animaciones
      initAllAnimations();

      // INICIAR MÚSICA AUTOMÁTICAMENTE para la primera sección
      playSectionMusic('hero', true);

      // Fade in principal
      gsap.fromTo(main,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  });
}

// ---- NAVEGACIÓN SUAVE ENTRE SECCIONES ----
function smoothNavTo(hash, e) {
  if (e) e.preventDefault();
  const target = document.querySelector(hash);
  if (!target) return;

  // Registrar en historial para retroceder
  window.history.pushState({ section: hash }, '', hash);

  target.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Cambiar música inmediatamente al pulsar en el menú
  const secName = hash.replace('#', '');
  playSectionMusic(secName, true);
}

// ---- OBSERVER PARA CAMBIO AUTOMÁTICO DE MÚSICA POR SECCIÓN ----
let sectionObserver = null;

function initSectionMusicObserver() {
  const sections = document.querySelectorAll('section[data-section]');
  if (!sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -40% 0px', // Detecta la sección activa en el centro de pantalla
    threshold: 0.2
  };

  sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const secId = entry.target.dataset.section || entry.target.id;
        // Reproducir la canción correspondiente
        playSectionMusic(secId);
      }
    });
  }, observerOptions);

  sections.forEach(s => sectionObserver.observe(s));
}

// ---- SECCIÓN SECRETA (Abrir y Cerrar) ----
function unlockSecret() {
  const lock = document.getElementById('lock-wrap');
  const content = document.getElementById('secreto-content');

  // Registrar en historial para poder salir con el botón Atrás
  window.history.pushState({ modal: 'secret' }, '');

  gsap.to(lock, {
    scale: 0,
    opacity: 0,
    duration: 0.5,
    ease: 'back.in(1.7)',
    onComplete: () => {
      lock.style.display = 'none';
      content.style.display = 'block';

      gsap.fromTo(content,
        { opacity: 0, scale: 0.85, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'back.out(1.4)' }
      );

      // Confetti de corazones
      launchConfetti();
    }
  });
}

function lockSecret() {
  const lock = document.getElementById('lock-wrap');
  const content = document.getElementById('secreto-content');

  gsap.to(content, {
    opacity: 0,
    scale: 0.9,
    y: 20,
    duration: 0.4,
    ease: 'power2.in',
    onComplete: () => {
      content.style.display = 'none';
      lock.style.display = 'block';

      gsap.fromTo(lock,
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' }
      );
    }
  });
}

// ---- MODAL / LIGHTBOX DE FOTOS (Con botón de salir) ----
function openPhotoModal(src, caption) {
  const modal = document.getElementById('photo-modal');
  const img = document.getElementById('photo-modal-img');
  const cap = document.getElementById('photo-modal-caption');

  if (!modal || !img) return;

  img.src = src;
  if (cap) cap.textContent = caption || '';

  modal.style.display = 'flex';

  // Registrar en historial para retroceder con el botón atrás del móvil
  window.history.pushState({ modal: 'photo' }, '');
}

function closePhotoModal(e) {
  if (e && e.target && e.target.closest && e.target.closest('.photo-modal-content') && !e.target.classList.contains('photo-modal-close') && !e.target.classList.contains('btn-modal-back')) {
    return;
  }
  const modal = document.getElementById('photo-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

// ---- SOPORTE PARA BOTÓN "ATRÁS" DEL MÓVIL (Android / Gestos iOS) ----
window.addEventListener('popstate', (e) => {
  // 1. Si el modal de fotos está abierto, cerrarlo
  const photoModal = document.getElementById('photo-modal');
  if (photoModal && photoModal.style.display !== 'none') {
    photoModal.style.display = 'none';
    return;
  }

  // 2. Si el mensaje secreto está abierto, cerrarlo
  const secretContent = document.getElementById('secreto-content');
  if (secretContent && secretContent.style.display !== 'none') {
    lockSecret();
    return;
  }

  // 3. Si el panel de música está abierto, cerrarlo
  const playerBody = document.querySelector('.player-body');
  if (playerBody && playerBody.classList.contains('open')) {
    closePlayer();
    return;
  }

  // 4. Si el usuario estaba abajo y retrocede, volver suavemente arriba
  if (window.scrollY > 400) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// ---- CONFETTI DE CORAZONES ----
function launchConfetti() {
  const container = document.getElementById('secret-confetti');
  if (!container) return;
  const emojis = ['💕', '❤️', '💗', '💖', '✨', '🌹', '💝', '⭐'];

  for (let i = 0; i < 35; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 95}vw;
        top: -20px;
        font-size: ${Math.random() * 20 + 14}px;
        z-index: 9999;
        pointer-events: none;
        user-select: none;
      `;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(el);

      gsap.to(el, {
        y: '105vh',
        x: (Math.random() - 0.5) * 150,
        rotation: Math.random() * 720 - 360,
        duration: Math.random() * 2.5 + 2,
        ease: 'none',
        onComplete: () => el.remove()
      });
    }, i * 60);
  }
}

// ---- INICIALIZACIÓN COMPLETA ----
function initAllAnimations() {
  if (typeof initParticles === 'function') initParticles();
  if (typeof initUniverse === 'function') initUniverse();
  if (typeof animateHero === 'function') animateHero();
  if (typeof createFloatingHearts === 'function') createFloatingHearts();
  if (typeof initScrollTriggers === 'function') initScrollTriggers();
  if (typeof revealCarta === 'function') revealCarta();
  if (typeof revealCards === 'function') revealCards();
  if (typeof revealTexts === 'function') revealTexts();
  if (typeof animateCounters === 'function') animateCounters();
  if (typeof initSwiper === 'function') initSwiper();
  if (typeof initCursor === 'function') initCursor();

  // Iniciar observador de música por sección
  initSectionMusicObserver();
}

// ---- INICIAR CANVAS AL CARGAR ----
window.addEventListener('DOMContentLoaded', () => {
  if (typeof initIntroCanvas === 'function') initIntroCanvas();
});

// ---- EFECTO AL TOCAR LA PANTALLA (Corazón flotante) ----
document.addEventListener('click', (e) => {
  if (e.target.closest('#intro-screen') || e.target.closest('.btn-enter') || e.target.closest('button') || e.target.closest('input')) return;
  const heart = document.createElement('div');
  heart.textContent = ['💕', '❤️', '💗', '✨'][Math.floor(Math.random() * 4)];
  heart.style.cssText = `
    position: fixed;
    left: ${e.clientX - 10}px;
    top: ${e.clientY - 10}px;
    font-size: 1.3rem;
    pointer-events: none;
    z-index: 99999;
    user-select: none;
  `;
  document.body.appendChild(heart);
  gsap.to(heart, {
    y: -50,
    opacity: 0,
    scale: 1.4,
    duration: 0.9,
    ease: 'power2.out',
    onComplete: () => heart.remove()
  });
});
