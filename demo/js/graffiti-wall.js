// Graffiti Wall of Truth JavaScript

const PROJECT_KEY = 'graffiti_wall';

const STYLE_ICONS = {
  'spray': '🎨',
  'marker': '✏️',
  'chalk': '📝',
  'sticker': '🏷️',
  'poster': '📄'
};

// Render tags on the wall
function renderWallTags() {
  const wallTags = document.getElementById('wall-tags');
  const topicSelect = document.getElementById('topic-select');
  
  if (!wallTags || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  // Show last 20 tags on the wall
  const recentTags = filteredComments.slice(0, 20);
  
  if (recentTags.length === 0) {
    wallTags.innerHTML = '<div style="color: #888; padding: 40px; text-align: center; width: 100%;">The wall is empty. Be the first to tag it!</div>';
    return;
  }
  
  wallTags.innerHTML = recentTags.map(comment => {
    const style = comment.style || 'spray';
    return `
      <div class="wall-tag ${style}" data-style-icon="${STYLE_ICONS[style]}">
        <div class="tag-author">${escapeHtml(comment.name)}</div>
        <div class="tag-text">${escapeHtml(comment.text)}</div>
        <span class="tag-time">${formatTime(comment.timestamp)}</span>
      </div>
    `;
  }).join('');
}

// Render comments list
function renderCommentsList() {
  const commentsList = document.getElementById('comments-list');
  const topicSelect = document.getElementById('topic-select');
  
  if (!commentsList || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (filteredComments.length === 0) {
    commentsList.innerHTML = '<li class="comment-item">No tags yet. Start the conversation!</li>';
    return;
  }
  
  commentsList.innerHTML = filteredComments.map(comment => {
    const styleIcon = STYLE_ICONS[comment.style] || '🎨';
    return `
      <li class="comment-item fade-in">
        <div class="comment-author">
          ${styleIcon} ${escapeHtml(comment.name)}
          <span class="comment-time">${formatTime(comment.timestamp)}</span>
        </div>
        <div class="comment-text">${escapeHtml(comment.text)}</div>
      </li>
    `;
  }).join('');
}

// Main render function
function renderAll() {
  renderWallTags();
  renderCommentsList();
}

// Custom comment form setup with style
function setupCustomCommentForm() {
  const form = document.getElementById('comment-form');
  const nameInput = document.getElementById('comment-name');
  const textArea = document.getElementById('comment-text');
  const topicSelect = document.getElementById('topic-select');
  const styleSelect = document.getElementById('tag-style');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim() || 'Anonymous';
    const text = textArea.value.trim();
    const topic = topicSelect ? topicSelect.value : 'default';
    const style = styleSelect ? styleSelect.value : 'spray';
    
    if (!text) {
      alert('Please enter a comment');
      return;
    }
    
    const comment = {
      id: Date.now(),
      name: name,
      text: text,
      topic: topic,
      style: style,
      timestamp: Date.now()
    };
    
    const comments = getStoredData(PROJECT_KEY);
    comments.unshift(comment);
    saveData(PROJECT_KEY, comments);
    
    // Clear form
    nameInput.value = '';
    textArea.value = '';
    
    // Render
    renderAll();
    
    // Speak comment if audio mode is on
    if (typeof speakText === 'function') {
      speakText(`${name} tagged: ${text}`);
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set up topic selector
  const topicSelect = document.getElementById('topic-select');
  if (topicSelect) {
    topicSelect.addEventListener('change', renderAll);
  }
  
  // Set up custom comment form
  setupCustomCommentForm();
  
  // Initial render
  renderAll();
});
