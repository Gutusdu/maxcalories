const KEY = "maxCalories.v1";
const today = () => new Date().toISOString().slice(0,10);
const defaults = {
  profile:{height:190,weight:112,goalWeight:90,age:20,activity:"1.375",goal:"lose",waist:"",targetCalories:2100,targetProtein:200,targetCarbs:220,targetFat:70},
  meals:[], pantry:[], supplements:[], workouts:[], weights:[], preferences:{likes:"",dislikes:"Haferflocken",highProtein:true}
};
let state = loadState();
function loadState(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||"{}")}}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(state));renderAll()}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function num(id){return Number(document.getElementById(id).value)||0}
function val(id,v){const el=document.getElementById(id);if(el)el.value=v??""}
function fmt(n){return Math.round(n||0).toLocaleString("de-DE")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2400)}
function go(page){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id==="page-"+page));document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.page===page));document.getElementById("moreMenu").classList.add("hidden");window.scrollTo({top:0,behavior:"smooth"});if(page==="coach")renderRecipes()}
function totals(){return state.meals.filter(m=>m.date===today()).reduce((a,m)=>{for(const k of ["calories","protein","carbs","fat"])a[k]+=Number(m[k])||0;return a},{calories:0,protein:0,carbs:0,fat:0})}
function progress(now,target){return Math.max(0,Math.min(100,target?now/target*100:0))}
function renderDashboard(){
 const t=totals(),p=state.profile;
 document.getElementById("todayLabel").textContent=new Date().toLocaleDateString("de-DE",{weekday:"long",day:"2-digit",month:"short"}).toUpperCase();
 document.getElementById("caloriesLeft").textContent=fmt(Math.max(0,p.targetCalories-t.calories));
 document.getElementById("caloriePercent").textContent=fmt(progress(t.calories,p.targetCalories))+"% erreicht";
 document.getElementById("calorieBar").style.width=progress(t.calories,p.targetCalories)+"%";
 [["protein",p.targetProtein],["carbs",p.targetCarbs],["fat",p.targetFat]].forEach(([k,g])=>{document.getElementById(k+"Now").textContent=fmt(t[k]);document.getElementById(k+"Goal").textContent=fmt(g);document.getElementById(k+"Bar").style.width=progress(t[k],g)+"%"});
 const list=document.getElementById("mealList"),todayMeals=state.meals.filter(m=>m.date===today());
 list.innerHTML=todayMeals.length?todayMeals.map(m=>mealHTML(m)).join(""):'<div class="meal-item"><div class="item-icon">＋</div><div class="item-main"><b>Noch keine Mahlzeiten</b><small>Füge dein erstes Essen hinzu.</small></div></div>';
}
function mealHTML(m){return `<div class="meal-item" data-delete-meal="${m.id}" title="Zum Löschen antippen"><div class="item-icon">◉</div><div class="item-main"><b>${esc(m.name)}</b><small>${esc(m.meal||"Mahlzeit")} · ${fmt(m.amount)} g/ml · ${fmt(m.protein)} g Protein</small></div><div class="item-cal">${fmt(m.calories)}<small>kcal · löschen</small></div></div>`}
function renderFood(){const list=document.getElementById("foodHistory"),arr=state.meals.filter(m=>m.date===today());list.innerHTML=arr.length?arr.map(mealHTML).join(""):'<p class="muted">Noch keine Mahlzeiten eingetragen.</p>'}
function renderPantry(){document.getElementById("pantryCount").textContent=state.pantry.length+" Artikel";const el=document.getElementById("pantryList");el.innerHTML=state.pantry.length?state.pantry.map((x,i)=>`<button class="pantry-item" data-pantry="${i}"><span>🥗</span><span><b>${esc(x.name)}</b><small>${esc(x.qty||"Antippen zum Entfernen")}</small></span></button>`).join(""):'<p class="muted">Deine Vorratsliste ist noch leer. Füge ein paar Zutaten hinzu.</p>'}
function renderSupp(){const el=document.getElementById("suppList");el.innerHTML=state.supplements.length?state.supplements.map((s,i)=>`<div class="list-item"><input style="width:18px;height:18px;accent-color:var(--lime)" type="checkbox" aria-label="Erledigt"><div class="item-main"><b>${esc(s.name)}</b><small>${esc(s.dose||"Keine Dosierung")} · ${esc(s.time)}${s.note?" · "+esc(s.note):""}</small></div><button class="text-button" data-delete-supp="${i}">Entfernen</button></div>`).join(""):'<p class="muted">Noch keine Supplements eingetragen.</p>'}
function renderWorkouts(){const el=document.getElementById("workoutList");el.innerHTML=state.workouts.length?state.workouts.map((w,i)=>`<div class="list-item"><div class="item-icon">↗</div><div class="item-main"><b>${esc(w.name)}</b><small>${esc(w.focus||"Ganzkörper")} · ${fmt(w.duration)} Minuten</small></div><button class="secondary" data-done-workout="${i}">Erledigt</button><button class="text-button" data-delete-workout="${i}">×</button></div>`).join(""):'<p class="muted">Noch kein Training geplant. Füge dein erstes Workout hinzu.</p>'}
function renderWeights(){const el=document.getElementById("weightHistory");el.innerHTML=state.weights.length?state.weights.slice().reverse().map(w=>`<div class="weight-row"><span>${new Date(w.date+"T12:00:00").toLocaleDateString("de-DE")}</span><b>${Number(w.weight).toLocaleString("de-DE")} kg</b></div>`).join(""):'<p class="muted">Trage dein Gewicht regelmäßig ein, um den Verlauf aufzubauen.</p>'}
function renderBodyInsight(){const p=state.profile,h=Number(p.height)/100,w=Number(p.weight),bmi=h>0?w/(h*h):0;document.getElementById("bodyInsight").textContent=`BMI rechnerisch: ${bmi?bmi.toLocaleString("de-DE",{maximumFractionDigits:1}):"–"}. Das ist nur ein grober Orientierungswert und unterscheidet nicht zwischen Muskel- und Fettmasse. Dein Ziel: ${p.goalWeight} kg.`}
function renderAll(){renderDashboard();renderFood();renderPantry();renderSupp();renderWorkouts();renderWeights();renderBodyInsight()}
function fillProfile(){const p=state.profile;Object.keys(p).forEach(k=>val(k,p[k]));val("likes",state.preferences.likes);val("dislikes",state.preferences.dislikes);document.getElementById("highProtein").checked=!!state.preferences.highProtein}
function addMeal(obj){state.meals.push({id:Date.now()+Math.random(),date:today(),...obj});save();toast("Mahlzeit gespeichert. Stark!")}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.page)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
document.getElementById("moreButton").addEventListener("click",()=>document.getElementById("moreMenu").classList.toggle("hidden"));
document.getElementById("profileShortcut").addEventListener("click",()=>go("body"));
document.getElementById("foodForm").addEventListener("submit",e=>{e.preventDefault();addMeal({name:document.getElementById("foodName").value.trim(),amount:num("foodAmount"),calories:num("foodCalories"),protein:num("foodProtein"),carbs:num("foodCarbs"),fat:num("foodFat"),meal:document.getElementById("foodMeal").value});e.target.reset();val("foodAmount",100);val("foodProtein",0);val("foodCarbs",0);val("foodFat",0)});
document.addEventListener("click",e=>{const m=e.target.closest("[data-delete-meal]");if(m){if(confirm("Diesen Eintrag löschen?")){state.meals=state.meals.filter(x=>String(x.id)!==m.dataset.deleteMeal);save()}}const p=e.target.closest("[data-pantry]");if(p){const x=state.pantry[Number(p.dataset.pantry)];if(confirm(`„${x.name}“ aus den Vorräten entfernen?`)){state.pantry.splice(Number(p.dataset.pantry),1);save()}}const s=e.target.closest("[data-delete-supp]");if(s){state.supplements.splice(Number(s.dataset.deleteSupp),1);save()}const d=e.target.closest("[data-delete-workout]");if(d){state.workouts.splice(Number(d.dataset.deleteWorkout),1);save()}const done=e.target.closest("[data-done-workout]");if(done)toast("Workout abgehakt – gute Arbeit!")});
document.getElementById("pantryForm").addEventListener("submit",e=>{e.preventDefault();state.pantry.push({name:document.getElementById("pantryName").value.trim(),qty:document.getElementById("pantryQty").value.trim()});e.target.reset();save();toast("Vorrat hinzugefügt")});
document.getElementById("suppForm").addEventListener("submit",e=>{e.preventDefault();state.supplements.push({name:document.getElementById("suppName").value.trim(),dose:document.getElementById("suppDose").value.trim(),time:document.getElementById("suppTime").value,note:document.getElementById("suppNote").value.trim()});e.target.reset();save();toast("Supplement gespeichert")});
document.getElementById("workoutForm").addEventListener("submit",e=>{e.preventDefault();state.workouts.push({name:document.getElementById("workoutName").value.trim(),focus:document.getElementById("workoutFocus").value.trim(),duration:num("workoutDuration")});e.target.reset();val("workoutDuration",30);save();toast("Workout hinzugefügt")});
document.getElementById("bodyForm").addEventListener("submit",e=>{e.preventDefault();const p={};["height","weight","goalWeight","age","activity","goal","waist","targetCalories","targetProtein","targetCarbs","targetFat"].forEach(k=>p[k]=document.getElementById(k).value);state.profile=p;save();toast("Körperprofil gespeichert")});
document.getElementById("weightForm").addEventListener("submit",e=>{e.preventDefault();const weight=num("newWeight");state.profile.weight=weight;state.weights.push({date:today(),weight});val("weight",weight);val("newWeight","");save();toast("Gewicht eingetragen")});
document.getElementById("savePrefs").addEventListener("click",()=>{state.preferences={likes:document.getElementById("likes").value,dislikes:document.getElementById("dislikes").value,highProtein:document.getElementById("highProtein").checked};save();renderRecipes();toast("Vorlieben gespeichert")});
const recipes=[
 {name:"Protein-Wraps aus deiner Küche",ingredients:["wrap","puten","hähn","huhn","salat","skyr","quark"],base:["Wraps","Putenhack oder Hähnchen","Salat","Skyr-Sauce"],cal:480,protein:42,carbs:44,fat:13,desc:"Fülle einen Wrap mit gebratener Proteinquelle, knackigem Gemüse und einer würzigen Skyr-Sauce."},
 {name:"Herzhafte Eier-Bowl",ingredients:["ei","eier","kartoffel","tomate","spinat"],base:["Eier","Kartoffeln","Tomaten oder Spinat"],cal:390,protein:25,carbs:35,fat:15,desc:"Kartoffeln anbraten, Eier dazugeben und mit Gemüse würzen. Schnell, sättigend und flexibel."},
 {name:"Skyr-Protein-Bowl",ingredients:["skyr","quark","joghurt","beere","banane","protein"],base:["Skyr oder Magerquark","Obst nach Wahl","Optional Proteinpulver"],cal:320,protein:38,carbs:30,fat:3,desc:"Skyr oder Quark mit Obst verrühren. Bei Bedarf mit Proteinpulver ergänzen."},
 {name:"Pasta mit Protein-Tomatensauce",ingredients:["nudel","pasta","tomate","hack","pute","linsen"],base:["Nudeln","Tomatensauce","Putenhack oder Linsen"],cal:540,protein:38,carbs:66,fat:12,desc:"Bereite eine Tomatensauce mit Putenhack oder Linsen zu und serviere sie mit Nudeln."},
 {name:"Knusprige Kartoffel-Hähnchen-Pfanne",ingredients:["kartoffel","hähn","huhn","pute","brokkoli","gemüse"],base:["Kartoffeln","Hähnchen oder Pute","Gemüse"],cal:460,protein:43,carbs:42,fat:10,desc:"Kartoffeln würfeln, Proteinquelle durchgaren und mit Gemüse in der Pfanne fertig garen."},
 {name:"Protein-Burger-Teller",ingredients:["burger","hack","pute","salat","brot","käse"],base:["Burger-Patty","Brötchen oder Kartoffeln","Salat"],cal:520,protein:40,carbs:48,fat:17,desc:"Würze ein mageres Patty kräftig und serviere es mit Salat und einer passenden Beilage."}
];
function renderRecipes(){const pantry=state.pantry.map(x=>x.name.toLowerCase()).join(" "),likes=(state.preferences.likes||"").toLowerCase(),dislikes=(state.preferences.dislikes||"").toLowerCase().split(",").map(x=>x.trim()).filter(Boolean),t=totals(),left=Math.max(0,state.profile.targetCalories-t.calories);let scored=recipes.map(r=>{let score=r.ingredients.reduce((n,k)=>n+(pantry.includes(k)?2:0),0);if(likes&&likes.split(",").some(x=>x.trim()&&r.name.toLowerCase().includes(x.trim())))score+=3;if(state.preferences.highProtein)score+=r.protein/20;if(dislikes.some(x=>x&&[r.name,...r.base].join(" ").toLowerCase().includes(x)))score-=10;if(pantry&&r.ingredients.some(k=>pantry.includes(k)))score+=2;return {...r,score}}).sort((a,b)=>b.score-a.score);const el=document.getElementById("recipeList");el.innerHTML=scored.slice(0,4).map((r,i)=>`<article class="recipe-card"><div class="recipe-top"><b>${esc(r.name)}</b><span class="pill">${r.cal} kcal</span></div><p>${esc(r.desc)}</p><div class="recipe-macros"><span>${r.protein} g Protein</span><span>${r.carbs} g KH</span><span>${r.fat} g Fett</span></div><p><b>Du brauchst:</b> ${esc(r.base.join(", "))}. ${pantry? (r.ingredients.some(k=>pantry.includes(k))?"Einige passende Vorräte erkannt.":"Prüfe, was du noch einkaufen musst."):"Trage zuerst deine Vorräte ein, damit die Vorschläge besser passen."}</p><button class="secondary" data-recipe="${i}">Als gegessen eintragen</button></article>`).join("")+`<p class="muted small">Noch etwa ${fmt(left)} kcal für heute. Rezeptwerte sind grobe Beispielwerte und hängen von Zutaten und Portionsgrößen ab.</p>`;el.querySelectorAll("[data-recipe]").forEach((b,i)=>b.addEventListener("click",()=>{const r=scored[i];addMeal({name:r.name,amount:1,calories:r.cal,protein:r.protein,carbs:r.carbs,fat:r.fat,meal:"Mahlzeit"});go("dashboard")}))}
document.getElementById("scanForm").addEventListener("submit",e=>{e.preventDefault();if(!document.getElementById("scanName").value.trim()){toast("Bitte Produktnamen eintragen");return}addMeal({name:document.getElementById("scanName").value.trim(),amount:num("scanAmount")||100,calories:num("scanCalories"),protein:num("scanProtein"),carbs:num("scanCarbs"),fat:num("scanFat"),meal:"Gescannt"});go("dashboard")});
document.getElementById("labelImage").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;const preview=document.getElementById("labelPreview"),status=document.getElementById("scanStatus");preview.src=URL.createObjectURL(file);preview.classList.remove("hidden");status.textContent="Bild geladen. OCR wird vorbereitet …";try{if(!window.Tesseract){await new Promise((resolve,reject)=>{const s=document.createElement("script");s.src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js";s.onload=resolve;s.onerror=reject;document.head.appendChild(s)})}status.textContent="Nährwerttabelle wird gelesen …";const result=await Tesseract.recognize(file,"deu+eng");const text=result.data.text;status.textContent="Erkannter Text – Werte bitte kontrollieren: "+text.replace(/\s+/g," ").slice(0,450);const patterns=[["scanCalories",/(?:energie|energy|kcal)[^\d]{0,18}(\d{2,4})/i],["scanProtein",/(?:eiweiß|protein)[^\d]{0,18}(\d{1,3}(?:[.,]\d)?)/i],["scanCarbs",/(?:kohlenhydrate|carbohydrate)[^\d]{0,18}(\d{1,3}(?:[.,]\d)?)/i],["scanFat",/(?:fett|fat)[^\d]{0,18}(\d{1,3}(?:[.,]\d)?)/i]];patterns.forEach(([id,re])=>{const m=text.match(re);if(m)val(id,m[1].replace(",","."))});toast("Scan fertig – bitte Werte abgleichen")}catch(err){status.textContent="Automatische Texterkennung konnte nicht geladen werden. Du kannst die Werte unten manuell eintragen. Prüfe die Internetverbindung.";toast("OCR nicht verfügbar – manuell eintragen")}});

document.getElementById("exportData").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="max-calories-backup.json";a.click();URL.revokeObjectURL(url);toast("Export vorbereitet")});
document.getElementById("resetData").addEventListener("click",()=>{if(confirm("Wirklich alle MAX Calories Daten auf diesem Gerät löschen?")){localStorage.removeItem(KEY);state=structuredClone(defaults);fillProfile();save();toast("Lokale Daten gelöscht")}});
fillProfile();if(!state.weights.length&&state.profile.weight)state.weights.push({date:today(),weight:Number(state.profile.weight)});renderAll();
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});


// Free Open Food Facts lookup + native BarcodeDetector where supported.
let barcodeStream = null;
async function lookupBarcode(code) {
  const status = document.getElementById("barcodeStatus");
  const clean = String(code || "").replace(/\D/g, "");
  if (!clean) { status.textContent = "Bitte einen gültigen Barcode eingeben."; return; }
  status.textContent = "Produkt wird in Open Food Facts gesucht …";
  try {
    const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(clean)}.json`);
    if (!response.ok) throw new Error("Netzwerkfehler");
    const data = await response.json();
    if (data.status !== 1 || !data.product) {
      status.textContent = "Produkt nicht gefunden. Du kannst die Nährwerte unten manuell eintragen oder das Etikett fotografieren.";
      toast("Kein Produkt gefunden");
      return;
    }
    const p = data.product, n = p.nutriments || {};
    const per = n["energy-kcal_100g"] ?? (n["energy-kcal_value"] || 0);
    val("scanName", p.product_name_de || p.product_name || p.abbreviated_product_name || "");
    val("scanAmount", 100);
    val("scanCalories", Math.round(Number(per) || 0));
    val("scanProtein", Number(n.proteins_100g ?? 0).toFixed(1));
    val("scanCarbs", Number(n.carbohydrates_100g ?? 0).toFixed(1));
    val("scanFat", Number(n.fat_100g ?? 0).toFixed(1));
    const brand = p.brands ? " · " + p.brands : "";
    status.textContent = `Gefunden: ${p.product_name_de || p.product_name || "Produkt"}${brand}. Werte gelten pro 100 g/ml, soweit angegeben. Bitte Verpackung prüfen.`;
    toast("Produktdaten geladen – bitte prüfen");
  } catch (e) {
    status.textContent = "Produktdaten konnten nicht geladen werden. Prüfe deine Internetverbindung oder trage die Werte manuell ein.";
  }
}
document.getElementById("barcodeForm")?.addEventListener("submit", e => {
  e.preventDefault();
  lookupBarcode(document.getElementById("barcodeInput").value);
});
document.getElementById("startBarcodeCamera")?.addEventListener("click", async () => {
  const status = document.getElementById("barcodeStatus");
  const video = document.getElementById("barcodeVideo");
  if (!("BarcodeDetector" in window)) {
    status.textContent = "Dein Browser unterstützt den eingebauten Kamera-Barcode-Scanner nicht. Nutze die Barcode-Eingabe oder den Etikett-Scan.";
    return;
  }
  try {
    barcodeStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:false});
    video.srcObject = barcodeStream;
    video.classList.remove("hidden");
    document.getElementById("stopBarcodeCamera").classList.remove("hidden");
    await video.play();
    status.textContent = "Halte den Barcode ruhig in den Kamerarahmen …";
    const detector = new BarcodeDetector({formats:["ean_13","ean_8","upc_a","upc_e","code_128"]});
    let stopped = false;
    const stopButton = document.getElementById("stopBarcodeCamera");
    stopButton.onclick = () => { stopped = true; stopBarcodeCamera(); status.textContent = "Kamera gestoppt."; };
    const scanFrame = async () => {
      if (stopped || !barcodeStream) return;
      try {
        const codes = await detector.detect(video);
        if (codes.length) {
          stopped = true;
          const code = codes[0].rawValue;
          document.getElementById("barcodeInput").value = code;
          stopBarcodeCamera();
          await lookupBarcode(code);
          return;
        }
      } catch {}
      requestAnimationFrame(scanFrame);
    };
    requestAnimationFrame(scanFrame);
  } catch {
    status.textContent = "Kamerazugriff nicht möglich. Erlaube den Zugriff oder gib den Barcode manuell ein.";
  }
});
function stopBarcodeCamera() {
  if (barcodeStream) barcodeStream.getTracks().forEach(t => t.stop());
  barcodeStream = null;
  const video = document.getElementById("barcodeVideo");
  if (video) { video.pause(); video.srcObject = null; video.classList.add("hidden"); }
  document.getElementById("stopBarcodeCamera")?.classList.add("hidden");
}
window.addEventListener("pagehide", stopBarcodeCamera);
