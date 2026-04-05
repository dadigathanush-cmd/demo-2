/* =====================================================
   LUMIÈRE CAFÉ — script.js
   Animations: Loader, Cursor, Parallax, Scroll Reveals,
   Particles, Counter, 3D Tilt, Marquee, Form
   ===================================================== */

'use strict';

// ── LOADER ──────────────────────────────────────────────
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = 'visible';
  }, 2400);
});
document.body.style.overflow = 'hidden';

// ── CUSTOM CURSOR ────────────────────────────────────────
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX; mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth follower using rAF
function animateFollower() {
  followerX += (mouseX - followerX) * 0.1;
  followerY += (mouseY - followerY) * 0.1;
  follower.style.left = followerX + 'px';
  follower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
}
animateFollower();

// Grow on interactive elements
document.querySelectorAll('a, button, .menu-card, .gallery-item, .testimonial-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-grow'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-grow'));
});

// ── NAVBAR SCROLL ────────────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) { navbar.classList.add('scrolled'); }
  else { navbar.classList.remove('scrolled'); }
});

// ── PARALLAX HERO BACKGROUND ─────────────────────────────
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  if (heroBg) {
    heroBg.style.transform = `translateY(${scrollY * 0.45}px)`;
  }
}, { passive: true });

// ── PARALLAX FEATURE IMAGE ───────────────────────────────
const pfImage = document.getElementById('pfImage');
if (pfImage) {
  window.addEventListener('scroll', () => {
    const section  = pfImage.closest('.parallax-feature');
    if (!section) return;
    const rect     = section.getBoundingClientRect();
    const progress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
    const offset   = (progress - 0.5) * 200;
    pfImage.parentElement.style.transform = `translateY(${offset}px)`;
  }, { passive: true });
}

// ── FLOATING PARTICLES ───────────────────────────────────
(function spawnParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    const size     = Math.random() * 6 + 3;
    const startX   = Math.random() * 100;
    const duration = Math.random() * 12 + 8;
    const delay    = Math.random() * 8;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${startX}%;
      bottom:-${size}px;
      opacity:${Math.random() * 0.5 + 0.15};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
    `;
    const keyframes = `
      @keyframes floatParticle${i} {
        0%   { transform: translate(0, 0) scale(1);   opacity: 0; }
        10%  { opacity: ${Math.random() * 0.5 + 0.15}; }
        80%  { opacity: ${Math.random() * 0.3 + 0.05}; }
        100% { transform: translate(${(Math.random()-0.5)*160}px, -${window.innerHeight + 60}px) scale(${Math.random()*0.5+0.5}); opacity: 0; }
      }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = keyframes;
    document.head.appendChild(styleEl);
    p.style.animationName = `floatParticle${i}`;
    container.appendChild(p);
  }
})();

// ── SCROLL REVEAL (IntersectionObserver) ─────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll(
  '.reveal-left, .reveal-right, .reveal-up, .reveal-card, .reveal-gallery'
).forEach(el => revealObserver.observe(el));

// ── COUNTING NUMBERS ─────────────────────────────────────
function easeOutQuart(t) { return 1 - Math.pow(1 - t, 4); }

function animateCounter(el) {
  const target   = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start    = performance.now();
  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const value    = Math.round(easeOutQuart(progress) * target);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num').forEach(el => counterObserver.observe(el));

// ── 3D CARD TILT ─────────────────────────────────────────
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    const rotX   = -dy * 10;
    const rotY   =  dx * 10;
    card.style.transform = `translateY(-12px) perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── GALLERY MAGNETIC HOVER ───────────────────────────────
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('mousemove', (e) => {
    const rect = item.getBoundingClientRect();
    const dx   = (e.clientX - rect.left - rect.width  / 2) / 20;
    const dy   = (e.clientY - rect.top  - rect.height / 2) / 20;
    item.style.transform = `scale(1.04) translate(${dx * 0.3}px, ${dy * 0.3}px)`;
  });
  item.addEventListener('mouseleave', () => {
    item.style.transform = '';
  });
});

// ── PARALLAX ON MOUSE MOVE (Hero cards) ──────────────────
const heroSection = document.getElementById('hero');
if (heroSection) {
  heroSection.addEventListener('mousemove', (e) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const mx = (e.clientX - w / 2) / w;
    const my = (e.clientY - h / 2) / h;

    document.querySelectorAll('.hero-card').forEach(card => {
      const depth = parseFloat(card.dataset.depth || 0.3);
      const moveX = mx * depth * 50;
      const moveY = my * depth * 30;
      card.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    if (heroBg) {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.45}px) translate(${mx * 12}px, ${my * 8}px)`;
    }
  });
}

// ── HAMBURGER MENU ───────────────────────────────────────
const hamburger = document.getElementById('hamburger');
if (hamburger) {
  hamburger.addEventListener('click', () => {
    // Simple mobile nav toggle (extend as needed)
    hamburger.classList.toggle('open');
  });
}

// ── FORM SUBMIT ──────────────────────────────────────────
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.textContent = '✓ Reservation Confirmed!';
    btn.style.background = 'linear-gradient(135deg, #4caf50, #66bb6a)';
    setTimeout(() => {
      btn.textContent = 'Confirm Reservation';
      btn.style.background = '';
      form.reset();
    }, 3200);
  });
}

// ── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ── STAGGER TESTIMONIALS ON SCROLL ───────────────────────
const testCards = document.querySelectorAll('.testimonial-card');
testCards.forEach((card, i) => {
  card.style.opacity   = '0';
  card.style.transform = 'translateY(50px)';
  card.style.transition= `opacity 0.7s ${i * 0.15}s ease-out, transform 0.7s ${i * 0.15}s ease-out`;
});
const testObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      testObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
testCards.forEach(card => testObserver.observe(card));

// ── PAGE ENTER ANIMATION (body fade) ─────────────────────
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.6s ease';
setTimeout(() => { document.documentElement.style.opacity = '1'; }, 100);

// ══════════════════════════════════════════════════════════
// ANTI-GRAVITY SECTION — Cinematic Scene Trigger
// ══════════════════════════════════════════════════════════
(function initAntiGravity() {
  const agSection = document.getElementById('anti-gravity');
  if (!agSection) return;

  const agObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          agSection.classList.add('is-active');
        }, 150);
      } else {
        // Reset when scrolled out of view to replay
        agSection.classList.remove('is-active');
      }
    });
  }, { threshold: 0.4 });

  agObs.observe(agSection);
})();

// ══════════════════════════════════════════════════════════
// LATTE ART DRAWING ANIMATION — Signature Latte Card
// Sequence:
//  0s    → card enters view
//  0.2s  → coffee image darkens & zooms (art-active)
//  0.4s  → scene overlay fades in
//  0.6s  → outer foam ring draws (1.2s)
//  1.1s  → inner ring draws (0.9s)
//  1.6s  → heart path draws (2.3s, the dramatic centerpiece)
//  3.6s  → horizontal leaf lines draw one by one
//  4.2s  → stem + flourishes draw
//  4.6s  → SVG glow-pulse starts; sparkles pop
//  4.8s  → artisan badge fades in
//  7.0s  → scene fades out → image restores → resets → loops
// ══════════════════════════════════════════════════════════
(function initLatteArtAnimation() {
  const card  = document.getElementById('latteCard');
  const scene = document.getElementById('latteArtScene');
  const wrap  = document.getElementById('latteArtWrap');
  const svg   = document.getElementById('laArtSvg');
  const badge = document.getElementById('laBadge');

  if (!card || !scene || !svg) return;

  let running = false;
  const timers = [];

  // ── Get path length safely for any SVG element ──
  function getLen(el) {
    try {
      if (el.getTotalLength) return el.getTotalLength();
    } catch (e) {}
    // Fallback for <circle>
    const r = parseFloat(el.getAttribute('r'));
    if (r) return 2 * Math.PI * r;
    // Fallback for <line>
    const x1 = +el.getAttribute('x1') || 0, y1 = +el.getAttribute('y1') || 0;
    const x2 = +el.getAttribute('x2') || 0, y2 = +el.getAttribute('y2') || 0;
    return Math.hypot(x2 - x1, y2 - y1);
  }

  // ── Schedule a timeout ──
  function after(ms, fn) { const t = setTimeout(fn, ms); timers.push(t); }

  // ── Hide all SVG elements (set dashoffset = full length) ──
  function hidePaths() {
    svg.querySelectorAll('.la-el').forEach(el => {
      const len = getLen(el) + 4; // tiny buffer
      el.style.transition = 'none';
      el.style.strokeDasharray  = len;
      el.style.strokeDashoffset = len;
    });
  }

  // ── Draw a single element by transitioning dashoffset to 0 ──
  function draw(id, durationMs, delayMs, easing) {
    after(delayMs, () => {
      const el = document.getElementById(id);
      if (!el) return;
      el.style.transition = `stroke-dashoffset ${durationMs}ms ${easing || 'cubic-bezier(0.37,0,0.63,1)'}`;
      el.style.strokeDashoffset = '0';
    });
  }

  // ── Full reset ──
  function resetAll() {
    running = false;
    timers.forEach(clearTimeout);
    timers.length = 0;

    scene.classList.remove('active');
    wrap && wrap.classList.remove('art-active');
    svg.classList.remove('glow-pulse');
    badge && badge.classList.remove('visible');

    scene.querySelectorAll('.la-sp').forEach(sp => {
      sp.classList.remove('pop', 'fade');
    });

    hidePaths();
  }

  // ── Main animation sequence ──
  function runSequence() {
    if (running) return;
    running = true;

    resetAll();
    running = true; // re-set after resetAll clears it

    // 1. Image zooms & darkens
    after(200,  () => wrap && wrap.classList.add('art-active'));

    // 2. Overlay fades in
    after(400,  () => scene.classList.add('active'));

    // 3. Draw SVG elements in sequence
    draw('laRing1',  1200, 600);             // outer foam ring
    draw('laRing2',   900, 1100);             // inner ring

    // Heart — the dramatic centrepiece (slower, smoother cubic)
    draw('laHeart',  2400, 1700, 'cubic-bezier(0.22, 1, 0.36, 1)');

    // Horizontal leaf detail lines
    draw('laLine1',  550, 3400);
    draw('laLine2',  550, 3700);
    draw('laLine3',  550, 3900);

    // Stem + flourishes
    draw('laStem',   350, 3900);
    draw('laFlourL', 450, 4100);
    draw('laFlourR', 450, 4200);

    // 4. SVG starts glowing after drawing is done
    after(4600, () => svg.classList.add('glow-pulse'));

    // 5. Sparkles pop one by one
    const sparks = Array.from(scene.querySelectorAll('.la-sp'));
    sparks.forEach((sp, i) => {
      after(4700 + i * 140, () => {
        sp.classList.add('pop');
        after(600, () => sp.classList.add('fade'));
      });
    });

    // 6. Badge fades in
    after(4900, () => badge && badge.classList.add('visible'));

    // 7. Scene fades out → restore image → reset → LOOP
    after(7200, () => {
      scene.classList.remove('active');
      wrap && wrap.classList.remove('art-active');
      after(750, () => {
        running = false;
        after(400, runSequence);
      });
    });
  }

  // Trigger when card scrolls into view
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !running) runSequence();
    });
  }, { threshold: 0.35 });

  obs.observe(card);
})();

console.log('%c☕ Lumière Café — Built with craft & care', 'color: #c8953a; font-size: 14px; font-weight: bold;');



