const plans = [
  {id:"push",name:"PUSH DAY",category:"upper",description:"Prsa, ramena a triceps.",duration:"45–60 MIN",mark:"01",exercises:["Bench press","Shoulder press","Lateral raises","Triceps pushdown"]},
  {id:"pull",name:"PULL DAY",category:"upper",description:"Záda, zadní ramena a biceps.",duration:"45–60 MIN",mark:"02",exercises:["Lat pulldown","Seated cable row","Face pulls","Biceps curls"]},
  {id:"legs",name:"LEG DAY",category:"lower",description:"Nohy a střed těla.",duration:"50–65 MIN",mark:"03",exercises:["Squats nebo leg press","Romanian deadlift","Leg curl","Calf raises"]},
  {id:"upper",name:"UPPER BODY",category:"upper",description:"Kompletní trénink horní poloviny.",duration:"45–60 MIN",mark:"04",exercises:["Bench press","Lat pulldown","Shoulder press","Cable row"]},
  {id:"lower",name:"LOWER BODY",category:"lower",description:"Síla nohou a stabilita.",duration:"45–60 MIN",mark:"05",exercises:["Goblet squat","Hip hinge","Split squat","Plank"]},
  {id:"full",name:"FULL BODY",category:"full",description:"Základní pohyby pro celé tělo.",duration:"40–55 MIN",mark:"06",exercises:["Squat variation","Push movement","Pull movement","Core exercise"]}
];
const storageKey = "noirFitnessHistoryV2";
const grid = document.getElementById("workoutGrid");
const toast = document.getElementById("toast");
let activeFilter = "all";
let toastTimer;

function getHistory(){
  try { const data = JSON.parse(localStorage.getItem(storageKey) || "[]"); return Array.isArray(data) ? data : []; }
  catch { return []; }
}
function saveHistory(history){ try { localStorage.setItem(storageKey, JSON.stringify(history)); } catch { showToast("Prohlížeč nedovolil uložit historii."); } }
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>toast.classList.remove("show"),2600);
}
function renderPlans(){
  const visible = plans.filter(p=>activeFilter==="all" || p.category===activeFilter);
  grid.innerHTML = visible.map(plan=>`
    <article class="workout">
      <span class="workout-number">PROGRAM / ${plan.mark}</span><span class="workout-mark">${plan.mark}</span>
      <h3>${plan.name}</h3><p class="workout-description">${plan.description}</p>
      <ul class="exercise-list">${plan.exercises.map(ex=>`<li>${ex}</li>`).join("")}</ul>
      <div class="workout-bottom"><span class="duration">◷ &nbsp;${plan.duration}</span><button class="complete-button" type="button" data-plan="${plan.id}">DOKONČIT ✓</button></div>
    </article>`).join("");
}
function weekStart(timestamp){
  const date = new Date(timestamp); date.setHours(0,0,0,0);
  date.setDate(date.getDate() - ((date.getDay()+6)%7)); return date.getTime();
}
function renderHistory(){
  const history = getHistory();
  const now = Date.now();
  const thisWeek = history.filter(item=>item.timestamp && item.timestamp>=weekStart(now));
  document.getElementById("total").textContent = history.length;
  document.getElementById("weekly").textContent = thisWeek.length;
  document.getElementById("goalCount").textContent = Math.min(thisWeek.length,3);
  document.getElementById("goalBar").style.width = `${Math.min(thisWeek.length/3,1)*100}%`;
  const list = document.getElementById("history");
  if(!history.length){
    list.innerHTML = `<div class="empty-state"><span>✳</span><p>Zatím žádné záznamy.</p><small>Dokonči svůj první trénink a objeví se tady.</small></div>`;
    return;
  }
  list.innerHTML = history.slice(0,12).map((item,index)=>{
    const date = new Date(item.timestamp);
    const dateText = date.toLocaleDateString("cs-CZ",{day:"numeric",month:"short",year:"numeric"});
    const timeText = date.toLocaleTimeString("cs-CZ",{hour:"2-digit",minute:"2-digit"});
    const initials = String(index+1).padStart(2,"0");
    return `<div class="history-item"><div class="history-badge">${initials}</div><div><div class="history-name">${escapeHTML(item.name)}</div><div class="history-date">${dateText}</div></div><div class="history-time">${timeText}</div></div>`;
  }).join("");
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
grid.addEventListener("click",event=>{
  const button = event.target.closest("[data-plan]");
  if(!button)return;
  const plan = plans.find(p=>p.id===button.dataset.plan);
  if(!plan)return;
  const history = getHistory();
  history.unshift({name:plan.name,timestamp:Date.now()});
  saveHistory(history); renderHistory();
  showToast(`Trénink ${plan.name} zaznamenán. Dobrá práce!`);
});
document.querySelectorAll(".filter").forEach(button=>button.addEventListener("click",()=>{
  activeFilter=button.dataset.filter;
  document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===button));
  renderPlans();
}));
document.getElementById("clearHistory").addEventListener("click",()=>{
  const history=getHistory();
  if(!history.length){showToast("Historie je už prázdná.");return;}
  if(confirm("Opravdu chceš vymazat všechny záznamy tréninků?")){saveHistory([]);renderHistory();showToast("Historie byla vymazána.");}
});
renderPlans();renderHistory();
