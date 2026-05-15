/* ANVIÉ interactions
 - typing effect
 - lightbox
 - music autoplay with soft fade-in & fallback
 - music toggle
 - contact form demo handler
*/

// TYPING EFFECT
const typedEl = document.getElementById('typed');
const words = ["Advertiser.", "Entrepreneur.", "Graphic Designer.", "Photographer.", "Videographer.", "Artist.", "Product Designer."];
let wordIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  if (!typedEl) return;
  const current = words[wordIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, ++charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 900);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, --charIndex);
    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
typeLoop();

// LIGHTBOX
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbTitle = document.getElementById('lbTitle');
const lbDesc = document.getElementById('lbDesc');
const lbClose = document.getElementById('lbClose');

document.querySelectorAll('.grid-item img').forEach(img=>{
  img.addEventListener('click', ()=>{
    lbImg.src = img.src;
    lbTitle.textContent = img.dataset.title || '';
    lbDesc.textContent = img.dataset.desc || '';
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden','false');
  });
});
if (lbClose) lbClose.addEventListener('click', ()=> {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden','true');
});
lightbox.addEventListener('click', (e)=> { if (e.target === lightbox) { lightbox.classList.remove('active'); lightbox.setAttribute('aria-hidden','true'); } });

// MUSIC handling
const bg = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');

async function tryAutoplay() {
  if (!bg) return;
  bg.volume = 0;
  try {
    await bg.play();
    fadeInAudio(bg);
    if (musicToggle) musicToggle.textContent = 'Music: On';
  } catch (err) {
    // autoplay blocked -> wait for user gesture
    document.addEventListener('click', initOnUser, { once: true });
    if (musicToggle) musicToggle.textContent = 'Music: Paused (click to play)';
  }
}
function initOnUser() {
  if (!bg) return;
  bg.volume = 0;
  bg.play().then(()=> fadeInAudio(bg));
  if (musicToggle) musicToggle.textContent = 'Music: On';
}
function fadeInAudio(audio) {
  let v = 0;
  audio.volume = 0;
  const t = setInterval(()=>{
    v += 0.03;
    audio.volume = Math.min(v, 1);
    if (audio.volume >= 1) clearInterval(t);
  }, 200);
}
if (musicToggle) {
  musicToggle.addEventListener('click', ()=>{
    if (bg.paused) {
      bg.play().then(()=> fadeInAudio(bg));
      musicToggle.textContent = 'Music: On';
    } else {
      // fade-out until pause
      let v = bg.volume;
      const out = setInterval(()=>{
        v -= 0.08;
        bg.volume = Math.max(v, 0);
        if (bg.volume <= 0.02){ clearInterval(out); bg.pause(); musicToggle.textContent = 'Music: Off'; }
      }, 100);
    }
  });
}
window.addEventListener('load', tryAutoplay);

// CONTACT form demo handler
const form = document.getElementById('contactForm');
if (form) form.addEventListener('submit',(e)=>{
  e.preventDefault();
  alert('Message sent — thank you. (Demo handler — connect a backend to receive messages.)');
  form.reset();
});