// Streetlight Topic Lantern JavaScript

const PROJECT_KEY = 'streetlight_lantern';

// Change lamp color based on topic
function updateLampColor() {
  const topicSelect = document.getElementById('topic-select');
  const lampBulb = document.getElementById('lamp-bulb');
  
  if (topicSelect && lampBulb) {
    const selectedOption = topicSelect.options[topicSelect.selectedIndex];
    const color = selectedOption.getAttribute('data-color');
    lampBulb.setAttribute('data-color', color);
  }
}

// Create firefly animation when comment is added
function createFirefly() {
  const container = document.getElementById('firefly-container');
  if (!container) return;
  
  const firefly = document.createElement('div');
  firefly.className = 'firefly';
  
  // Random horizontal position
  firefly.style.left = Math.random() * 100 + '%';
  firefly.style.bottom = '0';
  
  // Random horizontal drift
  const drift = (Math.random() - 0.5) * 100;
  firefly.style.setProperty('--drift', drift + 'px');
  
  container.appendChild(firefly);
  
  // Remove after animation
  setTimeout(() => {
    firefly.remove();
  }, 5000);
}

// Update time display
function updateTime() {
  const timeDisplay = document.querySelector('.time-display');
  if (!timeDisplay) return;
  
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  timeDisplay.textContent = `${hours}:${minutes}`;
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
    commentsList.innerHTML = '<li class="comment-item">No voices yet. Share your story under the light.</li>';
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

// Override the comment submission to add firefly effect
function setupCustomCommentForm() {
  const form = document.getElementById('comment-form');
  const nameInput = document.getElementById('comment-name');
  const textArea = document.getElementById('comment-text');
  const topicSelect = document.getElementById('topic-select');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = nameInput.value.trim() || 'Anonymous';
    const text = textArea.value.trim();
    const topic = topicSelect ? topicSelect.value : 'default';
    
    if (!text) {
      alert('Please enter a comment');
      return;
    }
    
    const comment = {
      id: Date.now(),
      name: name,
      text: text,
      topic: topic,
      timestamp: Date.now()
    };
    
    const comments = getStoredData(PROJECT_KEY);
    comments.unshift(comment);
    saveData(PROJECT_KEY, comments);
    
    // Clear form
    nameInput.value = '';
    textArea.value = '';
    
    // Create firefly effect
    createFirefly();
    setTimeout(createFirefly, 300);
    setTimeout(createFirefly, 600);
    
    // Render comments
    renderComments();
    
    // Speak comment if audio mode is on
    if (window.speechSynthesis && typeof speakText === 'function') {
      speakText(`${name} says: ${text}`);
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  // Set up topic selector
  const topicSelect = document.getElementById('topic-select');
  if (topicSelect) {
    topicSelect.addEventListener('change', function() {
      updateLampColor();
      renderComments();
    });
  }
  
  // Set up custom comment form
  setupCustomCommentForm();
  
  // Initial setup
  updateLampColor();
  updateTime();
  renderComments();
  
  // Update time every minute
  setInterval(updateTime, 60000);
});
