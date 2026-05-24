window.saveReturnToLogin = (href) => {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  const returnTo = current === 'giris.html' ? 'index.html' : current;
  sessionStorage.setItem('returnTo', returnTo);
  window.location.href = href;
};

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
  const navActions = document.querySelector('.nav-actions');
  const mobileActions = document.querySelector('.mobile-menu-actions');

  if (!navToggle || !mobileMenu || !mobileClose) {
    return;
  }

  const getCurrentMember = () => JSON.parse(localStorage.getItem('zentraMember') || 'null');

  const createProfileCard = (member) => {
    const profile = document.createElement('div');
    profile.className = 'nav-profile';

    const info = document.createElement('div');
    info.className = 'nav-profile-info';
    const name = document.createElement('span');
    name.className = 'nav-profile-name';
    name.textContent = member.name || 'Profil';
    const email = document.createElement('span');
    email.className = 'nav-profile-email';
    email.textContent = member.email;
    info.appendChild(name);
    info.appendChild(email);

    const logoutBtn = document.createElement('button');
    logoutBtn.type = 'button';
    logoutBtn.className = 'btn btn-primary nav-profile-btn';
    logoutBtn.textContent = 'Çıkış';
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('zentraMember');
      window.location.reload();
    });

    profile.appendChild(info);
    profile.appendChild(logoutBtn);
    return profile;
  };

  const updateAuthUi = () => {
    const member = getCurrentMember();
    if (!navActions) return;

    const signInBtn = navActions.querySelector('button');
    const mobileSignInBtn = mobileActions?.querySelector('button');
    const profileCard = document.getElementById('navProfile');
    const mobileProfileCard = document.getElementById('mobileNavProfile');

    if (member) {
      if (signInBtn) signInBtn.style.display = 'none';
      if (mobileSignInBtn) mobileSignInBtn.style.display = 'none';
      if (!profileCard) {
        const profile = createProfileCard(member);
        profile.id = 'navProfile';
        navActions.appendChild(profile);
      }
      if (mobileActions && !mobileProfileCard) {
        const profile = createProfileCard(member);
        profile.id = 'mobileNavProfile';
        profile.classList.add('mobile-profile');
        mobileActions.appendChild(profile);
      }
    } else {
      if (signInBtn) signInBtn.style.display = '';
      if (mobileSignInBtn) mobileSignInBtn.style.display = '';
      if (profileCard) profileCard.remove();
      if (mobileProfileCard) mobileProfileCard.remove();
    }
  };

  const setMenuOpen = (open) => {
    navToggle.classList.toggle('open', open);
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', open);
    mobileMenu.setAttribute('aria-hidden', !open);
  };

  navToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    setMenuOpen(!isOpen);
  });

  mobileClose.addEventListener('click', () => setMenuOpen(false));

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => setMenuOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mobileMenu.classList.contains('open')) {
      setMenuOpen(false);
    }
  });

  const updateLoginLinks = () => {
    document.querySelectorAll('a[href="giris.html"]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        window.saveReturnToLogin('giris.html');
      });
    });
    document.querySelectorAll('button[onclick*="giris.html"]').forEach(button => {
      button.onclick = event => {
        event.preventDefault();
        window.saveReturnToLogin('giris.html');
      };
    });
  };

  updateAuthUi();
  updateLoginLinks();
});
