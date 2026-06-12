/* ════════════════════════════════════════════════════════════════
   Site-wide touch & feel layer — pairs with site-polish.css.
   Smart navbar, tap ripples, magnetic CTAs, card spotlight,
   stat icon pops.
   ════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer  = window.matchMedia('(pointer: fine)').matches;
  var coarsePointer = window.matchMedia('(pointer: coarse)').matches;

  function el(tag, className) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  /* ── Smart navbar: hide on scroll down, show on scroll up ────── */
  var navbar = document.getElementById('navbar');
  var mobileMenu = document.getElementById('mobile-menu');
  var lastY = window.scrollY;

  /* ── Scroll handler (scroll events are already frame-aligned;
     rAF throttling can deadlock in throttled tabs) ── */
  function onScrollFrame() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (navbar) {
      var menuOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
      var delta = y - lastY;
      if (menuOpen || y < 160 || delta < -4) {
        navbar.classList.remove('nav-hidden');
      } else if (delta > 6 && y > 320) {
        navbar.classList.add('nav-hidden');
      }
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScrollFrame, { passive: true });
  onScrollFrame();

  /* ── Menu icon rotates with open/close state ─────────────────── */
  var menuBtn = document.getElementById('mobile-menu-btn');
  if (menuBtn && mobileMenu && 'MutationObserver' in window) {
    new MutationObserver(function () {
      var open = !mobileMenu.classList.contains('hidden');
      menuBtn.classList.toggle('menu-open', open);
      if (open && navbar) navbar.classList.remove('nav-hidden');
    }).observe(mobileMenu, { attributes: true, attributeFilter: ['class'] });
  }

  /* ── Tap ripples on interactive elements ─────────────────────── */
  var RIPPLE_SELECTOR = 'button, .chrome-btn, #mobile-menu a, nav a, .card-lift, .cap-card, footer a[aria-label]';

  function isDarkHost(host) {
    if (host.closest('.chrome-btn, .cap-card, footer, .bg-primary, .bg-primary-container, .bg-secondary')) return true;
    var bg = getComputedStyle(host).backgroundColor;
    var m = bg && bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!m) return false;
    if (m[4] !== undefined && parseFloat(m[4]) < 0.2) return false;
    var lum = (0.299 * m[1] + 0.587 * m[2] + 0.114 * m[3]) / 255;
    return lum < 0.5;
  }

  document.addEventListener('pointerdown', function (e) {
    if (reduceMotion || !e.target || !e.target.closest) return;
    var host = e.target.closest(RIPPLE_SELECTOR);
    if (!host) return;

    host.classList.add('ripple-host');
    var rect = host.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height);
    var ink = el('span', 'ripple-ink' + (isDarkHost(host) ? ' ripple-light' : ''));
    ink.style.width = ink.style.height = size + 'px';
    ink.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ink.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
    host.appendChild(ink);
    setTimeout(function () { ink.remove(); }, 650);

    if (coarsePointer && navigator.vibrate &&
        (host.tagName === 'BUTTON' || host.classList.contains('chrome-btn'))) {
      navigator.vibrate(5);
    }
  }, { passive: true });

  /* ── Magnetic CTA buttons (desktop only) ─────────────────────── */
  if (finePointer && !reduceMotion) {
    var magnets = document.querySelectorAll('.chrome-btn, header a.rounded-full:not(.chrome-btn)');
    Array.prototype.forEach.call(magnets, function (m) {
      var strength = 0.28;
      m.addEventListener('mousemove', function (e) {
        var r = m.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) * strength;
        var y = (e.clientY - r.top - r.height / 2) * strength;
        m.style.transition = 'transform 0.12s ease-out';
        m.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
      });
      m.addEventListener('mouseleave', function () {
        m.style.transition = 'transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1)';
        m.style.transform = '';
        setTimeout(function () { m.style.transition = ''; }, 560);
      });
    });
  }

  /* ── Cursor spotlight position on cards (desktop only) ───────── */
  if (finePointer && !reduceMotion) {
    document.addEventListener('pointermove', function (e) {
      if (!e.target || !e.target.closest) return;
      var card = e.target.closest('.card-lift');
      if (!card) return;
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });
  }

  /* ── 3D tilt cards: perspective tilt on mouse & touch ─────────── */
  if (!reduceMotion) {
    var tiltCards = document.querySelectorAll('.tilt-card');
    Array.prototype.forEach.call(tiltCards, function (card) {
      var rect = null;
      var MAX_TILT = 9;

      function update(clientX, clientY) {
        if (!rect) rect = card.getBoundingClientRect();
        var px = (clientX - rect.left) / rect.width;
        var py = (clientY - rect.top) / rect.height;
        px = Math.min(1, Math.max(0, px));
        py = Math.min(1, Math.max(0, py));
        var rx = (0.5 - py) * MAX_TILT * 2;
        var ry = (px - 0.5) * MAX_TILT * 2;
        card.style.transform = 'perspective(1000px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) translateZ(8px)';
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      }

      function reset() {
        card.classList.remove('tilting');
        card.style.transform = '';
        rect = null;
      }

      card.addEventListener('mouseenter', function () {
        rect = card.getBoundingClientRect();
        card.classList.add('tilting');
      });
      card.addEventListener('mousemove', function (e) { update(e.clientX, e.clientY); });
      card.addEventListener('mouseleave', reset);

      card.addEventListener('touchstart', function (e) {
        rect = card.getBoundingClientRect();
        card.classList.add('tilting');
        update(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      card.addEventListener('touchmove', function (e) {
        update(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      card.addEventListener('touchend', reset);
      card.addEventListener('touchcancel', reset);
    });
  }

  /* ── Stat icons pop in alongside their counters ──────────────── */
  var counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    var popObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var icon = entry.target.previousElementSibling;
        if (icon && icon.classList.contains('material-symbols-outlined')) {
          var cell = entry.target.parentElement;
          var idx = cell && cell.parentElement
            ? Array.prototype.indexOf.call(cell.parentElement.children, cell) : 0;
          icon.style.animationDelay = (idx * 90) + 'ms';
          icon.classList.add('stat-pop');
        }
        popObserver.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    Array.prototype.forEach.call(counters, function (c) { popObserver.observe(c); });
  }
})();
