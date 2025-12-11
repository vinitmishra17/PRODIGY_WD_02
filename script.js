// Stopwatch using performance.now() for accuracy
(function(){
const display = document.getElementById('display');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const lapsList = document.getElementById('lapsList');

let startTime = 0;
let elapsed = 0;
let rafId = null;
let running = false;
let lastLap = 0;
let lapCount = 0;
let startOffset = 0;

function format(ms){
  const total = Math.max(0, ms|0);
  const msPart = total % 1000;
  const s = Math.floor(total / 1000) % 60;
  const m = Math.floor(total / 60000) % 60;
  const h = Math.floor(total / 3600000);
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}.${String(msPart).padStart(3,'0')}`;
}

function elapsedTotal(){
  return (running ? (performance.now() - startTime) : 0) + startOffset;
}

function update(){
  display.textContent = format(elapsedTotal());
  rafId = requestAnimationFrame(update);
}

function start(){
  if(running) return;
  running = true;
  startTime = performance.now();
  rafId = requestAnimationFrame(update);
  startBtn.textContent = "Running";
  startBtn.disabled = true;
  stopBtn.disabled = false;
  resetBtn.disabled = false;
  lapBtn.disabled = false;
}

function stop(){
  if(!running) return;
  running = false;
  cancelAnimationFrame(rafId);
  startOffset = elapsedTotal();
  display.textContent = format(startOffset);
  startBtn.textContent = "Start";
  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;
}

function reset(){
  running = false;
  cancelAnimationFrame(rafId);
  startOffset = 0;
  elapsed = 0;
  lastLap = 0;
  lapCount = 0;
  lapsList.innerHTML = '';
  display.textContent = "00:00:00.000";
  startBtn.disabled = false;
  stopBtn.disabled = true;
  lapBtn.disabled = true;
  resetBtn.disabled = true;
}

function lap(){
  const time = running ? elapsedTotal() : startOffset;
  lapCount += 1;
  const lapTime = time - lastLap;
  lastLap = time;

  const li = document.createElement('li');
  li.innerHTML = `<span>Lap ${lapCount}</span><span>${format(lapTime)}</span>`;
  lapsList.prepend(li);
}

startBtn.addEventListener('click', start);
stopBtn.addEventListener('click', stop);
resetBtn.addEventListener('click', reset);
lapBtn.addEventListener('click', lap);

reset();
})();
