document.addEventListener('DOMContentLoaded', () => {
  // Select DOM Elements
  const greetingEl = document.getElementById('greeting');
  const clockTimeEl = document.getElementById('clock-time');
  const clockDateEl = document.getElementById('clock-date');
  const clockTzEl = document.getElementById('clock-tz');
  
  // Progress Ring Elements
  const progressCircle = document.querySelector('.progress-bar-circle');
  const percentageNumEl = document.getElementById('percentage-num');
  const hoursElapsedEl = document.getElementById('hours-elapsed');
  const hoursRemainingEl = document.getElementById('hours-remaining');

  // SVG Circumference calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  
  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
  }

  // Time-of-Day Themes Configuration
  const timeThemes = {
    morning: { // 5am - 12pm
      greeting: "Good Morning, Will",
      cyan: "#ff9f43", // Warm golden orange
      purple: "#ff5252", // Sunset red
      bg: "#0c0702"
    },
    afternoon: { // 12pm - 6pm
      greeting: "Good Afternoon, Will",
      cyan: "#00e5ff", // Cool electric cyan
      purple: "#bd00ff", // Neon purple
      bg: "#05070f"
    },
    evening: { // 6pm - 10pm
      greeting: "Good Evening, Will",
      cyan: "#ff007f", // Neon pink
      purple: "#7b2cbf", // Deep violet
      bg: "#0a0512"
    },
    night: { // 10pm - 5am
      greeting: "Good Night, Will",
      cyan: "#00f5d4", // Mint green
      purple: "#00bbf9", // Cool sky blue
      bg: "#02040a"
    }
  };

  // 1. Update Clock and Tracker
  function updateTimeAndProgress() {
    const now = new Date();
    
    // Digital Clock
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    
    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    clockTimeEl.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    
    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    clockDateEl.textContent = now.toLocaleDateString('en-US', options);
    
    // Timezone
    const tzString = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tzOffset = -now.getTimezoneOffset() / 60;
    const tzOffsetSign = tzOffset >= 0 ? '+' : '';
    clockTzEl.textContent = `${tzString.replace('_', ' ')} (UTC${tzOffsetSign}${tzOffset})`;

    // Calculate Day Progress
    const totalSecondsInDay = 24 * 60 * 60;
    const elapsedSeconds = (hours * 3600) + (minutes * 60) + seconds;
    const progressPercent = (elapsedSeconds / totalSecondsInDay) * 100;
    
    // Update SVG Progress Circle
    if (progressCircle) {
      const offset = circumference - (progressPercent / 100) * circumference;
      progressCircle.style.strokeDashoffset = offset;
    }
    
    // Update percentage label
    percentageNumEl.textContent = `${progressPercent.toFixed(1)}%`;
    
    // Update Stats
    const elapsedHours = elapsedSeconds / 3600;
    const remainingHours = 24 - elapsedHours;
    hoursElapsedEl.textContent = `${elapsedHours.toFixed(1)}h`;
    hoursRemainingEl.textContent = `${remainingHours.toFixed(1)}h`;

    // Dynamic Time-of-Day logic
    let activeTheme = 'afternoon';
    if (hours >= 5 && hours < 12) {
      activeTheme = 'morning';
    } else if (hours >= 12 && hours < 18) {
      activeTheme = 'afternoon';
    } else if (hours >= 18 && hours < 22) {
      activeTheme = 'evening';
    } else {
      activeTheme = 'night';
    }

    const theme = timeThemes[activeTheme];
    
    // Smoothly transition colors and greetings
    greetingEl.textContent = theme.greeting;
    document.documentElement.style.setProperty('--accent-cyan', theme.cyan);
    document.documentElement.style.setProperty('--accent-purple', theme.purple);
    document.documentElement.style.setProperty('--bg-color', theme.bg);
  }

  // Initialize and tick every second
  updateTimeAndProgress();
  setInterval(updateTimeAndProgress, 1000);

  // 2. Mouse Glow tracking effect
  window.addEventListener('mousemove', (e) => {
    // Get mouse coordinates relative to viewport
    const x = e.clientX;
    const y = e.clientY;
    
    // Set custom properties
    document.documentElement.style.setProperty('--mouse-x', `${x}px`);
    document.documentElement.style.setProperty('--mouse-y', `${y}px`);
  });
});
