// Police Scanner Feed JavaScript

const PROJECT_KEY = 'police_scanner';

// Render dispatch log (recent messages)
function renderDispatchLog() {
  const dispatchLog = document.getElementById('dispatch-log');
  const topicSelect = document.getElementById('topic-select');
  
  if (!dispatchLog || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  // Show last 10 messages in dispatch log
  const recentMessages = filteredComments.slice(0, 10);
  
  if (recentMessages.length === 0) {
    dispatchLog.innerHTML = '<div class="dispatch-entry">No active transmissions on this channel.</div>';
    return;
  }
  
  dispatchLog.innerHTML = recentMessages.map(comment => {
    const time = new Date(comment.timestamp).toLocaleTimeString('en-US', { hour12: false });
    return `
      <div class="dispatch-entry">
        <span class="dispatch-timestamp">[${time}]</span>
        <span class="dispatch-callsign">${escapeHtml(comment.name)}:</span>
        <div style="margin-left: 20px; margin-top: 5px;">${escapeHtml(comment.text)}</div>
      </div>
    `;
  }).join('');
  
  // Auto-scroll to bottom
  dispatchLog.scrollTop = dispatchLog.scrollHeight;
}

// Render full comments list
function renderCommentsList() {
  const commentsList = document.getElementById('comments-list');
  const topicSelect = document.getElementById('topic-select');
  
  if (!commentsList || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (filteredComments.length === 0) {
    commentsList.innerHTML = '<li class="comment-item">No transmissions logged for this topic.</li>';
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
  renderDispatchLog();
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
  
  // Update dispatch log periodically
  setInterval(renderDispatchLog, 30000);
});
