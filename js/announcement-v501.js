/* V50.3: single original message; keep Supabase's #announcementText node. */
(()=>{
 'use strict';
 const bar=document.querySelector('.site-announcement'),text=bar?.querySelector('#announcementText'),viewport=bar?.querySelector('.announcement-window');
 if(!text||!viewport||bar.dataset.v503Ready)return;
 const fallback='Chào mừng bạn đến với ExamLab · Chúc bạn học tập hiệu quả!';
 // Restore the original node if an older layout is present (e.g. restored page).
 if(text.parentElement!==viewport){viewport.append(text);viewport.querySelectorAll('.v502-notice-track').forEach(n=>n.remove());}
 bar.querySelectorAll('.v502-notice-toggle').forEach(n=>n.remove());delete bar.dataset.v502Paused;delete bar.dataset.v502Ready;
 let frame=0,last='';
 function measure(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
  if(!text.textContent.trim())text.textContent=fallback;
  const width=viewport.clientWidth, message=Math.ceil(text.scrollWidth);
  if(width<1||message<1)return;
  const key=width+'|'+message+'|'+text.textContent;
  if(key===last)return;last=key;
  text.style.setProperty('--v503-start',width+'px');
  text.style.setProperty('--v503-end',-message+'px');
  text.style.setProperty('--v503-duration',Math.max(8,(width+message)/55).toFixed(2)+'s');
  // Restart at the right edge only when the content or width actually changes.
  delete bar.dataset.v503Ready;void text.offsetWidth;bar.dataset.v503Ready='true';
 });}
 if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(measure);ro.observe(viewport);ro.observe(text);}
 new MutationObserver(measure).observe(text,{childList:true,characterData:true,subtree:true});
 window.addEventListener('resize',measure,{passive:true});document.addEventListener('examlab:festival-change',measure);
 document.fonts?.ready.then(measure);measure();
})();
