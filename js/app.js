/* ============================================
   VOID FORUM — JavaScript
   ============================================ */

// Server time clock
function updateServerTime() {
  const now = new Date();
  const h = String(now.getUTCHours()).padStart(2, '0');
  const m = String(now.getUTCMinutes()).padStart(2, '0');
  const s = String(now.getUTCSeconds()).padStart(2, '0');
  const el = document.getElementById('serverTime');
  if (el) el.textContent = `${h}:${m}:${s}`;
}
setInterval(updateServerTime, 1000);
updateServerTime();

// Mobile nav toggle
function toggleNav() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

// Login handler
function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;
  const errorEl = document.getElementById('loginError');
  const successEl = document.getElementById('loginSuccess');

  if (!username || !password) {
    showMessage(errorEl, 'ERROR: All fields are required.');
    return;
  }

  // Simulate authentication
  showMessage(errorEl, null);
  showMessage(successEl, '> Authenticating...');

  setTimeout(() => {
    // Store session
    localStorage.setItem('voidUser', JSON.stringify({
      username: username,
      rank: 'Member',
      avatar: '🎭',
      loggedIn: true
    }));
    showMessage(successEl, `> Authentication successful. Welcome, ${username}.`);
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }, 1500);
}

// Register handler
function handleRegister(e) {
  e.preventDefault();
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPw = document.getElementById('regPasswordConfirm').value;
  const errorEl = document.getElementById('regError');
  const successEl = document.getElementById('regSuccess');

  if (password !== confirmPw) {
    showMessage(errorEl, 'ERROR: Passphrases do not match.');
    return;
  }

  if (password.length < 12) {
    showMessage(errorEl, 'ERROR: Passphrase must be at least 12 characters.');
    return;
  }

  showMessage(errorEl, null);
  showMessage(successEl, '> Generating identity...');

  setTimeout(() => {
    showMessage(successEl, '> Generating cryptographic keys...');
    setTimeout(() => {
      localStorage.setItem('voidUser', JSON.stringify({
        username: username,
        rank: 'New Member',
        avatar: '👤',
        loggedIn: true
      }));
      showMessage(successEl, `> Identity created: ${username}\n> Redirecting to forum...`);
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1200);
    }, 1200);
  }, 1000);
}

// Password strength meter
const regPassword = document.getElementById('regPassword');
if (regPassword) {
  regPassword.addEventListener('input', function () {
    const val = this.value;
    const fill = document.getElementById('strengthFill');
    const text = document.getElementById('strengthText');
    let score = 0;

    if (val.length >= 8) score++;
    if (val.length >= 12) score++;
    if (val.length >= 16) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const levels = [
      { width: '0%', color: 'var(--border-color)', label: 'Enter a passphrase' },
      { width: '16%', color: 'var(--accent-red)', label: 'Very Weak — easily cracked' },
      { width: '33%', color: 'var(--accent-red)', label: 'Weak — add more characters' },
      { width: '50%', color: 'var(--accent-amber)', label: 'Fair — add symbols/numbers' },
      { width: '66%', color: 'var(--accent-amber)', label: 'Good — almost there' },
      { width: '83%', color: 'var(--accent-green)', label: 'Strong — good passphrase' },
      { width: '100%', color: 'var(--accent-green)', label: 'Excellent — very secure' }
    ];

    if (val.length === 0) score = 0;
    const level = levels[Math.min(score, levels.length - 1)];
    fill.style.width = level.width;
    fill.style.background = level.color;
    text.textContent = level.label;
    text.style.color = level.color;
  });
}

// New thread handler
function handleNewThread(e) {
  e.preventDefault();
  const title = document.getElementById('threadTitle').value.trim();
  const content = document.getElementById('threadContent').value.trim();
  const errorEl = document.getElementById('threadError');
  const successEl = document.getElementById('threadSuccess');

  if (!title || !content) {
    showMessage(errorEl, 'ERROR: Title and content are required.');
    return;
  }

  const user = getUser();
  if (!user) {
    showMessage(errorEl, 'ERROR: You must be logged in to create a thread.');
    return;
  }

  showMessage(errorEl, null);
  showMessage(successEl, '> Creating thread...');

  setTimeout(() => {
    showMessage(successEl, '> Thread created successfully. Redirecting...');
    setTimeout(() => {
      window.location.href = 'thread.html';
    }, 1000);
  }, 1000);
}

// Reply handler
function submitReply() {
  const textarea = document.getElementById('replyText');
  if (!textarea) return;

  const content = textarea.value.trim();
  if (!content) {
    alert('Reply cannot be empty.');
    return;
  }

  const user = getUser();
  if (!user) {
    alert('You must be logged in to reply.');
    return;
  }

  // Create new post element
  const postsContainer = document.querySelector('.content-area');
  const replyBox = document.getElementById('replyBox');

  const post = document.createElement('div');
  post.className = 'post';
  post.style.animation = 'fadeIn 0.3s ease';
  post.innerHTML = `
    <div class="post-sidebar">
      <div class="post-avatar">${user.avatar}</div>
      <div class="post-username">${user.username}</div>
      <div class="post-rank">${user.rank}</div>
      <div class="post-user-stats">
        <span>Posts: 1</span>
        <span>Rep: <span style="color:var(--accent-green)">+0</span></span>
        <span style="color:var(--accent-green);">● Online</span>
      </div>
    </div>
    <div class="post-content-area">
      <div class="post-header">
        <span>Posted just now</span>
        <div class="post-actions">
          <a href="#">Quote</a>
          <a href="#">Report</a>
        </div>
      </div>
      <div class="post-body">
        <p>${escapeHtml(content)}</p>
      </div>
      <div class="post-footer">
        <div style="display:flex; gap:1rem; font-size:0.75rem;">
          <a href="#" style="color:var(--accent-green);">▲ 0</a>
          <a href="#" style="color:var(--text-muted);">▼</a>
        </div>
        <div></div>
      </div>
    </div>
  `;

  postsContainer.insertBefore(post, replyBox);
  textarea.value = '';

  // Scroll to the new post
  post.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function previewReply() {
  const textarea = document.getElementById('replyText');
  if (!textarea || !textarea.value.trim()) {
    alert('Nothing to preview.');
    return;
  }
  alert('Preview:\n\n' + textarea.value);
}

function previewThread() {
  const title = document.getElementById('threadTitle');
  const content = document.getElementById('threadContent');
  if (!title || !content) return;
  alert('Thread Preview:\n\nTitle: ' + title.value + '\n\n' + content.value);
}

// Markdown toolbar helpers
function insertFormat(before, after) {
  const textarea = document.getElementById('threadContent');
  if (!textarea) return;

  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.substring(start, end);
  const replacement = before + (selected || 'text') + after;

  textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
  textarea.focus();
  textarea.selectionStart = start + before.length;
  textarea.selectionEnd = start + before.length + (selected || 'text').length;
}

// Utility functions
function showMessage(el, msg) {
  if (!el) return;
  if (msg === null) {
    el.style.display = 'none';
    el.textContent = '';
  } else {
    el.style.display = 'block';
    el.textContent = msg;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getUser() {
  try {
    const data = localStorage.getItem('voidUser');
    if (data) return JSON.parse(data);
  } catch (e) {}
  return null;
}

// Update UI based on login state
function updateAuthUI() {
  const user = getUser();
  const authButtons = document.getElementById('authButtons');

  if (user && user.loggedIn && authButtons) {
    authButtons.innerHTML = `
      <span style="color:var(--accent-cyan); font-size:0.85rem;">${user.avatar} ${user.username}</span>
      <button class="btn btn-danger" onclick="logout()" style="padding:0.35rem 0.8rem; font-size:0.7rem;">Logout</button>
    `;
  }
}

function logout() {
  localStorage.removeItem('voidUser');
  window.location.href = 'index.html';
}

// Random stat animation on load
function animateStats() {
  const statValues = document.querySelectorAll('.stat-value');
  statValues.forEach(el => {
    const target = el.textContent;
    const numericTarget = parseInt(target.replace(/,/g, ''));
    if (isNaN(numericTarget)) return;

    let current = 0;
    const step = Math.max(1, Math.floor(numericTarget / 30));
    const interval = setInterval(() => {
      current += step;
      if (current >= numericTarget) {
        current = numericTarget;
        clearInterval(interval);
      }
      el.textContent = current.toLocaleString();
    }, 30);
  });
}

// Typing effect for terminal decorations
function typeEffect(el, text, speed) {
  let i = 0;
  el.textContent = '';
  const timer = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
}

// Add a fade-in CSS animation
const fadeStyle = document.createElement('style');
fadeStyle.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .category-card, .thread-item, .post, .sidebar-widget {
    animation: fadeIn 0.3s ease forwards;
  }
`;
document.head.appendChild(fadeStyle);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI();
  animateStats();

  // Add staggered animation to cards
  const cards = document.querySelectorAll('.category-card, .thread-item');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.animationDelay = `${i * 0.05}s`;
    card.style.animationFillMode = 'forwards';
  });
});
