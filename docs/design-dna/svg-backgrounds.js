// APEX Design DNA — SVG Backgrounds (Static + Animated)
// Static:   <div data-bg="dots"></div>
// Animated: <div data-animated-bg="orbs"></div>

let _pid = 0;
function uid() { return 'p' + (++_pid); }

const SVG_PATTERNS = {
  dots: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="${c}" opacity="0.4"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  grid: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0L0 0 0 48" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  topo: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="200" patternUnits="userSpaceOnUse"><path d="M20,80Q60,20 100,80T180,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.2"/><path d="M20,130Q60,70 100,130T180,130" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/><path d="M20,180Q60,120 100,180T180,180" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  circuit: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="80" height="80" patternUnits="userSpaceOnUse"><path d="M0,40L20,40 20,20 40,20M40,40L60,40 60,60 80,60M40,0L40,20M40,60L40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><circle cx="20" cy="20" r="2.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><circle cx="40" cy="40" r="2" fill="${c}" opacity="0.25"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  hexagons: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(0.6)"><path d="M28,2L52,17 52,47 28,62 4,47 4,17Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M28,52L52,67 52,97 28,112 4,97 4,67Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  crosses: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M14,8L18,8 18,14 24,14 24,18 18,18 18,24 14,24 14,18 8,18 8,14 14,14Z" fill="${c}" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  diamonds: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20,0L40,20 20,40 0,20Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  diagonals: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="16" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  triangles: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M24,4L44,44H4Z" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  constellation: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="120" height="120" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="2" fill="${c}" opacity="0.3"/><circle cx="80" cy="30" r="1.5" fill="${c}" opacity="0.2"/><circle cx="100" cy="90" r="2" fill="${c}" opacity="0.3"/><circle cx="40" cy="100" r="1.5" fill="${c}" opacity="0.2"/><circle cx="60" cy="60" r="2.5" fill="${c}" opacity="0.2"/><line x1="20" y1="20" x2="80" y2="30" stroke="${c}" stroke-width="0.4" opacity="0.12"/><line x1="80" y1="30" x2="100" y2="90" stroke="${c}" stroke-width="0.4" opacity="0.1"/><line x1="100" y1="90" x2="40" y2="100" stroke="${c}" stroke-width="0.4" opacity="0.12"/><line x1="60" y1="60" x2="20" y2="20" stroke="${c}" stroke-width="0.4" opacity="0.1"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  isometric: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="56" height="32" patternUnits="userSpaceOnUse"><path d="M28,0L56,16 28,32 0,16Z" fill="none" stroke="${c}" stroke-width="0.5" opacity="0.12"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  waves: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="200" height="40" patternUnits="userSpaceOnUse"><path d="M0,20Q50,0 100,20T200,20" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  dna: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><pattern id="${id}" width="40" height="80" patternUnits="userSpaceOnUse"><path d="M0,0Q20,20 40,0M0,40Q20,60 40,40M0,80Q20,100 40,80" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.15"/><path d="M0,20Q20,0 40,20M0,60Q20,40 40,60" fill="none" stroke="${c}" stroke-width="0.6" opacity="0.08"/></pattern></defs><rect width="100%" height="100%" fill="url(#${id})"/></svg>`,

  noise: (c,id) => `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><defs><filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter></defs><rect width="100%" height="100%" filter="url(#${id})" opacity="0.05"/></svg>`
};

// ── Static pattern injection ──
function injectBg(pattern, element, color) {
  if (!SVG_PATTERNS[pattern]) return;
  const c = color || getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#636bf0';
  const id = uid();
  const svg = SVG_PATTERNS[pattern](c, id);
  element.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  element.style.backgroundRepeat = 'repeat';
}

// ── Animated backgrounds ──
const ANIMATED_BGS = {
  orbs: (el) => {
    [
      { color:'var(--accent)', size:400, dur:20, top:'10%', left:'15%' },
      { color:'#a855f7', size:300, dur:25, top:'50%', right:'10%' },
      { color:'#06b6d4', size:250, dur:18, bottom:'10%', left:'40%' },
    ].forEach((cfg, i) => {
      const orb = document.createElement('div');
      orb.className = 'apex-animated-bg-child';
      Object.assign(orb.style, {
        position:'absolute', borderRadius:'50%', filter:'blur(80px)', opacity:'0.25',
        width:cfg.size+'px', height:cfg.size+'px', background:cfg.color, pointerEvents:'none',
        mixBlendMode:'screen', animation:`apex-drift-${i} ${cfg.dur}s ease-in-out infinite`,
        top:cfg.top||'auto', left:cfg.left||'auto', right:cfg.right||'auto', bottom:cfg.bottom||'auto',
      });
      el.appendChild(orb);
    });
  },

  aurora: (el) => {
    [
      { color:'var(--accent)', y:'20%', dur:12 },
      { color:'#a855f7', y:'45%', dur:16 },
      { color:'#06b6d4', y:'65%', dur:20 },
      { color:'#f43f5e', y:'80%', dur:14 },
    ].forEach((s,i) => {
      const d = document.createElement('div');
      d.className = 'apex-animated-bg-child';
      Object.assign(d.style, {
        position:'absolute', width:'120%', height:'120px', top:s.y, left:'-10%',
        background:`linear-gradient(90deg, transparent, ${s.color}, transparent)`,
        filter:'blur(50px)', opacity:'0.12', pointerEvents:'none',
        animation:`apex-aurora-${i%3} ${s.dur}s ease-in-out infinite`,
      });
      el.appendChild(d);
    });
  },

  particles: (el) => {
    for (let i = 0; i < 40; i++) {
      const p = document.createElement('div');
      p.className = 'apex-animated-bg-child';
      const size = 1 + Math.random() * 3;
      Object.assign(p.style, {
        position:'absolute', width:size+'px', height:size+'px', borderRadius:'50%',
        background:'var(--accent)', opacity: String(0.08 + Math.random() * 0.25),
        left: Math.random()*100+'%', top: Math.random()*100+'%', pointerEvents:'none',
        animation:`apex-float ${6+Math.random()*14}s ease-in-out ${Math.random()*5}s infinite`,
      });
      el.appendChild(p);
    }
  },

  gradient: (el) => {
    const mesh = document.createElement('div');
    mesh.className = 'apex-animated-bg-child';
    Object.assign(mesh.style, {
      position:'absolute', inset:'0', pointerEvents:'none', opacity:'0.4',
      background:`radial-gradient(ellipse at 20% 50%, var(--accent-glow) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(168,85,247,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 80%, rgba(6,182,212,0.05) 0%, transparent 50%)`,
      animation:'apex-mesh-shift 20s ease-in-out infinite',
    });
    el.appendChild(mesh);
  },

  rings: (el) => {
    for (let i = 0; i < 4; i++) {
      const ring = document.createElement('div');
      ring.className = 'apex-animated-bg-child';
      Object.assign(ring.style, {
        position:'absolute', borderRadius:'50%', pointerEvents:'none',
        border:'1px solid var(--accent)', opacity:'0',
        width:'0', height:'0',
        top:'50%', left:'50%', transform:'translate(-50%,-50%)',
        animation:`apex-ring-expand 6s ease-out ${i*1.5}s infinite`,
      });
      el.appendChild(ring);
    }
  },

  matrix: (el) => {
    for (let i = 0; i < 20; i++) {
      const col = document.createElement('div');
      col.className = 'apex-animated-bg-child';
      Object.assign(col.style, {
        position:'absolute', width:'1px', pointerEvents:'none',
        background:`linear-gradient(180deg, transparent, var(--accent), transparent)`,
        height: (60 + Math.random()*120) + 'px', opacity: String(0.06 + Math.random()*0.1),
        left: Math.random()*100+'%', top: '-150px',
        animation:`apex-rain ${4+Math.random()*8}s linear ${Math.random()*5}s infinite`,
      });
      el.appendChild(col);
    }
  },

  nebula: (el) => {
    ['var(--accent)', '#a855f7', '#ec4899', '#06b6d4', '#f59e0b'].forEach((color, i) => {
      const blob = document.createElement('div');
      blob.className = 'apex-animated-bg-child';
      const size = 150 + Math.random()*250;
      Object.assign(blob.style, {
        position:'absolute', borderRadius:'50%', filter:'blur(100px)',
        width:size+'px', height:size+'px', background:color, pointerEvents:'none',
        opacity: String(0.08 + Math.random()*0.1), mixBlendMode:'screen',
        top: Math.random()*80+'%', left: Math.random()*80+'%',
        animation:`apex-drift-${i%3} ${15+Math.random()*15}s ease-in-out infinite`,
      });
      el.appendChild(blob);
    });
  },

  spotlight: (el) => {
    const light = document.createElement('div');
    light.className = 'apex-animated-bg-child';
    Object.assign(light.style, {
      position:'absolute', width:'600px', height:'600px', borderRadius:'50%',
      background:'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
      top:'50%', left:'50%', transform:'translate(-50%,-50%)', pointerEvents:'none',
      animation:'apex-spotlight 8s ease-in-out infinite',
    });
    el.appendChild(light);
  }
};

function injectAnimatedBg(type, el) {
  if (el === document.body) {
    let wrapper = document.getElementById('apex-bg-layer');
    if (!wrapper) {
      wrapper = document.createElement('div');
      wrapper.id = 'apex-bg-layer';
      Object.assign(wrapper.style, {
        position:'fixed', inset:'0', zIndex:'-1', overflow:'hidden', pointerEvents:'none'
      });
      document.body.prepend(wrapper);
    }
    wrapper.innerHTML = '';
    if (ANIMATED_BGS[type]) ANIMATED_BGS[type](wrapper);
  } else {
    el.style.position = el.style.position || 'relative';
    el.style.overflow = 'hidden';
    if (ANIMATED_BGS[type]) ANIMATED_BGS[type](el);
  }
}

// ── Keyframes ──
const animStyle = document.createElement('style');
animStyle.textContent = `
  @keyframes apex-drift-0 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(60px,-40px)} 66%{transform:translate(-30px,50px)} }
  @keyframes apex-drift-1 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(-50px,30px)} 66%{transform:translate(40px,-45px)} }
  @keyframes apex-drift-2 { 0%,100%{transform:translate(0,0)} 33%{transform:translate(35px,45px)} 66%{transform:translate(-55px,-25px)} }
  @keyframes apex-aurora-0 { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(5%) scaleY(1.4)} }
  @keyframes apex-aurora-1 { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(-8%) scaleY(0.7)} }
  @keyframes apex-aurora-2 { 0%,100%{transform:translateX(0) scaleY(1)} 50%{transform:translateX(6%) scaleY(1.2)} }
  @keyframes apex-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
  @keyframes apex-mesh-shift { 0%,100%{filter:hue-rotate(0deg)} 50%{filter:hue-rotate(30deg)} }
  @keyframes apex-ring-expand { 0%{width:0;height:0;opacity:0.3} 100%{width:500px;height:500px;opacity:0} }
  @keyframes apex-rain { 0%{transform:translateY(-150px)} 100%{transform:translateY(110vh)} }
  @keyframes apex-spotlight { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:0.5} 50%{transform:translate(-40%,-40%) scale(1.2);opacity:0.8} }
`;
document.head.appendChild(animStyle);

// ── Auto-apply ──
function initBgs() {
  document.querySelectorAll('[data-bg]').forEach(el => injectBg(el.dataset.bg, el, el.dataset.bgColor));
  document.querySelectorAll('[data-animated-bg]').forEach(el => injectAnimatedBg(el.dataset.animatedBg, el));
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBgs);
} else {
  initBgs();
}
