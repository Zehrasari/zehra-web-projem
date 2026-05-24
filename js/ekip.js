const memberStorageKey = 'zentraMember';
const followStorageKey = 'zentraFollowing';
const postsStorageKey = 'zentraPosts';
const messagesStorageKey = 'zentraMessages';
const sectionStorageKey = 'zentraEkipSection';

const postInput = document.getElementById('postInput');
const shareBtn = document.getElementById('shareBtn');
const postsContainer = document.getElementById('postsContainer');
const messageThread = document.getElementById('messageThread');
const messageThreadList = document.getElementById('messageThreadList');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const activeThreadInfo = document.getElementById('activeThreadInfo');
const followingList = document.getElementById('followingList');
const sidebarLinks = document.querySelectorAll('.ekip-sidebar nav a');
const sections = document.querySelectorAll('.section-panel');

let activeThread = null;

const defaultPosts = [
  {
    id: 'post-1',
    author: 'Ahmet Yılmaz',
    handle: 'ahmet',
    avatar: 'https://i.pravatar.cc/100?img=31',
    time: '5 dk önce',
    content: 'SaaS girişimim için frontend geliştirici arıyorum. React bilen ekip arkadaşı varsa konuşabiliriz 👋',
    liked: false,
    comments: [
      { author: 'Zehra', text: 'UI tarafında yardımcı olabilirim 🚀', time: '3 dk önce' }
    ]
  }
];

const knownProfiles = {
  ahmet: { name: 'Ahmet Yılmaz' },
  elif: { name: 'Elif Kaya' },
  burak: { name: 'Burak Demir' }
};

function getCurrentMember() {
  return JSON.parse(localStorage.getItem(memberStorageKey) || 'null');
}

function requireLogin() {
  const user = getCurrentMember();
  if (!user) {
    sessionStorage.setItem('returnTo', 'ekip.html');
    window.location.href = 'giris.html';
    return false;
  }
  return true;
}

function getFollowing() {
  return JSON.parse(localStorage.getItem(followStorageKey) || '[]');
}

function setFollowing(list) {
  localStorage.setItem(followStorageKey, JSON.stringify(list));
}

function toggleFollowing(handle) {
  const list = getFollowing();
  const index = list.indexOf(handle);
  if (index === -1) {
    list.push(handle);
  } else {
    list.splice(index, 1);
  }
  setFollowing(list);
  renderFollowingSection();
}

function getPosts() {
  const stored = JSON.parse(localStorage.getItem(postsStorageKey) || 'null');
  return Array.isArray(stored) && stored.length ? stored : defaultPosts;
}

function savePosts(posts) {
  localStorage.setItem(postsStorageKey, JSON.stringify(posts));
}

function getMessages() {
  return JSON.parse(localStorage.getItem(messagesStorageKey) || '{}');
}

function saveMessages(messages) {
  localStorage.setItem(messagesStorageKey, JSON.stringify(messages));
}

function renderPosts() {
  postsContainer.innerHTML = '';
  const posts = getPosts();
  posts.forEach(post => postsContainer.appendChild(createPostCard(post)));
}

function createPostCard(post) {
  const element = document.createElement('div');
  element.className = 'post-card';
  element.dataset.postId = post.id;
  element.dataset.authorHandle = post.handle;

  const following = getFollowing().includes(post.handle);
  const likeLabel = post.liked ? '❤️ Beğenildi' : 'Beğen';

  element.innerHTML = `
    <div class="post-header">
      <div class="post-user">
        <img src="${post.avatar}">
        <div>
          <h3>${post.author}</h3>
          <span>@${post.handle} • ${post.time}</span>
        </div>
      </div>
      <button class="follow-btn">${following ? 'Takipten Çık' : 'Takip Et'}</button>
    </div>
    <div class="post-content">${post.content}</div>
    <div class="post-actions">
      <button class="like-btn">${likeLabel}</button>
      <button class="comment-btn"><i class="fa-regular fa-comment"></i> Yorum</button>
      <button class="message-btn"><i class="fa-regular fa-paper-plane"></i> Mesaj</button>
    </div>
    <div class="comments"></div>
    <div class="comment-box">
      <input type="text" placeholder="Yorum yaz...">
      <button class="send-comment-btn">Gönder</button>
    </div>
  `;

  const commentsContainer = element.querySelector('.comments');
  (post.comments || []).forEach(comment => {
    const item = document.createElement('div');
    item.className = 'comment';
    item.innerHTML = `<strong>${comment.author}:</strong> ${comment.text}`;
    commentsContainer.appendChild(item);
  });

  const followBtn = element.querySelector('.follow-btn');
  followBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    toggleFollowing(post.handle);
    followBtn.textContent = getFollowing().includes(post.handle) ? 'Takipten Çık' : 'Takip Et';
  });

  const commentBtn = element.querySelector('.comment-btn');
  const commentInput = element.querySelector('.comment-box input');
  const sendCommentBtn = element.querySelector('.send-comment-btn');

  commentBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    commentInput.focus();
  });

  sendCommentBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    const value = commentInput.value.trim();
    if (!value) return;
    addComment(post.id, value);
    renderPosts();
  });

  const messageBtn = element.querySelector('.message-btn');
  messageBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    openThread(post.handle);
    showSection('messages');
  });

  const likeBtn = element.querySelector('.like-btn');
  likeBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    toggleLike(post.id);
    renderPosts();
  });

  return element;
}

function addComment(postId, text) {
  const posts = getPosts();
  const current = getCurrentMember();
  const index = posts.findIndex(post => post.id === postId);
  if (index === -1 || !current) return;
  posts[index].comments = posts[index].comments || [];
  posts[index].comments.push({ author: current.name, text, time: 'şimdi' });
  savePosts(posts);
}

function toggleLike(postId) {
  const posts = getPosts();
  const index = posts.findIndex(post => post.id === postId);
  if (index === -1) return;
  posts[index].liked = !posts[index].liked;
  savePosts(posts);
}

function setupCreatePost() {
  shareBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    const text = postInput.value.trim();
    if (!text) {
      alert('Bir şeyler yazmalısın.');
      return;
    }
    const current = getCurrentMember();
    const handle = current.email.split('@')[0];
    const posts = getPosts();
    posts.unshift({
      id: `post-${Date.now()}`,
      author: current.name,
      handle,
      avatar: `https://i.pravatar.cc/100?u=${handle}`,
      time: 'şimdi',
      content: text,
      liked: false,
      comments: []
    });
    savePosts(posts);
    postInput.value = '';
    renderPosts();
    showSection('feed');
  });
}

function loadSidebarNavigation() {
  sidebarLinks.forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const section = link.dataset.section;
      if (!section) return;
      setActiveSidebar(link);
      showSection(section);
    });
  });
  const storedSection = localStorage.getItem(sectionStorageKey) || 'feed';
  const targetLink = Array.from(sidebarLinks).find(link => link.dataset.section === storedSection);
  if (targetLink) {
    setActiveSidebar(targetLink);
    showSection(storedSection);
  } else {
    showSection('feed');
  }
}

function setActiveSidebar(link) {
  sidebarLinks.forEach(item => item.classList.remove('active'));
  link.classList.add('active');
}

function showSection(sectionId) {
  sections.forEach(section => {
    section.hidden = section.id !== `${sectionId}Section`;
  });
  const targetLink = Array.from(sidebarLinks).find(link => link.dataset.section === sectionId);
  if (targetLink) {
    setActiveSidebar(targetLink);
  }
  localStorage.setItem(sectionStorageKey, sectionId);
  if (sectionId === 'messages') {
    renderMessageThread();
  }
  if (sectionId === 'following') {
    renderFollowingSection();
  }
}

function renderFollowingSection() {
  const following = getFollowing();
  followingList.innerHTML = '';
  if (!following.length) {
    followingList.innerHTML = '<p>Henüz kimseyi takip etmiyorsun. Gönderilerde veya önerilen kişilerde takip et düğmesine bas.</p>';
    return;
  }
  const container = document.createElement('div');
  container.className = 'following-list';
  following.forEach(handle => {
    const profile = knownProfiles[handle] || { name: handle };
    const item = document.createElement('div');
    item.className = 'following-item';
    item.innerHTML = `
      <div>
        <strong>${profile.name}</strong>
        <p>@${handle}</p>
      </div>
      <button data-follow-toggle="${handle}">Takipten Çık</button>
    `;
    item.querySelector('button').addEventListener('click', () => {
      toggleFollowing(handle);
      renderPosts();
    });
    container.appendChild(item);
  });
  followingList.appendChild(container);
}

function openThread(handle) {
  activeThread = handle;
  const profile = knownProfiles[handle] || { name: handle };
  activeThreadInfo.textContent = `Sohbet: ${profile.name} (@${handle})`;
  renderMessageThread();
}

function renderMessageThread() {
  messageThreadList.innerHTML = '';
  const messages = getMessages();
  const partners = new Set(Object.keys(messages));
  if (activeThread) partners.add(activeThread);

  Array.from(partners).forEach(handle => {
    const profile = knownProfiles[handle] || { name: handle };
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'thread-chip';
    chip.textContent = profile.name;
    if (handle === activeThread) chip.classList.add('active');
    chip.addEventListener('click', () => openThread(handle));
    messageThreadList.appendChild(chip);
  });

  messageThread.innerHTML = '';
  if (!activeThread) {
    const heading = document.createElement('div');
    heading.textContent = 'Bir sohbet seçin veya bir gönderiden mesaj başlatın.';
    heading.style.color = '#c7cbd6';
    messageThread.appendChild(heading);
    return;
  }

  const threadMessages = messages[activeThread] || [];
  if (!threadMessages.length) {
    const empty = document.createElement('div');
    empty.className = 'message-bubble received';
    empty.textContent = 'Henüz mesaj yok. Mesaj yazıp gönderin.';
    messageThread.appendChild(empty);
    return;
  }

  threadMessages.forEach(item => {
    const bubble = document.createElement('div');
    bubble.className = `message-bubble ${item.sender === 'me' ? 'sent' : 'received'}`;
    bubble.innerHTML = `<strong>${item.sender === 'me' ? 'Sen' : item.sender}:</strong> ${item.text}`;
    messageThread.appendChild(bubble);
  });
}

function addMessage(handle, text) {
  const current = getCurrentMember();
  if (!current) return;
  const messages = getMessages();
  messages[handle] = messages[handle] || [];
  messages[handle].push({ sender: 'me', text, time: new Date().toISOString() });
  saveMessages(messages);
}

function setupMessageSend() {
  sendMessageBtn.addEventListener('click', () => {
    if (!requireLogin()) return;
    if (!activeThread) {
      alert('Lütfen önce bir sohbet seçin.');
      return;
    }
    const text = messageInput.value.trim();
    if (!text) return;
    addMessage(activeThread, text);
    messageInput.value = '';
    renderMessageThread();
  });
}

function setupSuggestionButtons() {
  document.querySelectorAll('[data-follow-user]').forEach(button => {
    const handle = button.dataset.followUser;
    updateSuggestionButton(button, handle);
    button.addEventListener('click', () => {
      if (!requireLogin()) return;
      toggleFollowing(handle);
      updateSuggestionButton(button, handle);
    });
  });
}

function updateSuggestionButton(button, handle) {
  button.textContent = getFollowing().includes(handle) ? 'Takipten Çık' : 'Takip';
}

function init() {
  setupCreatePost();
  renderPosts();
  loadSidebarNavigation();
  setupMessageSend();
  setupSuggestionButtons();
  renderFollowingSection();
}

init();
