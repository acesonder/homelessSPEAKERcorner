// Dashboard JavaScript

const STORAGE_PREFIX = 'homeless_speaker_';
const PROJECT_KEYS = [
  'retro_tv',
  'streetlight_lantern',
  'graffiti_wall',
  'cafe_chat',
  'police_scanner',
  'town_podium',
  'documentary_room'
];

// Get all comments from a project
function getProjectComments(projectKey) {
  const data = localStorage.getItem(STORAGE_PREFIX + projectKey);
  return data ? JSON.parse(data) : [];
}

// Get comments from today
function getCommentsToday(comments) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return comments.filter(c => c.timestamp >= today.getTime());
}

// Get comments from last hour
function getCommentsThisHour(comments) {
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  return comments.filter(c => c.timestamp >= oneHourAgo);
}

// Update dashboard statistics
function updateDashboard() {
  let totalComments = 0;
  let commentsToday = 0;
  let commentsThisHour = 0;
  
  const demoStats = {
    'retro_tv': { total: 0, today: 0 },
    'streetlight_lantern': { total: 0, today: 0 },
    'graffiti_wall': { total: 0, today: 0 },
    'cafe_chat': { total: 0, today: 0 },
    'police_scanner': { total: 0, today: 0 },
    'town_podium': { total: 0, today: 0 },
    'documentary_room': { total: 0, today: 0 }
  };
  
  PROJECT_KEYS.forEach(key => {
    const comments = getProjectComments(key);
    const todayComments = getCommentsToday(comments);
    const hourComments = getCommentsThisHour(comments);
    
    demoStats[key].total = comments.length;
    demoStats[key].today = todayComments.length;
    
    totalComments += comments.length;
    commentsToday += todayComments.length;
    commentsThisHour += hourComments.length;
  });
  
  // Update tiles
  document.getElementById('comments-today').textContent = commentsToday;
  document.getElementById('comments-hour').textContent = commentsThisHour;
  
  // Update demo stats table
  document.getElementById('tv-total').textContent = demoStats.retro_tv.total;
  document.getElementById('tv-today').textContent = demoStats.retro_tv.today;
  
  document.getElementById('lantern-total').textContent = demoStats.streetlight_lantern.total;
  document.getElementById('lantern-today').textContent = demoStats.streetlight_lantern.today;
  
  document.getElementById('wall-total').textContent = demoStats.graffiti_wall.total;
  document.getElementById('wall-today').textContent = demoStats.graffiti_wall.today;
  
  document.getElementById('cafe-total').textContent = demoStats.cafe_chat.total;
  document.getElementById('cafe-today').textContent = demoStats.cafe_chat.today;
  
  document.getElementById('scanner-total').textContent = demoStats.police_scanner.total;
  document.getElementById('scanner-today').textContent = demoStats.police_scanner.today;
  
  document.getElementById('podium-total').textContent = demoStats.town_podium.total;
  document.getElementById('podium-today').textContent = demoStats.town_podium.today;
  
  document.getElementById('doc-total').textContent = demoStats.documentary_room.total;
  document.getElementById('doc-today').textContent = demoStats.documentary_room.today;
  
  // Update recent activity
  updateRecentActivity();
}

// Update recent activity table
function updateRecentActivity() {
  const tbody = document.querySelector('#recent-activity tbody');
  const allComments = [];
  
  const projectNames = {
    'retro_tv': 'Retro TV',
    'streetlight_lantern': 'Streetlight Lantern',
    'graffiti_wall': 'Graffiti Wall',
    'cafe_chat': 'Café Chat',
    'police_scanner': 'Police Scanner',
    'town_podium': 'Town Podium',
    'documentary_room': 'Documentary Room'
  };
  
  PROJECT_KEYS.forEach(key => {
    const comments = getProjectComments(key);
    comments.forEach(comment => {
      allComments.push({
        ...comment,
        project: projectNames[key]
      });
    });
  });
  
  // Sort by timestamp descending
  allComments.sort((a, b) => b.timestamp - a.timestamp);
  
  // Show last 10
  const recent = allComments.slice(0, 10);
  
  if (recent.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #888;">No activity yet</td></tr>';
    return;
  }
  
  tbody.innerHTML = recent.map(comment => {
    const timeAgo = getTimeAgo(comment.timestamp);
    return `
      <tr>
        <td>${timeAgo}</td>
        <td>${comment.project}</td>
        <td>${escapeHtml(comment.name)}</td>
        <td>New comment posted</td>
        <td><span class="badge badge-active">Active</span></td>
      </tr>
    `;
  }).join('');
}

// Format time ago
function getTimeAgo(timestamp) {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Emergency mode toggle
function setupEmergencyMode() {
  const emergencyToggle = document.getElementById('emergency-toggle');
  const emergencyControls = document.getElementById('emergency-controls');
  const emergencyStatus = document.getElementById('emergency-status');
  const emergencySection = document.getElementById('emergency-section');
  
  if (emergencySection) {
    emergencySection.style.display = 'block';
  }
  
  if (emergencyToggle) {
    emergencyToggle.addEventListener('change', function() {
      const isOn = this.checked;
      emergencyStatus.textContent = isOn ? 'ON' : 'OFF';
      emergencyControls.style.display = isOn ? 'block' : 'none';
      
      if (isOn) {
        emergencyStatus.style.color = '#ff3333';
      } else {
        emergencyStatus.style.color = '#888';
      }
    });
  }
}

// Broadcast emergency alert
function broadcastEmergency() {
  const message = document.getElementById('emergency-message').value;
  if (!message) {
    alert('Please enter an emergency message');
    return;
  }
  
  // Store emergency alert
  const alert = {
    id: Date.now(),
    message: message,
    timestamp: Date.now()
  };
  
  const alerts = JSON.parse(localStorage.getItem(STORAGE_PREFIX + 'emergency_alerts') || '[]');
  alerts.unshift(alert);
  localStorage.setItem(STORAGE_PREFIX + 'emergency_alerts', JSON.stringify(alerts));
  
  alert('Emergency alert broadcast successfully!');
  document.getElementById('emergency-message').value = '';
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function() {
  updateDashboard();
  setupEmergencyMode();
  
  // Refresh dashboard every 30 seconds
  setInterval(updateDashboard, 30000);
});
