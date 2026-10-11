const root=document.documentElement;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('#motion-toggle');
let paused=false;
const traveler=document.querySelector('#orbit-traveler');
const tilt=-25*Math.PI/180;
let orbitAngle=-0.24;
let orbitFrame=0;
let previousTime=null;
let heroVisible=true;
function drawOrbit(){
  const x=254*Math.cos(orbitAngle), y=70*Math.sin(orbitAngle);
  traveler.setAttribute('transform',`translate(${(755+x*Math.cos(tilt)-y*Math.sin(tilt)).toFixed(2)} ${(213+x*Math.sin(tilt)+y*Math.cos(tilt)).toFixed(2)})`);
}
function animateOrbit(now){
  if(previousTime!==null)orbitAngle+=(now-previousTime)*Math.PI*2/32000;
  previousTime=now;
  drawOrbit();
  orbitFrame=requestAnimationFrame(animateOrbit);
}
function syncOrbit(){
  const shouldRun=root.dataset.motion==='on'&&!document.hidden&&heroVisible;
  if(shouldRun&&!orbitFrame){previousTime=null;orbitFrame=requestAnimationFrame(animateOrbit);}
  if(!shouldRun&&orbitFrame){cancelAnimationFrame(orbitFrame);orbitFrame=0;previousTime=null;}
}
function syncMotion(){
  const enabled=!paused&&!preference.matches;
  root.dataset.motion=enabled?'on':'off';
  motionButton.textContent=enabled?'动态：开':'动态：关';
  motionButton.setAttribute('aria-pressed',String(enabled));
  motionButton.disabled=preference.matches;
  motionButton.title=preference.matches?'跟随系统减少动态效果':enabled?'关闭本页动态效果':'开启本页动态效果';
  syncOrbit();
}
motionButton.hidden=false;
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
preference.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>{root.classList.toggle('page-hidden',document.hidden);syncOrbit();});
new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;syncOrbit();}).observe(document.querySelector('.hero'));
drawOrbit();
syncMotion();

// A live preview stays passive until requested, so a mobile swipe scrolls the talk.
for(const preview of document.querySelectorAll('[data-preview]')){
  const button=preview.querySelector('.interact-button');
  const viewport=preview.querySelector('.frame-viewport');
  const frame=preview.querySelector('iframe');
  const hint=preview.querySelector('.frame-hint');
  button.addEventListener('click',()=>{
    const enabled=button.getAttribute('aria-pressed')!=='true';
    button.setAttribute('aria-pressed',String(enabled));
    button.textContent=enabled?'退出操作':'操作网页';
    viewport.inert=!enabled;
    frame.tabIndex=enabled?0:-1;
    preview.classList.toggle('is-interactive',enabled);
    hint.textContent=enabled?'正在操作原站 · 点“退出操作”返回分享页滚动。':'实时内嵌 · 点“操作网页”后可在框内滚动。';
  });
}
