
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.site-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

const SUPPORTED_IMAGE_EXTENSIONS = /\.(png|jpe?g)$/i;

function getGitHubRepoInfo() {
  if (!window.location.hostname.endsWith('.github.io')) return null;

  const owner = window.location.hostname.split('.')[0];
  const parts = window.location.pathname.split('/').filter(Boolean);
  if (!parts.length) return null;

  return { owner, repo: parts[0] };
}

async function getAssetFileNamesFromGitHub() {
  const repoInfo = getGitHubRepoInfo();
  if (!repoInfo) return null;

  const apiUrl =
    `https://api.github.com/repos/${encodeURIComponent(repoInfo.owner)}/` +
    `${encodeURIComponent(repoInfo.repo)}/contents/assets`;

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store'
    });

    if (!response.ok) return null;

    const items = await response.json();
    if (!Array.isArray(items)) return null;

    return items
      .filter(item => item && item.type === 'file' && SUPPORTED_IMAGE_EXTENSIONS.test(item.name))
      .map(item => item.name);
  } catch (error) {
    console.warn('Could not read GitHub assets folder:', error);
    return null;
  }
}

function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function discoverLocally(prefix) {
  const sources = [];
  const extensions = ['png', 'jpg', 'jpeg'];

  for (let i = 1; i <= 250; i++) {
    const number = String(i).padStart(2, '0');
    let found = null;

    for (const ext of extensions) {
      const src = `assets/${prefix}-${number}.${ext}`;
      if (await imageExists(src)) {
        found = src;
        break;
      }
    }

    if (!found) break;
    sources.push(found);
  }

  return sources;
}

function getSourcesForPrefix(prefix, assetFileNames) {
  if (!assetFileNames) return null;

  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `^${escapedPrefix}-(\\d+)\\.(png|jpe?g)$`,
    'i'
  );

  return assetFileNames
    .map(name => {
      const match = name.match(pattern);
      if (!match) return null;

      return {
        name,
        number: parseInt(match[1], 10)
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.number - b.number || a.name.localeCompare(b.name))
    .map(item => `assets/${encodeURIComponent(item.name)}`);
}

/* ---------------------------
   Expanded carousel lightbox
---------------------------- */

const lightbox = document.getElementById('carousel-lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxDots = document.getElementById('lightbox-dots');
const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
const lightboxNext = lightbox?.querySelector('.lightbox-next');
const lightboxClose = lightbox?.querySelector('.lightbox-close');

let lightboxSources = [];
let lightboxIndex = 0;
let lightboxAltBase = 'Project image';
let lightboxReturnFocus = null;

function renderLightbox() {
  if (!lightbox || !lightboxSources.length) return;

  lightboxIndex =
    (lightboxIndex + lightboxSources.length) % lightboxSources.length;

  lightboxImage.src = lightboxSources[lightboxIndex];
  lightboxImage.alt = `${lightboxAltBase} — image ${lightboxIndex + 1}`;
  lightboxCounter.textContent =
    `${lightboxIndex + 1} / ${lightboxSources.length}`;

  lightboxDots.innerHTML = '';

  lightboxSources.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `lightbox-dot${index === lightboxIndex ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show expanded image ${index + 1}`);
    dot.addEventListener('click', () => {
      lightboxIndex = index;
      renderLightbox();
    });
    lightboxDots.appendChild(dot);
  });

  lightbox.classList.toggle('single-image', lightboxSources.length === 1);
}

function openLightbox(sources, index, altBase, returnFocus) {
  if (!lightbox || !sources.length) return;

  lightboxSources = [...sources];
  lightboxIndex = index;
  lightboxAltBase = altBase || 'Project image';
  lightboxReturnFocus = returnFocus || null;

  renderLightbox();

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lightbox-open');

  lightboxClose?.focus();
}

function closeLightbox() {
  if (!lightbox) return;

  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lightbox-open');

  lightboxImage.src = '';

  if (lightboxReturnFocus) {
    lightboxReturnFocus.focus({ preventScroll: true });
  }
}

function changeLightboxImage(delta) {
  if (!lightboxSources.length) return;
  lightboxIndex += delta;
  renderLightbox();
}

lightboxPrev?.addEventListener('click', () => changeLightboxImage(-1));
lightboxNext?.addEventListener('click', () => changeLightboxImage(1));
lightboxClose?.addEventListener('click', closeLightbox);

lightbox?.querySelectorAll('[data-lightbox-close]').forEach(element => {
  element.addEventListener('click', closeLightbox);
});

document.addEventListener('keydown', event => {
  if (!lightbox?.classList.contains('open')) return;

  if (event.key === 'Escape') closeLightbox();
  if (event.key === 'ArrowLeft') changeLightboxImage(-1);
  if (event.key === 'ArrowRight') changeLightboxImage(1);
});

/* ---------------------------
   Inline project carousels
---------------------------- */

function initialiseCarousel(carousel, sources) {
  const stage = carousel.querySelector('.carousel-stage');
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const dots = carousel.querySelector('.carousel-dots');
  const altBase = carousel.dataset.carouselAlt || 'Project image';

  stage.innerHTML = '';
  dots.innerHTML = '';

  if (!sources || !sources.length) {
    stage.innerHTML = `
      <div class="carousel-empty">
        <div>
          No photos found.<br>
          Use <code>${carousel.dataset.carouselPrefix}-01.png</code>
          or <code>${carousel.dataset.carouselPrefix}-01.jpg</code>
        </div>
      </div>
    `;
    carousel.classList.add('single-image');
    return;
  }

  carousel.classList.toggle('single-image', sources.length === 1);

  let current = 0;

  sources.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${altBase} — image ${index + 1}`;
    img.loading = index === 0 ? 'eager' : 'lazy';
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Open image ${index + 1} in large view`);

    const expand = () => openLightbox(sources, index, altBase, img);

    img.addEventListener('click', expand);
    img.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        expand();
      }
    });

    slide.appendChild(img);
    stage.appendChild(slide);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `carousel-dot${index === 0 ? ' active' : ''}`;
    dot.setAttribute('aria-label', `Show image ${index + 1}`);
    dot.addEventListener('click', () => show(index));
    dots.appendChild(dot);
  });

  const slides = [...stage.querySelectorAll('.carousel-slide')];
  const dotButtons = [...dots.querySelectorAll('.carousel-dot')];

  function show(index) {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === current);
    });

    dotButtons.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  prev.onclick = () => show(current - 1);
  next.onclick = () => show(current + 1);

  let startX = null;

  carousel.addEventListener('touchstart', event => {
    startX = event.touches[0].clientX;
  }, { passive: true });

  carousel.addEventListener('touchend', event => {
    if (startX === null) return;

    const delta = event.changedTouches[0].clientX - startX;
    startX = null;

    if (Math.abs(delta) >= 40) {
      show(delta < 0 ? current + 1 : current - 1);
    }
  }, { passive: true });
}

async function initialiseAllCarousels() {
  const carousels = [...document.querySelectorAll('[data-carousel-prefix]')];
  const assetFileNames = await getAssetFileNamesFromGitHub();

  for (const carousel of carousels) {
    const prefix = carousel.dataset.carouselPrefix;
    let sources = getSourcesForPrefix(prefix, assetFileNames);

    if (sources === null) {
      sources = await discoverLocally(prefix);
    }

    initialiseCarousel(carousel, sources);
  }
}

initialiseAllCarousels();
