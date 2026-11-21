const STORAGE_KEY = "cvstudio-data-v1";
const sectionMeta = [
  ["summary","Professional summary"],["education","Education"],["skills","Skills"],["projects","Projects"],
  ["internships","Internships & experience"],["certifications","Certifications"],["languages","Languages"]
];
const seed = {
  theme:"modern", photo:"", photoShape:"circle",
  personal:{fullName:"Shivali Ganesh Naik",jobTitle:"BCA Student · Aspiring Web Developer",location:"Goa, India",email:"shivali.naik@example.com",phone:"9876543210",website:"linkedin.com/in/shivali-naik"},
  summary:"Third-year BCA student interested in building responsive, user-friendly web applications. Enjoys turning ideas into practical digital experiences, learning new technologies and collaborating on creative projects.",
  education:[{degree:"Bachelor of Computer Applications (BCA)",school:"Dnyanprassarak Mandal’s College & Research Centre",location:"Assagao, Goa",dates:"2024 – Present",details:"Relevant areas: Web Development, Database Management, UI/UX Design"}],
  skills:[{name:"HTML & CSS",level:"Advanced"},{name:"JavaScript",level:"Intermediate"},{name:"React",level:"Intermediate"},{name:"Node.js & Express",level:"Beginner"},{name:"MySQL",level:"Intermediate"},{name:"Figma",level:"Intermediate"}],
  projects:[{name:"Smart Queue Display",tech:"HTML · CSS · JavaScript",link:"",impact:"Created a responsive queue display showing current and next token with counter information."},{name:"Task Manager",tech:"React · Local Storage",link:"",impact:"Built an interactive task tracker with add, edit, delete and persistent task data."}],
  internships:[{role:"Web Development Intern",company:"Sanctify Digital Marketing Agency",dates:"Nov 2026 – Present",details:"Developing responsive web interfaces and interactive JavaScript projects as part of a 60-hour internship."}],
  certifications:[{name:"Web Development Internship",issuer:"Sanctify Digital Marketing Agency",date:"2026"}],
  languages:[{name:"English",level:"Professional"},{name:"Konkani",level:"Native"},{name:"Hindi",level:"Conversational"}],
  order:["summary","education","skills","projects","internships","certifications","languages"],
  visible:{summary:true,education:true,skills:true,projects:true,internships:true,certifications:true,languages:true}
};
let data = loadData();
function clone(x){return JSON.parse(JSON.stringify(x))}
function loadData(){try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));return saved?{...clone(seed),...saved,personal:{...seed.personal,...saved.personal}}:clone(seed)}catch(e){return clone(seed)}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(data));renderPreview();updateProgress()}
function esc(v=""){return String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>t.classList.remove("show"),2200)}
const $=id=>document.getElementById(id);
function bindPersonal(){
  ["fullName","jobTitle","location","email","phone","website"].forEach(k=>{const el=$(k);el.value=data.personal[k]||"";el.addEventListener("input",()=>{data.personal[k]=el.value;save();validate()})});
  $("summary").value=data.summary||"";$("summary").addEventListener("input",e=>{data.summary=e.target.value;save()});
}
const templates={
 education:{title:"Education",fields:[["degree","Degree / course","e.g. Bachelor of Computer Applications"],["school","Institution","College or university"],["location","Location","City, country"],["dates","Dates","2024 – Present"],["details","Details","Relevant coursework, achievements...","wide","textarea"]]},
 skills:{title:"Skill",fields:[["name","Skill name","e.g. JavaScript"],["level","Confidence level","","","select",["Beginner","Intermediate","Advanced"]]]},
 projects:{title:"Project",fields:[["name","Project name","e.g. Student Portal"],["tech","Tools / technologies","HTML · CSS · JavaScript"],["link","Project link (optional)","https://...","wide"],["impact","One-line impact / what you built","What does it do?","wide","textarea"]]},
 internships:{title:"Experience",fields:[["role","Role / position","e.g. Web Development Intern"],["company","Company / organisation","Organisation name"],["dates","Dates","Nov 2026 – Present"],["details","What you did","Key responsibilities or achievement","wide","textarea"]]},
 certifications:{title:"Certification",fields:[["name","Certification / course","Course name"],["issuer","Issued by","Provider"],["date","Year / date","2026"]]},
 languages:{title:"Language",fields:[["name","Language","e.g. English"],["level","Proficiency","Native / Professional / Basic"]]}
};
function renderRepeat(type){
 const host=$(type+"List");host.innerHTML="";
 (data[type]||[]).forEach((item,i)=>{
  const card=document.createElement("div");card.className="repeat-item";
  card.innerHTML=`<div class="repeat-head"><strong>${templates[type].title} ${i+1}</strong><button class="remove-item" type="button">Remove ×</button></div><div class="repeat-grid"></div>`;
  const grid=card.querySelector(".repeat-grid");
  templates[type].fields.forEach(([key,label,placeholder,wide,kind,options])=>{
   const wrap=document.createElement("label");if(wide==="wide")wrap.className="wide";wrap.textContent=label;
   let el;
   if(kind==="textarea"){el=document.createElement("textarea");el.placeholder=placeholder}
   else if(kind==="select"){el=document.createElement("select");options.forEach(o=>{const opt=document.createElement("option");opt.value=o;opt.textContent=o;el.append(opt)})}
   else{el=document.createElement("input");el.placeholder=placeholder||"";if(key==="link")el.type="url"}
   el.value=item[key]||"";el.addEventListener("input",()=>{item[key]=el.value;save();validate()});el.addEventListener("change",()=>{item[key]=el.value;save();validate()});
   wrap.append(el);grid.append(wrap);
  });
  card.querySelector(".remove-item").addEventListener("click",()=>{data[type].splice(i,1);renderRepeat(type);save();validate()});
  host.append(card);
 });
}
function addItem(type){
 const defaults={education:{degree:"",school:"",location:"",dates:"",details:""},skills:{name:"",level:"Beginner"},projects:{name:"",tech:"",link:"",impact:""},internships:{role:"",company:"",dates:"",details:""},certifications:{name:"",issuer:"",date:""},languages:{name:"",level:""}};
 data[type].push(defaults[type]);renderRepeat(type);save();$(type+"List").lastElementChild?.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function renderManager(){
 const host=$("sectionManager");host.innerHTML="";
 data.order.forEach((key)=>{
  const meta=sectionMeta.find(x=>x[0]===key);if(!meta)return;
  const row=document.createElement("div");row.className="manager-item";row.draggable=true;row.dataset.key=key;
  row.innerHTML=`<span class="drag-handle">⠿</span><span class="manager-name">${meta[1]}</span><label><input type="checkbox" ${data.visible[key]!==false?"checked":""} aria-label="Show ${meta[1]}"></label>`;
  row.querySelector("input").addEventListener("change",e=>{data.visible[key]=e.target.checked;save()});
  row.addEventListener("dragstart",()=>{row.classList.add("dragging")});
  row.addEventListener("dragend",()=>{row.classList.remove("dragging");host.querySelectorAll(".drag-over").forEach(x=>x.classList.remove("drag-over"))});
  row.addEventListener("dragover",e=>{e.preventDefault();row.classList.add("drag-over")});
  row.addEventListener("dragleave",()=>row.classList.remove("drag-over"));
  row.addEventListener("drop",e=>{e.preventDefault();const moving=host.querySelector(".dragging")?.dataset.key;const target=key;if(!moving||moving===target)return;const from=data.order.indexOf(moving),to=data.order.indexOf(target);data.order.splice(from,1);data.order.splice(to,0,moving);renderManager();save()});
  host.append(row);
 });
}
function section(title,body){return `<section class="cv-section"><h3>${esc(title)}</h3>${body}</section>`}
function renderPreview(){
 const p=data.personal;$("pName").textContent=p.fullName||"";$("pTitle").textContent=p.jobTitle||"";
 $("pContact").textContent=[p.location,p.email,p.phone,p.website].filter(Boolean).join("  ·  ");
 const photo=$("pPhoto");if(data.photo){photo.src=data.photo;photo.hidden=false;photo.classList.toggle("square",data.photoShape==="square")}else{photo.hidden=true}
 const paper=$("cvPreview");paper.className="cv-paper theme-"+data.theme;
 const out=[];
 data.order.forEach(key=>{
  if(data.visible[key]===false)return;
  if(key==="summary"&&data.summary.trim())out.push(section("Profile",`<p>${esc(data.summary)}</p>`));
  if(key==="education"&&data.education.length){const b=data.education.filter(x=>x.degree||x.school).map(x=>`<div class="cv-entry"><div class="cv-entry-top"><span>${esc(x.degree)}</span><span>${esc(x.dates)}</span></div><div class="cv-entry-meta">${esc(x.school)}${x.location?" · "+esc(x.location):""}</div>${x.details?`<p class="cv-entry-desc">${esc(x.details)}</p>`:""}</div>`).join("");if(b)out.push(section("Education",b))}
  if(key==="skills"&&data.skills.some(x=>x.name)){const b=data.skills.filter(x=>x.name).map(x=>{const n={Beginner:35,Intermediate:68,Advanced:100}[x.level]||50;return `<div class="cv-skill"><span class="cv-skill-name">${esc(x.name)}</span><span class="cv-skill-level">${esc(x.level)}</span><div class="skill-track"><span style="width:${n}%"></span></div></div>`}).join("");out.push(section("Skills",`<div class="cv-skill-list">${b}</div>`))}
  if(key==="projects"&&data.projects.some(x=>x.name)){const b=data.projects.filter(x=>x.name).map(x=>`<div class="cv-entry"><div class="cv-entry-top"><span>${esc(x.name)}</span><span>${x.link?`<a class="cv-link" href="${esc(x.link)}">${esc(x.link.replace(/^https?:\/\//,""))}</a>`:""}</span></div>${x.tech?`<div class="cv-entry-meta">${esc(x.tech)}</div>`:""}${x.impact?`<p class="cv-entry-desc">${esc(x.impact)}</p>`:""}</div>`).join("");out.push(section("Projects",b))}
  if(key==="internships"&&data.internships.some(x=>x.role||x.company)){const b=data.internships.filter(x=>x.role||x.company).map(x=>`<div class="cv-entry"><div class="cv-entry-top"><span>${esc(x.role)}</span><span>${esc(x.dates)}</span></div><div class="cv-entry-meta">${esc(x.company)}</div>${x.details?`<p class="cv-entry-desc">${esc(x.details)}</p>`:""}</div>`).join("");out.push(section("Experience",b))}
  if(key==="certifications"&&data.certifications.some(x=>x.name)){const b=data.certifications.filter(x=>x.name).map(x=>`<div class="cv-entry"><div class="cv-entry-top"><span>${esc(x.name)}</span><span>${esc(x.date)}</span></div><div class="cv-entry-meta">${esc(x.issuer)}</div></div>`).join("");out.push(section("Certifications",b))}
  if(key==="languages"&&data.languages.some(x=>x.name)){const b=data.languages.filter(x=>x.name).map(x=>`<div class="cv-entry-top"><span>${esc(x.name)}</span><span>${esc(x.level)}</span></div>`).join("");out.push(section("Languages",b))}
 });
 $("previewSections").innerHTML=out.join("");
}
function validate(){
 const p=data.personal,errors={fullName:!p.fullName.trim()?"Please enter your full name.":"",email:!p.email.trim()?"Email is required.":!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)?"Enter a valid email address.":"",phone:!p.phone.trim()?"Phone number is required.":!/^\d{10}$/.test(p.phone.replace(/\D/g,""))?"Enter a 10-digit phone number.":"",skills:!data.skills.some(x=>x.name.trim())?"Add at least one skill.":"",projects:!data.projects.some(x=>x.name.trim())?"Add at least one project.":""};
 Object.entries(errors).forEach(([k,v])=>{const el=document.querySelector(`[data-error="${k}"]`);if(el)el.textContent=v});
 const done=[!!p.fullName.trim(),!!p.email.trim()&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email),/^\d{10}$/.test(p.phone.replace(/\D/g,"")),data.skills.some(x=>x.name.trim()),data.projects.some(x=>x.name.trim())].filter(Boolean).length;
 const pct=Math.round(done/5*100);$("completionValue").textContent=pct+"%";$("progressFill").style.width=pct+"%";$("progressCount").textContent=done+" of 5 essentials";
 $("progressMessage").textContent=pct===100?"Your essentials are looking great. Ready to shine!":pct>=60?"Nice work — you're getting there.":"Let's get the basics in place.";
 return {errors,pct};
}
function exportJSON(){const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="my-cv-data.json";a.click();URL.revokeObjectURL(a.href);toast("Your CV data has been exported!")}
function importJSON(file){const reader=new FileReader();reader.onload=()=>{try{const incoming=JSON.parse(reader.result);if(!incoming.personal||!Array.isArray(incoming.skills)||!Array.isArray(incoming.projects))throw Error();data={...clone(seed),...incoming,personal:{...seed.personal,...incoming.personal}};localStorage.setItem(STORAGE_KEY,JSON.stringify(data));init();toast("CV imported successfully!")}catch(e){toast("That file doesn't look like a CV Studio JSON.")}};reader.readAsText(file)}
function setTab(tab){document.querySelectorAll(".editor-tab").forEach(x=>x.classList.toggle("active",x.dataset.tab===tab));document.querySelectorAll(".tab-panel").forEach(x=>x.classList.toggle("active",x.id==="tab-"+tab))}
function init(){
 bindPersonal();["education","skills","projects","internships","certifications","languages"].forEach(renderRepeat);renderManager();
 document.querySelectorAll(".editor-tab").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
 document.querySelectorAll("[data-add]").forEach(b=>b.addEventListener("click",()=>addItem(b.dataset.add)));
 document.querySelectorAll(".theme-option").forEach(b=>b.addEventListener("click",()=>{data.theme=b.dataset.theme;document.querySelectorAll(".theme-option").forEach(x=>x.classList.toggle("active",x===b));save()}));
 document.querySelectorAll(".shape-btn").forEach(b=>b.addEventListener("click",()=>{data.photoShape=b.dataset.shape;document.querySelectorAll(".shape-btn").forEach(x=>x.classList.toggle("active",x===b));$("photoPreview").classList.toggle("square",data.photoShape==="square");$("pPhoto").classList.toggle("square",data.photoShape==="square");save()}));
 $("photoInput").addEventListener("change",e=>{const file=e.target.files[0];if(!file)return;if(!file.type.startsWith("image/"))return toast("Please choose an image file.");if(file.size>2*1024*1024)return toast("Please use an image smaller than 2 MB.");const reader=new FileReader();reader.onload=()=>{data.photo=reader.result;renderPhoto();save()};reader.readAsDataURL(file)});
 $("removePhotoBtn").addEventListener("click",()=>{data.photo="";$("photoInput").value="";renderPhoto();save()});
 $("exportBtn").addEventListener("click",exportJSON);$("importBtn").addEventListener("click",()=>$("importFile").click());$("importFile").addEventListener("change",e=>{if(e.target.files[0])importJSON(e.target.files[0]);e.target.value=""});
 ["printBtn","previewPrintBtn"].forEach(id=>$(id).addEventListener("click",()=>{const result=validate();if(Object.values(result.errors).some(Boolean))toast("A few essentials need your attention — you can still print.");window.print()}));
 document.querySelectorAll(".theme-option").forEach(x=>x.classList.toggle("active",x.dataset.theme===data.theme));
 document.querySelectorAll(".shape-btn").forEach(x=>x.classList.toggle("active",x.dataset.shape===data.photoShape));
 $("photoPreview").classList.toggle("square",data.photoShape==="square");renderPhoto();renderPreview();validate();
}
function renderPhoto(){const host=$("photoPreview");host.innerHTML=data.photo?`<img src="${data.photo}" alt="Your profile photo">`:"<span>＋</span>";host.classList.toggle("square",data.photoShape==="square")}
init();
