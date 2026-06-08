// HAMBURGER
const ham = document.getElementById("hamburger");
const mobileNav = document.getElementById("mobile-nav");
ham.addEventListener("click", () => {
  ham.classList.toggle("open");
  mobileNav.classList.toggle("open");
});
function closeMobile() {
  ham.classList.remove("open");
  mobileNav.classList.remove("open");
}

// SCROLL REVEAL COM DELAY EM CASCATA
const revealItems = document.querySelectorAll(".reveal");

revealItems.forEach((el, index) => {
  const delay = Math.min((index % 6) * 90, 450);
  el.style.setProperty("--delay", `${delay}ms`);
});

const obs = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.14,
    rootMargin: "0px 0px -60px 0px",
  },
);

revealItems.forEach((el) => obs.observe(el));

// SIMULAÇÃO INTERATIVA DO SENSOR
const simSmoke = document.getElementById("simSmoke");
const simStage = document.getElementById("simStage");
const simSensor = document.getElementById("simSensor");
const simLed = document.getElementById("simLed");
const simStatus = document.getElementById("simStatus");
const simAmbient = document.getElementById("simAmbient");
const simLevelName = document.getElementById("simLevelName");
const simMeterFill = document.getElementById("simMeterFill");

let simDragging = false;
let simOffsetX = 0;
let simOffsetY = 0;
let simBeepAllowed = true;

if (simSmoke && simStage && simSensor) {
  simSmoke.addEventListener("mousedown", startSimDrag);
  document.addEventListener("mouseup", stopSimDrag);
  document.addEventListener("mousemove", moveSimSmoke);

  simSmoke.addEventListener("touchstart", startSimDrag, {
    passive: false,
  });
  document.addEventListener("touchend", stopSimDrag);
  document.addEventListener("touchmove", moveSimSmoke, {
    passive: false,
  });
}

function getSimPointer(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }

  return {
    x: e.clientX,
    y: e.clientY,
  };
}

function startSimDrag(e) {
  e.preventDefault();
  simDragging = true;

  const pointer = getSimPointer(e);
  const smokeRect = simSmoke.getBoundingClientRect();

  simOffsetX = pointer.x - smokeRect.left;
  simOffsetY = pointer.y - smokeRect.top;
}

function stopSimDrag() {
  simDragging = false;
}

function moveSimSmoke(e) {
  if (!simDragging) return;
  e.preventDefault();

  const pointer = getSimPointer(e);
  const stageRect = simStage.getBoundingClientRect();

  let x = pointer.x - stageRect.left - simOffsetX;
  let y = pointer.y - stageRect.top - simOffsetY;

  x = Math.max(0, Math.min(x, simStage.offsetWidth - simSmoke.offsetWidth));
  y = Math.max(0, Math.min(y, simStage.offsetHeight - simSmoke.offsetHeight));

  simSmoke.style.left = x + "px";
  simSmoke.style.top = y + "px";

  checkSimDetection();
}

function checkSimDetection() {
  const smokeRect = simSmoke.getBoundingClientRect();
  const sensorRect = simSensor.getBoundingClientRect();

  const smokeCenterX = smokeRect.left + smokeRect.width / 2;
  const smokeCenterY = smokeRect.top + smokeRect.height / 2;
  const sensorCenterX = sensorRect.left + sensorRect.width / 2;
  const sensorCenterY = sensorRect.top + sensorRect.height / 2;

  const distance = Math.sqrt(
    Math.pow(smokeCenterX - sensorCenterX, 2) +
      Math.pow(smokeCenterY - sensorCenterY, 2),
  );

  if (distance < 90) {
    setSimDanger();
  } else if (distance < 190) {
    setSimAttention();
  } else {
    setSimSafe();
  }
}

function clearSimStates() {
  simSensor.classList.remove("attention", "danger");
  simLed.classList.remove("attention", "danger");
  simStatus.classList.remove("attention", "danger");
  simAmbient.classList.remove("attention", "danger");
}

function setSimSafe() {
  clearSimStates();
  simLevelName.textContent = "Seguro";
  simLevelName.style.color = "var(--green)";
  simMeterFill.style.width = "16%";
  simMeterFill.style.background = "var(--green)";
  simStatus.textContent = "Ambiente seguro. Nenhum gás detectado.";
}

function setSimAttention() {
  clearSimStates();
  simSensor.classList.add("attention");
  simLed.classList.add("attention");
  simStatus.classList.add("attention");
  simAmbient.classList.add("attention");
  simLevelName.textContent = "Atenção";
  simLevelName.style.color = "#d97706";
  simMeterFill.style.width = "58%";
  simMeterFill.style.background = "#f59e0b";
  simStatus.textContent = "⚠️ Atenção: presença de gás próxima ao sensor.";
}

function setSimDanger() {
  clearSimStates();
  simSensor.classList.add("danger");
  simLed.classList.add("danger");
  simStatus.classList.add("danger");
  simAmbient.classList.add("danger");
  simLevelName.textContent = "Perigo";
  simLevelName.style.color = "#ef4444";
  simMeterFill.style.width = "100%";
  simMeterFill.style.background = "#ef4444";
  simStatus.textContent = "🚨 Perigo! Gás detectado diretamente no sensor.";

  if (simBeepAllowed) {
    playSimBeep();
    simBeepAllowed = false;

    setTimeout(() => {
      simBeepAllowed = true;
    }, 750);
  }
}

function playSimBeep() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = 920;
  gainNode.gain.value = 0.075;

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.start();

  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 170);
}

// CONTACT FORM
function submitForm(e) {
  e.preventDefault();
  document.getElementById("contact-form").style.display = "none";
  const s = document.getElementById("form-success");
  s.style.display = "block";
}
