/* ── Floating particles ─────────────────────── */
const container = document.getElementById('particles');
const colors = ['#00e5ff', '#ff6ec7', '#7b2fff', '#ffffff', '#3a6dff'];

if (container) {
  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 5 + 2;
    p.style.cssText = `
      width:${size}px;
      height:${size}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      animation-duration:${Math.random() * 6 + 4}s;
      animation-delay:-${Math.random() * 8}s;
      opacity:${Math.random() * 0.7 + 0.3};
    `;
    container.appendChild(p);
  }
}

/* ── Scroll reveal ──────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Smooth active nav ──────────────────────── */
const navLinks = document.querySelectorAll('.nav-links a');
navLinks.forEach(a => {
  a.addEventListener('click', function (e) {
    if (this.getAttribute('href') === '#') {
      e.preventDefault();
    }
    navLinks.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
  });
});

const navProfile = document.getElementById('navProfile');
const navProfileName = document.getElementById('navProfileName');
const navProfileEmail = document.getElementById('navProfileEmail');
const navProfileLink = document.getElementById('navProfileLink');
const signInAction = document.getElementById('signInAction');

function getPageMember() {
  return JSON.parse(localStorage.getItem('zentraMember') || 'null');
}


function renderNavProfile() {
  if (!navProfile) return;
  const member = getPageMember();
  if (!member) {
    navProfile.hidden = true;
    if (signInAction) signInAction.hidden = false;
    return;
  }
  navProfile.hidden = false;
  if (signInAction) signInAction.hidden = true;
  navProfileName.textContent = member.name || 'Üye';
  navProfileEmail.textContent = member.email || '';
  if (navProfileLink) navProfileLink.href = 'profil.html';
}

/* Light theme and toggle removed — site stays on default styles */
renderNavProfile();

/* ── Parallax blobs on mouse move ───────────── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 30;
  const y = (e.clientY / window.innerHeight - 0.5) * 30;

  const b1 = document.querySelector('.blob-1');
  const b2 = document.querySelector('.blob-2');
  const b3 = document.querySelector('.blob-3');
  if (b1) b1.style.transform = `translate(${x * 0.6}px, ${y * 0.6}px)`;
  if (b2) b2.style.transform = `translate(${-x * 0.4}px, ${y * 0.4}px)`;
  if (b3) b3.style.transform = `translate(${x * 0.5}px, ${-y * 0.5}px)`;
});


// script.js dosyanın içi////////////////////////////////////////////////////////////////
async function verileriGetir() {
  try {
    const response = await fetch('/api/users');
    const data = await response.json();
    console.log("Veritabanından gelen veriler:", data);
    
    // Gelen datayı HTML içine burada basabilirsin
  } catch (error) {
    console.error("Veri çekilirken hata oluştu:", error);
  }
}

verileriGetir();