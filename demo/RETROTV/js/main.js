// Main page JavaScript for RETROTV Speakers Corner

// State
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;
let currentQuestionIndex = 0;
let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let countdownInterval = null;
let currentFilter = 'vhs';

const MAX_RECORDING_TIME = 150; // 2:30 in seconds

// DOM Elements
const mainCta = document.getElementById('main-cta');
const landingState = document.getElementById('landing-state');
const recordingState = document.getElementById('recording-state');
const controlPanel = document.getElementById('control-panel');
const tvScreen = document.getElementById('tv-screen');
const previewVideo = document.getElementById('preview-video');
const playbackVideo = document.getElementById('playback-video');
const recordingIndicator = document.getElementById('recording-indicator');
const countdownOverlay = document.getElementById('countdown-overlay');
const countdownNumber = document.getElementById('countdown-number');
const questionDisplay = document.getElementById('question-display');
const questionNumber = document.getElementById('question-number');
const timerProgress = document.getElementById('timer-progress');
const timerText = document.getElementById('timer-text');
const statusMessage = document.getElementById('status-message');

// Control buttons
const startRecordBtn = document.getElementById('start-record-btn');
const stopRecordBtn = document.getElementById('stop-record-btn');
const nextQuestionBtn = document.getElementById('next-question-btn');
const retryBtn = document.getElementById('retry-btn');
const uploadBtn = document.getElementById('upload-btn');

// Questions
let questions = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  questions = getQuestions();
  setupEventListeners();
  updateQuestionDisplay();
});

function setupEventListeners() {
  // Main CTA button
  if (mainCta) {
    mainCta.addEventListener('click', startSession);
  }
  
  // Control buttons
  if (startRecordBtn) {
    startRecordBtn.addEventListener('click', startRecording);
  }
  
  if (stopRecordBtn) {
    stopRecordBtn.addEventListener('click', stopRecording);
  }
  
  if (nextQuestionBtn) {
    nextQuestionBtn.addEventListener('click', nextQuestion);
  }
  
  if (retryBtn) {
    retryBtn.addEventListener('click', retryRecording);
  }
  
  if (uploadBtn) {
    uploadBtn.addEventListener('click', uploadRecording);
  }
  
  // Filter selection
  const filterRadios = document.querySelectorAll('input[name="filter"]');
  filterRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      currentFilter = e.target.value;
      updateFilter();
    });
  });
}

// Start session - request camera access
async function startSession() {
  try {
    showStatus('Requesting camera and microphone access...', 'info');
    
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: true
    });
    
    // Show preview
    if (previewVideo) {
      previewVideo.srcObject = stream;
    }
    
    // Hide landing, show recording state
    if (landingState) landingState.classList.add('hidden');
    if (recordingState) recordingState.classList.remove('hidden');
    if (controlPanel) controlPanel.classList.remove('hidden');
    
    showStatus('Camera ready! Click START RECORDING when ready.', 'success');
    updateButtonStates('ready');
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    showStatus('Could not access camera/microphone. Please allow permissions and try again.', 'error');
  }
}

// Update question display
function updateQuestionDisplay() {
  if (!questionDisplay || questions.length === 0) return;
  
  const question = questions[currentQuestionIndex];
  questionDisplay.innerHTML = `<p>${escapeHtml(question.text)}</p>`;
  
  if (questionNumber) {
    questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
  }
}

// Start recording with countdown
function startRecording() {
  if (!stream) {
    showStatus('Camera not initialized', 'error');
    return;
  }
  
  // Show countdown
  if (countdownOverlay) {
    countdownOverlay.classList.remove('hidden');
    let count = 10;
    countdownNumber.textContent = count;
    
    countdownInterval = setInterval(() => {
      count--;
      if (countdownNumber) {
        countdownNumber.textContent = count;
      }
      
      // Play beep sound (visual feedback)
      if (count <= 3) {
        countdownNumber.style.color = '#00ff00';
      }
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        countdownOverlay.classList.add('hidden');
        countdownNumber.style.color = '#ff3333';
        beginRecording();
      }
    }, 1000);
  } else {
    beginRecording();
  }
  
  updateButtonStates('countdown');
}

// Actually start recording
function beginRecording() {
  recordedChunks = [];
  
  try {
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
  } catch (e) {
    // Fallback
    mediaRecorder = new MediaRecorder(stream);
  }
  
  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  
  mediaRecorder.onstop = () => {
    handleRecordingComplete();
  };
  
  mediaRecorder.start(1000); // Collect data every second
  isRecording = true;
  recordingStartTime = Date.now();
  
  // Show recording indicator
  if (recordingIndicator) {
    recordingIndicator.classList.remove('hidden');
  }
  
  // Start timer
  startTimer();
  
  showStatus('Recording... Speak your truth!', 'info');
  updateButtonStates('recording');
}

// Stop recording
function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Hide recording indicator
    if (recordingIndicator) {
      recordingIndicator.classList.add('hidden');
    }
    
    updateButtonStates('stopped');
  }
}

// Handle recording complete
function handleRecordingComplete() {
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  
  // Show playback
  if (playbackVideo) {
    playbackVideo.src = url;
    playbackVideo.classList.remove('hidden');
    playbackVideo.play();
  }
  
  // Hide preview
  if (previewVideo) {
    previewVideo.classList.add('hidden');
  }
  
  showStatus('Recording complete! You can retry, upload, or continue to the next question.', 'success');
  updateButtonStates('complete');
}

// Start timer
function startTimer() {
  let elapsed = 0;
  
  timerInterval = setInterval(() => {
    elapsed++;
    const remaining = MAX_RECORDING_TIME - elapsed;
    
    // Update progress bar
    if (timerProgress) {
      const percent = (elapsed / MAX_RECORDING_TIME) * 100;
      timerProgress.style.width = `${percent}%`;
      
      if (percent > 80) {
        timerProgress.classList.add('danger');
        timerProgress.classList.remove('warning');
      } else if (percent > 60) {
        timerProgress.classList.add('warning');
      }
    }
    
    // Update timer text
    if (timerText) {
      timerText.textContent = `Time remaining: ${formatDuration(remaining)}`;
    }
    
    // Auto-stop at max time
    if (elapsed >= MAX_RECORDING_TIME) {
      stopRecording();
    }
  }, 1000);
}

// Next question
function nextQuestion() {
  // Reset for next question
  currentQuestionIndex++;
  
  if (currentQuestionIndex >= questions.length) {
    currentQuestionIndex = 0;
    showStatus('All questions completed! Starting over.', 'info');
  }
  
  updateQuestionDisplay();
  resetRecordingState();
  showStatus('Ready for the next question!', 'info');
}

// Retry recording
function retryRecording() {
  resetRecordingState();
  showStatus('Ready to record again!', 'info');
}

// Reset recording state
function resetRecordingState() {
  recordedChunks = [];
  
  // Reset timer
  if (timerProgress) {
    timerProgress.style.width = '0%';
    timerProgress.classList.remove('warning', 'danger');
  }
  
  if (timerText) {
    timerText.textContent = `Time remaining: ${formatDuration(MAX_RECORDING_TIME)}`;
  }
  
  // Show preview, hide playback
  if (previewVideo) {
    previewVideo.classList.remove('hidden');
  }
  
  if (playbackVideo) {
    playbackVideo.classList.add('hidden');
    playbackVideo.src = '';
  }
  
  updateButtonStates('ready');
}

// Upload recording
function uploadRecording() {
  if (recordedChunks.length === 0) {
    showStatus('No recording to upload', 'error');
    return;
  }
  
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const question = questions[currentQuestionIndex];
  
  // In a real app, this would upload to a server
  // For demo, we'll save to localStorage as base64 (limited by storage size)
  const reader = new FileReader();
  reader.onloadend = function() {
    const videoData = {
      id: generateId(),
      questionId: question.id,
      questionText: question.text,
      questionIndex: currentQuestionIndex,
      filter: currentFilter,
      timestamp: Date.now(),
      duration: (Date.now() - recordingStartTime) / 1000,
      // For demo purposes - in production this would be a URL to uploaded file
      dataUrl: reader.result.substring(0, 1000) + '...[truncated]', // Truncate for storage
      uploaded: true
    };
    
    saveVideo(videoData);
    showStatus('Recording uploaded successfully!', 'success');
    
    // Move to next question
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  };
  
  // Read as data URL (for demo)
  reader.readAsDataURL(blob);
  
  showStatus('Uploading recording...', 'info');
  updateButtonStates('uploading');
}

// Update filter
function updateFilter() {
  const tvContainer = document.querySelector('.tv-container');
  if (!tvContainer) return;
  
  tvContainer.classList.remove('filter-vhs', 'filter-neon', 'filter-scan');
  tvContainer.classList.add(`filter-${currentFilter}`);
}

// Update button states
function updateButtonStates(state) {
  if (!startRecordBtn || !stopRecordBtn) return;
  
  switch(state) {
    case 'ready':
      startRecordBtn.disabled = false;
      stopRecordBtn.disabled = true;
      if (nextQuestionBtn) nextQuestionBtn.disabled = false;
      if (retryBtn) retryBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      startRecordBtn.classList.remove('recording');
      break;
      
    case 'countdown':
      startRecordBtn.disabled = true;
      stopRecordBtn.disabled = true;
      if (nextQuestionBtn) nextQuestionBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      break;
      
    case 'recording':
      startRecordBtn.disabled = true;
      stopRecordBtn.disabled = false;
      stopRecordBtn.classList.add('recording');
      if (nextQuestionBtn) nextQuestionBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      break;
      
    case 'stopped':
    case 'complete':
      startRecordBtn.disabled = true;
      stopRecordBtn.disabled = true;
      stopRecordBtn.classList.remove('recording');
      if (nextQuestionBtn) nextQuestionBtn.disabled = false;
      if (retryBtn) retryBtn.disabled = false;
      if (uploadBtn) uploadBtn.disabled = false;
      break;
      
    case 'uploading':
      startRecordBtn.disabled = true;
      stopRecordBtn.disabled = true;
      if (nextQuestionBtn) nextQuestionBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      break;
  }
}

// Show status message
function showStatus(message, type) {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = 'status-message ' + type;
  statusMessage.classList.remove('hidden');
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
