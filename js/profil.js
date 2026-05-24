const memberStorageKey = 'zentraMember';
const userStorageKey = 'zentraUsers';
const profileFullName = document.getElementById('profileFullName');
const profileEmailAddress = document.getElementById('profileEmailAddress');
const profileAvatarCard = document.getElementById('profileAvatarCard');
const editName = document.getElementById('editName');
const editEmail = document.getElementById('editEmail');
const currentPassword = document.getElementById('currentPassword');
const newPassword = document.getElementById('newPassword');
const profileForm = document.getElementById('profileForm');
const logoutProfile = document.getElementById('logoutProfile');

function getCurrentMember() {
  return JSON.parse(localStorage.getItem(memberStorageKey) || 'null');
}

function setCurrentMember(member) {
  localStorage.setItem(memberStorageKey, JSON.stringify(member));
}

function getUsers() {
  return JSON.parse(localStorage.getItem(userStorageKey) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(userStorageKey, JSON.stringify(users));
}

function findUser(email) {
  return getUsers().find(user => user.email.toLowerCase() === email.toLowerCase());
}

function updateUser(email, updates) {
  const users = getUsers();
  const user = users.find(item => item.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;
  Object.assign(user, updates);
  saveUsers(users);
  return user;
}

function requireLogin() {
  const member = getCurrentMember();
  if (!member) {
    sessionStorage.setItem('returnTo', 'profil.html');
    window.location.href = 'giris.html';
    return false;
  }
  return member;
}

function renderProfile() {
  const member = requireLogin();
  if (!member) return;
  profileFullName.textContent = member.name;
  profileEmailAddress.textContent = member.email;
  profileAvatarCard.textContent = member.name.slice(0, 2).toUpperCase();
  editName.value = member.name;
  editEmail.value = member.email;
}

function handleProfileSave(event) {
  event.preventDefault();
  const member = requireLogin();
  if (!member) return;

  const name = editName.value.trim();
  const email = editEmail.value.trim().toLowerCase();
  const currentPass = currentPassword.value.trim();
  const newPass = newPassword.value.trim();

  if (!name || !email) {
    alert('Ad ve e-posta alanları boş bırakılamaz.');
    return;
  }

  const existingUser = findUser(email);
  if (existingUser && existingUser.email.toLowerCase() !== member.email.toLowerCase()) {
    alert('Bu e-posta başka bir kullanıcıya ait. Farklı bir e-posta kullanın.');
    return;
  }

  let updatedUser = null;
  if (newPass) {
    if (!currentPass) {
      alert('Önce mevcut şifrenizi girin.');
      return;
    }
    const currentUser = findUser(member.email);
    if (!currentUser || currentUser.password !== currentPass) {
      alert('Mevcut şifreniz hatalı.');
      return;
    }
    updatedUser = updateUser(member.email, { name, email, password: newPass });
  } else {
    updatedUser = updateUser(member.email, { name, email });
  }

  if (!updatedUser) {
    alert('Kullanıcı bulunamadı.');
    return;
  }

  setCurrentMember({ name: updatedUser.name, email: updatedUser.email });
  renderProfile();
  currentPassword.value = '';
  newPassword.value = '';
  alert('Profil bilgilerin başarıyla güncellendi.');
}

function logoutProfileUser() {
  localStorage.removeItem(memberStorageKey);
  window.location.href = 'giris.html';
}

profileForm.addEventListener('submit', handleProfileSave);
logoutProfile.addEventListener('click', logoutProfileUser);
renderProfile();
