// EarnSite app logic (localStorage-based) v4
function getAllUsers(){try{return JSON.parse(localStorage.getItem('es_users')||'[]');}catch(e){return [];}}
function saveAllUsers(arr){localStorage.setItem('es_users',JSON.stringify(arr));}
function getTransactions(){try{return JSON.parse(localStorage.getItem('es_tx')||'[]');}catch(e){return [];}}
function saveTransactions(arr){localStorage.setItem('es_tx',JSON.stringify(arr));}

function createUser({name,username,password}){if(!name||!username||!password)return {ok:false,msg:'All fields required.'};const users=getAllUsers();if(users.find(u=>u.username.toLowerCase()===username.toLowerCase()))return {ok:false,msg:'Username already exists.'};const user={name,username,password,balance:0,referrals:[],created:new Date().toISOString(),_shareCount:0};users.push(user);saveAllUsers(users);return {ok:true};}

function loginUser({username,password}){const users=getAllUsers();const u=users.find(x=>x.username.toLowerCase()===username.toLowerCase());if(!u)return {ok:false,msg:'User not found.'};if(u.password!==password)return {ok:false,msg:'Incorrect password.'};return {ok:true,username:u.username};}

function getUser(username){const users=getAllUsers();return users.find(u=>u.username===username)||{username,balance:0,_shareCount:0};}
function updateUser(user){const users=getAllUsers();const idx=users.findIndex(u=>u.username===user.username);if(idx===-1){users.push(user);}else{users[idx]=user;}saveAllUsers(users);}

function generateReferralToken(){return 'ref_'+Math.random().toString(36).slice(2,10);}
function saveReferralForCurrent(url){const cur=localStorage.getItem('current_user');if(!cur)return;const u=getUser(cur);u.referrals=u.referrals||[];u.referrals.push({url,date:new Date().toISOString()});updateUser(u);const tx=getTransactions();tx.unshift({username:cur,title:'Referral link created',amount:0,date:new Date().toLocaleString()});saveTransactions(tx);}

function generateFakeLinks(n){const items=[];const domains=['news-gate.com','paynow-info.net','secure-earn.org','insights-hub.io','offersdaily.co'];for(let i=0;i<n;i++){const domain=domains[Math.floor(Math.random()*domains.length)];const title=['How to Earn Fast','Payout Proofs','Top Earning Tips','Withdrawal Guide','Earners Community'][Math.floor(Math.random()*5)];const url=`https://${domain}/article/${Math.random().toString(36).slice(2,9)}`;items.push({title,url,domain});}return items;}

function creditCurrent(amount,title){const cur=localStorage.getItem('current_user');if(!cur)return;const u=getUser(cur);u.balance=(u.balance||0)+amount;updateUser(u);const tx=getTransactions();tx.unshift({username:cur,title:title||'Credit',amount:amount,date:new Date().toLocaleString()});saveTransactions(tx);}
function getTransactionsForCurrent(){const cur=localStorage.getItem('current_user');if(!cur)return[];return getTransactions().filter(t=>t.username===cur);}

(function ensureSeed(){const users=getAllUsers();if(!users.find(u=>u.username==='user1')){users.push({name:'Ayesha',username:'user1',password:'pass123',balance:1200.0,referrals:[],created:new Date().toISOString(),_shareCount:4});users.push({name:'Bilal',username:'user2',password:'pass123',balance:1500.0,referrals:[],created:new Date().toISOString(),_shareCount:2});saveAllUsers(users);} })();

function populateLinks(){const list=document.getElementById('linksList');if(!list)return;list.innerHTML='';const sl=generateFakeLinks(6);sl.forEach(s=>{const li=document.createElement('li');li.innerHTML=`<a href="${s.url}" target="_blank">${s.title}</a> <span class="muted"> — ${s.domain}</span>`;list.appendChild(li);});}

function renderTx(){const tx=getTransactionsForCurrent();const container=document.getElementById('txList');if(!container)return;if(tx.length===0)container.innerHTML='<p class="muted">No transactions yet.</p>';else container.innerHTML=tx.map(t=>`<div class="tx"><strong>${t.title}</strong><div class="muted">${t.date} ${t.status? ' — ' + t.status : ''}</div><div>$${t.amount.toFixed(2)}</div></div>`).join('');}

function refreshBalance(){const u=getUser(localStorage.getItem('current_user'));const el=document.getElementById('balanceLine');if(el)el.textContent=`Balance: $${(u.balance||0).toFixed(2)}`;}

function renderShareState(){const u=getUser(localStorage.getItem('current_user'));const count=(u._shareCount||0);const sc=document.getElementById('shareCount');if(sc)sc.textContent=count;const pct=Math.min(100,(count/10)*100);const pf=document.getElementById('progressFill');if(pf)pf.style.width=pct+'%';}

async function simulateShare(n){const curUser=localStorage.getItem('current_user');if(!curUser)return;const u=getUser(curUser);u._shareCount=u._shareCount||0;for(let i=0;i<n;i++){u._shareCount++;updateUser(u);renderShareState();await new Promise(r=>setTimeout(r,300));if(u._shareCount>=10){creditCurrent(25,'Referral bonus: 10 shares');u._shareCount=0;updateUser(u);renderShareState();renderTx();alert('$25 credited!');break;}}}
