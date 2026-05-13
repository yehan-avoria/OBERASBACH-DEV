import { animate, inView } from 'https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm';

const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
function goto(id){ document.querySelector(id)?.scrollIntoView({behavior:'smooth'}); }
window.goto = goto;

// ── PRELOADER ──────────────────────────────────────
const pre = document.getElementById('pre');
const fill = document.getElementById('pre-fill');
const pct = document.getElementById('pre-pct');
let p = 0;
const loadTick = setInterval(() => {
  p = Math.min(p + (Math.random() * 18), 95);
  fill.style.width = p + '%';
  pct.textContent = Math.floor(p) + '%';
}, 60);
window.addEventListener('load', () => {
  clearInterval(loadTick);
  fill.style.width = '100%';
  pct.textContent = '100%';
  setTimeout(() => { pre.classList.add('done'); }, 600);
});
setTimeout(() => { fill.style.width='100%'; pct.textContent='100%'; pre.classList.add('done'); }, 4000);

// ── CURSOR ─────────────────────────────────────────
const dot = document.getElementById('cur-dot');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
(function tick(){
  rx += (mx-rx)*.12; ry += (my-ry)*.12;
  ring.style.left = rx+'px'; ring.style.top = ry+'px';
  requestAnimationFrame(tick);
})();
$$('a,button,.gal-item,.vid-item,.amen-card,.nbhd-card').forEach(el => {
  el.addEventListener('mouseenter', () => { dot.style.width='14px'; dot.style.height='14px'; ring.style.width='58px'; ring.style.height='58px'; });
  el.addEventListener('mouseleave', () => { dot.style.width='8px'; dot.style.height='8px'; ring.style.width='40px'; ring.style.height='40px'; });
});

// ── SCROLL PROGRESS ────────────────────────────────
const sp = document.getElementById('sprogress');
window.addEventListener('scroll', () => {
  sp.style.transform = `scaleX(${window.scrollY/(document.body.scrollHeight-innerHeight)})`;
}, {passive:true});

// ── NAV SCROLL ─────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 80); }, {passive:true});
document.getElementById('nav-cta-btn').addEventListener('click', () => goto('#contact'));

// ── MOBILE MENU ────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
function toggleMenu(force) {
  const open = force !== undefined ? force : !mobileMenu.classList.contains('open');
  hamburger.classList.toggle('open', open);
  mobileMenu.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
}
hamburger.addEventListener('click', () => toggleMenu());
$$('[data-mm]').forEach(a => a.addEventListener('click', () => {
  toggleMenu(false);
  const href = a.getAttribute('href');
  if (href && href.startsWith('#')) { setTimeout(() => goto(href), 300); }
}));

// ── THREE.JS HERO ──────────────────────────────────
const cvs = document.getElementById('hero-canvas');
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, .1, 1000);
const ren = new THREE.WebGLRenderer({canvas:cvs, alpha:true, antialias:true});
ren.setSize(innerWidth, innerHeight);
ren.setPixelRatio(Math.min(devicePixelRatio, 2));
cam.position.z = 3;

const N = 2500;
const pos = new Float32Array(N*3);
const col = new Float32Array(N*3);
for (let i=0; i<N; i++) {
  pos[i*3] = (Math.random()-.5)*22;
  pos[i*3+1] = (Math.random()-.5)*22;
  pos[i*3+2] = (Math.random()-.5)*22;
  col[i*3] = .5+Math.random()*.5;
  col[i*3+1] = .3+Math.random()*.35;
  col[i*3+2] = .05+Math.random()*.15;
}
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.BufferAttribute(pos,3));
geo.setAttribute('color', new THREE.BufferAttribute(col,3));
const mat = new THREE.PointsMaterial({size:.018, vertexColors:true, transparent:true, opacity:.85, sizeAttenuation:true});
const pts = new THREE.Points(geo, mat);
scene.add(pts);

const sGeo = new THREE.IcosahedronGeometry(4.5, 1);
const sMat = new THREE.MeshBasicMaterial({color:0x3a2208, wireframe:true, transparent:true, opacity:.1});
const sphere = new THREE.Mesh(sGeo, sMat);
scene.add(sphere);

const tGeo = new THREE.TorusGeometry(6, .02, 8, 60);
const tMat = new THREE.MeshBasicMaterial({color:0xC9A070, transparent:true, opacity:.08});
const torus = new THREE.Mesh(tGeo, tMat);
torus.rotation.x = Math.PI/2;
scene.add(torus);

let nmx=0, nmy=0;
document.addEventListener('mousemove', e => { nmx=(e.clientX/innerWidth-.5)*.5; nmy=(e.clientY/innerHeight-.5)*.5; });
let t=0;
(function frame(){
  requestAnimationFrame(frame); t+=.01;
  pts.rotation.y+=.0004; pts.rotation.x+=.00015;
  sphere.rotation.y+=.001; sphere.rotation.x+=.0005;
  torus.rotation.z = t*.3;
  cam.position.x += (nmx-cam.position.x)*.04;
  cam.position.y += (-nmy-cam.position.y)*.04;
  cam.lookAt(scene.position);
  ren.render(scene, cam);
})();
window.addEventListener('resize', () => {
  cam.aspect=innerWidth/innerHeight; cam.updateProjectionMatrix();
  ren.setSize(innerWidth, innerHeight);
});

// ── HERO VIDEO PARALLAX ────────────────────────────
const hv = document.getElementById('hero-video');
window.addEventListener('scroll', () => {
  if (window.scrollY < innerHeight) hv.style.transform = `translateY(${window.scrollY*.3}px)`;
}, {passive:true});

// ── HERO ANIMATIONS ────────────────────────────────
animate('#hbadge',   {opacity:[0,1], y:[20,0]}, {duration:.8, delay:.5});
animate($$('.hero-title .word'), {opacity:[0,1], y:['110%','0%']}, {duration:1, delay:i=>.9+i*.22, easing:[.16,1,.3,1]});
animate('#hsub',     {opacity:[0,1], y:[20,0]}, {duration:.8, delay:1.55, easing:[.16,1,.3,1]});
animate('#hsavings', {opacity:[0,1], y:[20,0]}, {duration:.8, delay:1.80, easing:[.16,1,.3,1]});
animate('#hprice',   {opacity:[0,1], y:[20,0]}, {duration:.8, delay:2.05, easing:[.16,1,.3,1]});
animate('#hacts',    {opacity:[0,1], y:[20,0]}, {duration:.8, delay:2.3,  easing:[.16,1,.3,1]});
animate('#hscroll',  {opacity:[0,1]},            {duration:.8, delay:2.7});

// ── IN-VIEW ANIMATIONS ─────────────────────────────
const eIn = [.16,1,.3,1];

$$('.stat-item').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[30,0]}, {duration:.7, delay:i*.1, easing:eIn}), {margin:'-10% 0px'});
});
$$('.trust-item').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[24,0]}, {duration:.6, delay:(i%3)*.1, easing:eIn}), {margin:'-5% 0px'});
});
inView('#dcontent', () => animate('#dcontent', {opacity:[0,1],x:[-40,0]}, {duration:.9, easing:eIn}), {margin:'-10% 0px'});
inView('#dimg',     () => animate('#dimg',     {opacity:[0,1],x:[40,0]},  {duration:.9, easing:eIn}), {margin:'-10% 0px'});
inView('#dbottom',  () => animate('#dbottom',  {opacity:[0,1],y:[30,0]},  {duration:.9, delay:.15, easing:eIn}), {margin:'-10% 0px'});
$$('.ps-item').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[20,0]}, {duration:.6, delay:i*.08, easing:eIn}), {margin:'-5% 0px'});
});
$$('.gal-item').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],scale:[.93,1]}, {duration:.65, delay:(i%4)*.07, easing:eIn}), {margin:'-5% 0px'});
});
$$('.vid-item').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[40,0]}, {duration:.7, delay:i*.1, easing:eIn}), {margin:'-5% 0px'});
});
$$('.amen-card').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[30,0]}, {duration:.7, delay:(i%3)*.1, easing:eIn}), {margin:'-5% 0px'});
});
$$('.nbhd-card').forEach((el,i) => {
  inView(el, () => animate(el, {opacity:[0,1],y:[30,0]}, {duration:.7, delay:i*.1, easing:eIn}), {margin:'-5% 0px'});
});
inView('#nbhd-quote', () => animate('#nbhd-quote', {opacity:[0,1],y:[30,0]}, {duration:.9, easing:eIn}), {margin:'-5% 0px'});

$$('.ccard').forEach((el,i) => {
  el.style.opacity='0'; el.style.transform='translateY(40px)';
  inView(el, () => animate(el, {opacity:[0,1],y:[40,0]}, {duration:.8, delay:i*.14, easing:eIn}), {margin:'-5% 0px'});
});

// ── COUNTER ANIMATION ──────────────────────────────
function countUp(el, target) {
  if (target === 0) { el.textContent = '0'; return; }
  const dur = target > 100 ? 2000 : 1200;
  const t0 = performance.now();
  function u(now) {
    const pr = Math.min((now-t0)/dur, 1);
    el.textContent = Math.floor((1-Math.pow(1-pr,3))*target).toLocaleString('de-DE');
    if (pr < 1) requestAnimationFrame(u);
  }
  requestAnimationFrame(u);
}
const cobs = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { countUp(e.target, +e.target.dataset.t); cobs.unobserve(e.target); }
}), {threshold:.5});
$$('.counter').forEach(c => cobs.observe(c));

// ── TRUST CARD 3D TILT ─────────────────────────────
$$('.trust-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    el.style.transition = 'transform .12s linear, border-color .4s, box-shadow .4s';
  });
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    el.style.transform = `perspective(720px) rotateX(${-y*11}deg) rotateY(${x*11}deg) translateY(-6px) scale(1.01)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s';
    el.style.transform = 'perspective(720px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';
  });
});

// ── GALLERY 3D TILT ────────────────────────────────
$$('.gal-item').forEach(el => {
  el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX-r.left)/r.width-.5;
    const y = (e.clientY-r.top)/r.height-.5;
    el.style.transition = 'transform .1s';
    el.style.transform = `perspective(700px) rotateX(${-y*8}deg) rotateY(${x*8}deg) scale(1.03)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transition = 'transform .5s cubic-bezier(.16,1,.3,1)';
    el.style.transform = 'perspective(700px) rotateX(0) rotateY(0) scale(1)';
  });
});

// ── LIGHTBOX ───────────────────────────────────────
const lb = document.getElementById('lb');
const lbImg = document.getElementById('lb-img');
const lbCounter = document.getElementById('lb-counter');
const imgs = Array.from({length:10}, (_,i) => `./assets/images/gallery-${i+1}.jpg`);
let ci = 0;

function openLB(i) {
  ci = i; lbImg.src = imgs[ci];
  lbCounter.textContent = `${ci+1} / ${imgs.length}`;
  lb.classList.add('on'); document.body.style.overflow = 'hidden';
}
function closeLB() { lb.classList.remove('on'); document.body.style.overflow = ''; }
function navLB(d) {
  ci = (ci+d+imgs.length) % imgs.length;
  animate(lbImg, {opacity:[1,0]}, {duration:.15}).then(() => {
    lbImg.src = imgs[ci];
    lbCounter.textContent = `${ci+1} / ${imgs.length}`;
    animate(lbImg, {opacity:[0,1]}, {duration:.15});
  });
}

// ── MOBILE GALLERY LIGHTBOX ────────────────────────
const mlb      = document.getElementById('mlb');
const mlbTrack = document.getElementById('mlb-track');
const mlbNum   = document.getElementById('mlb-num');
let mlbObs     = null;

function openMLB(startIdx) {
  mlbTrack.innerHTML = '';
  imgs.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'mlb-slide';
    slide.dataset.i = i;

    const img = document.createElement('img');
    img.src = src; img.alt = `Foto ${i+1}`;
    slide.appendChild(img);

    if (i > 0) {
      const indUp = document.createElement('div');
      indUp.className = 'mlb-ind mlb-ind-top';
      indUp.innerHTML = '<div class="mlb-ind-line up"></div><span>Scrollen</span>';
      slide.appendChild(indUp);
    }
    if (i < imgs.length - 1) {
      const indDn = document.createElement('div');
      indDn.className = 'mlb-ind mlb-ind-bot';
      indDn.innerHTML = '<span>Scrollen</span><div class="mlb-ind-line dn"></div>';
      slide.appendChild(indDn);
    }

    mlbTrack.appendChild(slide);
  });

  // Belt-and-suspenders: force-remove top indicator from first slide
  mlbTrack.firstElementChild?.querySelector('.mlb-ind-top')?.remove();
  // Force-remove bottom indicator from last slide
  mlbTrack.lastElementChild?.querySelector('.mlb-ind-bot')?.remove();

  mlb.classList.add('on');
  document.body.style.overflow = 'hidden';

  const slides = mlbTrack.querySelectorAll('.mlb-slide');
  slides[startIdx].scrollIntoView();
  slides[startIdx].classList.add('enter-init');
  mlbNum.textContent = `${startIdx + 1} / ${imgs.length}`;

  let lastST = mlbTrack.scrollTop;
  let dir = 'down';
  let scrollTimer = null;

  const showInds = () => mlbTrack.classList.remove('scrolling');

  const onScroll = () => {
    const st = mlbTrack.scrollTop;
    dir = st > lastST ? 'down' : 'up';
    lastST = st;
    mlbTrack.classList.add('scrolling');
    const h = mlbTrack.clientHeight || window.innerHeight;
    const idx = Math.max(0, Math.min(Math.round(st / h), slides.length - 1));
    mlbNum.textContent = `${idx + 1} / ${imgs.length}`;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(showInds, 350);
  };
  mlbTrack.addEventListener('scroll', onScroll, {passive: true});
  // scrollend for browsers that support it (instant reveal)
  mlbTrack.addEventListener('scrollend', showInds, {passive: true});

  // Image entrance animation — direction-aware
  if (mlbObs) mlbObs.disconnect();
  mlbObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        if (!e.target.classList.contains('enter-init')) {
          e.target.classList.remove('enter-down', 'enter-up');
          void e.target.offsetHeight;
          e.target.classList.add(dir === 'down' ? 'enter-down' : 'enter-up');
        }
      } else {
        e.target.classList.remove('enter-down', 'enter-up', 'enter-init');
      }
    });
  }, {root: mlbTrack, threshold: 0.5});
  slides.forEach(s => mlbObs.observe(s));

  mlb._cleanup = () => {
    clearTimeout(scrollTimer);
    mlbTrack.removeEventListener('scroll', onScroll);
    mlbTrack.removeEventListener('scrollend', showInds);
    mlbTrack.classList.remove('scrolling');
  };
}

function closeMLB() {
  mlb.classList.remove('on');
  document.body.style.overflow = '';
  if (mlbObs) { mlbObs.disconnect(); mlbObs = null; }
  if (mlb._cleanup) { mlb._cleanup(); mlb._cleanup = null; }
}

document.getElementById('mlb-x').addEventListener('click', closeMLB);
mlb.addEventListener('click', e => { if (e.target === mlb) closeMLB(); });

$$('.gal-item').forEach(el => el.addEventListener('click', () => {
  if (window.innerWidth <= 1024) openMLB(+el.dataset.i);
  else openLB(+el.dataset.i);
}));
document.getElementById('lb-close').addEventListener('click', closeLB);
document.querySelector('.lb-prev').addEventListener('click', () => navLB(-1));
document.querySelector('.lb-next').addEventListener('click', () => navLB(1));
lb.addEventListener('click', e => { if(e.target===lb) closeLB(); });

// ── VIDEO HOVER + MODAL ────────────────────────────
const vm = document.getElementById('vm');
const vmVid = document.getElementById('vm-vid');

// Auto-play video when centred in viewport
const vidAutoObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    const v = e.target.querySelector('video');
    if (!v) return;
    if (e.isIntersecting) { v.play().catch(()=>{}); }
    else { v.pause(); v.currentTime = 0; }
  });
}, {threshold: 0.5});

$$('.vid-item').forEach(item => {
  const v = item.querySelector('video');
  vidAutoObs.observe(item);
  item.addEventListener('mouseenter', () => v.play().catch(()=>{}));
  item.addEventListener('mouseleave', () => { v.pause(); v.currentTime=0; });
  item.addEventListener('click', () => {
    vmVid.src = item.dataset.src; vmVid.muted = true; vmVid.load(); vmVid.play().catch(()=>{});
    vm.classList.add('on'); document.body.style.overflow = 'hidden';
  });
});
function closeVM() {
  animate(vm, {opacity:[1,0]}, {duration:.3}).then(() => {
    vm.classList.remove('on'); vmVid.pause(); vmVid.src=''; document.body.style.overflow='';
  });
}
document.getElementById('vm-close').addEventListener('click', closeVM);
vm.addEventListener('click', e => { if(e.target===vm) closeVM(); });

// ── KEYBOARD ──────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key==='Escape') { closeLB(); closeVM(); closeMLB(); toggleMenu(false); }
  if (lb.classList.contains('on')) {
    if (e.key==='ArrowLeft') navLB(-1);
    if (e.key==='ArrowRight') navLB(1);
  }
});

// ── FLOATING CTA ──────────────────────────────────
const fcta = document.getElementById('fcta');
window.addEventListener('scroll', () => {
  fcta.classList.toggle('visible', window.scrollY > 600);
}, {passive:true});
