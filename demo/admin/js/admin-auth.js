// Admin Authentication Check

function checkAuth() {
  const isAuthenticated = localStorage.getItem('admin_authenticated');
  const loginTime = localStorage.getItem('admin_login_time');
  
  // Check if authenticated and within 24 hours
  if (!isAuthenticated || !loginTime) {
    redirectToLogin();
    return false;
  }
  
  const hoursSinceLogin = (Date.now() - parseInt(loginTime)) / (1000 * 60 * 60);
  if (hoursSinceLogin > 24) {
    // Session expired
    logout();
    return false;
  }
  
  return true;
}

function redirectToLogin() {
  window.location.href = 'index.html';
}

function logout() {
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('admin_login_time');
  redirectToLogin();
}

// Check auth on page load
if (window.location.pathname.includes('dashboard') || 
    window.location.pathname.includes('topics') ||
    window.location.pathname.includes('moderation') ||
    window.location.pathname.includes('broadcast') ||
    window.location.pathname.includes('polls') ||
    window.location.pathname.includes('resources') ||
    window.location.pathname.includes('analytics') ||
    window.location.pathname.includes('themes') ||
    window.location.pathname.includes('security')) {
  if (!checkAuth()) {
    // Redirect will happen in checkAuth
  }
}
