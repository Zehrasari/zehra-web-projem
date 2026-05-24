// Attach handlers to mentor "Randevu Al" buttons.
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.book-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = btn.getAttribute('data-mentor-id');
      const name = btn.getAttribute('data-mentor-name');
      if (id && name) {
        localStorage.setItem('selectedMentor', JSON.stringify({ id, name }));
      }
      // navigate to destek page's mentor grid / booking area
      window.location.href = 'destek.html#mentorGrid';
    });
  });
});
