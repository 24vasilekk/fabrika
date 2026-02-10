const form = document.getElementById('contactForm');
const message = document.getElementById('formMessage');
const year = document.getElementById('year');

year.textContent = new Date().getFullYear();

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(form);
  const name = formData.get('name');

  message.textContent = `Спасибо, ${name}! Заявка сохранена локально. Следующий шаг — подключим отправку на Telegram/почту.`;
  form.reset();
});
