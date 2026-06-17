// Full-page loading overlay.
// Goals: hide FAST (don't wait for every image), NEVER hang, and feel smooth
// when navigating between internal pages.
(function () {
  var SAFETY_MS = 2200;   // hard cap: loader is gone by now no matter what
  var hidden = false;

  function hideLoader() {
    if (hidden) return;
    hidden = true;
    var loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('loader-hidden');
  }

  // Hide as soon as the document is interactive + first paint has happened.
  // We deliberately do NOT wait for window.load (all images/fonts) — that's
  // what made the loader feel stuck on slow phone connections.
  function scheduleHide() {
    // two rAFs ≈ first real paint, then reveal
    requestAnimationFrame(function () {
      requestAnimationFrame(hideLoader);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleHide, { once: true });
  } else {
    scheduleHide();
  }

  // Absolute safety net — the loader can never outlive this, even if a script
  // error or a never-firing event would otherwise leave it on screen.
  setTimeout(hideLoader, SAFETY_MS);

  // ── Re-show loader on internal navigation ──────────────────────────
  // Delay showing it slightly so instant (cached) navigations don't flash
  // the overlay; only pages that actually take a moment reveal it.
  var showTimer = null;
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a');
    if (!link) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 || href.indexOf('http') === 0 ||
        href.indexOf('javascript:') === 0 || link.target === '_blank' ||
        link.hasAttribute('download')) {
      return;
    }
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    clearTimeout(showTimer);
    showTimer = setTimeout(function () {
      loader.classList.remove('loader-hidden');
    }, 120);
  }, { passive: true });

  // Returning via back/forward cache: page is already rendered, hide instantly.
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) {
      hidden = false;            // allow it to hide again after a bfcache restore
      clearTimeout(showTimer);
      hideLoader();
    }
  });

  // If the user navigates away and the tab is hidden, make sure we don't
  // leave a half-shown loader if they come back.
  window.addEventListener('pagehide', function () {
    clearTimeout(showTimer);
  });
})();
