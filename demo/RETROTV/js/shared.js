// Shared JavaScript for RETROTV project

const STORAGE_PREFIX = 'retrotv_';

// Default questions
const DEFAULT_QUESTIONS = [
  "What barriers stop people from getting permanent housing right now?",
  "How does sleep deprivation affect your daily functioning?",
  "What support services actually make a difference for people using substances?",
  "What single policy change would help the most people today?",
  "What does a 'safe place to sleep' mean to you personally?",
  "How do stigma and judgment impact someone's recovery journey?",
  "What's something people misunderstand about addiction?",
  "What would you want the public to know about homelessness?",
  "What gives you hope for the future?",
  "If you could change one thing about how society treats homeless people, what would it be?"
];

// Get stored data
function getStoredData(key) {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : null;
}

// Save data
function saveData(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

// Get questions (initialize if not exists)
function getQuestions() {
  let questions = getStoredData('questions');
  if (!questions || questions.length === 0) {
    questions = DEFAULT_QUESTIONS.map((text, index) => ({
      id: Date.now() + index,
      text: text,
      order: index,
      active: true
    }));
    saveData('questions', questions);
  }
  return questions.sort((a, b) => a.order - b.order);
}

// Save questions
function saveQuestions(questions) {
  saveData('questions', questions);
}

// Get videos
function getVideos() {
  return getStoredData('videos') || [];
}

// Save video
function saveVideo(videoData) {
  const videos = getVideos();
  videos.push(videoData);
  saveData('videos', videos);
}

// Delete video
function deleteVideo(videoId) {
  let videos = getVideos();
  videos = videos.filter(v => v.id !== videoId);
  saveData('videos', videos);
}

// Format time
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) return 'just now';
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Format duration
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Generate unique ID
function generateId() {
  return Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Check admin authentication
function checkAdminAuth() {
  const authenticated = localStorage.getItem(STORAGE_PREFIX + 'admin_authenticated');
  const loginTime = localStorage.getItem(STORAGE_PREFIX + 'admin_login_time');
  
  if (!authenticated || !loginTime) {
    return false;
  }
  
  // Session expires after 24 hours
  const sessionDuration = 24 * 60 * 60 * 1000;
  if (Date.now() - parseInt(loginTime) > sessionDuration) {
    localStorage.removeItem(STORAGE_PREFIX + 'admin_authenticated');
    localStorage.removeItem(STORAGE_PREFIX + 'admin_login_time');
    return false;
  }
  
  return true;
}

// Logout
function logout() {
  localStorage.removeItem(STORAGE_PREFIX + 'admin_authenticated');
  localStorage.removeItem(STORAGE_PREFIX + 'admin_login_time');
  window.location.href = 'index.html';
}

// Export functions for modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getStoredData,
    saveData,
    getQuestions,
    saveQuestions,
    getVideos,
    saveVideo,
    deleteVideo,
    formatTime,
    formatDuration,
    escapeHtml,
    generateId,
    checkAdminAuth,
    logout
  };
}
