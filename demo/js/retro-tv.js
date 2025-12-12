// Retro TV Debate Station JavaScript

const PROJECT_KEY = 'retro_tv';

// Topic display names
const TOPICS = {
  'housing-barriers': 'What barriers stop people from getting permanent housing right now?',
  'sleep-deprivation': 'How does sleep deprivation affect your daily functioning?',
  'support-services': 'What support services actually make a difference for people using substances?',
  'other-towns': 'How has homelessness been handled well in other towns you\'ve lived in?',
  'policy-change': 'What single policy change would help the most people today?',
  'low-barrier': 'Does Cobourg have enough low-barrier options for those who need them?',
  'stigma-recovery': 'How do stigma and judgment impact someone\'s recovery journey?',
  'safe-sleep': 'What does a "safe place to sleep" mean to you personally?',
  'county-change': 'What\'s one change you\'d want the County to implement immediately?',
  'addiction-misunderstanding': 'What\'s something people misunderstand about addiction?'
};

// Update TV display with current topic
function updateTopicDisplay() {
  const topicSelect = document.getElementById('topic-select');
  const topicDisplay = document.getElementById('current-topic');
  
  if (topicSelect && topicDisplay) {
    topicDisplay.textContent = TOPICS[topicSelect.value];
  }
}

// Render comments in the TV crawl
function renderCommentCrawl() {
  const crawl = document.getElementById('comment-crawl');
  const topicSelect = document.getElementById('topic-select');
  
  if (!crawl || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  // Show only the last 5 comments in the TV crawl
  const recentComments = filteredComments.slice(0, 5);
  
  crawl.innerHTML = recentComments.map(comment => `
    <div class="crawl-item">
      <span class="crawl-author">${escapeHtml(comment.name)}</span>
      <span class="crawl-time">${formatTime(comment.timestamp)}</span>
      <div>${escapeHtml(comment.text)}</div>
    </div>
  `).join('');
}

// Render all comments in the list below
function renderCommentsList() {
  const commentsList = document.getElementById('comments-list');
  const commentCount = document.getElementById('comment-count');
  const topicSelect = document.getElementById('topic-select');
  
  if (!commentsList || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (commentCount) {
    commentCount.textContent = filteredComments.length;
  }
  
  if (filteredComments.length === 0) {
    commentsList.innerHTML = '<li class="comment-item">No broadcasts yet for this topic. Be the first to share your voice!</li>';
    return;
  }
  
  commentsList.innerHTML = filteredComments.map(comment => `
    <li class="comment-item fade-in">
      <div class="comment-author">
        ${escapeHtml(comment.name)}
        <span class="comment-time">${formatTime(comment.timestamp)}</span>
      </div>
      <div class="comment-text">${escapeHtml(comment.text)}</div>
    </li>
  `).join('');
}

// Main render function
function renderAll() {
  updateTopicDisplay();
  renderCommentCrawl();
  renderCommentsList();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set up topic selector
  const topicSelect = document.getElementById('topic-select');
  if (topicSelect) {
    topicSelect.addEventListener('change', renderAll);
  }
  
  // Set up comment form
  setupCommentForm(PROJECT_KEY, renderAll);
  
  // Initial render
  renderAll();
  
  // Update crawl periodically to show animation
  setInterval(renderCommentCrawl, 30000); // Update every 30 seconds
});
