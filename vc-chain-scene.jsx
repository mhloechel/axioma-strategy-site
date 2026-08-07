/* Biopharma Value Chain — animated explainer
   Loads real world geometry (d3-geo Natural Earth) at runtime and animates
   the tangled hand-offs of the biopharma value chain on the globe.
   Built on animations-v2 (SceneStage) + Axioma Strategy design system. */

const { useState, useEffect, useRef } = React;
const W = 1600, H = 900;

const C = {
  bg: '#1A1A1A', surface: '#232120', border: 'rgba(244,238,227,0.10)',
  text: '#F4EEE3', muted: '#B0A79A', teal: '#007889', cyan: '#00B6CC',
};
let TW = { labelDensity: 'focus', packetSpeed: 1, captionScale: 1, motionEditor: true };

// ── Node locations [lon,lat] + labels ───────────────────────────────────────
const LOCS = {
  boston:[-71.06,42.36], sandiego:[-122.42,37.77], basel:[7.59,47.56],
  london:[-0.12,51.5], amsterdam:[4.9,52.37], frankfurt:[8.68,50.11],
  bangalore:[77.59,12.97], shanghai:[121.47,31.23], tokyo:[139.69,35.68],
  beijing:[116.4,39.9], singapore:[103.82,1.35], dublin:[-6.26,53.35],
  puertorico:[-66.11,18.47], washington:[-77.04,38.9], newyork:[-74.0,40.71],
  chicago:[-87.63,41.88], memphis:[-90.05,35.15], saopaulo:[-46.63,-23.55],
  capetown:[18.42,-33.92], sydney:[151.21,-33.87],
  patientUS:[-98.5,39.0], patientEU:[10.0,48.0], patientAsia:[100.0,20.0],
};
const LABELS = {
  boston:'Boston · R&D', sandiego:'San Francisco · Biotech', basel:'Basel · Pharma HQ',
  london:'London · Trials / NHS', amsterdam:'Amsterdam · EMA', frankfurt:'Germany · Payers',
  bangalore:'Bengaluru · Trials & CRO', shanghai:'Shanghai · Mfg & Trials',
  tokyo:'Tokyo · PMDA & Payer', beijing:'Beijing · NMPA', singapore:'Singapore · Mfg',
  dublin:'Dublin · Manufacturing', puertorico:'Puerto Rico · Mfg', washington:'Washington · FDA',
  newyork:'New York · Payers & PBMs', chicago:'Chicago · Physicians', memphis:'Memphis · Distribution',
  saopaulo:'São Paulo · Trials & Patients', capetown:'Cape Town · Trials', sydney:'Sydney · Market',
  patientUS:'Patient · US', patientEU:'Patient · EU', patientAsia:'Patient · Asia',
};
const REGULATORS = new Set(['washington','amsterdam','tokyo','beijing']);
const PATIENTS = new Set(['patientUS','patientEU','patientAsia']);

// ── Scene definitions (parallel to OM_SCENES order) ──────────────────────────
const ORDER = ['open','simple','research','trials','regulators','manufacturing','payers','delivery','tangle','axioma'];
const DEF = {
  open: { focus:null, nodes:[], arcs:[], overlay:'title' },
  simple: { focus:['boston','dublin','patientUS'], nodes:['boston','dublin','patientUS'],
    labels:['boston','dublin','patientUS'],
    arcs:[['boston','dublin','drug'],['dublin','patientUS','drug']],
    caption:{ step:'The story we tell', text:'Discover a molecule, make a medicine, hand it to a patient. Simple, right?' } },
  research: { focus:['boston','basel'], nodes:['sandiego','basel'],
    labels:['boston','basel','sandiego'],
    arcs:[['sandiego','boston','info'],['basel','boston','info']],
    caption:{ step:'01 · Research & Development', text:'10–15 years, billions spent, and roughly 9 in 10 candidates fail. Each failure is what narrows the path to the one that works.' } },
  trials: { focus:null, nodes:['london','bangalore','saopaulo','shanghai','capetown'],
    labels:['london','bangalore','saopaulo','shanghai','capetown'],
    arcs:[['boston','london','info'],['boston','bangalore','info'],['boston','saopaulo','info'],['boston','shanghai','info'],['boston','capetown','info']],
    caption:{ step:'02 · Clinical trials', text:'Trials run across multiple continents at once — thousands of patients, sites and CROs feeding data back.' } },
  regulators: { focus:null, nodes:['washington','amsterdam','tokyo','beijing'],
    labels:['washington','amsterdam','tokyo','beijing'],
    arcs:[['dublin','washington','info'],['basel','amsterdam','info'],['dublin','tokyo','info'],['shanghai','beijing','info']],
    caption:{ step:'03 · Regulators', text:'The major markets each apply their own standards, independently. Smaller markets often rely on those reviews instead of running their own.' } },
  manufacturing: { focus:null, nodes:['singapore','puertorico','memphis','frankfurt','patientEU','patientAsia'],
    labels:['singapore','puertorico','memphis'],
    arcs:[['basel','dublin','drug'],['shanghai','singapore','drug'],['puertorico','memphis','drug'],['dublin','memphis','drug'],['singapore','memphis','drug'],['memphis','patientUS','drug'],['memphis','frankfurt','drug'],['memphis','patientAsia','drug']],
    caption:{ step:'04 · Manufacturing & distribution', text:'Ingredient made in one country, formulated in another, packaged in a third — then shipped worldwide.' } },
  payers: { focus:['newyork','chicago','patientUS','washington'], nodes:['newyork','chicago'],
    labels:['newyork','chicago','patientUS'],
    arcs:[['patientUS','newyork','info'],['newyork','chicago','info'],['newyork','boston','info'],['newyork','washington','info']],
    caption:{ step:'05 · Payers, PBMs & insurers', text:'Between you and your medicine sits a maze of insurers, pharmacy middlemen and rebates — different in every country.' } },
  delivery: { focus:null, nodes:[],
    labels:['patientUS','patientEU','patientAsia'],
    arcs:[['chicago','patientUS','drug'],['frankfurt','patientEU','drug'],['london','patientEU','drug'],['tokyo','patientAsia','drug'],['shanghai','patientAsia','drug']],
    caption:{ step:'06 · Physicians, pharmacies & patients', text:'Prescribed by a physician, dispensed by a pharmacy, taken by a patient — the only part most of us ever see.' } },
  tangle: { focus:null, nodes:'all', labels:[],
    arcs:[['boston','chicago','info'],['boston','newyork','info'],['basel','frankfurt','info'],['chicago','patientUS','info'],['patientUS','chicago','info'],['shanghai','basel','drug'],['bangalore','london','info'],['frankfurt','amsterdam','info'],['tokyo','singapore','drug'],['london','washington','info'],['capetown','london','info'],['sydney','singapore','drug'],['saopaulo','newyork','info'],['memphis','sydney','drug'],['puertorico','newyork','info'],['beijing','shanghai','info']],
    caption:{ step:'The whole picture', text:'This is the real value chain. Dozens of players, every one a hand-off — and no single one sees all of it.' } },
  axioma: { focus:null, nodes:'all', labels:[], arcs:[], overlay:'axioma' },
};
// expand node lists (handle 'all')
function nodeList(nm){ const v = DEF[nm].nodes; return v === 'all' ? Object.keys(LOCS) : (v||[]); }
// first scene index each node becomes active
const NODE_INTRO = {};
ORDER.forEach((nm,i)=>{ nodeList(nm).forEach(k=>{ if(NODE_INTRO[k]===undefined) NODE_INTRO[k]=i; }); });

// ── World geometry (loaded once) ─────────────────────────────────────────────
let WORLD = null;
async function buildWorld(){
  const topo = await fetch(window.__resources && window.__resources.worldAtlas || 'https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-110m.json').then(r=>r.json());
  const countries = topojson.feature(topo, topo.objects.countries);
  const proj = d3.geoNaturalEarth1().fitExtent([[46,78],[W-46,H-92]], {type:'Sphere'});
  const path = d3.geoPath(proj);
  const paths = countries.features.map(f=>path(f)).filter(Boolean);
  const sphere = path({type:'Sphere'});
  const nodes = {};
  for (const k in LOCS){ nodes[k] = proj(LOCS[k]); }
  return { paths, sphere, nodes };
}

// ── math helpers (clamp/Easing/interpolate come from animations-v2 globals) ──
function ss(e0,e1,x){ let t=clamp((x-e0)/(e1-e0),0,1); return t*t*(3-2*t); }
const ec = Easing.easeInOutCubic, es = Easing.easeInOutSine, eo = Easing.easeOutCubic;

function camFor(focusKeys){
  if(!focusKeys) return { fx:W/2, fy:H/2, s:1 };
  const pts = focusKeys.map(k=>WORLD.nodes[k]).filter(Boolean);
  if(!pts.length) return { fx:W/2, fy:H/2, s:1 };
  let x0=1e9,y0=1e9,x1=-1e9,y1=-1e9;
  pts.forEach(p=>{ x0=Math.min(x0,p[0]); y0=Math.min(y0,p[1]); x1=Math.max(x1,p[0]); y1=Math.max(y1,p[1]); });
  const cx=(x0+x1)/2, cy=(y0+y1)/2, bw=Math.max(x1-x0,120), bh=Math.max(y1-y0,120);
  const s = clamp(Math.min((W*0.60)/(bw*1.6),(H*0.60)/(bh*1.6)),1,2.25);
  return { fx:cx, fy:cy, s };
}
function quad(a,c,b,t){ const u=1-t; return [u*u*a[0]+2*u*t*c[0]+t*t*b[0], u*u*a[1]+2*u*t*c[1]+t*t*b[1]]; }
function arcParts(f,to){
  const a=WORLD.nodes[f], b=WORLD.nodes[to];
  const mx=(a[0]+b[0])/2, my=(a[1]+b[1])/2, d=Math.hypot(b[0]-a[0],b[1]-a[1]);
  const c=[mx, my - d*0.30 - 24];
  const len=Math.hypot(c[0]-a[0],c[1]-a[1])+Math.hypot(b[0]-c[0],b[1]-c[1]);
  return { a, b, c, d, len };
}

function buildArcs(idx){
  const seen=new Map(), out=[];
  for(let i=0;i<=idx;i++){ (DEF[ORDER[i]].arcs||[]).forEach(([f,to,k])=>{ const id=f+'>'+to; if(!seen.has(id)){ seen.set(id,i); out.push({f,to,k,since:i}); } }); }
  return out;
}

// ── The scene renderer (one component drives every scene) ────────────────────
function ChainScene(props){
  const { progress:p, localTime, index } = props;
  if(!WORLD) return null;
  const name = ORDER[index];
  const def = DEF[name];
  const env = ss(0,0.09,p) * ss(1,0.9,p);       // transient layer envelope (0 at both edges)
  const capScale = TW.captionScale || 1;
  const pkSpeed = TW.packetSpeed || 1;

  // camera
  const camFrom = index>0 ? camFor(DEF[ORDER[index-1]].focus) : camFor(null);
  const camTo = camFor(def.focus);
  const e = ec(p);
  let fx = camFrom.fx+(camTo.fx-camFrom.fx)*e;
  let fy = camFrom.fy+(camTo.fy-camFrom.fy)*e;
  let s  = camFrom.s +(camTo.s -camFrom.s )*e;
  const staticCam = camFrom.s===camTo.s && camFrom.fx===camTo.fx;
  if(staticCam){ s *= 1 + 0.022*es(p); fy -= 6*es(p); }       // subtle ken-burns
  const scr = (pt)=>[ W/2 + (pt[0]-fx)*s, H/2 + (pt[1]-fy)*s ];
  const mapT = `translate(${W/2 - fx*s} ${H/2 - fy*s}) scale(${s})`;

  // map opacity (open scene fades map up)
  const mapOp = name==='open' ? (0.32 + 0.68*eo(clamp(p/0.6,0,1))) : 1;

  // arcs
  const arcs = buildArcs(index);
  const arcEls = [], packetEls = [];
  arcs.forEach((arc,i)=>{
    const isNew = arc.since===index;
    const pr = arcParts(arc.f, arc.to);
    const col = arc.k==='drug' ? C.teal : C.cyan;
    let drawT = 1, op = 0.5, hi = 0;
    if(isNew){
      drawT = eo(clamp(p/0.5,0,1));
      hi = drawT * (1 - ss(0.62,0.94,p));       // highlight fades out before edge
      op = 0.5*drawT + 0.38*hi;
    }
    if(name==='axioma'){ op = 0.5 - 0.37*ec(p); drawT=1; }   // whole web dims down
    const dPath = `M${pr.a[0]},${pr.a[1]} Q${pr.c[0]},${pr.c[1]} ${pr.b[0]},${pr.b[1]}`;
    arcEls.push(
      React.createElement('path',{ key:'u'+i, d:dPath, fill:'none', stroke:col,
        strokeWidth:6, opacity:op*0.18, strokeLinecap:'round', vectorEffect:'non-scaling-stroke' }),
      React.createElement('path',{ key:'a'+i, d:dPath, fill:'none', stroke:col,
        strokeWidth:2.4, opacity:op, strokeLinecap:'round', vectorEffect:'non-scaling-stroke',
        strokeDasharray:pr.len, strokeDashoffset:pr.len*(1-drawT) })
    );
    // packets
    if(isNew && hi>0.02){
      const pt = scr(quad(pr.a,pr.c,pr.b,Math.min(drawT,1)));
      packetEls.push(React.createElement('circle',{ key:'p'+i, cx:pt[0], cy:pt[1], r:5,
        fill:col, opacity:env*hi }));
    }
    if(name==='tangle'){
      const tt = ((localTime*0.28*pkSpeed + i*0.137) % 1 + 1) % 1;
      const pt = scr(quad(pr.a,pr.c,pr.b,tt));
      packetEls.push(React.createElement('circle',{ key:'tp'+i, cx:pt[0], cy:pt[1], r:4.5,
        fill:col, opacity:env*0.85 }));
    }
  });

  // nodes + rings (screen space)
  const nodeEls=[], ringEls=[];
  Object.keys(LOCS).forEach((k,i)=>{
    const intro = NODE_INTRO[k];
    let bright = 0;
    if(intro!==undefined){
      if(intro<index) bright = 1;
      else if(intro===index) bright = ss(0,0.35,p);
    }
    const pt = scr(WORLD.nodes[k]);
    const col = REGULATORS.has(k) ? C.cyan : (PATIENTS.has(k) ? C.text : C.teal);
    // dim base dot for every node
    nodeEls.push(React.createElement('circle',{ key:'d'+i, cx:pt[0], cy:pt[1], r:3,
      fill:C.muted, opacity:0.22 + 0.10*(name==='open'?eo(clamp(p/0.6,0,1)):1) }));
    if(bright>0.01){
      // pulse ring (transient)
      const pulse = (Math.sin(localTime*2.4 + i)*0.5+0.5);
      ringEls.push(React.createElement('circle',{ key:'r'+i, cx:pt[0], cy:pt[1],
        r:6 + pulse*10, fill:'none', stroke:col, strokeWidth:1.4,
        opacity:env*bright*(0.5-0.42*pulse) }));
      if(REGULATORS.has(k)){
        ringEls.push(React.createElement('circle',{ key:'rr'+i, cx:pt[0], cy:pt[1], r:11,
          fill:'none', stroke:C.cyan, strokeWidth:1.4, opacity:bright*0.7 }));
      }
      nodeEls.push(
        React.createElement('circle',{ key:'nb'+i, cx:pt[0], cy:pt[1], r:6.5,
          fill:C.bg, opacity:bright }),
        React.createElement('circle',{ key:'n'+i, cx:pt[0], cy:pt[1], r:5,
          fill:col, opacity:bright, stroke:C.text, strokeWidth:0.6 })
      );
    }
  });

  // labels (HTML overlay, transient) — which nodes to label this scene
  let labelKeys = def.labels || nodeList(name);
  if(TW.labelDensity==='all'){
    labelKeys = Object.keys(LOCS).filter(k=>NODE_INTRO[k]!==undefined && NODE_INTRO[k]<=index);
  }
  const labelEls = labelKeys.map((k,i)=>{
    const pt = scr(WORLD.nodes[k]);
    if(pt[0]<10||pt[0]>W-10||pt[1]<10||pt[1]>H-90) return null;
    if(def.caption && pt[0]<1040 && pt[1]>H-190) return null;
    const flip = pt[0] > W-260;
    return React.createElement('div',{ key:'l'+k, style:{
      position:'absolute', left: flip? undefined : pt[0]+11, right: flip? (W-pt[0])+11 : undefined,
      top: pt[1]-13, opacity:env, transition:'none',
      background:'rgba(35,33,32,0.86)', border:'1px solid '+C.border, borderRadius:4,
      padding:'3px 8px', font:'600 15px "Open Sans", sans-serif', color:C.text,
      whiteSpace:'nowrap', letterSpacing:'0.01em', pointerEvents:'none' } }, LABELS[k]);
  });

  // caption
  let captionEl=null;
  if(def.caption){
    const y = 18*(1-eo(clamp(p/0.14,0,1)));
    captionEl = React.createElement('div',{ style:{
      position:'absolute', left:96, bottom:92, maxWidth:900, opacity:env,
      transform:`translateY(${y}px)`, pointerEvents:'none' } },
      React.createElement('div',{ style:{ display:'flex', alignItems:'center', gap:12, marginBottom:16 } },
        React.createElement('div',{ style:{ display:'flex', gap:4, alignItems:'flex-end' } },
          [0,1,2,3].map(b=>React.createElement('div',{ key:b, style:{
            width:5, height:5+b*3.5, background:b%2?C.cyan:C.teal, opacity:0.4+b*0.2, borderRadius:1 } }))
        ),
        React.createElement('div',{ style:{ font:'700 21px "Montserrat", sans-serif',
          letterSpacing:'0.15em', textTransform:'uppercase', color:C.cyan } }, def.caption.step)
      ),
      React.createElement('div',{ style:{ font:`600 ${46*capScale}px "Montserrat", sans-serif`,
        lineHeight:1.16, color:C.text, textWrap:'balance', maxWidth:880 } }, def.caption.text)
    );
  }

  // title / axioma cards
  let cardEl=null;
  if(def.overlay==='title'){
    cardEl = React.createElement('div',{ style:{
      position:'absolute', inset:0, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center',
      background:'rgba(26,26,26,0.55)', opacity:env, pointerEvents:'none' } },
      React.createElement('div',{ style:{ display:'flex', alignItems:'center', gap:12, marginBottom:34 } },
        React.createElement('img',{ src:'assets/axioma-leaf-mark.png', style:{ width:34, height:34, objectFit:'contain' } }),
        React.createElement('div',{ style:{ font:'600 16px "Montserrat", sans-serif',
          letterSpacing:'0.34em', textTransform:'uppercase', color:C.muted } }, 'Axioma Strategy')
      ),
      React.createElement('div',{ style:{ font:'700 96px "Montserrat", sans-serif',
        lineHeight:1.02, color:C.text, maxWidth:1180, textWrap:'balance' } }, 'How medicine actually reaches patients like you.'),
      React.createElement('div',{ style:{ marginTop:30, font:'400 30px "Open Sans", sans-serif',
        color:C.muted, maxWidth:820, textWrap:'balance' } }, 'The biopharma value chain — as tangled as it is invisible.')
    );
  } else if(def.overlay==='axioma'){
    const rise = ec(clamp(p/0.7,0,1));
    cardEl = React.createElement('div',{ style:{
      position:'absolute', inset:0, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center', textAlign:'center',
      background:`rgba(26,26,26,${0.78*rise})`, opacity:rise, pointerEvents:'none' } },
      React.createElement('div',{ style:{ display:'flex', gap:6, marginBottom:30 } },
        [0,1,2,3,4].map(b=>React.createElement('div',{ key:b, style:{
          width:22, height:(12+b*12)*rise, background:b%2?C.cyan:C.teal, opacity:0.35+b*0.16,
          borderRadius:2, alignSelf:'flex-end' } }))
      ),
      React.createElement('div',{ style:{ font:'700 78px "Montserrat", sans-serif',
        lineHeight:1.05, color:C.text, maxWidth:1120, textWrap:'balance' } }, 'It’s complicated. We make it navigable.'),
      React.createElement('div',{ style:{ marginTop:28, font:'400 29px "Open Sans", sans-serif',
        color:C.muted, maxWidth:900, lineHeight:1.5, textWrap:'balance' } },
        'Axioma Strategy applies systems thinking and a disciplined creative problem-solving process to find — and implement — real, enduring solutions.'),
      React.createElement('div',{ style:{ display:'flex', alignItems:'center', gap:13, marginTop:44, opacity:ss(0.35,0.8,p) } },
        React.createElement('img',{ src:'assets/axioma-leaf-mark.png', style:{ width:40, height:40, objectFit:'contain' } }),
        React.createElement('div',{ style:{ font:'700 26px "Montserrat", sans-serif', color:C.text, letterSpacing:'0.02em' } }, 'Axioma Strategy')
      ),
      React.createElement('div',{ style:{ marginTop:22, font:'400 15px "Open Sans", sans-serif',
        color:'rgba(176,167,154,0.65)', opacity:ss(0.5,0.9,p) } }, 'Axioma Strategy is a division of Axioma Group Inc.')
    );
  }

  return React.createElement('div',{ style:{ position:'absolute', inset:0, width:W, height:H, overflow:'hidden' } },
    React.createElement('svg',{ width:W, height:H, viewBox:`0 0 ${W} ${H}`, style:{ position:'absolute', inset:0 } },
      React.createElement('g',{ transform:mapT, opacity:mapOp },
        WORLD.paths.map((d,i)=>React.createElement('path',{ key:'c'+i, d, fill:'#302c29',
          stroke:'rgba(244,238,227,0.16)', strokeWidth:1, vectorEffect:'non-scaling-stroke' })),
        arcEls
      ),
      React.createElement('g',null, ringEls, nodeEls, packetEls)
    ),
    labelEls,
    captionEl,
    cardEl
  );
}

// ── Loader (pre-geometry) ────────────────────────────────────────────────────
function Loader(){
  return React.createElement('div',{ style:{ position:'absolute', inset:0, display:'flex',
    alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, background:C.bg } },
    React.createElement('div',{ style:{ display:'flex', gap:6 } },
      [0,1,2,3].map(b=>React.createElement('div',{ key:b, style:{ width:14, height:12+b*9,
        background:b%2?C.cyan:C.teal, opacity:0.5, borderRadius:1, animation:`om-pulse 1.2s ${b*0.15}s ease-in-out infinite` } }))
    ),
    React.createElement('div',{ style:{ font:'600 15px "Montserrat", sans-serif', letterSpacing:'0.24em',
      textTransform:'uppercase', color:C.muted } }, 'Mapping the value chain…')
  );
}

const SCENE_MAP = {};
ORDER.forEach(nm=>{ SCENE_MAP[nm]=ChainScene; });

function App(){
  const [tw,setTweak] = useTweaks(window.TWEAK_DEFAULTS);
  TW = tw;
  const [ready,setReady] = useState(!!WORLD);
  useEffect(()=>{
    if(WORLD){ setReady(true); return; }
    let alive=true;
    buildWorld().then(w=>{ WORLD=w; if(alive) setReady(true); }).catch(e=>console.error('world load failed',e));
    return ()=>{ alive=false; };
  },[]);
  return React.createElement('div',{ style:{ position:'relative', width:'100%', height:'100%', background:C.bg } },
    ready
      ? React.createElement(SceneStage,{ width:W, height:H, bg:C.bg,
          scenes:window.OM_SCENES, playback:window.OM_PLAYBACK, transition:'cut' }, SCENE_MAP)
      : React.createElement(Loader,null),
    React.createElement(TweaksPanel,null,
      React.createElement(TweakSection,{ label:'Playback' }),
      React.createElement(TweakToggle,{ label:'Motion editor', value:tw.motionEditor, onChange:v=>setTweak('motionEditor',v) }),
      React.createElement(TweakSlider,{ label:'Packet speed', value:tw.packetSpeed, min:0.3, max:2.5, step:0.1, unit:'×', onChange:v=>setTweak('packetSpeed',v) }),
      React.createElement(TweakSection,{ label:'Labels & captions' }),
      React.createElement(TweakRadio,{ label:'Labels', value:tw.labelDensity, options:['focus','all'], onChange:v=>setTweak('labelDensity',v) }),
      React.createElement(TweakSlider,{ label:'Caption size', value:tw.captionScale, min:0.75, max:1.35, step:0.05, unit:'×', onChange:v=>setTweak('captionScale',v) })
    )
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App,null));
