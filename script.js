const form = document.querySelector("#meetingForm");
const resetButton = document.querySelector("#resetButton");
const outputs = document.querySelectorAll("[data-output]");

const defaultValues = {
  attendees: 5,
  duration: 60,
  salary: 55000,
  hoursPerWeek: 40,
  weeksPerYear: 47,
  frequency: "once",
  overhead: "1.3"
};

const frequencyLabels = {
  once: "einmalig",
  daily: "täglich",
  weekly: "wöchentlich",
  biweekly: "14 Tägig",
  monthly: "monatlich"
};

const currency = "EUR";

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

function render() {
  const state = getState();
  const result = calculate(state);
  const impactWidth = `${Math.min(100, Math.max(4, result.meetingCost / 15))}%`;

  setOutput("meetingCost", money(result.meetingCost, currency));
  setOutput("hourlyRate", money(result.hourlyRate, currency));
  setOutput("costPerMinute", money(result.costPerMinute, currency, 2));
  setOutput("costPerMinuteDetail", money(result.costPerMinute, currency, 2));
  setOutput("personHours", `${number(result.personHours)} h`);
  setOutput("yearlyCost", money(result.yearlyCost, currency));
  setOutput("yearlyHours", `${number(result.yearlyPersonHours)} h`);
  setOutput("yearlyPersonHours", `${number(result.yearlyPersonHours)} h`);
  setOutput("workHoursYear", `${number(result.workHoursYear, 0)} h`);
  setOutput("occurrences", `${number(result.occurrences, 1)} (${frequencyLabels[state.frequency]})`);
  setOutput("impactBar", impactWidth);
  setOutput("impactText", impactMessage(result.meetingCost, currency));
}

function resetForm() {
  document.querySelector("#attendees").value = defaultValues.attendees;
  document.querySelector("#duration").value = defaultValues.duration;
  document.querySelector("#salary").value = defaultValues.salary;
  document.querySelector("#hoursPerWeek").value = defaultValues.hoursPerWeek;
  document.querySelector("#weeksPerYear").value = defaultValues.weeksPerYear;
  form.querySelector(`input[name="frequency"][value="${defaultValues.frequency}"]`).checked = true;
  form.querySelector(`input[name="overhead"][value="${defaultValues.overhead}"]`).checked = true;
  render();
}

form.addEventListener("input", render);
form.addEventListener("change", render);
resetButton.addEventListener("click", resetForm);

document.querySelector("#year").textContent = new Date().getFullYear();
render();
