// Midnight Documentary Room JavaScript

const PROJECT_KEY = 'documentary_room';

const TOPICS = {
  'story-hit': 'What part of this story hit you hardest?',
  'your-life': 'What does this video make you think about in your own life?',
  'system-change': 'What would you change in the system shown here?',
  'gives-hope': 'What gives you hope?',
  'recovery-unpredictable': 'What makes recovery so unpredictable?',
  'trauma-shapes': 'How does trauma shape someone\'s path?',
  'film-missing': 'What\'s something the film didn\'t show that matters?',
  'missing-service': 'What\'s the biggest missing service in this town?',
  'prevent-stories': 'What could prevent stories like this?',
  'next-topic': 'What should be the next documentary topic?'
};

// Update documentary title on screen
function updateDocTitle() {
  const topicSelect = document.getElementById('topic-select');
  const docTitle = document.getElementById('documentary-title');
  
  if (topicSelect && docTitle) {
    docTitle.textContent = TOPICS[topicSelect.value];
  }
}

// Render comments
function renderComments() {
  const commentsList = document.getElementById('comments-list');
  const topicSelect = document.getElementById('topic-select');
  
  if (!commentsList || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (filteredComments.length === 0) {
    commentsList.innerHTML = '<li class="comment-item">No commentary yet. Be the first to share your reflection.</li>';
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
  updateDocTitle();
  renderComments();
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
});
