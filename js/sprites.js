// PokéBattle Sprites & Animations

function spawnDmg(wrapId,dmg,color,isS){
  const arena=document.getElementById("arena");if(!arena)return;
  const W=arena.offsetWidth||SP.W||300;
  const H=arena.offsetHeight||SP.groundY*1.5||200;
  const isP1=wrapId==="sp1wrap";
  // Use SP if available, else fallback to % of arena
  const cx=SP.W>0?(isP1?SP.p1cx:SP.p2cx):(isP1?W*0.22:W*0.78);
  const cy=SP.groundY>0?(SP.groundY-SP.sprH*0.6):(H*0.4);
  const d=document.createElement("div");
  // Size proportional to damage
  const maxHp=SP.sprH>0?SP.sprH:100;
  const dmgRatio=Math.min(1,dmg/80);
  const baseSize=isS?1.8:1.2;
  const scaledSize=(baseSize+dmgRatio*1.4).toFixed(1);
  d.style.cssText=`position:absolute;left:${cx}px;top:${cy}px;transform:translateX(-50%);font-family:'Press Start 2P',monospace;font-weight:900;font-size:min(${scaledSize}rem,${Math.round(scaledSize*3)}vw);color:${isS?"#FCD34D":color};text-shadow:0 3px 14px rgba(0,0,0,.95),0 0 ${Math.round(dmgRatio*30)+10}px ${color};pointer-events:none;animation:dmgFloat ${0.9+dmgRatio*0.6}s ease-out forwards;z-index:100;white-space:nowrap;`;
  d.textContent=(isS?"★":"")+"-"+dmg;
  arena.appendChild(d);
  setTimeout(()=>d.remove(),2000);
}

function sfxBurst(isSuper,color){
  // Central screen flash + burst
  const arena=document.getElementById("arena");
  if(!arena)return;
  // Screen flash
  const flash=document.createElement("div");
  flash.style.cssText=`position:absolute;inset:0;background:${isSuper?"rgba(255,240,80,.45)":"rgba(255,255,255,.25)"};z-index:10;pointer-events:none;animation:sfShock ${isSuper?".45s":".3s"} ease-out forwards;`;
  arena.appendChild(flash);setTimeout(()=>flash.remove(),800);
  // Screen shake for super effective
  if(isSuper){
    arena.style.animation="none";void arena.offsetWidth;
    arena.style.transform="translate(0,0)";
    let s=0;const shk=setInterval(()=>{
      s++;arena.style.transform=`translate(${(Math.random()-.5)*12}px,${(Math.random()-.5)*6}px)`;
      if(s>6){clearInterval(shk);arena.style.transform="";};
    },50);
  }

  // Central burst rings
  const cx=document.getElementById("sfx-center");if(!cx)return;
  const rings=isSuper?3:2;
  for(let i=0;i<rings;i++){
    setTimeout(()=>{
      const ring=document.createElement("div");
      ring.style.cssText=`position:absolute;width:${isSuper?120:80}px;height:${isSuper?120:80}px;border-radius:50%;border:${isSuper?5:3}px solid ${color};animation:sfBurst ${isSuper?.5:.35}s ease-out forwards;`;
      cx.appendChild(ring);setTimeout(()=>ring.remove(),600);
      // Star burst for super
      if(isSuper){
        const star=document.createElement("div");
        star.style.cssText=`position:absolute;width:0;height:0;border-left:40px solid transparent;border-right:40px solid transparent;border-bottom:70px solid ${color};opacity:.8;animation:sfStar .5s ease-out forwards;filter:drop-shadow(0 0 8px ${color});`;
        cx.appendChild(star);setTimeout(()=>star.remove(),600);
      }
    },i*80);
  }
  // Slash lines
  const numSlash=isSuper?5:3;
  for(let i=0;i<numSlash;i++){
    setTimeout(()=>{
      const slash=document.createElement("div");
      const angle=(Math.random()*180-90).toFixed(0);
      const w=isSuper?(60+Math.random()*80):(30+Math.random()*50);
      slash.style.cssText=`position:absolute;width:${w}px;height:${isSuper?4:2}px;background:linear-gradient(90deg,transparent,${color},white,transparent);transform-origin:left center;transform:rotate(${angle}deg);animation:sfSlash .35s ease-out forwards;filter:blur(.5px);box-shadow:0 0 8px ${color};`;
      cx.appendChild(slash);setTimeout(()=>slash.remove(),400);
    },i*40);
  }
  // Particle sparks
  const sparks=isSuper?12:7;
  for(let i=0;i<sparks;i++){
    setTimeout(()=>{
      const spark=document.createElement("div");
      const angle=Math.random()*360;const dist=(30+Math.random()*60);
      const dx=Math.cos(angle*Math.PI/180)*dist;
      const dy=Math.sin(angle*Math.PI/180)*dist;
      spark.style.cssText=`position:absolute;width:${isSuper?8:5}px;height:${isSuper?8:5}px;background:${Math.random()>.5?color:"#fff"};border-radius:50%;animation:dmgFloat .7s ease-out forwards;box-shadow:0 0 6px ${color};`;
      spark.style.setProperty("--dx",dx+"px");spark.style.setProperty("--dy",dy+"px");
      // Manual movement
      cx.appendChild(spark);
      const start=Date.now();
      const move=()=>{const t=(Date.now()-start)/700;if(t>=1){spark.remove();return;}spark.style.transform=`translate(${dx*t}px,${dy*t-30*t*t}px)`;spark.style.opacity=1-t;requestAnimationFrame(move);};
      move();
    },i*25);
  }
}

function jsLunge(el,isP1,onImpact){
  const wrapEl=document.getElementById(isP1?"sp1wrap":"sp2wrap");
  if(!wrapEl)return;
  const arena=document.getElementById("arena");
  const W=arena?arena.offsetWidth:SP.W||800;
  const dist=Math.round(W*0.18);
  // P1 faces right (scaleX-1), lunges toward p2 = move right = left increases
  // P2 faces left, lunges toward p1 = move left = right decreases (or left set)
  const offsets=[0, dist*0.2*(isP1?1:-1), dist*(isP1?1:-1), dist*0.3*(isP1?1:-1), 0];
  const times=[0,200,160,120,280];
  let step=0;
  const origLeft=wrapEl.style.left;
  const origRight=wrapEl.style.right;
  const origLeftPx=parseInt(origLeft)||0;
  const origRightPx=parseInt(origRight)||0;
  function next(){
    if(step>=offsets.length){
      wrapEl.style.transition="";
      if(isP1)wrapEl.style.left=origLeft;
      else wrapEl.style.right=origRight;
      return;
    }
    const spd=step===0?0.01:step===2?0.13:0.22;
    if(isP1){
      wrapEl.style.transition=`left ${spd}s ease`;
      wrapEl.style.left=(origLeftPx+offsets[step])+"px";
    } else {
      wrapEl.style.transition=`right ${spd}s ease`;
      wrapEl.style.right=(origRightPx-offsets[step])+"px";
    }
    if(step===2&&onImpact)onImpact();
    setTimeout(next,times[step]);
    step++;
  }
  next();
}


// ══════════════════════════════════════════════════════
// TYPE-BASED ATTACK ANIMATIONS on canvas
// ══════════════════════════════════════════════════════
function typeAttackAnim(moveType, isP1Attacking, onDone) {
  const canvas = document.getElementById('scene-canvas');
  if (!canvas) { if(onDone) onDone(); return; }
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  if (!W || !H) { if(onDone) onDone(); return; }

  // Source and target X positions
  const srcX = isP1Attacking ? SP.p1cx : SP.p2cx;
  const tgtX = isP1Attacking ? SP.p2cx : SP.p1cx;
  const midY = SP.groundY - SP.sprH * 0.55;

  const configs = {
    fire:     { color:'#FF4500', glow:'#FF6B00', particles:18, shape:'flame'   },
    water:    { color:'#1E90FF', glow:'#00BFFF', particles:20, shape:'wave'    },
    electric: { color:'#FFD700', glow:'#FFFF00', particles:12, shape:'bolt'    },
    grass:    { color:'#7CFC00', glow:'#ADFF2F', particles:16, shape:'leaf'    },
    ice:      { color:'#A0F0FF', glow:'#E0FFFF', particles:15, shape:'crystal' },
    psychic:  { color:'#FF69B4', glow:'#FF1493', particles:14, shape:'ring'    },
    dark:     { color:'#4B0082', glow:'#8B008B', particles:12, shape:'shadow'  },
    ghost:    { color:'#9400D3', glow:'#EE82EE', particles:10, shape:'wisp'    },
    dragon:   { color:'#6A0DAD', glow:'#9B59B6', particles:20, shape:'beam'    },
    fighting: { color:'#FF6347', glow:'#FF4500', particles:10, shape:'impact'  },
    rock:     { color:'#CD853F', glow:'#DEB887', particles:14, shape:'rock'    },
    ground:   { color:'#DAA520', glow:'#FFD700', particles:16, shape:'quake'   },
    poison:   { color:'#9932CC', glow:'#DA70D6', particles:12, shape:'bubble'  },
    steel:    { color:'#C0C0C0', glow:'#E8E8E8', particles:10, shape:'blade'   },
    flying:   { color:'#87CEEB', glow:'#B0E0E6', particles:14, shape:'wind'    },
    bug:      { color:'#ADFF2F', glow:'#7CFC00', particles:12, shape:'swarm'   },
    normal:   { color:'#FFFFFF', glow:'#E0E0E0', particles:8,  shape:'impact'  },
  };

  const cfg = configs[moveType] || configs.normal;
  const particles = [];
  const t0 = performance.now();
  const DURATION = 600;

  // Initialize particles along the path
  for (let i = 0; i < cfg.particles; i++) {
    const progress = i / cfg.particles;
    particles.push({
      x: srcX + (tgtX - srcX) * progress * 0.3,
      y: midY + (Math.random() - 0.5) * 40,
      vx: (tgtX - srcX) / 25 + (Math.random()-0.5)*3,
      vy: (Math.random()-0.5)*4,
      life: 1.0,
      decay: 0.03 + Math.random()*0.02,
      size: 4 + Math.random()*8,
      delay: i * 20,
      born: t0 + i * 25,
    });
  }

  function drawFrame(now) {
    const elapsed = now - t0;
    if (elapsed > DURATION + 200) { if(onDone) onDone(); return; }

    // Only draw overlay — don't clear full canvas (canvas-scenes handles bg)
    ctx.save();

    particles.forEach(p => {
      if (now < p.born) return;
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) return;

      const a = p.life;
      ctx.globalAlpha = a * 0.85;

      if (cfg.shape === 'bolt') {
        // Lightning zigzag
        ctx.strokeStyle = cfg.color;
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 12;
        ctx.lineWidth = p.size * 0.4;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + (Math.random()-0.5)*20, p.y + 15);
        ctx.lineTo(p.x + p.vx*3, p.y + 30);
        ctx.stroke();
      } else if (cfg.shape === 'ring') {
        // Psychic rings
        ctx.strokeStyle = cfg.color;
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 15;
        ctx.lineWidth = 2;
        const r = p.size * (1 + (1-p.life)*3);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI*2);
        ctx.stroke();
      } else if (cfg.shape === 'wave') {
        // Water wave
        ctx.fillStyle = cfg.color;
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size*1.5, p.size*0.6, p.vx > 0 ? 0.3 : -0.3, 0, Math.PI*2);
        ctx.fill();
      } else if (cfg.shape === 'crystal') {
        // Ice crystals
        ctx.strokeStyle = cfg.color;
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 10;
        ctx.lineWidth = 1.5;
        const s = p.size;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.life * Math.PI);
        ctx.beginPath();
        ctx.moveTo(0,-s); ctx.lineTo(s*0.5,0); ctx.lineTo(0,s); ctx.lineTo(-s*0.5,0); ctx.closePath();
        ctx.stroke();
        ctx.restore();
      } else {
        // Default: glowing particle
        const g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);
        g.addColorStop(0, cfg.glow);
        g.addColorStop(0.4, cfg.color);
        g.addColorStop(1, 'transparent');
        ctx.fillStyle = g;
        ctx.shadowColor = cfg.glow;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
        ctx.fill();
      }
    });

    // Impact flash at target when particles arrive
    if (elapsed > 350 && elapsed < 500) {
      const flashA = (elapsed-350)/150;
      const flash = ctx.createRadialGradient(tgtX, midY, 0, tgtX, midY, 60);
      flash.addColorStop(0, cfg.glow.replace(')', `,${0.6*(1-flashA)})`).replace('rgb','rgba'));
      flash.addColorStop(1, 'transparent');
      ctx.globalAlpha = 1;
      ctx.fillStyle = flash;
      ctx.beginPath();
      ctx.arc(tgtX, midY, 60, 0, Math.PI*2);
      ctx.fill();
    }

    ctx.shadowBlur = 0;
    ctx.restore();
    requestAnimationFrame(drawFrame);
  }

  requestAnimationFrame(drawFrame);
}

// ══════════════════════════════════════════════════════
// CRITICAL HIT & MISS effects
// ══════════════════════════════════════════════════════
function critEffect(isP1Target) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  // Screen flash white
  const fl = document.createElement('div');
  fl.style.cssText = 'position:absolute;inset:0;background:rgba(255,255,255,.85);z-index:40;pointer-events:none;animation:sfShock .2s ease forwards;';
  arena.appendChild(fl);
  setTimeout(()=>fl.remove(), 250);
  // CRITICO text
  const txt = document.createElement('div');
  txt.innerHTML = '⚡ ¡CRÍTICO!';
  txt.style.cssText = `position:absolute;${isP1Target?'right:10%':'left:10%'};top:25%;font-family:'Press Start 2P',monospace;font-size:min(1rem,3.5vw);color:#FFD700;text-shadow:2px 2px 0 #000,0 0 20px #FFD700;z-index:45;pointer-events:none;animation:vsSlam .3s ease forwards;`;
  arena.appendChild(txt);
  setTimeout(()=>txt.remove(), 1200);
}

function koEffect(isP1) {
  const arena = document.getElementById('arena');
  if (!arena) return;
  const txt = document.createElement('div');
  txt.innerHTML = '💥 K.O.!';
  txt.style.cssText = `position:absolute;left:50%;top:35%;transform:translateX(-50%);font-family:'Press Start 2P',monospace;font-size:min(1.4rem,5vw);color:#EF4444;text-shadow:3px 3px 0 #000,0 0 30px #EF4444;z-index:50;pointer-events:none;animation:vsSlam .4s cubic-bezier(.175,.885,.32,1.275) forwards;`;
  arena.appendChild(txt);
  setTimeout(()=>txt.remove(), 2000);
}

function hitAnim(spId,wrapId,ripId,color,dmg,isS,moveType,isCrit){
  const defender=document.getElementById(spId);
  const isDefP1=(spId==="sp1");
  const atkWrapId=isDefP1?"sp2wrap":"sp1wrap";
  const isAtkP1=!isDefP1;
  const atkWrap=document.getElementById(atkWrapId);
  // Type animation on canvas
  typeAttackAnim(moveType||"normal", isAtkP1, null);
  jsLunge(atkWrap,isAtkP1,()=>{
    if(isCrit) critEffect(isDefP1);
    if(defender){
      defender.style.animation="none";void defender.offsetWidth;
      const shakeAnim=isCrit?"shake .9s, flashW .4s":"shake .7s, flashW .6s";
      defender.style.animation=shakeAnim+", "+(isDefP1?"sfRecoil":"sfRecoil2")+" .65s";
      setTimeout(()=>{if(defender){defender.style.animation="";}},isCrit?1100:900);
    }
    sfxBurst(isS,color);
    spawnDmg(wrapId,isCrit?Math.round(dmg)+"!":dmg,color,isS||isCrit);
  });
}

// -- CPU AI -----------------------------------------------------
function cpuA(){
  const b=G.bat,cpu=b.t2[b.a2],en=b.t1[b.a1];
  const avail=cpu.moves.map((m,i)=>({m,i})).filter(x=>b.cd2[x.i]===0&&(cpu.ppLeft[x.i]??x.m.pp)>0);
  if(!avail.length)return{type:"attack",moveIdx:0};

  // FÁCIL: random move
  if(G.diff==="easy"){
    return{type:"attack",moveIdx:avail[Math.floor(Math.random()*avail.length)].i};
  }

  // Score each move
  function scoreMove(m){
    if(m.p===0&&m.effect){
      // Status moves
      if(m.effect==="sleep_opp"&&!en.status) return 85;
      if(m.effect==="atkup"&&!cpu._atkBoost) return 60;
      if(m.effect==="defup"&&!cpu._defBoost) return 50;
      if(m.effect==="heal"&&cpu.currentHp/cpu.hp<0.5) return 70;
      return 10;
    }
    const eff=te(m.t,en.types);
    let score=m.p*eff;
    // Bonus for moves that might KO
    const estDmg=dd(cpu.atk,en.def,m.p,eff);
    if(estDmg>=en.currentHp) score+=200;
    // Prefer super effective
    if(eff>=2) score+=40;
    return score;
  }

  let bi=avail[0].i,bs=-Infinity;
  avail.forEach(({m,i})=>{const sc=scoreMove(m);if(sc>bs){bs=sc;bi=i;}});

  if(G.diff==="normal"){
    // 20% chance to use status move if available
    const statusMoves=avail.filter(({m})=>m.p===0&&m.effect);
    if(statusMoves.length&&Math.random()<0.2&&!en.status){
      return{type:"attack",moveIdx:statusMoves[0].i};
    }
    return{type:"attack",moveIdx:bi};
  }

  // DIFÍCIL: smart AI
  // Switch if badly outmatched
  const defMult=te(en.types[0],cpu.types);
  const hpRatio=cpu.currentHp/cpu.hp;
  if(defMult>=2&&hpRatio<0.6){
    const best=b.t2.reduce((bst,pk,i)=>{
      if(pk.currentHp<=0||i===b.a2)return bst;
      const score=pk.currentHp/pk.hp*100+te(en.types[0],pk.types)*(-25)+te(pk.types[0],en.types)*30;
      return score>bst.score?{i,score}:bst;
    },{i:-1,score:-99});
    if(best.i!==-1&&Math.random()<0.7)return{type:"switch",to:best.i};
  }
  // Use potion strategically
  if(hpRatio<0.25&&b.potions2>0)return{type:"potion"};
  // Use sleep/status if opponent is healthy and no status yet
  if(!en.status&&Math.random()<0.25){
    const sleepMove=avail.find(({m})=>m.effect==="sleep_opp");
    if(sleepMove)return{type:"attack",moveIdx:sleepMove.i};
  }
  return{type:"attack",moveIdx:bi};
}
function reduceCd(arr){return arr.map(v=>Math.max(0,v-1));}

function doAtk(i){
  const b=G.bat;if(b.cd1[i]>0&&b.ct==="p1")return;if(b.cd2[i]>0&&b.ct==="p2")return;
  b.ph="action";const ac={type:"attack",moveIdx:i};
  if(G.mode==="cpu"){execAnim(ac,cpuA());}
  else if(b.ct==="p1"){G.pact=ac;b.ct="p2";shPass(G.p2,()=>{b.ph="action";go("battle");});}
  else{execAnim(G.pact,ac);G.pact=null;b.ct="p1";}
}
function doSw(i){
  const b=G.bat;b.ph="action";const ac={type:"switch",to:i};
  if(G.mode==="cpu"){execAnim(ac,cpuA());}
  else if(b.ct==="p1"){G.pact=ac;b.ct="p2";shPass(G.p2,()=>{b.ph="action";go("battle");});}
  else{execAnim(G.pact,ac);G.pact=null;b.ct="p1";}
}

// -- Main turn animator -----------------------------------------
function execAnim(a1,a2){
  const b=G.bat;b.locked=true;render();
  const sc=G.scenario;
  const nt1=b.t1.map(p=>({...p})),nt2=b.t2.map(p=>({...p}));
  let na1=b.a1,na2=b.a2;const st={...b.st};
  const p1f=nt1[b.a1].spd>=nt2[b.a2].spd;
  const evs=[];

  const weather=sc?sc.weather:null;
  function resolveAct(atk,def,ac,nm,ip){
    if(ac.type==="switch"){
      const idx=ac.to;evs.push({type:"sw",nm,toName:(ip?nt1:nt2)[idx].name,ip,idx});
      if(ip)na1=idx;else na2=idx;return;
    }
    // Check if paralyzed (25% chance to skip)
    if(atk.status==="paralysis"&&Math.random()<.25){
      evs.push({type:"status_skip",nm,reason:"paralysis",ip});return;
    }
    // Check if asleep
    if(atk.status==="sleep"){
      atk.statusTurns=(atk.statusTurns||0)+1;
      if(atk.statusTurns<3){evs.push({type:"status_skip",nm,reason:"sleep",ip});return;}
      else{atk.status=null;atk.statusTurns=0;evs.push({type:"status_wake",nm,ip});}
    }
    const mv=atk.moves[ac.moveIdx];if(!mv)return;
    // Handle status/buff moves (p===0 with effect)
    if(mv.p===0&&mv.effect){
      if(atk.ppLeft[ac.moveIdx]>0)atk.ppLeft[ac.moveIdx]--;
      if(mv.effect==="heal"){
        const h=Math.round(atk.hp*0.5);atk.currentHp=Math.min(atk.hp,atk.currentHp+h);
        atk.status=null;
        evs.push({type:"status_effect",nm,eff:"heal",val:h,ip});
      } else if(mv.effect==="atkup"){
        atk._atkBoost=(atk._atkBoost||0)+1;
        evs.push({type:"status_effect",nm,eff:"atkup",ip});
      } else if(mv.effect==="defup"){
        atk._defBoost=(atk._defBoost||0)+1;
        evs.push({type:"status_effect",nm,eff:"defup",ip});
      } else if(mv.effect==="sleep_opp"){
        if(!def.status){def.status="sleep";def.statusTurns=0;}
        evs.push({type:"status_effect",nm,eff:"sleep_opp",defNm:def.name,ip});
      }
      return;
    }
    const mult=te(mv.t,def.types);
    const atkStat=Math.round(atk.atk*(1+(atk._atkBoost||0)*0.5));
    const defStat=Math.round(def.def*(1+(def._defBoost||0)*0.5));
    const isCrit=Math.random()<0.0625;
    let d=dd(atkStat,defStat,mv.p,mult);
    if(isCrit) d=Math.round(d*1.5);
    // Weather modifiers
    if(weather==="rain"){
      if(mv.t==="water")d=Math.round(d*1.3);
      if(mv.t==="fire")d=Math.round(d*0.7);
    } else if(weather==="thunder"&&Math.random()<0.15&&!def.status){
      def.status="paralysis"; // thunder storms can paralyze
    } else if(weather==="fog"&&Math.random()<0.25){
      d=Math.round(d*0.8); // fog reduces accuracy/damage
    }
    // Burn reduces attack damage by 50%
    if(atk.status==="burn")d=Math.max(1,Math.floor(d*.5));
    def.currentHp=Math.max(0,def.currentHp-d);
    if(atk.ppLeft[ac.moveIdx]>0)atk.ppLeft[ac.moveIdx]--;
    if(ip)b.cd1[ac.moveIdx]=2;else b.cd2[ac.moveIdx]=2;
    st.moves++;
    const isS=mult>=2,isW=mult>0&&mult<=.5,isN=mult===0;
    // Status application (15% chance per move type)
    let newStatus=null;
    if(mult>0&&!def.status){
      for(const[st_id,moves_list] of Object.entries(STATUS_MOVES)){
        if(moves_list.includes(mv.n)&&Math.random()<.3){newStatus=st_id;break;}
      }
    }
    if(newStatus)def.status=newStatus;
    st.dmgDone=(st.dmgDone||0)+d;
    if(ip){st.dmgTypes=st.dmgTypes||{};st.dmgTypes[mv.t]=(st.dmgTypes[mv.t]||0)+1;}
    evs.push({type:"atk",nm,mv,ip,d,isS,isW,isN,isCrit,col:(TC[mv.t]||TC.fire).bg,fainted:def.currentHp<=0,defNm:def.name,newStatus});
    if(def.currentHp<=0)st.defeated++;
    // End-of-turn status damage
    if(atk.status==="poison"||atk.status==="burn"){
      const dot=Math.max(1,Math.floor(atk.hp/8));
      atk.currentHp=Math.max(0,atk.currentHp-dot);
      evs.push({type:"status_dmg",nm,status:atk.status,dot,ip,fainted:atk.currentHp<=0});
      if(atk.currentHp<=0)st.defeated++;
    }
  }

  if(p1f){resolveAct(nt1[b.a1],nt2[b.a2],a1,G.p1.name,true);if(nt2[na2].currentHp>0)resolveAct(nt2[b.a2],nt1[na1],a2,G.p2.name,false);}
  else{resolveAct(nt2[b.a2],nt1[b.a1],a2,G.p2.name,false);if(nt1[na1].currentHp>0)resolveAct(nt1[b.a1],nt2[na2],a1,G.p1.name,true);}

  let delay=0;
  evs.forEach(ev=>{
    setTimeout(()=>{
      if(G.scr!=="battle")return;
      if(ev.type==="status_effect"){
        const effMsgs={
          heal:`<span style="color:#4ade80;font-weight:900;">💚 ${ev.nm} recupera HP!</span>`,
          atkup:`<span style="color:#FCD34D;font-weight:900;">⬆ ${ev.nm}: ¡Ataque subió!</span>`,
          defup:`<span style="color:#60A5FA;font-weight:900;">🛡 ${ev.nm}: ¡Defensa subió!</span>`,
          sleep_opp:`<span style="color:#818CF8;font-weight:900;">💤 ¡${ev.defNm} se ha dormido!</span>`,
        };
        amsg(effMsgs[ev.eff]||"",1600);
      } else if(ev.type==="sw"){
        sfxSwitch();
        // Pokéball animation before showing new pokemon
        const swIsP1=ev.ip;
        const swWrapId=swIsP1?"sp1wrap":"sp2wrap";
        const swEl=document.getElementById(swIsP1?"sp1":"sp2");
        if(swEl)swEl.style.opacity="0";
        animPokeball(swIsP1,()=>{if(swEl)swEl.style.opacity="1";});
        amsg(`<span style="color:#fff;font-weight:900;font-size:1.05rem;">🔄 ${ev.nm} cambia a <span style="color:#FCD34D;font-size:1.2rem;">${ev.toName}</span>!</span>`,1600);
      } else {
        // "X us- Y!"
        sfxAtk();
        // Show attacker quote if available
        const atkQ=qGet(ev.ip?b.t1[b.a1].id:b.t2[b.a2].id,"atk");
        if(atkQ){
          // Quote over attacker's head
          const atkIsP1=ev.ip;
          if(Math.random()<0.33) amsgPoke(atkIsP1,`<span style="color:#FCD34D;font-weight:900;font-size:1.05rem;font-style:italic;">"${atkQ}"</span>`,1800);
          setTimeout(()=>amsg(`<span style="color:#fff;font-weight:900;font-size:1rem;">${ev.nm} usó <span style="color:${ev.col};font-size:1.2rem;text-shadow:0 0 10px ${ev.col};">${ev.mv&&ev.mv.n?ev.mv.n:"???"}!</span></span>`,1600),1900);
        } else {
          amsg(`<span style="color:#fff;font-weight:900;font-size:1rem;">${ev.nm} usó <span style="color:${ev.col};font-size:1.25rem;text-shadow:0 0 10px ${ev.col};">${ev.mv&&ev.mv.n?ev.mv.n:"???"}!</span></span>`,1800);
        }
        // Hit after 1800ms
        setTimeout(()=>{
          if(G.scr!=="battle")return;
          sfxHit();
          if(ev.ip)hitAnim("sp2","sp2wrap","rip2",ev.col,ev.d,ev.isS,ev.mv&&ev.mv.t,ev.isCrit);
          else hitAnim("sp1","sp1wrap","rip1",ev.col,ev.d,ev.isS,ev.mv&&ev.mv.t,ev.isCrit);
          // Animate HP bar smoothly
          const atkHp=ev.ip?nt1[na1]:nt2[na2], defHp=ev.ip?nt2[na2]:nt1[na1];
          setTimeout(()=>{
            if(ev.ip)animHpBar("hpbar2",defHp.currentHp,defHp.hp,true);
            else animHpBar("hpbar1",defHp.currentHp,defHp.hp,false);
          },200);
          // Defender quote on hit — shown over defender's head
          const defId=ev.ip?b.t2[b.a2].id:b.t1[b.a1].id;
          const defIsP1=!ev.ip;
          if(ev.fainted){
            const fQ=qGet(defId,"faint");
            sfxFaint();
            koEffect(defIsP1);
            if(fQ) setTimeout(()=>amsgPoke(defIsP1,`<span style="color:#FCA5A5;font-weight:900;font-size:1rem;font-style:italic;">"${fQ}"</span>`,2000),400);
            setTimeout(()=>amsg(`<span style="font-size:1rem;font-weight:900;color:#FCA5A5;">😔 ¡${ev.defNm} se ha debilitado!</span>`,2000),fQ?2500:400);
          } else {
            const hitQ=qGet(defId,"hit");
            if(hitQ&&Math.random()<0.33){setTimeout(()=>amsgPoke(defIsP1,`<span style="color:#FDA4AF;font-weight:900;font-size:1rem;font-style:italic;">"${hitQ}"</span>`,1800),300);}
          }
          if(ev.isCrit&&!ev.fainted){setTimeout(()=>amsg(`<span style="font-size:1.1rem;font-weight:900;color:#FFD700;text-shadow:0 0 15px #FFD700;">⚡ ¡GOLPE CRÍTICO!</span>`,1800),600);}
          if(ev.isS){sfxSuper();setTimeout(()=>amsg(`<span style="font-size:1.35rem;font-weight:900;color:#FCD34D;text-shadow:0 0 20px #F59E0B;">💥 ¡ES SÚPER EFECTIVO!</span>`,2000),ev.fainted?0:1200);}
          else if(ev.isW){sfxWeak();setTimeout(()=>amsg(`<span style="font-size:1rem;font-weight:800;color:#CBD5E1;">😕 No es muy efectivo...</span>`,2000),ev.fainted?0:1200);}
          else if(ev.isN){setTimeout(()=>amsg(`<span style="font-size:1rem;font-weight:800;color:#9CA3AF;">❌ ¡No tiene efecto!</span>`,2000),ev.fainted?0:1200);}
        },1800);
      }
    },delay);
    delay+=ev.type==="atk"?5500:(ev.type==="status_dmg"?2800:2400);
  });

  setTimeout(()=>{
    if(G.scr!=="battle")return;
    b.t1=nt1;b.t2=nt2;b.st=st;b.a1=na1;b.a2=na2;
    b.cd1=reduceCd(b.cd1);b.cd2=reduceCd(b.cd2);
    b.locked=false;
    const al1=nt1.every(p=>p.currentHp<=0),al2=nt2.every(p=>p.currentHp<=0);
    const ns1=nt1[na1].currentHp<=0&&!al1,ns2=nt2[na2].currentHp<=0&&!al2;
    if(al1){G.vd={winner:G.p2,loser:G.p1,stats:b.st,isP1Win:false};addRec(false,b.st.moves);sfxDefeat();setTimeout(()=>go("victory"),600);return;}
    if(al2){G.vd={winner:G.p1,loser:G.p2,stats:b.st,isP1Win:true};addRec(true,b.st.moves);sfxVic();setTimeout(()=>go("victory"),600);return;}
    if(ns1){G.fsfor="p1";go("fswitch");return;}
    if(ns2){if(G.p2.isCPU){const nx=nt2.findIndex((pk,i)=>pk.currentHp>0&&i!==na2);if(nx!==-1)b.a2=nx;}else{G.fsfor="p2";go("fswitch");return;}b.ph="action";render();return;}
    b.ph="action";
    if(G.mode==="pvp"){const nxt=b.ct==="p1"?"p2":"p1";b.ct=nxt;shPass(nxt==="p1"?G.p1:G.p2,()=>{b.ph="action";go("battle");});}
    else render();
  },delay+600);
}

// Global sprite position state for use by lunge animations
let SP={p1cx:0,p2cx:0,sprH:0,groundY:0,W:0};

// Called when each sprite image finishes loading
// This is the ONLY reliable way to position sprites at the ground
function animPokeball(isP1, onDone){
  const arena=document.getElementById("arena");
  if(!arena){onDone();return;}
  const pb=document.createElement("div");
  const x=isP1?SP.p1cx:(SP.p2cx||SP.W*0.8);
  pb.style.cssText=`position:absolute;left:${x}px;top:50%;transform:translate(-50%,-50%);z-index:50;animation:vsSlam .4s ease both;`;
  pb.innerHTML=POKEBALL_MINI;
  arena.appendChild(pb);
  // Flash
  const fl=document.createElement("div");
  fl.style.cssText=`position:absolute;inset:0;background:rgba(255,255,255,.6);z-index:49;animation:sfShock .35s ease forwards;pointer-events:none;`;
  arena.appendChild(fl);
  setTimeout(()=>{pb.remove();fl.remove();onDone();},420);
}
function placeSpriteNow(img, wrapId, shadowId, isP1, groundH){
  const arena=document.getElementById("arena");
  if(!arena)return;
  const W=arena.offsetWidth, H=arena.offsetHeight;
  if(!W||!H)return;

  const horizonY=Math.round(H*(100-groundH)/100);
  const fighterGroundY=Math.round(H*0.92);

  // Portrait mobile: bigger sprites, tight padding
  const isPortrait = W < H;
  const maxPct   = isPortrait ? 0.22 : 0.26;   // sprite width % of arena
  const minPx    = isPortrait ? 100  : 150;
  const maxPx    = isPortrait ? 200  : 280;
  const maxHpct  = isPortrait ? 0.46 : 0.50;   // max height % of arena
  const padPct   = isPortrait ? 0.01 : 0.05;   // very tight pad = max separation

  const targetW=Math.min(maxPx, Math.max(minPx, Math.round(W*maxPct)));

  img.style.width=targetW+"px";
  img.style.height="auto";
  img.style.maxHeight=Math.round(H*0.42)+"px";
  img.style.objectFit="contain";
  img.style.display="block";

  const ratio=(img.naturalHeight&&img.naturalWidth)
    ? img.naturalHeight/img.naturalWidth : 1;
  let spriteH=Math.round(targetW*ratio);
  spriteH=Math.min(spriteH, Math.round(H*maxHpct));

  const wrap=document.getElementById(wrapId);
  if(!wrap)return;

  const sidePad=Math.round(W*padPct);
  wrap.style.cssText=[
    "position:absolute","z-index:3","background:transparent",
    "border:none","outline:none","box-shadow:none","overflow:visible",
    `width:${targetW}px`,`height:${spriteH}px`,
    `top:${fighterGroundY-spriteH}px`,"bottom:auto",
    isP1?`left:${sidePad}px`:`right:${sidePad}px`
  ].join(";")+";";

  if(isP1){wrap.style.right="auto";SP.p1cx=sidePad+targetW*0.5;}
  else{wrap.style.left="auto";SP.p2cx=W-sidePad-targetW*0.5;}

  SP.sprH=spriteH; SP.groundY=fighterGroundY; SP.horizonY=horizonY;
  SP.W=W; SP.sprTop=fighterGroundY-spriteH;

  // Shiny effect
  const pkData=isP1?G.bat.t1[G.bat.a1]:G.bat.t2[G.bat.a2];
  if(pkData&&pkData.shiny){
    img.style.filter="drop-shadow(0 0 8px #FFD700) saturate(0.5) sepia(1) hue-rotate(10deg) brightness(1.4)";
    // Spawn sparkles
    for(let si=0;si<6;si++){
      setTimeout(()=>{
        const sp=document.createElement("div");
        sp.textContent="✨";
        sp.style.cssText=`position:absolute;font-size:${14+Math.random()*10}px;left:${Math.random()*100}%;top:${Math.random()*80}%;z-index:30;pointer-events:none;animation:zzzFloat 1.2s ease-out forwards;`;
        wrap.appendChild(sp);setTimeout(()=>sp.remove(),1200);
      },si*200);
    }
    amsg('<span style="color:#FFD700;font-weight:900;font-size:1.1rem;">✨ ¡Pokémon SHINY!</span>',2500);
  }
  // Entry animation: slide in from edge + flash
  img.style.animation=isP1?"pkSlideInLeft .5s cubic-bezier(.175,.885,.32,1.275) forwards":"pkSlideInRight .5s cubic-bezier(.175,.885,.32,1.275) forwards";
  setTimeout(()=>{
    const idleAnim=isP1?"idleBreath 2.5s ease-in-out .5s infinite":"idleBreath2 2.5s ease-in-out .5s infinite";
    img.style.animation=`pkFlashIn .4s ease forwards, ${idleAnim}`;
    if(pkData&&pkData.shiny)img.style.filter="drop-shadow(0 0 6px #FFD700) saturate(0.6) sepia(0.8) hue-rotate(10deg) brightness(1.3)";
  },520);

  const sfx=document.getElementById("sfx-center");
  if(sfx){sfx.style.left=Math.round(W*0.5)+"px";sfx.style.top=Math.round(fighterGroundY-spriteH*0.55)+"px";}

  const sh=document.getElementById(shadowId);
  if(sh){
    const shW=Math.round(targetW*0.55);
    const shH=Math.max(10,Math.round(shW*0.14));
    const shX=isP1?(sidePad+targetW*0.5):(W-sidePad-targetW*0.5);
    sh.style.cssText=[
      "position:absolute",`left:${shX}px`,`top:${fighterGroundY-shH/2}px`,
      `width:${shW}px`,`height:${shH}px`,"transform:translateX(-50%)",
      "background:rgba(0,0,0,.42)","border-radius:50%","filter:blur(10px)",
      "pointer-events:none","z-index:2"
    ].join(";")+";";
  }
}


function onSpriteLoad(img, wrapId, shadowId, isP1, groundH){
  // Retry up to 5 times if arena not measured yet (mobile timing issue)
  let tries=0;
  function attempt(){
    const arena=document.getElementById("arena");
    if(!arena)return;
    if(arena.offsetHeight<10&&tries<5){tries++;requestAnimationFrame(attempt);return;}
    placeSpriteNow(img,wrapId,shadowId,isP1,groundH);
  }
  attempt();
}

function positionSprites(groundH){
  const arena=document.getElementById("arena");
  if(!arena)return;
  const W=arena.offsetWidth,H=arena.offsetHeight;
  if(!W||!H)return;

  // Width of sprite = 28% of arena width (SF proportions)
  const sprW=Math.min(260,Math.max(120,Math.round(W*0.28)));
  const p1cx=Math.round(W*0.18);
  const p2cx=Math.round(W*0.82);
  const groundY=Math.round(H*(100-groundH)/100);
  SP={p1cx,p2cx,sprH:sprW,groundY,sprTop:groundY-sprW,W};

  ["sp1wrap","sp2wrap"].forEach((id,i)=>{
    const el=document.getElementById(id);
    if(!el)return;
    const cx=i===0?p1cx:p2cx;
    el.style.cssText=`position:absolute;left:${cx}px;bottom:${groundH}%;top:auto;width:${sprW}px;height:auto;transform:translateX(-50%);background:transparent;border:none;outline:none;box-shadow:none;overflow:visible;z-index:3;`;
    const img=el.querySelector("img");
    if(img){
      // p1 (i===0) must face right → scaleX(-1)
      const mirror=i===0?"scaleX(-1)":"scaleX(1)";
      const filt=img.style.filter||"";
      img.style.cssText=`width:${sprW}px;height:auto;display:block;transform:${mirror};filter:${filt};`;
    }
  });

  const sfx=document.getElementById("sfx-center");
  if(sfx){sfx.style.cssText=`position:absolute;left:${Math.round(W*0.5)}px;top:${Math.round(groundY-sprW*0.6)}px;z-index:15;pointer-events:none;`;}

  const shW=Math.round(sprW*0.7),shH=Math.max(8,Math.round(sprW*0.07));
  ["sh1","sh2"].forEach((id,i)=>{
    const sh=document.getElementById(id);if(!sh)return;
    const cx=i===0?p1cx:p2cx;
    sh.style.cssText=`position:absolute;left:${cx}px;bottom:${groundH}%;top:auto;width:${shW}px;height:${shH}px;transform:translateX(-50%);background:rgba(0,0,0,.35);border-radius:50%;filter:blur(9px);pointer-events:none;z-index:2;`;
  });
}
