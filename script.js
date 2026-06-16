const form = document.querySelector("#meetingForm");
const resetButton = document.querySelector("#resetButton");
const timerToggle = document.querySelector("#timerToggle");
const timerReset = document.querySelector("#timerReset");
const outputs = document.querySelectorAll("[data-output]");

const defaultValues = {
  attendees: 5,
  duration: 60,
  salary: 55000,
  currency: "EUR",
  hoursPerWeek: 40,
  weeksPerYear: 47,
  frequency: "once",
  overhead: "1.3"
};

const frequencyLabels = {
  once: "einmalig",
  daily: "täglich",
  weekly: "wöchentlich",
  biweekly: "alle 2 Wochen",
  monthly: "monatlich"
};

const alternatives = [
  { label: "Automatisierungs-Minuten", price: 2.5 },
  { label: "Espresso-Doppelte für das Team", price: 3.2 },
  { label: "Stunden fokussierte Projektarbeit", price: 95 },
  { label: "Monate Cloud-Tool-Lizenz", price: 18 }
];

let timer = {
  running: false,
  startedAt: 0,
  elapsedBeforeStart: 0,
  intervalId: null,
  hourlyBurnRate: 0,
  currency: "EUR"
};

function numberValue(id, fallback = 0) {
  const value = Number(document.querySelector(`#${id}`).value);
  return Number.isFinite(value) ? Math.max(value, 0) : fallback;
}

function selectedValue(name) {
  const checked = form.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : defaultValues[name];
}

function getState() {
  return {
    attendees: Math.max(1, Math.round(numberValue("attendees", defaultValues.attendees))),
    duration: Math.max(1, numberValue("duration", defaultValues.duration)),
    salary: numberValue("salary", defaultValues.salary),
    currency: document.querySelector("#currency").value,
    hoursPerWeek: Math.max(1, numberValue("hoursPerWeek", defaultValues.hoursPerWeek)),
    weeksPerYear: Math.min(52, Math.max(1, numberValue("weeksPerYear", defaultValues.weeksPerYear))),
    frequency: selectedValue("frequency"),
    overhead: Number(selectedValue("overhead"))
  };
}

function occurrencesPerYear(state) {
  const map = {
    once: 1,
    daily: state.weeksPerYear * 5,
    weekly: state.weeksPerYear,
    biweekly: state.weeksPerYear / 2,
    monthly: 12
  };

  return map[state.frequency] || 1;
}

function calculate(state) {
  const workHoursYear = state.hoursPerWeek * state.weeksPerYear;
  const hourlyRate = workHoursYear > 0 ? (state.salary / workHoursYear) * state.overhead : 0;
  const durationHours = state.duration / 60;
  const personHours = state.attendees * durationHours;
  const meetingCost = state.attendees * hourlyRate * durationHours;
  const costPerMinute = state.duration > 0 ? meetingCost / state.duration : 0;
  const occurrences = occurrencesPerYear(state);
  const yearlyCost = meetingCost * occurrences;
  const yearlyPersonHours = personHours * occurrences;

  return {
    workHoursYear,
    hourlyRate,
    durationHours,
    personHours,
    meetingCost,
    costPerMinute,
    occurrences,
    yearlyCost,
    yearlyPersonHours
  };
}

function money(value, currency, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    maximumFractionDigits
  }).format(value);
}

function number(value, maximumFractionDigits = 1) {
  return new Intl.NumberFormat("de-DE", {
    maximumFractionDigits
  }).format(value);
}

function setOutput(name, value) {
  outputs.forEach((element) => {
    if (element.dataset.output === name) {
      if (element.tagName === "SPAN" && name === "impactBar") {
        element.style.width = value;
      } else {
        element.textContent = value;
      }
    }
  });
}

function impactMessage(cost, currency) {
  if (cost < 100) {
    return `Kleiner Termin, trotzdem sichtbar: ${money(cost, currency)} für eine einzelne Abstimmung.`;
  }

  if (cost < 500) {
    return `Spürbarer Aufwand: ${money(cost, currency)} sollten ein klares Ergebnis erzeugen.`;
  }

  return `Budgetrelevanter Termin: ${money(cost, currency)} brauchen eine sehr klare Agenda.`;
}

function renderAlternatives(meetingCost, currency) {
  const list = document.querySelector("[data-output='alternatives']");
  list.innerHTML = "";

  alternatives.forEach((item) => {
    const count = item.price > 0 ? Math.floor(meetingCost / item.price) : 0;
    const article = document.createElement("article");
    article.className = "alternative-item";
    article.innerHTML = `<strong>${number(count, 0)}</strong><span>${item.label} à ca. ${money(item.price, currency, 2)}</span>`;
    list.append(article);
  });
}

function render() {
  const state = getState();
  const result = calculate(state);
  const impactWidth = `${Math.min(100, Math.max(4, result.meetingCost / 15))}%`;

  setOutput("meetingCost", money(result.meetingCost, state.currency));
  setOutput("hourlyRate", money(result.hourlyRate, state.currency));
  setOutput("costPerMinute", money(result.costPerMinute, state.currency, 2));
  setOutput("costPerMinuteDetail", money(result.costPerMinute, state.currency, 2));
  setOutput("personHours", `${number(result.personHours)} h`);
  setOutput("yearlyCost", money(result.yearlyCost, state.currency));
  setOutput("yearlyHours", `${number(result.yearlyPersonHours)} h`);
  setOutput("yearlyPersonHours", `${number(result.yearlyPersonHours)} h`);
  setOutput("workHoursYear", `${number(result.workHoursYear, 0)} h`);
  setOutput("occurrences", `${number(result.occurrences, 1)} (${frequencyLabels[state.frequency]})`);
  setOutput("impactBar", impactWidth);
  setOutput("impactText", impactMessage(result.meetingCost, state.currency));
  renderAlternatives(result.meetingCost, state.currency);

  if (!timer.running) {
    timer.hourlyBurnRate = state.attendees * result.hourlyRate;
    timer.currency = state.currency;
    renderTimer();
  }
}

function elapsedMilliseconds() {
  if (!timer.running) {
    return timer.elapsedBeforeStart;
  }

  return timer.elapsedBeforeStart + Date.now() - timer.startedAt;
}

function formatTimer(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderTimer() {
  const elapsed = elapsedMilliseconds();
  const elapsedHours = elapsed / 1000 / 60 / 60;
  const cost = timer.hourlyBurnRate * elapsedHours;
  setOutput("timerCost", money(cost, timer.currency, 2));
  setOutput("timerTime", formatTimer(elapsed));
}

function startTimer() {
  const state = getState();
  const result = calculate(state);
  timer.running = true;
  timer.startedAt = Date.now();
  timer.hourlyBurnRate = state.attendees * result.hourlyRate;
  timer.currency = state.currency;
  timer.intervalId = window.setInterval(renderTimer, 250);
  timerToggle.textContent = "Ticker stoppen";
  renderTimer();
}

function stopTimer() {
  timer.elapsedBeforeStart = elapsedMilliseconds();
  timer.running = false;
  window.clearInterval(timer.intervalId);
  timer.intervalId = null;
  timerToggle.textContent = "Live-Ticker starten";
  renderTimer();
}

function resetTimer() {
  window.clearInterval(timer.intervalId);
  timer.running = false;
  timer.startedAt = 0;
  timer.elapsedBeforeStart = 0;
  timer.intervalId = null;
  timerToggle.textContent = "Live-Ticker starten";
  render();
}

function resetForm() {
  document.querySelector("#attendees").value = defaultValues.attendees;
  document.querySelector("#duration").value = defaultValues.duration;
  document.querySelector("#salary").value = defaultValues.salary;
  document.querySelector("#currency").value = defaultValues.currency;
  document.querySelector("#hoursPerWeek").value = defaultValues.hoursPerWeek;
  document.querySelector("#weeksPerYear").value = defaultValues.weeksPerYear;
  form.querySelector(`input[name="frequency"][value="${defaultValues.frequency}"]`).checked = true;
  form.querySelector(`input[name="overhead"][value="${defaultValues.overhead}"]`).checked = true;
  resetTimer();
}

form.addEventListener("input", render);
form.addEventListener("change", render);
resetButton.addEventListener("click", resetForm);
timerToggle.addEventListener("click", () => {
  if (timer.running) {
    stopTimer();
  } else {
    startTimer();
  }
});
timerReset.addEventListener("click", resetTimer);

document.querySelector("#year").textContent = new Date().getFullYear();
render();
