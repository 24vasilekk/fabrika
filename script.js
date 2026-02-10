// ===== Utils =====
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

// ===== Footer year =====
const currentYear = new Date().getFullYear();
$$('[data-year]').forEach((el) => (el.textContent = currentYear));

// ===== Theme toggle (light/dark) =====
(() => {
  const root = document.documentElement;
  const toggle = $('[data-theme-toggle]');

  const getPreferred = () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    if (toggle) {
      const isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', String(isDark));
      toggle.textContent = isDark ? '🌙' : '🌓';
    }
  };

  apply(getPreferred());

  if (toggle) {
    toggle.addEventListener('click', () => {
      const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
      apply(next);
    });
  }
})();

// ===== Rotating hero text =====
(() => {
  const rotatingText = $('[data-rotate-text]');
  if (!rotatingText) return;

  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер', 'родной дом'];
  let index = 0;

  const swap = () => {
    index = (index + 1) % words.length;
    rotatingText.classList.add('swap');
    window.setTimeout(() => {
      rotatingText.textContent = words[index];
      rotatingText.classList.remove('swap');
    }, 180);
  };

  window.setInterval(swap, 2400);
})();

// ===== Tilt effect (for any element with [data-tilt]) =====
(() => {
  const tiltItems = $$('[data-tilt]');
  if (!tiltItems.length) return;

  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  tiltItems.forEach((item) => {
    item.addEventListener('mousemove', (event) => {
      const rect = item.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width;
      const py = (event.clientY - rect.top) / rect.height;
      const rotateY = clamp((px - 0.5) * 12, -10, 10);
      const rotateX = clamp((0.5 - py) * 10, -10, 10);
      item.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    item.addEventListener('mouseleave', () => {
      item.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  });
})();

// ===== Reveal on scroll =====
(() => {
  const reveals = $$('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  reveals.forEach((el) => observer.observe(el));
})();

// ===== Portfolio modal + filters =====
(() => {
  const modal = $('#portfolioModal');
  const items = $$('[data-modal].portfolio-item');
  const chips = $$('.chip[data-filter]');

  // Filters
  if (chips.length && items.length) {
    const setActive = (btn) => {
      chips.forEach((c) => {
        c.classList.toggle('active', c === btn);
        c.setAttribute('aria-selected', c === btn ? 'true' : 'false');
      });
    };

    const applyFilter = (filter) => {
      items.forEach((card) => {
        const tag = card.getAttribute('data-tag') || 'all';
        const show = filter === 'all' || tag === filter;
        card.style.display = show ? '' : 'none';
      });
    };

    chips.forEach((btn) => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter') || 'all';
        setActive(btn);
        applyFilter(filter);
      });
    });
  }

  // Modal
  if (!modal || !items.length) return;

  const titleEl = $('#modalTitle');
  const descEl = $('#modalDesc');
  const imgEl = $('#modalImage');

  const openModal = (card) => {
    const title = card.getAttribute('data-title') || 'Кейс';
    const desc = card.getAttribute('data-desc') || '';
    const src = card.getAttribute('data-src') || '';

    if (titleEl) titleEl.textContent = title;
    if (descEl) descEl.textContent = desc;
    if (imgEl) {
      imgEl.src = src;
      imgEl.alt = title;
    }

    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', 'open');
  };

  items.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    const hit = $('.card-hit', card);
    if (hit) hit.addEventListener('click', (e) => (e.preventDefault(), openModal(card)));
  });

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    const rect = modal.getBoundingClientRect();
    const isInDialog =
      e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
    if (!isInDialog) modal.close();
  });
})();

// ===== Contact form (demo) =====
(() => {
  const form = $('#contactForm');
  if (!form) return;

  const message = $('#formMessage');
  const submit = $('[data-submit]', form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (submit) submit.disabled = true;

    const formData = new FormData(form);
    const name = (formData.get('name') || 'друг').toString().trim() || 'друг';

    if (message) {
      message.textContent = `Спасибо, ${name}! Заявка принята. Для быстрого старта напишите нам в Telegram — мы пришлём 2–3 концепции.`;
    }

    window.setTimeout(() => {
      form.reset();
      if (submit) submit.disabled = false;
    }, 450);
  });
})();
