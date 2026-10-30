// ====================================================
//  APP.JS — Main controller
// ====================================================

// ---- ENTER SITE from Intro ----
function enterSite() {
  const intro = document.getElementById('intro-screen');
  const main = document.getElementById('main-site');
  const player = document.getElementById('music-player');

  gsap.to(intro, {
    opacity: 0,
    scale: 1.05,
    duration: 1.2,
    ease: 'power3.inOut',
    onComplete: () => {
      intro.style.display = 'none';
      main.classList.remove('hidden');
      player.classList.remove('hidden');

      // Start all animations
      initAllAnimations();

      // Fade in main
      gsap.fromTo(main,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: 'power2.out' }
      );
    }
  });
}

// ---- UNLOCK SECRET ----
function unlockSecret() {
  const lock = document.getElementById('lock-wrap');
  const content = document.getElementById('secreto-content');

  gsap.to(lock, {
    scale: 0,
    opacity: 0,
    duration: 0.6,
    ease: 'back.in(1.7)',
    onComplete: () => {
      lock.style.display = 'none';
      content.style.display = 'block';

      gsap.fromTo(content,
        { opacity: 0, scale: 0.8, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1, ease: 'back.out(1.4)' }
      );

      // Confetti hearts
      launchConfetti();
    }
  });
}

// ---- CONFETTI HEARTS ----
function launchConfetti() {
  const container = document.getElementById('secret-confetti');
  if (!container) return;
  const emojis = ['💕', '❤️', '💗', '💖', '✨', '🌹', '💝', '⭐'];

  for (let i = 0; i < 40; i++) {
    setTimeout(() => {
      const el = document.createElement('div');
      el.style.cssText = `
        position: fixed;
        left: ${Math.random() * 100}vw;
        top: -20px;
        font-size: ${Math.random() * 20 + 12}px;
        z-index: 9999;
        pointer-events: none;
        user-select: none;
      `;
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      document.body.appendChild(el);

      gsap.to(el, {
        y: '110vh',
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 720 - 360,
        duration: Math.random() * 3 + 2,
        ease: 'none',
        onComplete: () => el.remove()
      });
    }, i * 80);
  }
}

// ---- MOBILE MENU ----
function toggleMenu() {
  document.querySelector('.nav-links').classList.toggle('open');
}

// Close menu on link click
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.remove('open');
  });
});

// ---- INIT ALL ANIMATIONS (called after intro) ----
function initAllAnimations() {
  // Particles
  initParticles();

  // Universe starfield
  initUniverse();

  // Hero animations
  animateHero();

  // Floating hearts
  createFloatingHearts();

  // Navbar scroll
  initNavbar();

  // ScrollTrigger
  initScrollTriggers();

  // Carta reveals
  revealCarta();

  // Cards
  revealCards();

  // Texts
  revealTexts();

  // Counters
  animateCounters();

  // Swiper
  initSwiper();

  // Cursor
  initCursor();

  // Songs — se carga y auto-reproduce al entrar
  loadSongs().then ? loadSongs() : loadSongs();

  // Pequeño delay para autoplay (esperar interacción del usuario)
  setTimeout(() => {
    if (!isPlaying && songFiles && songFiles.length > 0) {
      isPlaying = true;
      audio.play().catch(() => {
        // Navegador bloqueó autoplay — está bien, el usuario ya interactuó con el botón Enter
      });
      document.querySelector('.btn-play').textContent = '⏸';
      document.querySelector('.vinyl-disc').classList.add('playing');
    }
  }, 1500);
}

// ---- INIT INTRO ----
window.addEventListener('DOMContentLoaded', () => {
  initIntroCanvas();
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- PARALLAX en HERO ----
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const scroll = window.scrollY;
  const heroContent = hero.querySelector('.hero-content');
  if (heroContent && scroll < window.innerHeight) {
    heroContent.style.transform = `translateY(${scroll * 0.3}px)`;
    heroContent.style.opacity = 1 - scroll / (window.innerHeight * 0.8);
  }
});

// ---- HOVER GLOW en fotos ----
document.querySelectorAll('.foto-img').forEach(img => {
  img.addEventListener('mousemove', (e) => {
    const rect = img.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  });
});

// ---- HEART CLICK EFFECT (anywhere) ----
document.addEventListener('click', (e) => {
  if (e.target.closest('#intro-screen') || e.target.closest('.btn-enter')) return;
  const heart = document.createElement('div');
  heart.textContent = ['💕', '❤️', '💗', '✨'][Math.floor(Math.random() * 4)];
  heart.style.cssText = `
    position: fixed;
    left: ${e.clientX - 10}px;
    top: ${e.clientY - 10}px;
    font-size: 1.4rem;
    pointer-events: none;
    z-index: 99999;
    user-select: none;
  `;
  document.body.appendChild(heart);
  gsap.to(heart, {
    y: -60,
    opacity: 0,
    scale: 1.5,
    duration: 1,
    ease: 'power2.out',
    onComplete: () => heart.remove()
  });
});
