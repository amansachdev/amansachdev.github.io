/* ============================================
   AMAN SACHDEV — PORTFOLIO SCRIPTS
   Particles, typing effect, scroll animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // ---------- Particle System ----------
  initParticles();

  // ---------- Cursor Glow ----------
  initCursorGlow();

  // ---------- Navigation ----------
  initNavigation();

  // ---------- Typing Effect ----------
  initTypingEffect();

  // ---------- Scroll Reveal ----------
  initScrollReveal();

  // ---------- Counter Animation ----------
  initCounters();

  // ---------- Smooth Scroll ----------
  initSmoothScroll();
});

/* ==========================================
   PARTICLE SYSTEM
   ========================================== */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  let mouse = { x: null, y: null };
  const particleCount = window.innerWidth < 768 ? 40 : 80;
  const connectionDistance = 150;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.4 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120;
          this.vx += (dx / dist) * force * 0.2;
          this.vy += (dy / dist) * force * 0.2;
        }
      }

      // Damping
      this.vx *= 0.99;
      this.vy *= 0.99;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99, 102, 241, ${this.opacity})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const opacity = (1 - dist / connectionDistance) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================
   CURSOR GLOW
   ========================================== */
function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.innerWidth < 768) {
    if (glow) glow.style.display = 'none';
    return;
  }

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  function updateGlow() {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    glow.style.transform = `translate(${currentX - 300}px, ${currentY - 300}px)`;
    requestAnimationFrame(updateGlow);
  }
  updateGlow();
}

/* ==========================================
   NAVIGATION
   ========================================== */
function initNavigation() {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  // Scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = currentScroll;

    // Active section highlight
    updateActiveLink();
  });

  function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  // Mobile toggle
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
  });

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/* ==========================================
   TYPING EFFECT
   ========================================== */
function initTypingEffect() {
  const el = document.getElementById('typingText');
  if (!el) return;

  const phrases = [
    'scalable web applications.',
    'AI-powered platforms.',
    'enterprise solutions.',
    'beautiful user interfaces.',
    'high-performance APIs.',
    'innovative products.',
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      setTimeout(type, 1500);
      isPaused = false;
      isDeleting = true;
      return;
    }

    if (!isDeleting) {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
      }
    } else {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 30 : isPaused ? 1500 : 60;
    setTimeout(type, speed);
  }

  // Start after a short delay
  setTimeout(type, 1000);
}

/* ==========================================
   SCROLL REVEAL
   ========================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================
   COUNTER ANIMATION
   ========================================== */
function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-count'));
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    
    el.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ==========================================
   SMOOTH SCROLL
   ========================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}
