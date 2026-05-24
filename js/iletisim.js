document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  const clearBtn = document.getElementById('clearForm');

  function getContacts() {
    return JSON.parse(localStorage.getItem('zentraContacts') || '[]');
  }
  function saveContacts(list) {
    localStorage.setItem('zentraContacts', JSON.stringify(list));
  }

  // Prefill if logged in
  const member = JSON.parse(localStorage.getItem('zentraMember') || 'null');
  if (member) {
    const nameField = document.getElementById('cName');
    const emailField = document.getElementById('cEmail');
    if (nameField && !nameField.value) nameField.value = member.name || '';
    if (emailField && !emailField.value) emailField.value = member.email || '';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const subject = document.getElementById('cSubject').value.trim();
    const message = document.getElementById('cMessage').value.trim();

    if (!name || !email || !message) {
      alert('Lütfen isim, e-posta ve mesaj alanlarını doldurun.');
      return;
    }

    const contacts = getContacts();
    contacts.push({ name, email, subject, message, createdAt: new Date().toISOString() });
    saveContacts(contacts);

    form.reset();
    alert('Mesajınız alındı — en kısa zamanda dönüş yapacağız.');
  });

  clearBtn.addEventListener('click', () => { form.reset(); });
});
