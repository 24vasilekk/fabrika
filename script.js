// Year in footer
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));

// Rotating hero text + lock width to avoid layout shift
const rotatingText = document.querySelector('[data-rotate-text]');
if (rotatingText) {
  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер'];
  let idx = 0;

  const lockWidth = () => {
    const probe = document.createElement('span');
    probe.style.position = 'absolute';
    probe.style.visibility = 'hidden';
    probe.style.whiteSpace = 'nowrap';
    probe.style.font = getComputedStyle(rotatingText).font;
    document.body.appendChild(probe);

    let max = 0;
    words.forEach((w) => {
      probe.textContent = w;
      max = Math.max(max, probe.getBoundingClientRect().width);
    });

    document.body.removeChild(probe);
    rotatingText.style.display = 'inline-block';
    rotatingText.style.minWidth = `${Math.ceil(max)}px`;
  };

  // Lock on load and on resize (fonts can load later)
  window.addEventListener('load', lockWidth);
  window.addEventListener('resize', lockWidth);
  lockWidth();

  setInterval(() => {
    idx = (idx + 1) % words.length;
    rotatingText.textContent = words[idx];
  }, 2200);
}

// Simple tilt (kept)
const tiltCard = document.querySelector('[data-tilt]');
if (tiltCard) {
  tiltCard.addEventListener('mousemove', (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 6;
    tiltCard.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  tiltCard.addEventListener('mouseleave', () => {
    tiltCard.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
}

// Reveal animation
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

// Mobile header: hide brand while scrolling (menu stays)
const header = document.querySelector('.site-header');
const updateHeader = () => {
  if (!header) return;
  const isMobile = window.matchMedia('(max-width: 520px)').matches;
  if (!isMobile) {
    header.classList.remove('brand-collapsed');
    return;
  }
  if (window.scrollY > 6) header.classList.add('brand-collapsed');
  else header.classList.remove('brand-collapsed');
};
window.addEventListener('scroll', updateHeader, { passive: true });
window.addEventListener('resize', updateHeader);
updateHeader();

// Toast helper
function showToast(text) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
}

// Contact form: copy message + open manager Telegram
const form = document.getElementById('contactForm');
if (form) {
  const message = document.getElementById('formMessage');

  const buildText = (data) => {
    const name = (data.get('name') || '').toString().trim();
    const contact = (data.get('contact') || '').toString().trim();
    const messageText = (data.get('message') || '').toString().trim();

    return [
      '🧩 Заявка с сайта «Фабрика воспоминаний»',
      '',
      `Имя: ${name}`,
      `Контакт: ${contact}`,
      '',
      'Сообщение:',
      messageText,
    ].join('\n');
  };

  const copyToClipboard = async (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(ta);
    return ok;
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const text = buildText(data);

    const ok = await copyToClipboard(text);
    if (ok) showToast('Текст скопирован в буфер обмена ✅');
    else showToast('Не удалось скопировать текст — выделите и скопируйте вручную');

    // Open manager chat
    window.open('https://t.me/managerfabricav', '_blank', 'noopener');

    if (message) {
      message.textContent = 'Открыл чат менеджера. Вставьте текст (Ctrl+V) и отправьте.';
    }

    form.reset();
  });
}
