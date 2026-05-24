const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const memberStorageKey = 'zentraMember';

function getCurrentMember() {
  return JSON.parse(localStorage.getItem(memberStorageKey) || 'null');
}

function setCurrentMember(member) {
  localStorage.setItem(memberStorageKey, JSON.stringify(member));
}

function clearCurrentMember() {
  localStorage.removeItem(memberStorageKey);
}

function loginUser(user) {
  setCurrentMember({ name: user.name, email: user.email });
}

function redirectAfterLogin() {
  const target = sessionStorage.getItem('returnTo');
  sessionStorage.removeItem('returnTo');
  if (target && target !== 'giris.html') {
    window.location.href = target;
    return;
  }
  window.location.href = 'index.html';
}

function setupPasswordToggles() {
  document.querySelectorAll('.toggle-password').forEach(button => {
    button.addEventListener('click', () => {
      const wrapper = button.closest('.password-field');
      const input = wrapper.querySelector('input');
      if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
      } else {
        input.type = 'password';
        button.textContent = '👁';
      }
    });
  });
}

// Şifreyi basitçe SHA-256 ile şifrelemek (hashlemek) için yardımcı fonksiyon
async function hashPassword(password) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function handleAuthForm(form, type) {
  form.addEventListener('submit', async event => {
    event.preventDefault();
    const nameField = form.querySelector('input[name="kullanici_adi"]') || form.querySelector('input[name="name"]');
    const emailField = form.querySelector('input[name="email"]');
    const passwordField = form.querySelector('input[name="password"]');
    const name = nameField ? nameField.value.trim() : '';
    const email = emailField ? emailField.value.trim().toLowerCase() : '';
    const password = passwordField ? passwordField.value.trim() : '';

    if (!email || !password) {
      alert('Lütfen e-posta ve şifrenizi girin.');
      return;
    }

    // Kullanıcının girdiği şifreyi şifreliyoruz
    const hashedPassword = await hashPassword(password);

    if (type === 'signin') {
      try {
        // API üzerinden e-posta ile kullanıcıyı sorguluyoruz
        const response = await fetch(`/api/users?email=${encodeURIComponent(email)}`);
        const foundUser = await response.json();

        if (!foundUser) {
          alert('Üye bulunamadı. Lütfen önce kayıt olunuz.');
          container.classList.add('right-panel-active');
          return;
        }
        // Eski şifresiz kayıtları bozmamak için hem hash'li hem düz metin kontrolü yapıyoruz
        if (foundUser.sifre !== hashedPassword && foundUser.sifre !== password) {
          alert('E-posta veya şifre hatalı. Tekrar deneyin.');
          return;
        }
        
        // Veritabanındaki kolon ismimiz 'ad' olduğu için user objesini ona göre mapliyoruz
        loginUser({ name: foundUser.ad, email: foundUser.email });
        redirectAfterLogin();
      } catch (error) {
        console.error('Giriş hatası:', error);
        alert('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
      }
      return;
    }

    if (type === 'signup') {
      const userName = name || email.split('@')[0];
      
      try {
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ad: userName, email: email, sifre: hashedPassword })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Kayıt başarılı! Veritabanına eklendi. Lütfen giriş yapın.');
          container.classList.remove('right-panel-active');
          // Formu temizle
          form.reset();
        } else {
          alert('Kayıt başarısız: ' + (data.error || 'Bilinmeyen bir hata'));
        }
      } catch (error) {
        console.error('Sunucu hatası:', error);
        alert('Sunucuya ulaşılamadı. Lütfen tekrar deneyin.');
      }
    }
  });
}

signUpButton.addEventListener('click', () => {
  container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
  container.classList.remove('right-panel-active');
});

const signUpForm = document.querySelector('.sign-up-container form');
const signInForm = document.querySelector('.sign-in-container form');
if (signUpForm) handleAuthForm(signUpForm, 'signup');
if (signInForm) handleAuthForm(signInForm, 'signin');
setupPasswordToggles();

/* Arka plan renk yumaklarının (Blobs) fareye göre hafif hareketi (Parallax effect) */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;

  const blob1 = document.querySelector('.blob-1');
  const blob2 = document.querySelector('.blob-2');

  if (blob1) blob1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  if (blob2) blob2.style.transform = `translate(${-x * 0.5}px, ${y * 0.5}px)`;
});
