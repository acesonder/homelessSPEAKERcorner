// Billboard page JavaScript for RETROTV

// State
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;
let currentQuestionIndex = 0;
let isRecording = false;
let recordingStartTime = null;
let timerInterval = null;
let recordedClips = [];

const MAX_RECORDING_TIME = 150; // 2:30 in seconds

// DOM Elements
const previewVideo = document.getElementById('preview-video');
const playbackVideo = document.getElementById('playback-video');
const billboardQuestion = document.getElementById('billboard-question');
const questionIndicators = document.getElementById('question-indicators');
const recordingIndicator = document.getElementById('recording-indicator');
const timerProgress = document.getElementById('timer-progress');
const timerText = document.getElementById('timer-text');
const statusMessage = document.getElementById('status-message');

// Control buttons
const recordBtn = document.getElementById('record-btn');
const stopBtn = document.getElementById('stop-btn');
const retryBtn = document.getElementById('retry-btn');
const playbackBtn = document.getElementById('playback-btn');
const uploadBtn = document.getElementById('upload-btn');

// Billboard buttons
const startBtn = document.getElementById('start-btn');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const skipBtn = document.getElementById('skip-btn');

// Questions
let questions = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
  questions = getQuestions();
  setupEventListeners();
  createQuestionIndicators();
  updateBillboard();
  initCamera();
});

function setupEventListeners() {
  // Recording controls
  if (recordBtn) recordBtn.addEventListener('click', startRecording);
  if (stopBtn) stopBtn.addEventListener('click', stopRecording);
  if (retryBtn) retryBtn.addEventListener('click', retryRecording);
  if (playbackBtn) playbackBtn.addEventListener('click', togglePlayback);
  if (uploadBtn) uploadBtn.addEventListener('click', uploadAllRecordings);
  
  // Billboard controls
  if (startBtn) startBtn.addEventListener('click', startSession);
  if (nextBtn) nextBtn.addEventListener('click', nextQuestion);
  if (prevBtn) prevBtn.addEventListener('click', prevQuestion);
  if (skipBtn) skipBtn.addEventListener('click', skipQuestion);
}

// Initialize camera
async function initCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { 
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      },
      audio: true
    });
    
    if (previewVideo) {
      previewVideo.srcObject = stream;
    }
    
    showStatus('Camera ready!', 'success');
    updateButtonStates('ready');
    
  } catch (error) {
    console.error('Error accessing camera:', error);
    showStatus('Please allow camera access to record videos.', 'warning');
  }
}

// Create question indicators
function createQuestionIndicators() {
  if (!questionIndicators || questions.length === 0) return;
  
  questionIndicators.innerHTML = '';
  questions.forEach((q, index) => {
    const dot = document.createElement('div');
    dot.className = 'indicator-dot';
    if (index === currentQuestionIndex) dot.classList.add('active');
    dot.title = `Question ${index + 1}`;
    questionIndicators.appendChild(dot);
  });
}

// Update question indicators
function updateQuestionIndicators() {
  const dots = document.querySelectorAll('.indicator-dot');
  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    if (index === currentQuestionIndex) {
      dot.classList.add('active');
    }
    // Check if this question has a recorded clip
    const hasClip = recordedClips.some(clip => clip.questionIndex === index);
    if (hasClip) {
      dot.classList.add('completed');
    }
  });
}

// Update billboard display with animation
function updateBillboard() {
  if (!billboardQuestion || questions.length === 0) return;
  
  const question = questions[currentQuestionIndex];
  
  // Animate text
  billboardQuestion.innerHTML = '';
  const text = question.text;
  
  // Add characters with delay for animation
  text.split('').forEach((char, index) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = char;
    span.style.animationDelay = `${index * 0.02}s`;
    billboardQuestion.appendChild(span);
  });
  
  billboardQuestion.classList.add('animated-text');
  updateQuestionIndicators();
}

// Start session
function startSession() {
  currentQuestionIndex = 0;
  recordedClips = [];
  updateBillboard();
  showStatus('Session started! Record your response to each question.', 'info');
}

// Next question
function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateBillboard();
    resetRecordingState();
    showStatus(`Question ${currentQuestionIndex + 1} of ${questions.length}`, 'info');
  } else {
    showStatus('You\'ve reached the last question!', 'warning');
  }
}

// Previous question
function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateBillboard();
    resetRecordingState();
    showStatus(`Question ${currentQuestionIndex + 1} of ${questions.length}`, 'info');
  } else {
    showStatus('You\'re at the first question!', 'warning');
  }
}

// Skip question
function skipQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateBillboard();
    resetRecordingState();
    showStatus(`Skipped to question ${currentQuestionIndex + 1}`, 'info');
  } else {
    showStatus('No more questions to skip to!', 'warning');
  }
}

// Start recording
function startRecording() {
  if (!stream) {
    showStatus('Camera not initialized', 'error');
    return;
  }
  
  recordedChunks = [];
  
  try {
    mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp9'
    });
  } catch (e) {
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
  
  mediaRecorder.start(1000);
  isRecording = true;
  recordingStartTime = Date.now();
  
  // Show recording indicator
  if (recordingIndicator) {
    recordingIndicator.classList.remove('hidden');
  }
  
  startTimer();
  showStatus('Recording...', 'info');
  updateButtonStates('recording');
}

// Stop recording
function stopRecording() {
  if (mediaRecorder && isRecording) {
    mediaRecorder.stop();
    isRecording = false;
    
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
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
  const question = questions[currentQuestionIndex];
  
  // Save clip data
  const clipData = {
    id: generateId(),
    questionId: question.id,
    questionText: question.text,
    questionIndex: currentQuestionIndex,
    blob: blob,
    url: url,
    duration: (Date.now() - recordingStartTime) / 1000,
    timestamp: Date.now()
  };
  
  // Remove any existing clip for this question
  recordedClips = recordedClips.filter(c => c.questionIndex !== currentQuestionIndex);
  recordedClips.push(clipData);
  
  // Update playback
  if (playbackVideo) {
    playbackVideo.src = url;
  }
  
  showStatus('Recording saved! Play it back or continue to the next question.', 'success');
  updateButtonStates('complete');
  updateQuestionIndicators();
  updateClipsList();
}

// Start timer
function startTimer() {
  let elapsed = 0;
  
  timerInterval = setInterval(() => {
    elapsed++;
    const remaining = MAX_RECORDING_TIME - elapsed;
    
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
    
    if (timerText) {
      timerText.textContent = `Time: ${formatDuration(remaining)}`;
    }
    
    if (elapsed >= MAX_RECORDING_TIME) {
      stopRecording();
    }
  }, 1000);
}

// Toggle playback
function togglePlayback() {
  if (!playbackVideo) return;
  
  const currentClip = recordedClips.find(c => c.questionIndex === currentQuestionIndex);
  
  if (currentClip) {
    if (playbackVideo.classList.contains('active')) {
      // Stop playback, show preview
      playbackVideo.pause();
      playbackVideo.classList.remove('active');
      if (previewVideo) previewVideo.style.display = 'block';
    } else {
      // Start playback
      playbackVideo.src = currentClip.url;
      playbackVideo.classList.add('active');
      if (previewVideo) previewVideo.style.display = 'none';
      playbackVideo.play();
    }
  } else {
    showStatus('No recording for this question yet.', 'warning');
  }
}

// Retry recording
function retryRecording() {
  resetRecordingState();
  showStatus('Ready to record again!', 'info');
}

// Reset recording state
function resetRecordingState() {
  recordedChunks = [];
  
  if (timerProgress) {
    timerProgress.style.width = '0%';
    timerProgress.classList.remove('warning', 'danger');
  }
  
  if (timerText) {
    timerText.textContent = `Time: ${formatDuration(MAX_RECORDING_TIME)}`;
  }
  
  if (playbackVideo) {
    playbackVideo.classList.remove('active');
    if (previewVideo) previewVideo.style.display = 'block';
  }
  
  updateButtonStates('ready');
}

// Update clips list
function updateClipsList() {
  const clipsList = document.getElementById('clips-list');
  if (!clipsList) return;
  
  if (recordedClips.length === 0) {
    clipsList.innerHTML = '<p style="color: #888; text-align: center;">No clips recorded yet</p>';
    return;
  }
  
  clipsList.innerHTML = recordedClips.map(clip => `
    <div class="clip-item">
      <span class="clip-name">Q${clip.questionIndex + 1}: ${escapeHtml(clip.questionText.substring(0, 30))}...</span>
      <span class="clip-duration">${formatDuration(clip.duration)}</span>
    </div>
  `).join('');
}

// Upload all recordings
function uploadAllRecordings() {
  if (recordedClips.length === 0) {
    showStatus('No recordings to upload.', 'warning');
    return;
  }
  
  showStatus('Uploading recordings...', 'info');
  updateButtonStates('uploading');
  
  // Simulate upload progress
  let progress = 0;
  const progressBar = document.getElementById('upload-progress-fill');
  const uploadStatus = document.getElementById('upload-status');
  
  const uploadInterval = setInterval(() => {
    progress += 10;
    
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    
    if (uploadStatus) {
      uploadStatus.textContent = `Uploading... ${progress}%`;
    }
    
    if (progress >= 100) {
      clearInterval(uploadInterval);
      
      // Save videos to storage
      recordedClips.forEach(clip => {
        const videoData = {
          id: clip.id,
          questionId: clip.questionId,
          questionText: clip.questionText,
          questionIndex: clip.questionIndex,
          duration: clip.duration,
          timestamp: clip.timestamp,
          uploaded: true
        };
        saveVideo(videoData);
      });
      
      showStatus('All recordings uploaded successfully!', 'success');
      if (uploadStatus) {
        uploadStatus.textContent = 'Upload complete!';
      }
      
      // Reset after upload
      setTimeout(() => {
        recordedClips = [];
        updateClipsList();
        if (progressBar) progressBar.style.width = '0%';
        if (uploadStatus) uploadStatus.textContent = '';
        updateButtonStates('ready');
      }, 2000);
    }
  }, 200);
}

// Update button states
function updateButtonStates(state) {
  switch(state) {
    case 'ready':
      if (recordBtn) recordBtn.disabled = false;
      if (stopBtn) stopBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = true;
      if (playbackBtn) playbackBtn.disabled = recordedClips.some(c => c.questionIndex === currentQuestionIndex) ? false : true;
      if (uploadBtn) uploadBtn.disabled = recordedClips.length === 0;
      break;
      
    case 'recording':
      if (recordBtn) recordBtn.disabled = true;
      if (recordBtn) recordBtn.classList.add('record-active');
      if (stopBtn) stopBtn.disabled = false;
      if (retryBtn) retryBtn.disabled = true;
      if (playbackBtn) playbackBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      break;
      
    case 'stopped':
    case 'complete':
      if (recordBtn) recordBtn.disabled = true;
      if (recordBtn) recordBtn.classList.remove('record-active');
      if (stopBtn) stopBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = false;
      if (playbackBtn) playbackBtn.disabled = false;
      if (uploadBtn) uploadBtn.disabled = false;
      break;
      
    case 'uploading':
      if (recordBtn) recordBtn.disabled = true;
      if (stopBtn) stopBtn.disabled = true;
      if (retryBtn) retryBtn.disabled = true;
      if (playbackBtn) playbackBtn.disabled = true;
      if (uploadBtn) uploadBtn.disabled = true;
      break;
  }
}

// Show status message
function showStatus(message, type) {
  if (!statusMessage) return;
  
  statusMessage.textContent = message;
  statusMessage.className = 'status-message ' + type;
}

// Cleanup
window.addEventListener('beforeunload', () => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
});
