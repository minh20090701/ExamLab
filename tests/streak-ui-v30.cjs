const {JSDOM}=require('jsdom'),fs=require('fs'),path=require('path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),tick=()=>new Promise(r=>setTimeout(r,30));
const me='11111111-1111-4111-8111-111111111111',a='22222222-2222-4222-8222-222222222222',b='33333333-3333-4333-8333-333333333333';
function setup(page='friends-beta/index.html',guest=false){
const dom=new JSDOM(fs.readFileSync(root+'/'+page,'utf8'),{url:'https://exam.test/ExamLab-Main/'+page,runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window,d=w.document;w.HTMLElement.prototype.scrollIntoView=function(){};w.callbacks=[];w.user=guest?null:{id:me};w.sent=0;w.fail=false;w.defer=null;w.friends=[{user_id:a,name:'An <img src=x>'},{user_id:b,name:'Bình'}];
const stats={current:3,best:7,total:9,today_done:false,week:3,days:['2026-11-10','2026-11-11','2026-11-12'],seconds_today:300};
w.snapshot={today:'2026-11-13',server_now:new Date().toISOString(),next_reset_at:new Date(Date.now()+3600000).toISOString(),my:stats,sharing:true,sources:{study:true,attempt:true},friends:[{...w.friends[0],visible:true,personal:{...stats,current:4},duo:{...stats}},{...w.friends[1],visible:false}]};
w.ExamLabSupabase={auth:{getUser:async()=>({data:{user:w.user}}),onAuthStateChange:f=>w.callbacks.push(f)},rpc:async(name,p)=>{
if(name==='examlab_v30_streak_snapshot'){if(w.defer){const def=w.defer;w.defer=null;return new Promise(r=>def.resolve=r)}if(w.fail)return{error:{message:'offline'}};return{data:JSON.parse(JSON.stringify(w.snapshot))}}
if(name==='examlab_v30_streak_sharing'){w.snapshot.sharing=p.p_enabled;w.snapshot.friends[0].visible=p.p_enabled;return{data:p.p_enabled}}
if(name==='examlab_beta_overview')return{data:{friends:w.friends}};
if(name==='examlab_v29_chat_summary'||name==='examlab_v29_chat_thread')return{data:[]};
if(name==='examlab_v29_chat_send'){w.sent++;return{data:{}}}throw Error(name)}};
if(page.startsWith('friends'))w.eval(fs.readFileSync(root+'/friends-beta/js/chat-v29.js','utf8'));
Object.defineProperty(d,'currentScript',{configurable:true,value:{src:'https://exam.test/ExamLab-Main/js/streak-v30.js'}});
w.eval(fs.readFileSync(root+'/js/streak-v30.js','utf8'));
for(const href of ['css/streak-v30.css']){const style=d.createElement('style');style.textContent=fs.readFileSync(root+'/'+href,'utf8');d.head.append(style)}
return dom;
}
(async()=>{for(let round=1;round<=5;round++){
const dom=setup(),w=dom.window,d=w.document,$=id=>d.getElementById(id);await tick();
assert(!$('streakContent').hidden);assert.equal($('notice').nextElementSibling.id,'studyStreak');assert.equal($('streakCurrent').textContent,'3');assert.equal($('streakProgress').value,300);assert.equal(d.querySelectorAll('.streak-day').length,28);assert.equal(d.querySelectorAll('.streak-day.done').length,3);assert.equal(d.querySelectorAll('.streak-badge.earned').length,2);assert.equal(d.querySelectorAll('.streak-friend').length,2);assert.equal($('streakFriends').querySelector('img'),null);
assert.equal($('streakStudy').href,'https://exam.test/ExamLab-Main/study.html');
for(const theme of ['light','dark']){d.documentElement.dataset.theme=theme;const css=w.getComputedStyle($('studyStreak'));assert.equal(css.getPropertyValue('--streak-text').trim(),theme==='dark'?'#f5e7ce':'#382a20');assert.equal(css.getPropertyValue('--streak-bg').trim(),theme==='dark'?'#2a231e':'#fffaf0')}
$('streakSearch').value='bình';$('streakSearch').dispatchEvent(new w.Event('input'));assert.equal(d.querySelectorAll('.streak-friend').length,1);$('streakSearch').value='';$('streakSearch').dispatchEvent(new w.Event('input'));
$('streakFilter').value='done';$('streakFilter').dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('.streak-friend').length,0);$('streakFilter').value='waiting';$('streakFilter').dispatchEvent(new w.Event('change'));assert.equal(d.querySelectorAll('.streak-friend').length,1);
d.querySelector('.streak-friend button').click();await tick();assert($('chatText').value.includes('10 phút'));assert.equal(w.sent,0,'Rủ học must only draft');assert.equal($('chatPeerName').textContent,'An <img src=x>');
$('chatText').value='Nháp quan trọng';$('chatText').dispatchEvent(new w.Event('input'));d.querySelector('.streak-friend button').click();await tick();assert.equal($('chatText').value,'Nháp quan trọng');assert.equal(w.sent,0);
let recipient;d.addEventListener('examlab:share-to',e=>recipient=e.detail.userId);d.querySelectorAll('.streak-friend button')[1].click();assert.equal(recipient,a);
$('streakSharing').checked=false;$('streakSharing').dispatchEvent(new w.Event('change'));await tick();assert.equal(w.snapshot.sharing,false);assert(!$('streakSharing').disabled);$('streakFilter').value='all';$('streakFilter').dispatchEvent(new w.Event('change'));assert(!$('streakFriends').textContent.includes('Kỷ lục chung'));assert($('streakFriends').textContent.includes('riêng tư'));
w.snapshot.my={...w.snapshot.my,today_done:true,seconds_today:600,current:4};d.dispatchEvent(new w.CustomEvent('examlab:study-synced'));await tick();assert.equal($('streakCurrent').textContent,'4');assert($('streakToday').textContent.includes('đã giữ lửa'));
w.fail=true;$('streakRefresh').click();await tick();assert($('streakContent').hidden);assert($('streakStatus').textContent.includes('Kiểm tra kết nối'));w.fail=false;$('streakRefresh').click();await tick();assert(!$('streakContent').hidden);
// A pending response cannot expose the previous account's data after sign-out.
const deferred={};w.defer=deferred;$('streakRefresh').click();await tick();w.user=null;w.callbacks.forEach(f=>f('SIGNED_OUT',null));deferred.resolve({data:w.snapshot});await tick();assert($('streakContent').hidden);assert(!$('streakGuest').hidden);assert.equal($('streakFriends').children.length,0);assert.equal($('chatText').value,'');dom.window.close();
const compact=setup('study.html');await tick();const c=compact.window.document;assert(c.getElementById('streakFriendsLink').href.endsWith('/ExamLab-Main/friends-beta/index.html#studyStreak'));assert(!c.getElementById('streakCalendar'));assert(!c.getElementById('streakContent').hidden);compact.window.close();
const guest=setup('study.html',true);await tick();assert(!guest.window.document.getElementById('streakGuest').hidden);assert(guest.window.document.getElementById('streakContent').hidden);guest.window.close();
console.log(`PASS V30 UI round ${round}: progress/calendar/milestones, filters, theme tokens, draft-only invitation, existing draft, sharing, offline/retry, auth race, compact/guest`);
}})().catch(e=>{console.error(e);process.exit(1)});
