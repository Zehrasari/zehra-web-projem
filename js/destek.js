const memberBanner = document.getElementById('memberBanner');
const mentorGrid = document.getElementById('mentorGrid');
const openMemberButton = document.getElementById('openMemberButton');
const asideCardTag = document.getElementById('asideCardTag');
const asideCardTitle = document.getElementById('asideCardTitle');
const asideCardDesc = document.getElementById('asideCardDesc');
const asideAppointments = document.getElementById('asideAppointments');

const mentorData = [
  {
    id: 'm1',
    name: 'Dr. Elif Yıldız',
    title: 'Otonom Sistemler & Donanım Entegrasyonu',
    initials: 'EY',
    bio: '10+ yıllık gömülü sistem deneyimi, sensör füzyonu ve gerçek zamanlı kontrol. Endüstriyel robotik ve otonom drone projelerinde liderlik yaptı. Donanım-software entegrasyonu, güç yönetimi ve saha testleri konusunda danışmanlık veriyor.',
    schedule: [
      { date: '2026-06-12', label: '12 Haziran', times: ['10:00', '12:30', '15:00'] },
      { date: '2026-06-13', label: '13 Haziran', times: ['11:00', '13:30', '16:30'] },
      { date: '2026-06-14', label: '14 Haziran', times: ['09:30', '14:00', '17:00'] }
    ],
    busy: ['2026-06-12|12:30', '2026-06-14|14:00']
  },
  {
    id: 'm2',
    name: 'Mert Kaya',
    title: 'Makine Öğrenimi & Model Dağıtımı',
    initials: 'MK',
    bio: 'Model optimizasyonu, TinyML ve edge deployment uzmanı. Python, TensorFlow ve ONNX ile çalışma deneyimi; model quantization ve dağıtım süreçlerinde pratik çözümler sunuyor. Hackathon kazanan projelerde mentorluk yaptı.',
    schedule: [
      { date: '2026-06-12', label: '12 Haziran', times: ['09:00', '11:30', '15:30'] },
      { date: '2026-06-13', label: '13 Haziran', times: ['10:30', '13:00', '16:00'] },
      { date: '2026-06-14', label: '14 Haziran', times: ['09:00', '12:00', '17:30'] }
    ],
    busy: ['2026-06-13|13:00', '2026-06-14|17:30']
  },
  {
    id: 'm3',
    name: 'Ayşe Demir',
    title: 'Elektronik Tasarım & PCB',
    initials: 'AD',
    bio: 'PCB tasarımı, sinyal bütünlüğü ve üretim hazırlığı konusunda uzman. DFM, prototipleme ve seri üretim süreçlerinde danışmanlık veriyor. IoT ürünleri ve sensör entegrasyonlarında kapsamlı tecrübesi bulunuyor.',
    schedule: [
      { date: '2026-06-12', label: '12 Haziran', times: ['10:00', '13:00', '16:00'] },
      { date: '2026-06-13', label: '13 Haziran', times: ['09:30', '12:30', '15:30'] },
      { date: '2026-06-14', label: '14 Haziran', times: ['11:00', '14:30', '18:00'] }
    ],
    busy: ['2026-06-12|13:00', '2026-06-14|18:00']
  },
  {
    id: 'm4',
    name: 'Dr. Can Öztürk',
    title: 'Sistem Mühendisliği & Test Otomasyonu',
    initials: 'CO',
    bio: 'Donanım-software entegrasyonu, test otomasyonu ve CI/CD uzmanı. Otomotiv ve havacılık sektörlerinde sahada güvenilirlik ve entegrasyon testleri yürüttü. Test yazılımı ve altyapı tasarımında destek veriyor.',
    schedule: [
      { date: '2026-06-12', label: '12 Haziran', times: ['09:30', '11:00', '14:00'] },
      { date: '2026-06-13', label: '13 Haziran', times: ['10:00', '13:30', '16:30'] },
      { date: '2026-06-14', label: '14 Haziran', times: ['09:00', '12:30', '15:30'] }
    ],
    busy: ['2026-06-12|11:00', '2026-06-14|12:30']
  }
];

const storage = {
  member: 'zentraMember',
  appointments: 'zentraDestekAppointments'
};

function getMember() {
  return JSON.parse(localStorage.getItem(storage.member) || 'null');
}

function setMember(member) {
  localStorage.setItem(storage.member, JSON.stringify(member));
}

function clearMember() {
  localStorage.removeItem(storage.member);
}

function getAppointments() {
  return JSON.parse(localStorage.getItem(storage.appointments) || '[]');
}

function saveAppointments(items) {
  localStorage.setItem(storage.appointments, JSON.stringify(items));
}

function slotKey(mentorId, date, time) {
  return `${mentorId}|${date}|${time}`;
}

function isSlotTaken(mentorId, date, time) {
  const appointments = getAppointments();
  return appointments.some(app => app.mentorId === mentorId && app.date === date && app.time === time);
}

function renderMentorCards() {
  const member = getMember();
  const appointments = getAppointments();

  mentorGrid.innerHTML = mentorData.map(mentor => {
    const slotBlocks = mentor.schedule.map(day => {
      const buttons = day.times.map(time => {
        const isBooked = isSlotTaken(mentor.id, day.date, time);
        const isBusy = mentor.busy.includes(slotKey(mentor.id, day.date, time));
        let state = 'available';
        let label = time;
        if (isBooked) {
          const appointment = appointments.find(app => app.mentorId === mentor.id && app.date === day.date && app.time === time);
          state = appointment ? 'booked' : 'taken';
          label = appointment ? 'Senin Randevun' : 'Dolu';
        } else if (isBusy) {
          state = 'taken';
          label = 'Dolu';
        }

        return `<button class="slot ${state}" data-mentor="${mentor.id}" data-date="${day.date}" data-time="${time}" ${state !== 'available' ? 'disabled' : ''}>${label}</button>`;
      }).join('');

      return `
        <div class="schedule-day">
          <strong>${day.label}</strong>
          <div class="slot-grid">${buttons}</div>
        </div>
      `;
    }).join('');

    return `
      <article class="mentor-card">
        <div class="mentor-header">
          <span class="mentor-avatar">${mentor.initials}</span>
          <div class="mentor-info">
            <h3>${mentor.name}</h3>
            <span>${mentor.title}</span>
          </div>
        </div>
        <p>${mentor.bio}</p>
        <div class="schedule-grid">${slotBlocks}</div>
      </article>
    `;
  }).join('');

  document.querySelectorAll('.slot.available').forEach(button => {
    button.addEventListener('click', handleSlotClick);
  });
}

function renderMemberPanel() {
  const member = getMember();
  if (member) {
    asideCardTag.textContent = 'ÜYELİK';
    asideCardTitle.textContent = 'Aktif randevularım';
    asideCardDesc.textContent = 'Randevularınız bu alanda listelenir. Sağdaki takvimden yeni bir saat seçebilirsiniz.';
    memberBanner.textContent = `${member.name} olarak giriş yaptınız. Randevu almak için uygun bir saat seçin.`;
    memberBanner.style.background = 'rgba(0,229,255,0.12)';
    memberBanner.style.color = '#00e5ff';
    openMemberButton.style.display = 'none';

    renderAsideAppointments(member);

    document.getElementById('logoutButton')?.addEventListener('click', () => {
      clearMember();
      renderMemberPanel();
      renderMentorCards();
      renderAppointments();
    });
  } else {
    asideCardTag.textContent = 'ÜYE GEREKLİ';
    asideCardTitle.textContent = 'Randevu almak için giriş yapın.';
    asideCardDesc.textContent = 'Giriş yapmadan önce randevu talebi oluşturamazsınız. Mevcut hesabınızla login olduktan sonra randevu alabilirsiniz.';
    memberBanner.textContent = 'Giriş yapmadınız. Randevu almak için giriş sayfasına yönlendirileceksiniz.';
    memberBanner.style.background = 'rgba(255,110,199,0.12)';
    memberBanner.style.color = '#fff';
    openMemberButton.style.display = 'inline-flex';
    asideAppointments.hidden = true;
    asideAppointments.innerHTML = '';
  }
}

function renderAsideAppointments(member) {
  if (!asideAppointments) return;
  const booked = getAppointments().filter(app => app.bookedBy === member.name);
  asideAppointments.hidden = false;
  if (!booked.length) {
    asideAppointments.innerHTML = '<p class="alert-text">Henüz kayıtlı randevunuz yok. Sağdaki takvimden bir uygun saat seçin.</p>';
    return;
  }

  asideAppointments.innerHTML = booked.map(app => `
    <div class="appointment-card">
      <h4>${app.mentorName}</h4>
      <span><strong>Tarih:</strong> ${app.date}</span>
      <span><strong>Saat:</strong> ${app.time}</span>
    </div>
  `).join('');
}

function handleSlotClick(event) {
  const member = getMember();
  if (!member) {
    alert('Randevu almak için önce giriş yapmanız veya üye olmanız gerekiyor. Giriş sayfasına yönlendiriliyorsunuz.');
    sessionStorage.setItem('returnTo', 'destek.html');
    window.location.href = 'giris.html';
    return;
  }

  const button = event.currentTarget;
  const mentorId = button.dataset.mentor;
  const date = button.dataset.date;
  const time = button.dataset.time;
  const mentor = mentorData.find(m => m.id === mentorId);

  const confirmation = confirm(`${mentor.name} için ${date} ${time} tarihli randevuyu ayırmak istiyor musun?`);
  if (!confirmation) return;

  const appointments = getAppointments();
  const alreadyBooked = appointments.some(app => app.mentorId === mentorId && app.date === date && app.time === time);
  if (alreadyBooked) {
    alert('Bu randevu zaten alınmış. Lütfen farklı bir saat seçin.');
    renderMentorCards();
    return;
  }

  appointments.push({
    mentorId,
    mentorName: mentor.name,
    date,
    time,
    bookedBy: member.name,
    bookedAt: new Date().toISOString()
  });
  saveAppointments(appointments);

  alert('Randevunuz kaydedildi. Takvimde randevunuz gözüküyor.');
  renderMentorCards();
  renderMemberPanel();
}

function renderAppointments() {
  // Alt panel artık statik bilgi kartı olduğundan burada ekstra işlem yok.
}

openMemberButton.addEventListener('click', () => {
  sessionStorage.setItem('returnTo', 'destek.html');
  window.location.href = 'giris.html';
});

renderMemberPanel();
renderMentorCards();
renderAppointments();
