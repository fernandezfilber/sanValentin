// ====================================================
//  PARTICLES CONFIG — tsParticles configs
// ====================================================

const heroParticlesConfig = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 60, density: { enable: true, area: 800 } },
    color: { value: ["#e8175d", "#ff6b9d", "#f5c842", "#ffffff"] },
    shape: {
      type: ["char"],
      character: [
        { value: "💕", font: "Verdana", style: "", weight: "400", fill: true },
        { value: "❤", font: "Verdana", style: "", weight: "400", fill: true },
        { value: "✨", font: "Verdana", style: "", weight: "400", fill: true }
      ]
    },
    opacity: { value: { min: 0.3, max: 0.8 }, animation: { enable: true, speed: 0.5, minimumValue: 0.1 } },
    size: { value: { min: 8, max: 18 } },
    move: {
      enable: true,
      speed: { min: 0.5, max: 1.5 },
      direction: "top",
      straight: false,
      outModes: { default: "out" },
      warp: false,
      random: true
    },
    rotate: {
      value: { min: 0, max: 360 },
      direction: "random",
      animation: { enable: true, speed: 5 }
    },
    wobble: { enable: true, distance: 10, speed: { min: -3, max: 3 } }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      resize: true
    },
    modes: {
      repulse: { distance: 80, duration: 0.4 }
    }
  },
  detectRetina: true
};

const cartaParticlesConfig = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 30 },
    color: { value: "#e8175d" },
    shape: { type: "circle" },
    opacity: { value: { min: 0.05, max: 0.25 } },
    size: { value: { min: 2, max: 6 } },
    move: {
      enable: true,
      speed: 0.5,
      direction: "none",
      random: true,
      outModes: { default: "out" }
    },
    links: {
      enable: true,
      color: "#e8175d",
      opacity: 0.1,
      distance: 120,
      width: 1
    }
  },
  detectRetina: true
};

const footerParticlesConfig = {
  fullScreen: false,
  background: { color: { value: "transparent" } },
  particles: {
    number: { value: 25 },
    color: { value: ["#e8175d", "#ff6b9d"] },
    shape: { type: "char", character: { value: "💕", font: "Verdana" } },
    opacity: { value: { min: 0.2, max: 0.6 } },
    size: { value: { min: 10, max: 20 } },
    move: {
      enable: true,
      speed: 0.8,
      direction: "top",
      random: true,
      outModes: { default: "out" }
    }
  },
  detectRetina: true
};

// Inicializar al cargar el sitio
function initParticles() {
  // Hero
  const heroEl = document.getElementById("particles-hero");
  if (heroEl) {
    tsParticles.load({ id: "particles-hero", options: heroParticlesConfig });
  }
  // Carta
  const cartaEl = document.getElementById("particles-carta");
  if (cartaEl) {
    tsParticles.load({ id: "particles-carta", options: cartaParticlesConfig });
  }
  // Footer
  const footerEl = document.getElementById("particles-footer");
  if (footerEl) {
    tsParticles.load({ id: "particles-footer", options: footerParticlesConfig });
  }
}
