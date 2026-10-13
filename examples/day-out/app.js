import { stops } from './data.js';

const root = document.documentElement;
const motionButton = document.querySelector('#motion-toggle');
const replayButton = document.querySelector('#date-sticker');
const preference = matchMedia('(prefers-reduced-motion: reduce)');
let paused = false;
let observer;

const make = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text) node.textContent = text;
  if (className) node.className = className;
  return node;
};
document.querySelector('#timeline').replaceChildren(...stops.map((stop, index) => {
  const row = make('li', '', stop.finish ? 'finish' : '');
  row.style.setProperty('--entry-delay', `${index % 3 * 65}ms`);
  const card = make('div', '', 'stop-card');
  const stage = make('div', '', 'stage');
  stage.append(make('h3', stop.title), make('p', stop.note));
  card.append(make('span', stop.time, 'time'), stage);
  row.append(card);
  return row;
}));

function replay() {
  root.classList.remove('intro-play');
  if (root.dataset.motion === 'on') requestAnimationFrame(() => requestAnimationFrame(() => root.classList.add('intro-play')));
}
function syncMotion() {
  const enabled = !paused && !preference.matches;
  root.dataset.motion = enabled ? 'on' : 'off';
  motionButton.setAttribute('aria-pressed', String(enabled));
  motionButton.disabled = preference.matches;
  document.querySelector('#motion-label').textContent = enabled ? '动态：开' : '动态：关';
  replayButton.disabled = !enabled;
  observer?.disconnect();
  observer = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) {
      entry.target.classList.add('is-seen');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  document.querySelectorAll('#timeline li').forEach(row => observer.observe(row));
  replay();
}
motionButton.hidden = false;
motionButton.addEventListener('click', () => { paused = !paused; syncMotion(); });
replayButton.addEventListener('click', replay);
preference.addEventListener('change', syncMotion);
document.addEventListener('visibilitychange', () => root.classList.toggle('page-hidden', document.hidden));
syncMotion();
