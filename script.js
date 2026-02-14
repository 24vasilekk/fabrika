const yearElements = document.querySelectorAll('[data-year]');
const currentYear = new Date().getFullYear();
yearElements.forEach((item) => {
  item.textContent = currentYear;
});

const rotatingText = document.querySelector('[data-rotate-text]');
if (rotatingText) {
  const words = ['первую встречу', 'двор детства', 'первый поцелуй', 'семейный вечер'];
  let index = 0;
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
    const name = formData.get('name') || 'друг';

    if (message) {
      message.textContent = `Спасибо, ${name}! Заявка принята — напишите нам в Telegram для быстрого старта.`;
    }

    form.reset();
  });
}
