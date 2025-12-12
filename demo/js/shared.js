// Shared JavaScript functionality for all demo projects

// LocalStorage key prefix
const STORAGE_PREFIX = 'homeless_speaker_';

// Helper function to get stored data
function getStoredData(key) {
  const data = localStorage.getItem(STORAGE_PREFIX + key);
  return data ? JSON.parse(data) : [];
}

// Helper function to save data
function saveData(key, data) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
}

// Helper function to format timestamp
function formatTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  // Less than a minute
  if (diff < 60000) {
    return 'just now';
  }
  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  }
  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }
  // More than a day
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Helper function to escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Audio mode functionality
let audioEnabled = false;
let audioQueue = [];
let isSpeaking = false;

function initAudioMode() {
  const audioToggle = document.getElementById('audio-mode');
  if (!audioToggle) return;
  
  audioToggle.addEventListener('change', function() {
    audioEnabled = this.checked;
    if (audioEnabled) {
      speakText('Audio mode enabled');
    } else {
      window.speechSynthesis.cancel();
      audioQueue = [];
      isSpeaking = false;
    }
  });
}

function speakText(text) {
  if (!audioEnabled || !window.speechSynthesis) return;
  
  audioQueue.push(text);
  processAudioQueue();
}

function processAudioQueue() {
  if (isSpeaking || audioQueue.length === 0 || !audioEnabled) return;
  
  isSpeaking = true;
  const text = audioQueue.shift();
  const utterance = new SpeechSynthesisUtterance(text);
  
  utterance.onend = function() {
    isSpeaking = false;
    processAudioQueue();
  };
  
  utterance.onerror = function() {
    isSpeaking = false;
    processAudioQueue();
  };
  
  window.speechSynthesis.speak(utterance);
}

// Comment submission handler
function setupCommentForm(projectKey, renderFunction) {
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
    
    const comments = getStoredData(projectKey);
    comments.unshift(comment);
    saveData(projectKey, comments);
    
    // Clear form
    nameInput.value = '';
    textArea.value = '';
    
    // Render comments
    if (renderFunction) {
      renderFunction();
    }
    
    // Speak comment if audio mode is on
    speakText(`${name} says: ${text}`);
  });
  
  // Initial render
  if (renderFunction) {
    renderFunction();
  }
}

// Filter comments by topic
function filterCommentsByTopic(projectKey, topic) {
  const comments = getStoredData(projectKey);
  if (topic === 'all') {
    return comments;
  }
  return comments.filter(c => c.topic === topic);
}

// Topic selector handler
function setupTopicFilter(projectKey, renderFunction) {
  const topicSelect = document.getElementById('topic-select');
  if (!topicSelect) return;
  
  topicSelect.addEventListener('change', function() {
    if (renderFunction) {
      renderFunction();
    }
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  initAudioMode();
});
