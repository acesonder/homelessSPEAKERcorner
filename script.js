const viewData = {
  raw: [
    {
      id: "raw-1",
      title: "Why pop punk went quiet",
      description: "Rewatching old MuchMusic countdowns made me realize pop punk never died—it just lost the mic.",
      timestamp: "3m ago",
      replies: 12,
      topic: "bands"
    },
    {
      id: "raw-2",
      title: "Dress codes don\u2019t help",
      description: "We still can\u2019t wear sweats to school, but admin posts TikTok dances to flex. Where\u2019s the consistency?",
      timestamp: "12m ago",
      replies: 3,
      topic: "school"
    },
    {
      id: "raw-3",
      title: "Why Tim Hortons double doubles aren\u2019t that great",
      description: "Too much sugar, not enough grit. Bring back the messy grind.",
      timestamp: "21m ago",
      replies: 7,
      topic: "pet"
    }
  ],
  curated: [
    {
      id: "cur-1",
      title: "Tuition feels like a skip",
      description: "A much-loved VJ highlighted this one because the replies actually make a plan.",
      timestamp: "Yesterday",
      replies: 28,
      topic: "school"
    },
    {
      id: "cur-2",
      title: "Local band shoutout",
      description: "Much alum Rick Campanelli called this fave chanson a true garage anthem.",
      timestamp: "2 days ago",
      replies: 19,
      topic: "bands"
    }
  ],
  throwback: [
    {
      id: "throw-1",
      title: "00s booth — "Talk it out"",
      description: "Archived clip from 2004. 2000s teens flexing their skate crew drama.",
      timestamp: "2004",
      replies: 51,
      topic: "nostalgia"
    },
    {
      id: "throw-2",
      title: "90s booth reaction to Maple Leafs",
      description: "Classic Toronto teen meltdown about playoff grief.",
      timestamp: "1996",
      replies: 43,
      topic: "nostalgia"
    }
  ]
};

let currentView = "raw";
let currentTopic = "all";
let stream;
let mediaRecorder;
let recordedChunks = [];
let countdownInterval;
let recordingTimeout;
let replyTarget = null;

const feedContainer = document.getElementById("feed");
const viewButtons = document.querySelectorAll(".view-toggle button");
const topicButtons = document.querySelectorAll(".topic-toggle button");
const overlay = document.getElementById("recorder-overlay");
const countdown = document.getElementById("countdown");
const preview = document.getElementById("preview");
const previewStatus = document.getElementById("preview-status");
const ctaRecord = document.getElementById("cta-record");
const cancelRecord = document.getElementById("cancel-record");
const titleInput = document.getElementById("rant-title");
const filters = document.querySelectorAll("input[name=filter]");
const shoutoutForm = document.getElementById("shoutout-form");
const shoutoutList = document.getElementById("shoutout-list");

function renderFeed() {
  const dataset = viewData[currentView] || [];
  const filtered = dataset.filter(item => currentTopic === "all" || item.topic === currentTopic);
  if (!filtered.length) {
    feedContainer.innerHTML = "<p class='empty'>Nothing here yet—be the first voice.</p>";
    return;
  }
  feedContainer.innerHTML = filtered
    .map(
      item => `
        <article class="feed-card" data-id="${item.id}">
          <h3>${item.title}</h3>
          <p class="meta">${item.timestamp} • Replies ${item.replies}</p>
          <p class="description">${item.description}</p>
          <button data-action="reply">Reply</button>
          <button type="button" class="report" data-action="report">Report</button>
        </article>
      `
    )
    .join("\n");
}

function setActiveButton(buttons, value) {
  buttons.forEach(btn => btn.dataset.view === value || btn.dataset.topic === value
    ? btn.classList.add("active")
    : btn.classList.remove("active"));
}

viewButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentView = button.dataset.view;
    setActiveButton(viewButtons, currentView);
    setActiveButton(topicButtons, currentTopic);
    renderFeed();
  });
});

topicButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentTopic = button.dataset.topic;
    setActiveButton(topicButtons, currentTopic);
    renderFeed();
  });
});

feedContainer.addEventListener("click", event => {
  const action = event.target.dataset.action;
  if (!action) return;
  const card = event.target.closest(".feed-card");
  const id = card?.dataset.id;
  const allItems = viewData[currentView];
  const item = allItems.find(entry => entry.id === id);
  if (action === "reply" && item) {
    replyTarget = item;
    openRecorder(item.title);
  }
  if (action === "report") {
    event.target.textContent = "Flagged";
    event.target.disabled = true;
  }
});

async function openRecorder(targetTitle = "") {
  overlay.classList.add("active");
  titleInput.value = replyTarget ? `Reply to ${targetTitle}` : "";
  countdown.textContent = "10";
  try {
    if (!stream) {
      stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      preview.srcObject = stream;
    }
    previewStatus.textContent = "Camera ready. Countdown starting.";
    startCountdown();
  } catch (error) {
    previewStatus.textContent = "Camera access needed to record.";
  }
}

ctaRecord.addEventListener("click", () => openRecorder());
cancelRecord.addEventListener("click", () => {
  overlay.classList.remove("active");
  stopRecording(true);
  replyTarget = null;
});

function startCountdown() {
  let counter = 10;
  playBeep();
  countdown.textContent = counter;
  countdownInterval = setInterval(() => {
    counter -= 1;
    if (counter <= 0) {
      clearInterval(countdownInterval);
      startRecording();
      return;
    }
    playBeep();
    countdown.textContent = counter;
  }, 1000);
}

function startRecording() {
  if (!stream) return;
  if (typeof MediaRecorder === "undefined") {
    previewStatus.textContent = "Recording not supported in this browser.";
    overlay.classList.remove("recording");
    overlay.classList.remove("active");
    return;
  }
  recordedChunks = [];
  overlay.classList.add("recording");
  previewStatus.textContent = "Recording live";
  mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp8" });
  mediaRecorder.ondataavailable = event => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };
  mediaRecorder.onstop = saveRecording;
  mediaRecorder.start();
  recordingTimeout = setTimeout(stopRecording, 2 * 60 * 1000);
}

function stopRecording(force = false) {
  overlay.classList.remove("active");
  overlay.classList.remove("recording");
  clearTimeout(recordingTimeout);
  clearInterval(countdownInterval);
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
  if (force) {
    recordedChunks = [];
  }
  previewStatus.textContent = "Your camera preview will appear here.";
}

function saveRecording() {
  if (!recordedChunks.length) return;
  const blob = new Blob(recordedChunks, { type: "video/webm" });
  const entry = {
    id: `user-${Date.now()}`,
    title: titleInput.value || (replyTarget ? `Reply to ${replyTarget.title}` : "Fresh booth drop"),
    description: replyTarget ? `Response to: ${replyTarget.title}` : "Fresh rant from the booth",
    timestamp: "Just now",
    replies: 0,
    topic: replyTarget?.topic || "bands",
    videoUrl: URL.createObjectURL(blob)
  };
  viewData.raw.unshift(entry);
  currentView = "raw";
  setActiveButton(viewButtons, currentView);
  renderFeed();
  replyTarget = null;
}

const initialFilter = document.querySelector("input[name=filter]:checked");
if (initialFilter) {
  preview.classList.add(initialFilter.value);
}

filters.forEach(filter => {
  filter.addEventListener("change", () => {
    preview.classList.remove("vhs", "neon", "scan");
    preview.classList.add(filter.value);
  });
});

function playBeep() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.value = 880;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
  setTimeout(() => {
    osc.stop();
    ctx.close();
  }, 250);
}

shoutoutForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = document.getElementById("shoutout-text").value.trim();
  if (!text) return;
  const li = document.createElement("li");
  li.textContent = text;
  shoutoutList.prepend(li);
  shoutoutForm.reset();
});

renderFeed();
