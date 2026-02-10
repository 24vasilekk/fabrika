const yearElements = document.querySelectorAll('[data-year]');
const currentYear = new Date().getFullYear();
yearElements.forEach((item) => {
  item.textContent = currentYear;
});

const form = document.getElementById('contactForm');
if (form) {
  const message = document.getElementById('formMessage');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get('name') || 'друг';

    if (message) {
      message.textContent = `Спасибо, ${name}! Мы получили заявку и скоро свяжемся с вами.`;
    }

    form.reset();
  });
}
