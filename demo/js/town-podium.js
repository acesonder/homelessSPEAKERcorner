// Voice of the Town Podium JavaScript

const PROJECT_KEY = 'town_podium';

// Display current speaker at podium
function displayCurrentSpeaker() {
  const speakerBox = document.getElementById('current-speaker');
  const topicSelect = document.getElementById('topic-select');
  
  if (!speakerBox || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (filteredComments.length === 0) {
    speakerBox.innerHTML = `
      <div class="speech-bubble">
        <p class="waiting-text">Step up to the podium and speak your truth</p>
      </div>
    `;
    return;
  }
  
  // Show the most recent comment
  const latestComment = filteredComments[0];
  speakerBox.innerHTML = `
    <div class="speech-bubble">
      <div class="speech-author">${escapeHtml(latestComment.name)}</div>
      <div class="speech-text">"${escapeHtml(latestComment.text)}"</div>
    </div>
  `;
}

// Render all comments
function renderCommentsList() {
  const commentsList = document.getElementById('comments-list');
  const topicSelect = document.getElementById('topic-select');
  
  if (!commentsList || !topicSelect) return;
  
  const currentTopic = topicSelect.value;
  const allComments = getStoredData(PROJECT_KEY);
  const filteredComments = allComments.filter(c => c.topic === currentTopic);
  
  if (filteredComments.length === 0) {
    commentsList.innerHTML = '<li class="comment-item">No one has spoken yet. Be the first to take the podium.</li>';
    return;
  }
  
  commentsList.innerHTML = filteredComments.map(comment => `
    <li class="comment-item fade-in">
      <div class="comment-author">
        ${escapeHtml(comment.name)}
        <span class="comment-time">${formatTime(comment.timestamp)}</span>
      </div>
      <div class="comment-text">"${escapeHtml(comment.text)}"</div>
    </li>
  `).join('');
}

// Main render function
function renderAll() {
  displayCurrentSpeaker();
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
  
  // Update current speaker periodically
  setInterval(displayCurrentSpeaker, 30000);
});
