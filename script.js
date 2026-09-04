
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

/*
  PROJECT PHOTO NAMING:
  assets/<project-prefix>-01.jpg OR .png
  assets/<project-prefix>-02.jpg OR .png
  assets/<project-prefix>-03.jpg OR .png
  ...

  Keep numbering continuous. The carousel stops at the first missing number.
*/
const CAROUSEL_MAX_IMAGES = 250;

function imageExists(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

async function findCarouselImages(prefix) {
  const sources = [];
  const extensions = ['jpg', 'jpeg', 'png'];

  for (let i = 1; i <= CAROUSEL_MAX_IMAGES; i++) {
    const number = String(i).padStart(2, '0');
    let foundSource = null;

    // For every image number, accept JPG, JPEG or PNG.
    // This means formats can be mixed inside the same carousel.
    for (const extension of extensions) {
      const src = `assets/${prefix}-${number}.${extension}`;
      if (await imageExists(src)) {
        foundSource = src;
        break;
      }
    }

    // Stop only when this number does not exist in any supported format.
    if (!foundSource) break;
    sources.push(foundSource);
  }

  return sources;
}

function initialiseCarousel(carousel, sources) {
  const stage = carousel.querySelector('.carousel-stage');
  const prev = carousel.querySelector('.carousel-prev');
  const next = carousel.querySelector('.carousel-next');
  const dots = carousel.querySelector('.carousel-dots');
  const altBase = carousel.dataset.carouselAlt || 'Project image';

  if (!sources.length) {
    stage.innerHTML = `
      <div class="carousel-empty">
        <div>
          No photos uploaded yet.<br>
          Start with <code>${carousel.dataset.carouselPrefix}-01.jpg</code>
        </div>
      </div>`;
    carousel.classList.add('single-image');
    return;
  }

  let current = 0;

  sources.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = `carousel-slide${index === 0 ? ' active' : ''}`;

    const img = document.createElement('img');
    img.src = src;
    img.alt = `${altBase} — image ${index + 1}`;
    img.loading = index === 0 ? 'eager' : 'lazy';

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
    slides.forEach((slide, i) => slide.classList.toggle('active', i === current));
    dotButtons.forEach((dot, i) => dot.classList.toggle('active', i === current));
  }

  prev.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));

  if (sources.length === 1) carousel.classList.add('single-image');

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

document.querySelectorAll('[data-carousel-prefix]').forEach(async carousel => {
  const sources = await findCarouselImages(carousel.dataset.carouselPrefix);
  initialiseCarousel(carousel, sources);
});
