// ====================================================
//  ANIMATIONS — GSAP + ScrollTrigger
// ====================================================

gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);

// ---- HERO ANIMATIONS ----
function animateHero() {
  const tl = gsap.timeline();
  tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 0.3)
    .to('.hero-title', { opacity: 1, duration: 0.1 }, 0.6)
    .fromTo('.hero-title .line1',
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power4.out' }, 0.6
    )
    .fromTo('.hero-title .line2',
      { opacity: 0, scale: 0.6, rotateX: 90 },
      { opacity: 1, scale: 1, rotateX: 0, duration: 1, ease: 'back.out(1.7)' }, 0.9
    )
    .fromTo('.hero-title .line3',
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power4.out' }, 1.1
    )
    .to('.hero-sub', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 1.3)
    .to('.btn-hero', { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)' }, 1.6);
}

// ---- FLOATING HEARTS IN HERO ----
function createFloatingHearts() {
  const wrap = document.getElementById('floating-hearts');
  if (!wrap) return;
  const emojis = ['💕', '❤️', '💗', '💖', '✨', '🌹', '💝'];
  for (let i = 0; i < 18; i++) {
    const h = document.createElement('div');
    h.className = 'float-heart';
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + '%';
    h.style.bottom = '-50px';
    h.style.fontSize = (Math.random() * 1.2 + 0.6) + 'rem';
    h.style.animationDuration = (Math.random() * 8 + 6) + 's';
    h.style.animationDelay = (Math.random() * 10) + 's';
    h.style.opacity = (Math.random() * 0.5 + 0.3);
    wrap.appendChild(h);
  }
}

// ---- REVEAL CARTA PARAGRAPHS ----
function revealCarta() {
  const paras = document.querySelectorAll('.carta-para, .carta-firma');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  paras.forEach(p => observer.observe(p));
}

// ---- REVEAL GALLERY CARDS ----
function revealCards() {
  const cards = document.querySelectorAll('.foto-card, .razon-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
          gsap.fromTo(entry.target,
            { y: 40, scale: 0.93 },
            { y: 0, scale: 1, duration: 0.8, ease: 'back.out(1.4)' }
          );
        }, i * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => observer.observe(c));
}

// ---- REVEAL TEXT ----
function revealTexts() {
  const texts = document.querySelectorAll('.galeria-message, .reveal-text');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  texts.forEach(t => observer.observe(t));
}

// ---- COUNTERS ----
function animateCounters() {
  const counters = document.querySelectorAll('.counter-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
          const numEl = entry.target.querySelector('.counter-num');
          const target = numEl.dataset.target;
          const isInfinite = numEl.dataset.infinite === 'true';
          if (isInfinite) {
            gsap.to(numEl, {
              duration: 2,
              onUpdate: function() {
                const progress = this.progress();
                if (progress >= 0.95) {
                  numEl.textContent = '∞';
                } else {
                  numEl.textContent = Math.floor(progress * 9999).toLocaleString();
                }
              },
              ease: 'power2.out'
            });
          } else {
            const numTarget = parseInt(target);
            gsap.to({ val: 0 }, {
              val: numTarget,
              duration: 2.5,
              ease: 'power2.out',
              onUpdate: function() {
                numEl.textContent = Math.floor(this.targets()[0].val).toLocaleString('es-MX');
              }
            });
          }
        }, i * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

// ---- UNIVERSE CANVAS (starfield) ----
function initUniverse() {
  const canvas = document.getElementById('universe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];
  let nebulas = [];
  let animFrame;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    createStars();
  }

  function createStars() {
    stars = [];
    nebulas = [];
    const count = Math.floor((canvas.width * canvas.height) / 4000);
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        speed: Math.random() * 0.3 + 0.05,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.05 + 0.01,
        color: Math.random() > 0.8 ? '#ffe0ec' : '#ffffff'
      });
    }
    for (let i = 0; i < 4; i++) {
      nebulas.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 120 + 80,
        color: ['rgba(232,23,93,0.06)', 'rgba(180,10,72,0.04)', 'rgba(245,200,66,0.04)'][i % 3]
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Nebulas
    nebulas.forEach(n => {
      const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r);
      grad.addColorStop(0, n.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      // Small hearts occasionally
      if (s.r > 1.5 && Math.sin(s.twinkle * 0.5) > 0.95) {
        ctx.globalAlpha = 0.5;
        ctx.font = '8px serif';
        ctx.fillText('💕', s.x - 4, s.y + 4);
      }

      // Move slowly
      s.y -= s.speed;
      if (s.y < -10) {
        s.y = canvas.height + 10;
        s.x = Math.random() * canvas.width;
      }
    });

    ctx.globalAlpha = 1;
    animFrame = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize', resize);
  draw();
}

// ---- NAVBAR SCROLL ----
function initNavbar() {
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar') || document.getElementById('top-header');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ---- SECTION REVEALS with GSAP ScrollTrigger ----
function initScrollTriggers() {
  // Section headers fade in
  gsap.utils.toArray('.section-header').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 80%', toggleActions: 'play none none none' }
      }
    );
  });

  // Momentos slides entrance
  gsap.fromTo('.momentos-swiper',
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '.momentos-swiper', start: 'top 75%' }
    }
  );
}

// ---- SWIPER ----
function initSwiper() {
  new Swiper('.momentos-swiper', {
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { prevEl: '.swiper-button-prev', nextEl: '.swiper-button-next' },
    effect: 'slide',
    speed: 800
  });
}

// ---- CUSTOM CURSOR ----
function initCursor() {
  // Only desktop
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx - 4 + 'px';
    dot.style.top = my - 4 + 'px';
  });

  function animRing() {
    rx += (mx - rx) * 0.15;
    ry += (my - ry) * 0.15;
    ring.style.left = rx - 16 + 'px';
    ring.style.top = ry - 16 + 'px';
    requestAnimationFrame(animRing);
  }
  animRing();

  document.addEventListener('mousedown', () => {
    dot.style.transform = 'scale(2)';
    ring.style.width = '20px';
    ring.style.height = '20px';
  });
  document.addEventListener('mouseup', () => {
    dot.style.transform = 'scale(1)';
    ring.style.width = '32px';
    ring.style.height = '32px';
  });
}

// ---- INTRO CANVAS HEARTS ----
function initIntroCanvas() {
  const canvas = document.getElementById('intro-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 20,
      size: Math.random() * 20 + 10,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      drift: (Math.random() - 0.5) * 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.05
    };
  }

  function drawHeart(ctx, x, y, size, rotation, opacity) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    ctx.font = size + 'px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const hearts = ['💕', '❤️', '💗', '✨'];
    ctx.fillText(hearts[Math.floor(size * 7) % hearts.length], 0, 0);
    ctx.restore();
  }

  for (let i = 0; i < 30; i++) {
    const p = createParticle();
    p.y = Math.random() * canvas.height;
    particles.push(p);
  }

  function animate() {
    if (!document.getElementById('intro-screen') ||
        document.getElementById('intro-screen').style.display === 'none') return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, i) => {
      drawHeart(ctx, p.x, p.y, p.size, p.rotation, p.opacity);
      p.y -= p.speed;
      p.x += p.drift;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.001;
      if (p.y < -30 || p.opacity <= 0) {
        particles[i] = createParticle();
      }
    });
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  animate();
}
