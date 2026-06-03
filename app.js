// Brewing method presets
const METHODS = {
  pourover: {
    name: "Pour Over",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M5 5h14l-5 7H10z" />' +        // cone dripper
      '<path d="M12 12v3" />' +                 // drip stream
      '<path d="M7 17h10l-1.5 4h-7z" />' +      // carafe
      '</svg>',
    grind: "Medium-fine",
    temp: 94,
    brewSeconds: 180,
    steps: [
      "Rinse the filter with hot water and discard the rinse water.",
      "Add ground coffee and gently level the bed.",
      "Pour just enough water to saturate the grounds. Wait 30s for the bloom.",
      "Pour in slow spirals, keeping the water level steady.",
      "Let it drain fully, then serve.",
    ],
  },
  frenchpress: {
    name: "French Press",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 2v3" />' +                  // plunger rod
      '<rect x="8" y="5" width="8" height="2" rx="1" />' + // knob/lid
      '<path d="M8 8h8v11a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2z" />' + // carafe body
      '<path d="M16 11h2v4h-2" />' +            // handle
      '<path d="M8 13h8" />' +                  // plunger disk line
      '</svg>',
    grind: "Coarse",
    temp: 93,
    brewSeconds: 240,
    steps: [
      "Add coarse grounds to the press.",
      "Pour hot water, saturating all grounds. Stir gently.",
      "Place the lid on, plunger up. Steep for 4 minutes.",
      "Press the plunger down slowly and evenly.",
      "Pour immediately to avoid over-extraction.",
    ],
  },
  espresso: {
    name: "Espresso",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M8 3c0 1-1 1.5-1 2.5M12 3c0 1-1 1.5-1 2.5" />' + // steam
      '<path d="M4 9h13v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />' + // cup
      '<path d="M17 10h2a2 2 0 0 1 0 4h-2" />' + // handle
      '<path d="M5 20h12" />' +                 // saucer
      '</svg>',
    grind: "Fine",
    temp: 93,
    brewSeconds: 30,
    steps: [
      "Grind fine and dose into the portafilter.",
      "Distribute evenly and tamp level with firm pressure.",
      "Lock in the portafilter and start the shot.",
      "Aim for the target yield in about 25–30 seconds.",
      "Stop the shot and enjoy.",
    ],
  },
  aeropress: {
    name: "AeroPress",
    icon:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M9 2h6" />' +                   // plunger top
      '<path d="M12 2v4" />' +                  // plunger rod
      '<path d="M8 6h8" />' +                   // plunger cap
      '<path d="M8 9h8l-1 9a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z" />' + // chamber
      '<path d="M9 20h6" />' +                  // filter cap
      '</svg>',
    grind: "Medium-fine",
    temp: 85,
    brewSeconds: 90,
    steps: [
      "Insert a rinsed filter and add the grounds.",
      "Pour water and stir for 10 seconds.",
      "Insert the plunger slightly to create a seal. Steep 1 minute.",
      "Press down slowly over 30 seconds.",
      "Stop when you hear a hiss. Dilute to taste.",
    ],
  },
};

let currentMethod = "pourover";

// --- Render methods ---
const methodsEl = document.getElementById("methods");
function renderMethods() {
  methodsEl.innerHTML = "";
  Object.entries(METHODS).forEach(([key, m]) => {
    const div = document.createElement("div");
    div.className = "method" + (key === currentMethod ? " active" : "");
    div.innerHTML = `<span class="method-icon">${m.icon}</span><span class="method-name">${m.name}</span>`;
    div.addEventListener("click", () => {
      currentMethod = key;
      renderMethods();
      update();
    });
    methodsEl.appendChild(div);
  });
}

// --- Calculator ---
const cupsEl = document.getElementById("cups");
const cupSizeEl = document.getElementById("cupSize");
const ratioEl = document.getElementById("ratio");
const ratioBeans = document.getElementById("ratioBeans");
const waterOut = document.getElementById("waterOut");
const coffeeOut = document.getElementById("coffeeOut");
const grindOut = document.getElementById("grindOut");
const tempOut = document.getElementById("tempOut");
const stepsEl = document.getElementById("steps");
const timerTarget = document.getElementById("timerTarget");

// Strength descriptor + bean meter for the 13–18 ratio range
// Bean meter for the 13–18 ratio range
function updateStrength(ratio) {
  const min = Number(ratioEl.min);
  const max = Number(ratioEl.max);
  const beanCount = max - min + 1; // one bean per ratio step
  // Lower ratio = stronger coffee = more lit beans
  const lit = max - ratio + 1;

  if (ratioBeans.children.length !== beanCount) {
    ratioBeans.innerHTML = "";
    for (let i = 0; i < beanCount; i++) {
      const span = document.createElement("span");
      span.className = "ratio-bean";
      span.innerHTML = beanSVG();
      ratioBeans.appendChild(span);
    }
  }
  Array.from(ratioBeans.children).forEach((bean, i) => {
    bean.classList.toggle("on", i < lit);
  });
}

// Inline SVG of a roasted coffee bean (oval with a curved center crease)
function beanSVG() {
  return (
    '<svg viewBox="0 0 24 24" width="22" height="22" xmlns="http://www.w3.org/2000/svg">' +
    '<g transform="rotate(35 12 12)">' +
    '<ellipse cx="12" cy="12" rx="6" ry="9.5" fill="currentColor" />' +
    '<path d="M12 3 C9 8 15 16 12 21" stroke="rgba(0,0,0,0.45)" stroke-width="1.4" fill="none" stroke-linecap="round" />' +
    '</g></svg>'
  );
}

function update() {
  const method = METHODS[currentMethod];
  const cups = Math.max(1, Number(cupsEl.value) || 1);
  const cupSize = Math.max(60, Number(cupSizeEl.value) || 240);
  // Slider runs Mild (left) → Strong (right). Invert so right = lower ratio = stronger.
  const ratio = Number(ratioEl.min) + Number(ratioEl.max) - Number(ratioEl.value);

  const water = cups * cupSize;
  const coffee = Math.round(water / ratio);

  waterOut.textContent = water;
  coffeeOut.textContent = coffee;
  updateStrength(ratio);
  grindOut.textContent = method.grind;
  tempOut.textContent = method.temp + "°C";

  // Steps
  stepsEl.innerHTML = "";
  method.steps.forEach((s) => {
    const li = document.createElement("li");
    li.textContent = s;
    stepsEl.appendChild(li);
  });

  // Timer target
  targetSeconds = method.brewSeconds;
  timerTarget.textContent = `Target brew time: ${formatTime(targetSeconds)}`;
  resetTimer();
}

[cupsEl, cupSizeEl, ratioEl].forEach((el) =>
  el.addEventListener("input", update)
);

// --- Timer ---
const timerDisplay = document.getElementById("timerDisplay");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

let seconds = 0;
let targetSeconds = 180;
let intervalId = null;

function formatTime(total) {
  const m = String(Math.floor(total / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function tick() {
  seconds++;
  timerDisplay.textContent = formatTime(seconds);
  if (seconds >= targetSeconds) {
    stopTimer();
    timerDisplay.textContent = formatTime(targetSeconds);
    timerTarget.textContent = "Done! Your coffee is ready ☕";
  }
}

function startTimer() {
  if (intervalId) {
    stopTimer();
    return;
  }
  intervalId = setInterval(tick, 1000);
  startBtn.textContent = "Pause";
}

function stopTimer() {
  clearInterval(intervalId);
  intervalId = null;
  startBtn.textContent = "Start";
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  timerDisplay.textContent = formatTime(0);
}

startBtn.addEventListener("click", startTimer);
resetBtn.addEventListener("click", () => {
  resetTimer();
  timerTarget.textContent = `Target brew time: ${formatTime(targetSeconds)}`;
});

// Init
renderMethods();
update();
