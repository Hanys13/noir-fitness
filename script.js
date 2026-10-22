const plans = [

  {

    name: "PUSH DAY",

    description: "Prsa, ramena a triceps.",

    exercises: "Bench press · Shoulder press · Lateral raises · Triceps"

  },

  {

    name: "PULL DAY",

    description: "Záda a biceps.",

    exercises: "Lat pulldown · Cable row · Face pulls · Biceps curls"

  },

  {

    name: "LEG DAY",

    description: "Nohy a střed těla.",

    exercises: "Squats · Leg press · Leg curl · Calf raises"

  },

  {

    name: "UPPER BODY",

    description: "Celý vršek těla.",

    exercises: "Bench press · Lat pulldown · Shoulder press · Rows"

  },

  {

    name: "LOWER BODY",

    description: "Nohy a stabilita.",

    exercises: "Squats · Romanian deadlift · Leg press · Leg curl"

  },

  {

    name: "FULL BODY",

    description: "Trénink celého těla.",

    exercises: "Squats · Bench press · Lat pulldown · Plank"

  }

];

const key = "noirFitnessHistory";

function getHistory() {

  try {

    return JSON.parse(localStorage.getItem(key) || "[]");

  } catch {

    return [];

  }

}

function render() {

  const grid = document.getElementById("workoutGrid");

  grid.innerHTML = plans.map((plan, index) => `
<article class="workout">
<p>PROGRAM / 0${index + 1}</p>
<h3>${plan.name}</h3>
<p>${plan.description}</p>
<p>${plan.exercises}</p>
<button data-index="${index}">DOKONČIT TRÉNINK ✓</button>
</article>

  `).join("");

  grid.querySelectorAll("button").forEach(button => {

    button.addEventListener("click", () => {

      const history = getHistory();

      history.unshift({

        name: plans[Number(button.dataset.index)].name,

        date: new Date().toLocaleString("cs-CZ"),

        timestamp: Date.now()

      });

      localStorage.setItem(key, JSON.stringify(history));

      renderHistory();

    });

  });

  renderHistory();

}

function renderHistory() {

  const history = getHistory();

  const start = new Date();

  start.setHours(0, 0, 0, 0);

  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));

  const weekly = history.filter(item =>

    item.timestamp && item.timestamp >= start.getTime()

  );

  document.getElementById("total").textContent = history.length;

  document.getElementById("weekly").textContent = weekly.length;

  document.getElementById("history").innerHTML = history.length

    ? history.slice(0, 15).map(item => `
<div class="history-item">
<strong>${item.name}</strong>
<span>${item.date}</span>
</div>

      `).join("")

    : "Zatím žádné tréninky.";

}

render();
 
