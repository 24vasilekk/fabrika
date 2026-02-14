const yearElements = document.querySelectorAll('[data-year]');
const currentYear = new Date().getFullYear();
yearElements.forEach((item) => {
  item.textContent = currentYear;
});

const rotatingText = document.querySelector('[data-rotate-text]');
if (rotatingText) {
  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер'];
  let index = 0;

  // Prevent layout shift when the word changes by reserving width for the longest phrase.
  // We measure using the same font styles as the rotating element.
  const measure = document.createElement('span');
  measure.style.position = 'absolute';
  measure.style.visibility = 'hidden';
  measure.style.whiteSpace = 'nowrap';
  measure.style.pointerEvents = 'none';
  measure.style.font = window.getComputedStyle(rotatingText).font;
  document.body.appendChild(measure);

  let maxWidth = 0;
  words.forEach((word) => {
    measure.textContent = word;
    maxWidth = Math.max(maxWidth, measure.getBoundingClientRect().width);
  });
  document.body.removeChild(measure);

  // Add a couple pixels to avoid subpixel reflow differences across browsers.
  rotatingText.style.width = `${Math.ceil(maxWidth) + 2}px`;

  setInterval(() => {
    index = (index + 1) % words.length;
    rotatingText.textContent = words[index];
  }, 2200);
}

const tiltCard = document.querySelector('[data-tilt]');
if (tiltCard) {
  tiltCard.addEventListener('mousemove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 10;
    const rotateX = (0.5 - py) * 8;
    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

const reveals = document.querySelectorAll('.reveal');
if (reveals.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  reveals.forEach((item) => observer.observe(item));
}

const form = document.getElementById('contactForm');
if (form) {
  const message = document.getElementById('formMessage');
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);

    const name = (formData.get('name') || '').toString().trim();
    const contact = (formData.get('contact') || '').toString().trim();
    const projectType = (formData.get('projectType') || '').toString().trim();
    const details = (formData.get('details') || '').toString().trim();

    const lines = [
      '🧩 Заявка с сайта «Фабрика воспоминаний»',
      '',
      `Имя: ${name || '—'}`,
      `Контакт: ${contact || '—'}`,
      `Тип проекта: ${projectType || '—'}`,
      '',
      'Описание:',
      details || '—',
    ];

    // Telegram deep links support draft text.
    // Prefer tg://resolve to reduce the chance of the draft showing URL-encoded in some clients.
    // Official docs: tg://resolve?domain=<username>&text=<draft_text>
    let draftText = lines.join('\n');
    // Telegram recommends prepending a whitespace if the draft starts with '@' (inline query).
    if (draftText.startsWith('@')) draftText = ` ${draftText}`;

    const deepParams = new URLSearchParams({ domain: 'managerfabricav', text: draftText });
    const tgDeepLink = `tg://resolve?${deepParams.toString()}`;

    const webParams = new URLSearchParams({ text: draftText });
    const tgWebLink = `https://t.me/managerfabricav?${webParams.toString()}`;

    // Try to open Telegram app (deep link). If blocked, fall back to web link.
    const popup = window.open(tgDeepLink, '_blank');
    if (!popup) window.open(tgWebLink, '_blank', 'noopener,noreferrer');

    if (message) {
      if (popup) {
        message.textContent = 'Открыли Telegram с вашей заявкой — нажмите «Отправить» в чате менеджера.';
      } else {
        message.innerHTML = `Откройте Telegram и отправьте заявку менеджеру: <a href="${tgWebLink}" target="_blank" rel="noopener noreferrer">написать менеджеру</a>`;
      }
    }

    form.reset();
  });
}
