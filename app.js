const root=document.documentElement;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const motionButton=document.querySelector('#motion-toggle');
let paused=false;
function syncMotion(){
  const enabled=!paused&&!preference.matches;
  root.dataset.motion=enabled?'on':'off';
  motionButton.textContent=enabled?'动态：开':'动态：关';
  motionButton.setAttribute('aria-pressed',String(enabled));
  motionButton.disabled=preference.matches;
  motionButton.title=preference.matches?'跟随系统减少动态效果':enabled?'关闭本页动态效果':'开启本页动态效果';
}
motionButton.hidden=false;
motionButton.addEventListener('click',()=>{paused=!paused;syncMotion();});
preference.addEventListener('change',syncMotion);
document.addEventListener('visibilitychange',()=>root.classList.toggle('page-hidden',document.hidden));
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
