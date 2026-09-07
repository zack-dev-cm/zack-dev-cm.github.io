const video=document.querySelector('#hero-video'),button=document.querySelector('#hero-toggle');
if(video&&button){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let userPaused=false,manualPlay=false,visible=false,loaded=false;
 const canAutoPlay=()=>!reduced.matches&&!navigator.connection?.saveData;
 const wantsPlayback=()=>!userPaused&&(manualPlay||canAutoPlay());
 function load(){if(loaded)return;for(const s of video.querySelectorAll('source'))s.src=s.dataset.src;video.load();loaded=true;}
 async function play(){load();try{await video.play();}catch{button.textContent='Play preview';}}
 function sync(){button.textContent=video.paused?'Play preview':'Pause preview';button.setAttribute('aria-label',video.paused?'Play the muted hero preview':'Pause the hero preview');}
 video.addEventListener('play',sync);video.addEventListener('pause',sync);
 button.addEventListener('click',()=>{if(video.paused){userPaused=false;manualPlay=true;play();}else{userPaused=true;manualPlay=false;video.pause();}});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&wantsPlayback()&&!document.hidden)play();else video.pause();},{threshold:.15});observer.observe(video);
 reduced.addEventListener('change',()=>{if(!wantsPlayback())video.pause();else if(visible&&!document.hidden)play();});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();else if(visible&&wantsPlayback())play();});
 window.addEventListener('pagehide',()=>video.pause());window.addEventListener('pageshow',()=>{if(visible&&wantsPlayback())play();});
 sync();
}
