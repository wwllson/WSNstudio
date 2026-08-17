/* ============================================================
   WSN — Web design agency landing page behavior
   ============================================================ */
(function () {
  'use strict';

  /* --- Config: single source of truth ----------------------
     accent   : 'blue' | 'purple' | 'cyan'
     showGlow : true | false
  ---------------------------------------------------------- */
  var config = {
    accent: 'blue',
    showGlow: true
  };

  var root = document.documentElement;
  root.setAttribute('data-accent', config.accent);
  root.setAttribute('data-glow', config.showGlow ? 'on' : 'off');

  /* --- Mobile nav toggle ---------------------------------- */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  function setNav(open) {
    nav.setAttribute('data-open', open ? 'true' : 'false');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle) {
    toggle.addEventListener('click', function () {
      setNav(nav.getAttribute('data-open') !== 'true');
    });
    // Close after tapping a link
    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') setNav(false);
    });
    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setNav(false);
    });
  }

  /* --- Contact form: POST to contact.php, then confirm ---- */
  var form = document.getElementById('contactForm');
  var thanks = document.getElementById('thanks');

  function showFormError(msg) {
    var box = form.querySelector('.form-error');
    if (!box) {
      box = document.createElement('p');
      box.className = 'form-error';
      box.setAttribute('role', 'alert');
      form.appendChild(box);
    }
    box.textContent = msg;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Native validation (required + type="email") before sending
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      var btn = form.querySelector('button[type="submit"]');
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      var prev = form.querySelector('.form-error');
      if (prev) prev.remove();

      fetch('contact.php', { method: 'POST', body: new FormData(form) })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (data) {
          if (data && data.ok) {
            form.setAttribute('hidden', '');
            thanks.removeAttribute('hidden');
            thanks.style.animation = 'floatUp .4s ease both';
          } else {
            showFormError((data && data.error) ||
              'Sorry, something went wrong. Please email contact@wsnstudio.co.uk.');
            if (btn) { btn.disabled = false; btn.textContent = label; }
          }
        })
        .catch(function () {
          showFormError('Network error — please try again, or email contact@wsnstudio.co.uk.');
          if (btn) { btn.disabled = false; btn.textContent = label; }
        });
    });
  }

  /* --- Spotlight: mouse-follow glow on every glass card --- */
  if (!window.matchMedia('(hover: none)').matches) {
    document.querySelectorAll('.card, .strip, .panel, .faq__item').forEach(function (el) {
      var pending = false, px = 0, py = 0;
      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        px = e.clientX - rect.left;
        py = e.clientY - rect.top;
        // Coalesce many pointer events into one style write per frame
        if (!pending) {
          pending = true;
          requestAnimationFrame(function () {
            pending = false;
            el.style.setProperty('--spot-x', px + 'px');
            el.style.setProperty('--spot-y', py + 'px');
          });
        }
      });
      el.addEventListener('pointerenter', function () {
        el.style.setProperty('--spot-opacity', '1');
      });
      el.addEventListener('pointerleave', function () {
        el.style.setProperty('--spot-opacity', '0');
      });
    });
  }
})();

/* ============================================================
   Hero beams — animated light rays (premium background)
   Ported from a React/canvas component to plain canvas 2D.
   Hues tuned to the brand accent (#4C6FFF ≈ hue 227).
   ============================================================ */
(function initBeams() {
  'use strict';

  var canvas = document.getElementById('beams');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var INTENSITY = 0.8;   // overall opacity multiplier (subtle = premium)
  var CANVAS_BLUR = 24;  // px, applied in the 2D context
  var COUNT = 22;

  var beams = [];
  var raf = 0;
  var w = 0, h = 0;

  function makeBeam() {
    return {
      x: Math.random() * w * 1.5 - w * 0.25,
      y: Math.random() * h * 1.5 - h * 0.25,
      width: 40 + Math.random() * 80,
      length: h * 2.5,
      angle: -35 + Math.random() * 10,
      speed: 0.35 + Math.random() * 0.65,
      opacity: 0.10 + Math.random() * 0.14,
      hue: 212 + Math.random() * 34,          // blue → indigo
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.025
    };
  }

  function resetBeam(b, i) {
    var col = i % 3;
    var spacing = w / 3;
    b.y = h + 100;
    b.x = col * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
    b.width = 80 + Math.random() * 90;
    b.speed = 0.35 + Math.random() * 0.4;
    b.hue = 212 + (i * 34) / beams.length;
    b.opacity = 0.14 + Math.random() * 0.10;
  }

  function drawBeam(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.rotate((b.angle * Math.PI) / 180);
    var op = b.opacity * (0.8 + Math.sin(b.pulse) * 0.2) * INTENSITY;
    var g = ctx.createLinearGradient(0, 0, 0, b.length);
    var col = function (a) { return 'hsla(' + b.hue + ', 80%, 62%, ' + a + ')'; };
    g.addColorStop(0, col(0));
    g.addColorStop(0.1, col(op * 0.5));
    g.addColorStop(0.4, col(op));
    g.addColorStop(0.6, col(op));
    g.addColorStop(0.9, col(op * 0.5));
    g.addColorStop(1, col(0));
    ctx.fillStyle = g;
    ctx.fillRect(-b.width / 2, 0, b.width, b.length);
    ctx.restore();
  }

  function size() {
    // 1× is plenty — the field is heavily blurred, so retina density would
    // just quadruple the pixels we clear/fill every frame for no visible gain.
    var dpr = 1;
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    beams = [];
    for (var i = 0; i < COUNT; i++) beams.push(makeBeam());
  }

  function render() {
    ctx.clearRect(0, 0, w, h);
    // Softening is done once by the canvas's CSS filter, not per-beam here
    // (per-beam ctx.filter blur was the main cause of hero jank).
    for (var i = 0; i < beams.length; i++) {
      var b = beams[i];
      b.y -= b.speed;
      b.pulse += b.pulseSpeed;
      if (b.y + b.length < -100) resetBeam(b, i);
      drawBeam(b);
    }
  }

  function loop() {
    render();
    raf = requestAnimationFrame(loop);
  }

  var running = false;
  function start() {
    if (running || reduceMotion) return;
    running = true;
    loop();
  }
  function stop() {
    running = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
  }

  function heroOnScreen() {
    var r = hero ? hero.getBoundingClientRect() : null;
    return r ? (r.bottom > 0 && r.top < window.innerHeight) : true;
  }

  var hero = document.getElementById('top');

  size();
  window.addEventListener('resize', function () {
    var wasRunning = running;
    stop();
    size();
    if (reduceMotion) { render(); return; }
    if (wasRunning) start();
  });

  if (reduceMotion) {
    render(); // one static, softened frame
    return;
  }

  // Only animate while the hero is actually visible and the tab is focused —
  // otherwise the beams keep churning the GPU while you read the rest of the
  // page or sit in another tab, which is what made scrolling feel janky.
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !document.hidden) start();
      else stop();
    }, { threshold: 0 }).observe(hero);
  } else {
    start();
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else if (heroOnScreen()) start();
  });
})();

/* ============================================================
   FAQ accordion — single-open, ARIA-correct
   ============================================================ */
(function initFaq() {
  'use strict';
  var items = document.querySelectorAll('.faq__item');
  if (!items.length) return;

  items.forEach(function (item) {
    var btn = item.querySelector('.faq__q');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var isOpen = item.hasAttribute('data-open');
      // Close every item first (single-open accordion)
      items.forEach(function (other) {
        other.removeAttribute('data-open');
        var b = other.querySelector('.faq__q');
        if (b) b.setAttribute('aria-expanded', 'false');
      });
      // Then open this one, unless it was the one already open
      if (!isOpen) {
        item.setAttribute('data-open', '');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

