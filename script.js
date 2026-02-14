const yearElements = document.querySelectorAll('[data-year]');
const currentYear = new Date().getFullYear();
yearElements.forEach((item) => {
  item.textContent = currentYear;
});

const rotatingText = document.querySelector('[data-rotate-text]');
if (rotatingText) {
  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер'];

  // Prevent layout shift when the word changes by reserving width for the widest option.
  const probe = document.createElement('span');
  probe.style.visibility = 'hidden';
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  probe.style.top = '0';
  probe.style.whiteSpace = 'pre';
  probe.style.font = getComputedStyle(rotatingText).font;
  document.body.appendChild(probe);

  let maxWidth = 0;
  words.forEach((word) => {
    probe.textContent = word;
    maxWidth = Math.max(maxWidth, probe.getBoundingClientRect().width);
  });

  document.body.removeChild(probe);
  rotatingText.style.display = 'inline-block';
  rotatingText.style.minWidth = `${Math.ceil(maxWidth)}px`;

  let index = 0;
  rotatingText.textContent = words[index];

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
      'Новая заявка с сайта «Фабрика воспоминаний»',
      '',
      `Имя: ${name || '—'}`,
      `Контакт: ${contact || '—'}`,
      `Тип проекта: ${projectType || '—'}`,
      `Описание: ${details || '—'}`,
      '',
      `Страница: ${window.location.href}`,
    ];

    const text = encodeURIComponent(lines.join('
'));
    const tgUrl = `https://t.me/managerfabricav?text=${text}`;

    // Try to open Telegram with a prefilled message.
    const opened = window.open(tgUrl, '_blank', 'noopener,noreferrer');

    if (message) {
      if (opened) {
        message.textContent = 'Ок! Открылся Telegram с готовым текстом — нажмите «Отправить».';
      } else {
        message.innerHTML =
          'Браузер заблокировал всплывающее окно. Откройте чат вручную: ' +
          `<a href="${tgUrl}" target="_blank" rel="noopener noreferrer">написать менеджеру в Telegram</a>.`;
      }
    }

    form.reset();
  });
}
