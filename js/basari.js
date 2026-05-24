document.addEventListener('DOMContentLoaded', () => {
  const slides = Array.from(document.querySelectorAll('.success-slider .slide'));
  const dotsContainer = document.getElementById('sliderDots');
  const nextBtn = document.getElementById('nextSlide');
  const prevBtn = document.getElementById('prevSlide');
  let currentIndex = 0;

  function createDots() {
    slides.forEach((slide, index) => {
      const dot = document.createElement('button');
      dot.className = 'slider-dot';
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateSlides() {
    slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === currentIndex);
    });
    document.querySelectorAll('.slider-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function goToSlide(index) {
    currentIndex = (index + slides.length) % slides.length;
    updateSlides();
  }

  nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));
  prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));

  createDots();
  updateSlides();

  setInterval(() => {
    goToSlide(currentIndex + 1);
  }, 5000);
});
