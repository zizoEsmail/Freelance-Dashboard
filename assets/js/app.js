const API = {
  users: 'https://jsonplaceholder.typicode.com/users',
  posts: 'https://jsonplaceholder.typicode.com/posts',
  comments: (postId) => `https://jsonplaceholder.typicode.com/comments${postId ? `?postId=${postId}` : ''}`,
};

// Theme handling
(function initTheme() {
  const preferred = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  document.documentElement.setAttribute('data-theme', preferred);
  $(document).on('click', '#themeToggle', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    toastr.info(`Switched to ${next} mode`);
  });
})();

// Loader utilities
function showLoader() { $('#loader').removeClass('hidden'); }
function hideLoader() { $('#loader').addClass('hidden'); }

// Toastr global options
toastr.options = {
  closeButton: true,
  progressBar: true,
  newestOnTop: true,
  timeOut: 2200,
  positionClass: 'toast-bottom-right',
};

async function fetchJSON(url) {
  showLoader();
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(err);
    toastr.error('Failed to fetch data');
    return null;
  } finally {
    hideLoader();
  }
}

// Basic modal handling
$(document).on('click', '[data-close]', () => $('.modal').removeClass('show'));
$(document).on('click', '.modal', function(e) {
  if (e.target.classList.contains('modal')) $(this).removeClass('show');
});
