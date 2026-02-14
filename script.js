const yearElements = document.querySelectorAll('[data-year]');
const currentYear = new Date().getFullYear();
yearElements.forEach((item) => {
  item.textContent = currentYear;
});

/**
 * HERO rotating text (static layout, no page "jump")
 */
const rotatingText = document.querySelector('[data-rotate-text]');
if (rotatingText) {
  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер'];
  let index = 0;

  // Reserve width for the longest phrase to prevent layout shift.
  const original = rotatingText.textContent;
  let maxWidth = 0;
  rotatingText.style.display = 'inline-block';
  rotatingText.style.whiteSpace = 'nowrap';

  words.forEach((w) => {
    rotatingText.textContent = w;
    const wpx = rotatingText.offsetWidth;
    if (wpx > maxWidth) maxWidth = wpx;
  });

  rotatingText.textContent = original;
  if (maxWidth > 0) {
    rotatingText.style.width = `${maxWidth}px`;
  }

  setInterval(() => {
    index = (index + 1) % words.length;
    rotatingText.textContent = words[index];
  }, 2200);
}

/**
 * Contact form -> Telegram manager
 * We copy the exact text to clipboard (reliable, no % encoding),
 * then open the manager chat. User just pastes and sends.
 */
const form = document.getElementById('contactForm');
if (form) {
  const messageEl = document.getElementById('formMessage');
  const managerUsername = 'managerfabricav';
  const managerUrl = `https://t.me/${managerUsername}`;

  const copyToClipboard = async (text) => {
    // Primary: Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: hidden textarea + execCommand
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'absolute';
    ta.style.left = '-9999px';
    ta.style.top = '0';
    document.body.appendChild(ta);
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

    const formData = new FormData(form);
    const name = (formData.get('name') || '').toString().trim();
    const contact = (formData.get('contact') || '').toString().trim();
    const projectType = (formData.get('projectType') || '').toString().trim();
    const details = (formData.get('details') || '').toString().trim();

    const text =
`🧩 Заявка с сайта «Фабрика воспоминаний»

Имя: ${name}
Контакт: ${contact}
Тип проекта: ${projectType}

Описание:
${details}`.trim();

    let copied = false;
    try {
      copied = await copyToClipboard(text);
    } catch (e) {
      copied = false;
    }

    // Open Telegram chat (new tab)
    window.open(managerUrl, '_blank', 'noopener,noreferrer');

    if (messageEl) {
      if (copied) {
        messageEl.innerHTML = `Текст заявки скопирован. Откройте чат и вставьте сообщение (Ctrl+V / Вставить) → Отправить. <a href="${managerUrl}" target="_blank" rel="noopener noreferrer">Открыть Telegram</a>`;
      } else {
        messageEl.innerHTML = `Открыл чат менеджера. Скопируйте текст ниже и отправьте в Telegram: <a href="${managerUrl}" target="_blank" rel="noopener noreferrer">Открыть Telegram</a>`;
        // Create a selectable block with the text
        const pre = document.createElement('pre');
        pre.textContent = text;
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.wordBreak = 'break-word';
        pre.style.marginTop = '0.75rem';
        pre.style.padding = '0.75rem';
        pre.style.border = '1px solid #f0c8cc';
        pre.style.borderRadius = '0.75rem';
        pre.style.background = '#fff8f8';
        messageEl.appendChild(pre);
      }
    }

    form.reset();
  });
}

/**
 * Reveal-on-scroll
 */
const revealNodes = document.querySelectorAll('.reveal');
const onScrollReveal = () => {
  const trigger = window.innerHeight * 0.92;
  revealNodes.forEach((node) => {
    const rect = node.getBoundingClientRect();
    if (rect.top < trigger) node.classList.add('visible');
  });
};
window.addEventListener('scroll', onScrollReveal, { passive: true });
onScrollReveal();

/**
 * Simple tilt effect
 */
const tilt = document.querySelector('[data-tilt]');
if (tilt) {
  tilt.addEventListener('mousemove', (event) => {
    const rect = tilt.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tilt.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
  });

  tilt.addEventListener('mouseleave', () => {
    tilt.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}
