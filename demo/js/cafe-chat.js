// Café Chat Window JavaScript

const PROJECT_KEY = 'cafe_chat';

const TOPICS = {
  'exhausting-crisis': 'What\'s the most exhausting part of being in crisis?',
  'who-helped': 'Who helped you when you felt invisible?',
  'cobourg-ignores': 'What do you think Cobourg ignores about homelessness?',
  'stability-looks': 'What does stability look like for you?',
  'keep-safe': 'What would help keep people safe at night?',
  'kindness-wish': 'What\'s a kindness you wish more people offered?',
  'system-navigation': 'What part of the system feels impossible to navigate?',
  'good-day': 'What does a "good day" look like right now?',
  'sleep-mental-health': 'How has sleep loss affected your mental health?',
  'recovery-means': 'What does recovery mean to you?'
};

// Update chalkboard with current topic
function updateChalkboard() {
  const topicSelect = document.getElementById('topic-select');
  const topicDisplay = document.getElementById('current-topic');
  
  if (topicSelect && topicDisplay) {
    topicDisplay.textContent = TOPICS[topicSelect.value];
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
    commentsList.innerHTML = '<li class="comment-item">The table is quiet. Pull up a chair and start the conversation.</li>';
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
  updateChalkboard();
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
