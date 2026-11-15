(() => {
  'use strict';
  const bar=document.querySelector('.site-announcement'), text=bar?.querySelector('#announcementText'), viewport=bar?.querySelector('.announcement-window');
  if(!text||!viewport)return;
  let frame=0;
  function measure(){cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{
    const overflow=Math.max(0,Math.ceil(text.scrollWidth-viewport.clientWidth));
    bar.dataset.v501Scroll=String(overflow>2);
    bar.style.setProperty('--v501-distance',`-${overflow}px`);
    bar.style.setProperty('--v501-duration',`${Math.max(8,Math.ceil(overflow/38)+4)}s`);
  });}
  if(typeof ResizeObserver==='function'){const ro=new ResizeObserver(measure);ro.observe(viewport);ro.observe(text);}
  new MutationObserver(measure).observe(text,{childList:true,characterData:true,subtree:true});
  window.addEventListener('resize',measure,{passive:true});
  document.addEventListener('examlab:festival-change',measure);
  document.fonts?.ready.then(measure);measure();
})();
