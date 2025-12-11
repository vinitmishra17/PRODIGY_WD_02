// ===================================
// MODERN STOPWATCH - JAVASCRIPT
// Premium Functionality
// ===================================

class Stopwatch {
    constructor() {
        this.milliseconds = 0;
        this.isRunning = false;
        this.startTime = 0;
        this.interval = null;
        this.laps = [];
        this.lapStartTime = 0;
        
        this.initElements();
        this.attachEventListeners();
        this.updateDisplay();
    }
    
    initElements() {
        // Display elements
        this.hoursDisplay = document.getElementById('hours');
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.millisecondsDisplay = document.getElementById('milliseconds');
        
        // Control buttons
        this.startStopBtn = document.getElementById('startStopBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.lapBtn = document.getElementById('lapBtn');
        
        // Button icons and text
        this.playIcon = document.getElementById('playIcon');
        this.pauseIcon = document.getElementById('pauseIcon');
        this.startStopText = document.getElementById('startStopText');
        
        // Laps section
        this.lapsSection = document.getElementById('lapsSection');
        this.lapsList = document.getElementById('lapsList');
        this.clearLapsBtn = document.getElementById('clearLapsBtn');
        
        // Stats
        this.fastestLapDisplay = document.getElementById('fastestLap');
        this.slowestLapDisplay = document.getElementById('slowestLap');
        this.averageLapDisplay = document.getElementById('averageLap');
        
        // Progress ring
        this.progressCircle = document.getElementById('progressCircle');
        this.stopwatchCard = document.querySelector('.stopwatch-card');
        
        // Add gradient to SVG
        this.addProgressGradient();
    }
    
    addProgressGradient() {
        const svg = document.querySelector('.progress-ring-svg');
        const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        
        gradient.setAttribute('id', 'progressGradient');
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop1.setAttribute('offset', '0%');
        stop1.setAttribute('style', 'stop-color:#6366f1;stop-opacity:1');
        
        const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        stop2.setAttribute('offset', '100%');
        stop2.setAttribute('style', 'stop-color:#8b5cf6;stop-opacity:1');
        
        gradient.appendChild(stop1);
        gradient.appendChild(stop2);
        defs.appendChild(gradient);
        svg.insertBefore(defs, svg.firstChild);
    }
    
    attachEventListeners() {
        this.startStopBtn.addEventListener('click', () => this.toggleStartStop());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.lapBtn.addEventListener('click', () => this.recordLap());
        this.clearLapsBtn.addEventListener('click', () => this.clearLaps());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.toggleStartStop();
            } else if (e.code === 'KeyR' && !this.isRunning) {
                this.reset();
            } else if (e.code === 'KeyL' && this.isRunning) {
                this.recordLap();
            }
        });
    }
    
    toggleStartStop() {
        if (this.isRunning) {
            this.stop();
        } else {
            this.start();
        }
    }
    
    start() {
        this.isRunning = true;
        this.startTime = Date.now() - this.milliseconds;
        this.lapStartTime = this.milliseconds;
        
        this.interval = setInterval(() => {
            this.milliseconds = Date.now() - this.startTime;
            this.updateDisplay();
            this.updateProgressRing();
        }, 10);
        
        // Update UI
        this.playIcon.style.display = 'none';
        this.pauseIcon.style.display = 'block';
        this.startStopText.textContent = 'Pause';
        this.resetBtn.disabled = true;
        this.lapBtn.disabled = false;
        this.stopwatchCard.classList.add('running');
        
        // Add haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    stop() {
        this.isRunning = false;
        clearInterval(this.interval);
        
        // Update UI
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.startStopText.textContent = 'Resume';
        this.resetBtn.disabled = false;
        this.stopwatchCard.classList.remove('running');
        
        // Add haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    reset() {
        this.isRunning = false;
        this.milliseconds = 0;
        clearInterval(this.interval);
        
        this.updateDisplay();
        this.updateProgressRing();
        
        // Update UI
        this.playIcon.style.display = 'block';
        this.pauseIcon.style.display = 'none';
        this.startStopText.textContent = 'Start';
        this.resetBtn.disabled = true;
        this.lapBtn.disabled = true;
        this.stopwatchCard.classList.remove('running');
        
        // Clear laps
        this.clearLaps();
    }
    
    recordLap() {
        if (!this.isRunning) return;
        
        const lapTime = this.milliseconds - this.lapStartTime;
        this.laps.push({
            number: this.laps.length + 1,
            time: lapTime,
            totalTime: this.milliseconds
        });
        
        this.lapStartTime = this.milliseconds;
        
        this.displayLaps();
        this.updateStats();
        
        // Show laps section with animation
        if (this.lapsSection.style.display === 'none') {
            this.lapsSection.style.display = 'block';
        }
        
        // Add haptic feedback (if available)
        if (navigator.vibrate) {
            navigator.vibrate([30, 20, 30]);
        }
    }
    
    displayLaps() {
        this.lapsList.innerHTML = '';
        
        // Get fastest and slowest lap times
        const lapTimes = this.laps.map(lap => lap.time);
        const fastest = Math.min(...lapTimes);
        const slowest = Math.max(...lapTimes);
        
        // Display laps in reverse order (newest first)
        [...this.laps].reverse().forEach(lap => {
            const lapItem = document.createElement('div');
            lapItem.className = 'lap-item';
            
            // Add fastest/slowest classes
            if (this.laps.length > 1) {
                if (lap.time === fastest) {
                    lapItem.classList.add('fastest');
                } else if (lap.time === slowest) {
                    lapItem.classList.add('slowest');
                }
            }
            
            lapItem.innerHTML = `
                <span class="lap-number">Lap ${lap.number}</span>
                <span class="lap-time">${this.formatTime(lap.time)}</span>
                ${lap.time === fastest && this.laps.length > 1 
                    ? '<span class="lap-badge fastest">Fastest</span>' 
                    : lap.time === slowest && this.laps.length > 1 
                        ? '<span class="lap-badge slowest">Slowest</span>' 
                        : ''}
            `;
            
            this.lapsList.appendChild(lapItem);
        });
    }
    
    clearLaps() {
        this.laps = [];
        this.lapsList.innerHTML = '';
        this.lapsSection.style.display = 'none';
        this.lapStartTime = this.milliseconds;
        this.updateStats();
    }
    
    updateStats() {
        if (this.laps.length === 0) {
            this.fastestLapDisplay.textContent = '--:--:--';
            this.slowestLapDisplay.textContent = '--:--:--';
            this.averageLapDisplay.textContent = '--:--:--';
            return;
        }
        
        const lapTimes = this.laps.map(lap => lap.time);
        const fastest = Math.min(...lapTimes);
        const slowest = Math.max(...lapTimes);
        const average = lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length;
        
        this.fastestLapDisplay.textContent = this.formatTime(fastest);
        this.slowestLapDisplay.textContent = this.formatTime(slowest);
        this.averageLapDisplay.textContent = this.formatTime(average);
    }
    
    updateDisplay() {
        const time = this.getTimeComponents(this.milliseconds);
        
        this.hoursDisplay.textContent = this.pad(time.hours, 2);
        this.minutesDisplay.textContent = this.pad(time.minutes, 2);
        this.secondsDisplay.textContent = this.pad(time.seconds, 2);
        this.millisecondsDisplay.textContent = this.pad(time.milliseconds, 3);
    }
    
    updateProgressRing() {
        // Animate the progress ring based on seconds (60-second cycle)
        const seconds = Math.floor(this.milliseconds / 1000) % 60;
        const circumference = 2 * Math.PI * 190;
        const offset = circumference - (seconds / 60) * circumference;
        
        this.progressCircle.style.strokeDashoffset = offset;
    }
    
    getTimeComponents(ms) {
        const hours = Math.floor(ms / 3600000);
        const minutes = Math.floor((ms % 3600000) / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor((ms % 1000));
        
        return { hours, minutes, seconds, milliseconds };
    }
    
    formatTime(ms) {
        const time = this.getTimeComponents(ms);
        return `${this.pad(time.hours, 2)}:${this.pad(time.minutes, 2)}:${this.pad(time.seconds, 2)}.${this.pad(time.milliseconds, 3)}`;
    }
    
    pad(number, length) {
        return String(number).padStart(length, '0');
    }
}

// Initialize the stopwatch when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const stopwatch = new Stopwatch();
    
    // Add welcome animation
    setTimeout(() => {
        document.querySelector('.stopwatch-card').style.opacity = '1';
        document.querySelector('.stopwatch-card').style.transform = 'translateY(0)';
    }, 100);
    
    // Add keyboard shortcut info
    console.log('%c⏱️ Stopwatch Keyboard Shortcuts', 'font-size: 16px; font-weight: bold; color: #6366f1;');
    console.log('%cSpace: Start/Stop', 'color: #8b5cf6;');
    console.log('%cR: Reset (when stopped)', 'color: #8b5cf6;');
    console.log('%cL: Record Lap (when running)', 'color: #8b5cf6;');
});

// Add initial card animation
const style = document.createElement('style');
style.textContent = `
    .stopwatch-card {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
`;
document.head.appendChild(style);
