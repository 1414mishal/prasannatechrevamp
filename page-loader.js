// Full-page loading overlay: shown until the page finishes loading,
// and re-shown when navigating to another internal page.
(function () {
  function hideLoader() {
    var loader = document.getElementById('page-loader');
    if (loader) loader.classList.add('loader-hidden');
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader);
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a');
    if (!link) return;
    var href = link.getAttribute('href');
    if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 ||
        href.indexOf('tel:') === 0 || href.indexOf('http') === 0 || link.target === '_blank') {
      return;
    }
    var loader = document.getElementById('page-loader');
    if (loader) loader.classList.remove('loader-hidden');
  });

  // Restore loader state when returning via back/forward cache
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) hideLoader();
  });
})();
