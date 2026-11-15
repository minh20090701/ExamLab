/* V50.2: continuous seamless ticker, no duplicated accessible text. */
(() => {
 'use strict';
 const bar=document.querySelector('.site-announcement'), text=bar?.querySelector('#announcementText'), viewport=bar?.querySelector('.announcement-window');
 if(!text||!viewport||bar.dataset.v502Ready)return;
 bar.dataset.v502Ready='true';
 const track=document.createElement('div');track.className='v502-notice-track';
 const first=document.createElement('div');first.className='v502-notice-group';
 const second=document.createElement('div');second.className='v502-notice-group';second.setAttribute('aria-hidden','true');
 viewport.append(track);track.append(first,second);first.append(text);
 const toggle=document.createElement('button');toggle.type='button';toggle.className='v502-notice-toggle';toggle.textContent='Ⅱ';toggle.setAttribute('aria-label','Tạm dừng thông báo chạy');toggle.setAttribute('aria-pressed','false');bar.append(toggle);
 toggle.addEventListener('click',()=>{const paused=bar.dataset.v502Paused!=='true';bar.dataset.v502Paused=String(paused);toggle.textContent=paused?'▶':'Ⅱ';toggle.setAttribute('aria-pressed',String(paused));toggle.setAttribute('aria-label',paused?'Tiếp tục thông báo chạy':'Tạm dừng thông báo chạy');});
 const fallback='Chào mừng bạn đến với ExamLab · Chúc bạn học tập hiệu quả!';
 let frame=0,last='',lastWidth=0;
 function copy(value){const el=document.createElement('span');el.className='v502-notice-copy';el.setAttribute('aria-hidden','true');el.textContent=value;return el;}
 function measure(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
  const value=text.textContent.trim()||fallback;if(!text.textContent.trim())text.textContent=value;
  const width=viewport.clientWidth;if(width<1)return;
  const key=value+'|'+getComputedStyle(text).fontSize+'|'+getComputedStyle(text).fontFamily;if(key===last&&width===lastWidth)return;
  last=key;lastWidth=width;
  first.querySelectorAll('.v502-notice-copy').forEach(n=>n.remove());second.replaceChildren();
  const gap=parseFloat(getComputedStyle(first).columnGap)||48;
  const repeat=Math.max(1,Math.min(30,Math.ceil(width/(Math.max(1,text.getBoundingClientRect().width)+gap))));
  for(let i=1;i<repeat;i++)first.append(copy(value));for(let i=0;i<repeat;i++)second.append(copy(value));
  track.style.setProperty('--v502-speed',Math.max(10,first.scrollWidth/42)+'s');
 });}
 if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(measure);ro.observe(viewport);}
 new MutationObserver(measure).observe(text,{childList:true,characterData:true,subtree:true});
 window.addEventListener('resize',measure,{passive:true});document.addEventListener('examlab:festival-change',measure);document.fonts?.ready.then(()=>{last='';measure()});measure();
})();
