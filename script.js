document.addEventListener("DOMContentLoaded", () => {

const sections = document.querySelectorAll("section");
const contestants = [
  "Edwin Sifuna","Isaac Omondi","Silas Jakakiimba","George Orebo",
  "Hellen Jerusa","Conslate Apiyo","Mark Matunga","Debra Harriet",
  "Berlin Brilliant","Jane Sandra"
];

// Election countdown (24 hours demo)
let electionEnd = new Date().getTime() + 24*60*60*1000;
const countdownEl = document.getElementById("countdown");
let electionActive = true;
function updateCountdown(){
  const now = new Date().getTime();
  const diff = electionEnd - now;
  if(diff <= 0){
    countdownEl.textContent="Election Closed";
    electionActive=false;
    document.getElementById("electionStatus").textContent="Election Status: CLOSED";
  }else{
    const h=Math.floor(diff/1000/3600);
    const m=Math.floor((diff/1000%3600)/60);
    const s=Math.floor(diff/1000%60);
    countdownEl.textContent=`${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  }
}
setInterval(updateCountdown,1000);

// Navigation
function show(id){
  sections.forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  if(id==="vote") resetVoter();
  if(id==="overview") updateOverview();
  if(id==="results") loadCharts();
}

overviewBtn.onclick=()=>show("overview");
voteBtn.onclick=()=>show("vote");
adminBtn.onclick=()=>show("admin");

// Reset voter form
function resetVoter(){
  voterNumber.value="";
  contestant.selectedIndex=0;
}

// Activity log
function logActivity(msg){
  const log=document.getElementById("activityLog");
  const p=document.createElement("p");
  const t=new Date().toLocaleTimeString();
  p.textContent=`[${t}] ${msg}`;
  log.prepend(p);
}

// Voting
submitVoteBtn.onclick=()=>{
  if(!electionActive){ alert("Election is closed"); return; }
  if(!voterNumber.value.trim()||contestant.selectedIndex===0){ alert("Complete all fields"); return; }
  let voted=JSON.parse(localStorage.getItem("voted"))||[];
  if(voted.includes(voterNumber.value.trim())){ alert("Already voted"); return; }
  let votes=JSON.parse(localStorage.getItem("votes"))||{};
  contestants.forEach(c=>votes[c]??=0);
  votes[contestant.value]++;
  voted.push(voterNumber.value.trim());
  localStorage.setItem("votes",JSON.stringify(votes));
  localStorage.setItem("voted",JSON.stringify(voted));
  logActivity(`Voter ${voterNumber.value.trim()} voted for ${contestant.value}`);
  alert("Vote submitted successfully!");
  show("overview");
};

// Admin login
loginBtn.onclick=()=>{
  if(adminUser.value==="ke027400126meshack@gmail.com" &&
     adminPass.value==="274OO126"){
    show("results"); 
    logActivity("Admin logged in");
  }else alert("Invalid credentials");
};

// Reset election
resetBtn.onclick=()=>{
  if(confirm("Reset election?")){
    localStorage.removeItem("votes");
    localStorage.removeItem("voted");
    logActivity("Election reset by admin");
    loadCharts();
    updateOverview();
  }
};

// Update dashboard
function updateOverview(){
  let votes=JSON.parse(localStorage.getItem("votes"))||{};
  totalVotes.textContent=Object.values(votes).reduce((a,b)=>a+b,0);
}

// Load Charts
function loadCharts(){
  const votes=JSON.parse(localStorage.getItem("votes"))||{};
  contestants.forEach(c=>votes[c]??=0);
  const data=contestants.map(c=>votes[c]);

  // Bar chart
  const ctxBar=document.getElementById("barChart").getContext("2d");
  if(window.barChart) window.barChart.destroy();
  window.barChart=new Chart(ctxBar,{
    type:"bar",
    data:{labels:contestants,datasets:[{label:"Votes",data:data,backgroundColor:"#10b981"}]},
    options:{responsive:true,plugins:{legend:{display:false}}}
  });

  // Pie chart
  const ctxPie=document.getElementById("pieChart").getContext("2d");
  if(window.pieChart) window.pieChart.destroy();
  window.pieChart=new Chart(ctxPie,{
    type:"pie",
    data:{labels:contestants,datasets:[{data:data,backgroundColor:[
      "#10b981","#22c55e","#3b82f6","#6366f1","#8b5cf6","#ec4899","#f43f5e","#f97316","#facc15","#a3e635"
    ]}]},
    options:{responsive:true}
  });
}

// Initial dashboard
updateOverview();
updateCountdown();

});
