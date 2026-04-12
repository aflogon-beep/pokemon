// PokéBattle Canvas Scenarios — animated battle backgrounds
// All scenes extend ScenarioCanvas base class

class ScenarioCanvas {
  constructor(id, data) {
    this.id = id;
    this.data = data;
    this.canvas = null;
    this.ctx = null;
    this.raf = null;
    this.t = 0;
    this.W = 0;
    this.H = 0;
  }

  init() {
    this.canvas = document.getElementById(this.id);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this._onResize = () => this._resize();
    window.addEventListener('resize', this._onResize);
    this._resize();
    if (!this.W || !this.H) {
      // Retry for mobile where layout takes time
      let tries = 0;
      const retry = () => {
        this._resize();
        if ((this.W && this.H) || tries++ > 8) {
          this.setupParticles();
          this._loop();
        } else {
          setTimeout(retry, 80);
        }
      };
      setTimeout(retry, 50);
    } else {
      this.setupParticles();
      this._loop();
    }
  }

  _resize() {
    if (!this.canvas) return;
    let el = this.canvas;
    let w = 0, h = 0;
    while (el && !w) { w = el.offsetWidth || el.clientWidth; el = el.parentElement; }
    el = this.canvas;
    while (el && !h) { h = el.offsetHeight || el.clientHeight; el = el.parentElement; }
    if (!w) w = window.innerWidth || 400;
    if (!h) h = Math.round(w * 1.1);
    if (this.canvas.width !== w || this.canvas.height !== h) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.W = w; this.H = h;
    }
  }

  _loop() {
    if (!this.canvas) return;
    this.t += 0.016;
    this._resize();
    if (this.W && this.H) this.draw();
    this.raf = requestAnimationFrame(() => this._loop());
  }

  setupParticles() {}
  draw() {}

  destroy() {
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this._onResize) window.removeEventListener('resize', this._onResize);
    this.canvas = null;
  }
}

// ══════════════════════════════════════════════════════════
// CAMPO — sunny field with moving clouds, swaying grass, birds
// ══════════════════════════════════════════════════════════
class ScenaCampo extends ScenarioCanvas {
  setupParticles() {
    const W = this.W, H = this.H;
    this.clouds = Array.from({length:5},(_,i)=>({
      x: (i/5)*W + Math.random()*60,
      y: H*(0.08+i*0.035),
      w: 60+Math.random()*70,
      speed: 0.2+Math.random()*0.2,
      alpha: 0.88+Math.random()*0.1,
    }));
    this.grass = Array.from({length:50},()=>({
      x: Math.random()*W,
      h: 10+Math.random()*14,
      phase: Math.random()*Math.PI*2,
      col: `hsl(${120+Math.random()*20},${60+Math.random()*20}%,${28+Math.random()*10}%)`,
    }));
    this.birds = Array.from({length:4},()=>({
      x: Math.random()*W, y: H*(0.1+Math.random()*0.2),
      vx: 0.4+Math.random()*0.5, phase: Math.random()*Math.PI*2,
    }));
  }
  draw() {
    const {ctx,W,H,t} = this;
    ctx.clearRect(0,0,W,H);
    const gY = H*0.62;

    // Sky
    const sg = ctx.createLinearGradient(0,0,0,gY);
    sg.addColorStop(0,'#3a8fd8'); sg.addColorStop(0.6,'#87CEEB'); sg.addColorStop(1,'#b8e4f7');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,gY);

    // Sun
    const sx=W*0.78, sy=H*0.1, sr=H*0.055;
    const sunG = ctx.createRadialGradient(sx,sy,0,sx,sy,sr*2.5);
    sunG.addColorStop(0,'rgba(255,255,180,1)'); sunG.addColorStop(0.4,'rgba(255,220,80,.6)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.beginPath(); ctx.arc(sx,sy,sr*2.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFFAAA'; ctx.beginPath(); ctx.arc(sx,sy,sr,0,Math.PI*2); ctx.fill();

    // Clouds
    this.clouds.forEach(cl=>{
      cl.x += cl.speed;
      if(cl.x > W+cl.w*1.5) cl.x = -cl.w;
      ctx.fillStyle=`rgba(255,255,255,${cl.alpha})`;
      [[0,0,1],[-.35,.08,.7],[.35,.08,.65],[-.15,-.28,.55],[.2,-.22,.5]].forEach(([dx,dy,s])=>{
        ctx.beginPath(); ctx.ellipse(cl.x+dx*cl.w, cl.y+dy*cl.w*.4, cl.w*.38*s, cl.w*.2*s, 0, 0, Math.PI*2); ctx.fill();
      });
    });

    // Tree silhouettes horizon
    [[0.03,0.22],[0.08,0.18],[0.88,0.2],[0.94,0.16]].forEach(([px,ph])=>{
      const tx=px*W, th=ph*H;
      ctx.fillStyle='#1a5c1a';
      ctx.beginPath(); ctx.ellipse(tx, gY-th*.5, th*.28, th*.55, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle='#0f3d0f'; ctx.fillRect(tx-4,gY-th*.1,8,th*.12);
    });

    // Ground stripes
    for(let i=0;i<6;i++){
      const py=gY+i*(H-gY)/6;
      ctx.fillStyle=i%2===0?'#3a7a3a':'#347034';
      ctx.fillRect(0,py,W,(H-gY)/6+1);
    }

    // Grass blades
    ctx.lineWidth=1.2;
    this.grass.forEach(g=>{
      const sway=Math.sin(t*1.3+g.phase)*3.5;
      ctx.strokeStyle=g.col;
      ctx.beginPath(); ctx.moveTo(g.x,gY); ctx.quadraticCurveTo(g.x+sway,gY-g.h*.6,g.x+sway*1.5,gY-g.h); ctx.stroke();
    });

    // Birds
    this.birds.forEach(b=>{
      b.x+=b.vx; b.phase+=0.1;
      if(b.x>W+20) b.x=-20;
      const wy=Math.sin(b.phase)*3;
      ctx.strokeStyle='rgba(20,20,20,.55)'; ctx.lineWidth=1.2;
      ctx.beginPath(); ctx.moveTo(b.x-6,b.y+wy); ctx.quadraticCurveTo(b.x,b.y-3,b.x+6,b.y+wy); ctx.stroke();
    });
  }
}

// ══════════════════════════════════════════════════════════
// GALAXIA — deep space with stars, nebulae, meteors
// ══════════════════════════════════════════════════════════
class ScenaGalaxia extends ScenarioCanvas {
  setupParticles() {
    const W=this.W, H=this.H;
    this.stars = Array.from({length:140},()=>({
      x:Math.random()*W, y:Math.random()*H*.72,
      r:0.3+Math.random()*1.8, phase:Math.random()*Math.PI*2,
      speed:0.3+Math.random()*2,
      col:Math.random()<0.15?'200,220,255':Math.random()<0.08?'255,200,200':'255,255,255',
    }));
    this.nebulas = [
      {x:.28,y:.25,rx:.22,ry:.13,col:'80,30,120',ph:0},
      {x:.68,y:.18,rx:.18,ry:.11,col:'20,60,130',ph:1.1},
      {x:.5,y:.4,rx:.16,ry:.09,col:'100,20,60',ph:2.2},
    ];
    this.meteors = [];
    this.mTimer = 0;
  }
  draw() {
    const {ctx,W,H,t} = this;
    ctx.clearRect(0,0,W,H);
    const gY = H*0.65;

    // Space bg
    const sg=ctx.createLinearGradient(0,0,0,H);
    sg.addColorStop(0,'#000308'); sg.addColorStop(.5,'#02000f'); sg.addColorStop(1,'#060018');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

    // Nebulas
    this.nebulas.forEach(nb=>{
      const p=1+Math.sin(t*.4+nb.ph)*.08;
      const g=ctx.createRadialGradient(nb.x*W,nb.y*H,0,nb.x*W,nb.y*H,nb.rx*W*p);
      g.addColorStop(0,`rgba(${nb.col},.2)`); g.addColorStop(.5,`rgba(${nb.col},.08)`); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(nb.x*W,nb.y*H,nb.rx*W*p,nb.ry*H*p,0,0,Math.PI*2); ctx.fill();
    });

    // Stars twinkling
    this.stars.forEach(s=>{
      const a=0.3+Math.sin(t*s.speed+s.phase)*.55;
      const r=s.r*(0.7+Math.sin(t*s.speed+s.phase)*.35);
      ctx.fillStyle=`rgba(${s.col},${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2); ctx.fill();
    });

    // Meteors
    this.mTimer+=0.016;
    if(this.mTimer>2.5+Math.random()*4){this.mTimer=0;this.meteors.push({x:Math.random()*W,y:0,vx:3+Math.random()*5,vy:2+Math.random()*4,life:1});}
    this.meteors=this.meteors.filter(m=>{
      m.x+=m.vx;m.y+=m.vy;m.life-=0.03;
      if(m.life<=0)return false;
      ctx.strokeStyle=`rgba(200,220,255,${m.life*.9})`; ctx.lineWidth=m.life*2.5;
      ctx.beginPath(); ctx.moveTo(m.x,m.y); ctx.lineTo(m.x-m.vx*8,m.y-m.vy*8); ctx.stroke();
      return true;
    });

    // Ground (asteroid surface)
    const gg=ctx.createLinearGradient(0,gY,0,H);
    gg.addColorStop(0,'#0a0520'); gg.addColorStop(.5,'#060310'); gg.addColorStop(1,'#020108');
    ctx.fillStyle=gg; ctx.fillRect(0,gY,W,H-gY);

    // Rock silhouettes
    ctx.fillStyle='rgba(12,8,25,.95)';
    [[.04,.09],[.12,.06],[.77,.08],[.87,.05],[.95,.07]].forEach(([px,ph])=>{
      ctx.beginPath(); ctx.ellipse(px*W,gY,ph*W,ph*H*.4,0,0,Math.PI*2); ctx.fill();
    });
  }
}

// ══════════════════════════════════════════════════════════
// ESTADIO — Pokémon stadium with spotlights + crowd
// ══════════════════════════════════════════════════════════
class ScenaEstadio extends ScenarioCanvas {
  setupParticles() {
    const W=this.W,H=this.H;
    this.spots=[{x:.18,ph:0},{x:.5,ph:Math.PI},{x:.82,ph:Math.PI*.5}];
    this.crowd=Array.from({length:80},()=>({x:Math.random(),row:Math.floor(Math.random()*4),ph:Math.random()*Math.PI*2,col:`hsl(${Math.floor(Math.random()*360)},75%,58%)`}));
    this.flashes=[];this.fTimer=0;
  }
  draw() {
    const {ctx,W,H,t}=this;
    ctx.clearRect(0,0,W,H);
    const gY=H*.62;

    // Dark arena bg
    ctx.fillStyle='#05080f'; ctx.fillRect(0,0,W,H);

    // Stands rows
    const standH=gY*.52;
    for(let row=0;row<4;row++){
      const ry=standH*(0.1+row*.25),rh=standH*.2;
      ctx.fillStyle=`rgba(12,15,30,.8)`;ctx.fillRect(0,ry,W,rh);
      this.crowd.filter(c=>c.row===row).forEach(c=>{
        const cx=c.x*W, wave=Math.sin(t*1.8+c.ph)*2.5;
        ctx.fillStyle=c.col; ctx.beginPath(); ctx.arc(cx,ry+rh*.35+wave,2.8,0,Math.PI*2); ctx.fill();
      });
    }

    // Spotlights
    this.spots.forEach(sl=>{
      sl.ph+=0.007;
      const sx=(sl.x+Math.sin(sl.ph)*.12)*W;
      const lg=ctx.createConicalGradient?null:ctx.createRadialGradient(sx,0,0,sx,gY*.6,H*.4);
      const lg2=ctx.createLinearGradient(sx-H*.25,gY*.6,sx+H*.25,gY*.6);
      lg2.addColorStop(0,'transparent'); lg2.addColorStop(.5,`rgba(220,230,255,.07)`); lg2.addColorStop(1,'transparent');
      ctx.fillStyle=lg2; ctx.beginPath(); ctx.moveTo(sx,0); ctx.lineTo(sx-H*.22,gY*.6); ctx.lineTo(sx+H*.22,gY*.6); ctx.closePath(); ctx.fill();
    });

    // Camera flashes
    this.fTimer+=0.016;
    if(this.fTimer>0.4+Math.random()*2){this.fTimer=0;this.flashes.push({x:Math.random()*W,y:Math.random()*gY*.45,life:1});}
    this.flashes=this.flashes.filter(fl=>{fl.life-=0.09;if(fl.life<=0)return false;ctx.fillStyle=`rgba(255,255,255,${fl.life*.7})`;ctx.beginPath();ctx.arc(fl.x,fl.y,fl.life*5,0,Math.PI*2);ctx.fill();return true;});

    // Arena floor
    const fg=ctx.createLinearGradient(0,gY,0,H);
    fg.addColorStop(0,'#1a2040'); fg.addColorStop(.5,'#0f1528'); fg.addColorStop(1,'#080d18');
    ctx.fillStyle=fg; ctx.fillRect(0,gY,W,H-gY);

    // Arena circle glow
    const glow=.3+Math.sin(t*2)*.1;
    ctx.strokeStyle=`rgba(59,130,246,${glow+.2})`; ctx.lineWidth=2;
    ctx.shadowColor='#3B82F6'; ctx.shadowBlur=10;
    ctx.beginPath(); ctx.ellipse(W*.5,gY+H*.06,W*.4,H*.055,0,0,Math.PI*2); ctx.stroke();
    ctx.shadowBlur=0;
  }
}

// ══════════════════════════════════════════════════════════
// FÚTBOL — proper football pitch with perspective + fans
// ══════════════════════════════════════════════════════════
class ScenaFutbol extends ScenarioCanvas {
  setupParticles() {
    const W=this.W,H=this.H;
    this.clouds=Array.from({length:4},(_,i)=>({x:(i/4)*W,y:H*(0.06+i*.04),w:55+Math.random()*55,speed:.18+Math.random()*.15,alpha:.9}));
    this.fans=Array.from({length:90},()=>({x:Math.random(),row:Math.floor(Math.random()*3),ph:Math.random()*Math.PI*2,col:`hsl(${Math.floor(Math.random()*360)},80%,60%)`}));
  }
  draw() {
    const {ctx,W,H,t}=this;
    if(!W||!H)return;
    ctx.clearRect(0,0,W,H);
    const gY=H*.58; // pitch starts here

    // Sky
    const sg=ctx.createLinearGradient(0,0,0,gY);
    sg.addColorStop(0,'#0b2a6e'); sg.addColorStop(.45,'#1a5aaa'); sg.addColorStop(1,'#4a8fd4');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,gY);

    // Stands (top third of sky area)
    const stH=gY*.5;
    ctx.fillStyle='#0f1530'; ctx.fillRect(0,0,W,stH);
    for(let row=0;row<3;row++){
      const ry=stH*(0.08+row*.32),rh=stH*.2;
      ctx.fillStyle='rgba(15,18,40,.7)'; ctx.fillRect(0,ry,W,rh);
      this.fans.filter(f=>f.row===row).forEach(f=>{
        const wave=Math.sin(t*2+f.ph)*3;
        ctx.fillStyle=f.col; ctx.beginPath(); ctx.arc(f.x*W,ry+rh*.3+wave,2.5,0,Math.PI*2); ctx.fill();
      });
    }

    // Floodlights
    [[.03,.45],[.97,.45]].forEach(([px,py])=>{
      const lx=px*W,ly=py*H;
      ctx.strokeStyle='#ccc'; ctx.lineWidth=3;
      ctx.beginPath(); ctx.moveTo(lx,gY); ctx.lineTo(lx,ly); ctx.stroke();
      const lg=ctx.createRadialGradient(lx,ly,0,lx,ly,35);
      lg.addColorStop(0,'rgba(255,240,180,.55)'); lg.addColorStop(1,'transparent');
      ctx.fillStyle=lg; ctx.beginPath(); ctx.arc(lx,ly,35,0,Math.PI*2); ctx.fill();
    });

    // Clouds
    this.clouds.forEach(cl=>{
      cl.x+=cl.speed; if(cl.x>W+cl.w) cl.x=-cl.w;
      ctx.fillStyle=`rgba(255,255,255,${cl.alpha*.6})`;
      ctx.beginPath(); ctx.ellipse(cl.x,cl.y,cl.w*.5,cl.w*.2,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cl.x-cl.w*.28,cl.y+4,cl.w*.32,cl.w*.16,0,0,Math.PI*2); ctx.fill();
    });

    // ── Pitch stripes (perspective: narrower at top)
    const stripes=10;
    for(let i=0;i<stripes;i++){
      const py=gY+i*(H-gY)/stripes;
      ctx.fillStyle=i%2===0?'#1a6b1a':'#157015';
      ctx.fillRect(0,py,W,(H-gY)/stripes+1);
    }
    // Perspective fade at top of pitch
    const pf=ctx.createLinearGradient(0,gY,0,gY+H*.1);
    pf.addColorStop(0,'rgba(0,0,0,.35)'); pf.addColorStop(1,'transparent');
    ctx.fillStyle=pf; ctx.fillRect(0,gY,W,H*.1);

    // ── Pitch markings with proper perspective
    const m=W*.04; // margin
    ctx.save();
    ctx.strokeStyle='rgba(255,255,255,.55)'; ctx.lineWidth=1.8;

    // Boundary
    ctx.strokeRect(m,gY+H*.01,W-m*2,H-gY-H*.02);
    // Halfway line
    ctx.beginPath(); ctx.moveTo(W*.5,gY+H*.01); ctx.lineTo(W*.5,H-H*.01); ctx.stroke();
    // Centre circle (ellipse for perspective)
    ctx.beginPath(); ctx.ellipse(W*.5,gY+H*.2,W*.17,H*.085,0,0,Math.PI*2); ctx.stroke();
    // Centre spot
    ctx.fillStyle='rgba(255,255,255,.65)';
    ctx.beginPath(); ctx.arc(W*.5,gY+H*.2,3.5,0,Math.PI*2); ctx.fill();
    // Left penalty box
    ctx.strokeRect(m,gY+H*.05,W*.22,H*.26);
    ctx.strokeRect(m,gY+H*.1,W*.11,H*.14);
    // Right penalty box
    ctx.strokeRect(W-m-W*.22,gY+H*.05,W*.22,H*.26);
    ctx.strokeRect(W-m-W*.11,gY+H*.1,W*.11,H*.14);
    // Goal posts
    ctx.strokeStyle='rgba(255,255,255,.85)'; ctx.lineWidth=2.5;
    ctx.strokeRect(m-4,gY+H*.13,W*.035,H*.08);
    ctx.strokeRect(W-m-W*.035+4,gY+H*.13,W*.035,H*.08);
    ctx.restore();
  }
}

// ══════════════════════════════════════════════════════════
// CUEVA — dark cave with lava, bats, crystal glow, drips
// ══════════════════════════════════════════════════════════
class ScenaCueva extends ScenarioCanvas {
  setupParticles() {
    const W=this.W,H=this.H;
    this.embers=Array.from({length:20},()=>this._newEmber(W,H));
    this.bats=Array.from({length:4},()=>({x:Math.random()*W,y:H*(0.1+Math.random()*.25),vx:(0.5+Math.random()*.7)*(Math.random()<.5?1:-1),wp:Math.random()*Math.PI*2,sz:8+Math.random()*6}));
    this.drops=Array.from({length:10},()=>this._newDrop(W,H));
    this.crystals=[{x:.18,y:.5,r:24,col:'100,200,255',ph:0},{x:.72,y:.53,r:18,col:'180,100,255',ph:1.3},{x:.45,y:.47,r:14,col:'100,255,160',ph:2.5}];
  }
  _newEmber(W,H){return{x:(Math.random()<.5?0.05+Math.random()*.18:0.78+Math.random()*.17)*W,y:H*(.72+Math.random()*.18),vx:(Math.random()-.5)*.5,vy:-(0.4+Math.random()*.6),life:Math.random(),maxLife:.5+Math.random()*.9,sz:1.5+Math.random()*2.5};}
  _newDrop(W,H){return{x:(.05+Math.random()*.9)*W,y:0,vy:1.8+Math.random()*2.5,a:.4+Math.random()*.4};}
  draw() {
    const {ctx,W,H,t}=this;
    ctx.clearRect(0,0,W,H);
    const gY=H*.6;

    // Dark cave bg
    const sg=ctx.createLinearGradient(0,0,0,H);
    sg.addColorStop(0,'#040202'); sg.addColorStop(.5,'#0e0700'); sg.addColorStop(1,'#1a0e04');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

    // Lava glow on walls
    [{x:.12,y:.8,r:.38},{x:.82,y:.82,r:.3}].forEach(l=>{
      const p=.28+Math.sin(t*1.2)*.08;
      const g=ctx.createRadialGradient(l.x*W,l.y*H,0,l.x*W,l.y*H,l.r*W);
      g.addColorStop(0,`rgba(255,90,0,${p+.15})`); g.addColorStop(.5,`rgba(255,50,0,${p})`); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
    });

    // Stalactites
    ctx.fillStyle='#120a03';
    [[.05,16],[.13,26],[.24,18],[.36,12],[.52,20],[.65,14],[.76,22],[.88,16],[.95,12]].forEach(([px,l])=>{
      const x=px*W;
      ctx.beginPath(); ctx.moveTo(x-l*.6,0); ctx.lineTo(x+l*.6,0); ctx.lineTo(x,l*2.2); ctx.closePath(); ctx.fill();
    });

    // Stalagmites
    ctx.fillStyle='#251806';
    [[.04,18],[.09,24],[.19,28],[.62,20],[.73,26],[.84,18],[.92,22]].forEach(([px,h])=>{
      const x=px*W;
      ctx.beginPath(); ctx.moveTo(x-h*.45,gY+h*1.6); ctx.lineTo(x+h*.45,gY+h*1.6); ctx.lineTo(x,gY); ctx.closePath(); ctx.fill();
    });

    // Ground
    const gg=ctx.createLinearGradient(0,gY,0,H);
    gg.addColorStop(0,'#2d1f05'); gg.addColorStop(.4,'#1a1008'); gg.addColorStop(1,'#080503');
    ctx.fillStyle=gg; ctx.fillRect(0,gY,W,H-gY);

    // Lava pools
    [[.12,.88,.13,.04],[.8,.92,.1,.03]].forEach(([px,py,rx,ry])=>{
      const p=.35+Math.sin(t*1.5)*.12;
      const g=ctx.createRadialGradient(px*W,py*H,0,px*W,py*H,rx*W);
      g.addColorStop(0,`rgba(255,160,0,${p+.45})`); g.addColorStop(.5,`rgba(255,60,0,${p})`); g.addColorStop(1,'rgba(80,15,0,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.ellipse(px*W,py*H,rx*W,ry*H,0,0,Math.PI*2); ctx.fill();
    });

    // Crystal glows
    this.crystals.forEach(cr=>{
      const a=.2+Math.sin(t*1.2+cr.ph)*.12, rx=cr.x*W, ry=cr.y*H;
      const g=ctx.createRadialGradient(rx,ry,0,rx,ry,cr.r*(1+Math.sin(t+cr.ph)*.15));
      g.addColorStop(0,`rgba(${cr.col},${a+.1})`); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(rx,ry,cr.r*2.5,0,Math.PI*2); ctx.fill();
    });

    // Embers
    this.embers.forEach(em=>{
      em.life+=0.009; em.x+=em.vx+Math.sin(t*2+em.x)*.15; em.y+=em.vy;
      if(em.life>em.maxLife) Object.assign(em,this._newEmber(W,H));
      const a=Math.sin(em.life/em.maxLife*Math.PI)*.9;
      ctx.fillStyle=`rgba(255,${110+Math.floor(em.sz*22)},0,${a})`;
      ctx.beginPath(); ctx.arc(em.x,em.y,em.sz,0,Math.PI*2); ctx.fill();
    });

    // Bats
    this.bats.forEach(bat=>{
      bat.x+=bat.vx; bat.wp+=0.13;
      if(bat.x<-20) bat.x=W+20; if(bat.x>W+20) bat.x=-20;
      const wy=Math.abs(Math.sin(bat.wp))*bat.sz*.5+2;
      ctx.fillStyle='rgba(15,8,4,.9)';
      ctx.beginPath(); ctx.ellipse(bat.x,bat.y,bat.sz,wy,0,0,Math.PI*2); ctx.fill();
    });

    // Drips
    this.drops.forEach(d=>{
      d.y+=d.vy; if(d.y>gY){Object.assign(d,this._newDrop(W,H));}
      ctx.fillStyle=`rgba(100,180,255,${d.a})`; ctx.beginPath(); ctx.ellipse(d.x,d.y,1.5,3,0,0,Math.PI*2); ctx.fill();
    });
  }
}

// ══════════════════════════════════════════════════════════
// PLAYA — tropical beach sunset with animated waves
// ══════════════════════════════════════════════════════════
class ScenaPlaya extends ScenarioCanvas {
  setupParticles() {
    const W=this.W,H=this.H;
    this.wOff=0;
    this.clouds=Array.from({length:4},(_,i)=>({x:(i/4)*W,y:H*(0.08+i*.04),w:65+Math.random()*55,speed:.18+Math.random()*.15,alpha:.8}));
    this.gulls=Array.from({length:3},()=>({x:Math.random()*W,y:H*(0.1+Math.random()*.2),vx:.4+Math.random()*.4,ph:Math.random()*Math.PI*2,sz:4+Math.random()*3}));
  }
  draw() {
    const {ctx,W,H,t}=this;
    ctx.clearRect(0,0,W,H);
    const gY=H*.65;

    // Sunset sky
    const sg=ctx.createLinearGradient(0,0,0,gY);
    sg.addColorStop(0,'#1a0840'); sg.addColorStop(.2,'#7B2800'); sg.addColorStop(.45,'#FF6B35');
    sg.addColorStop(.7,'#FFB347'); sg.addColorStop(1,'#7ac8e0');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,gY);

    // Sun
    const sx=W*.72,sy=H*.25, sp=1+Math.sin(t*.5)*.02;
    const sunG=ctx.createRadialGradient(sx,sy,0,sx,sy,55*sp);
    sunG.addColorStop(0,'rgba(255,255,190,1)'); sunG.addColorStop(.35,'rgba(255,215,80,.8)'); sunG.addColorStop(.7,'rgba(255,150,40,.4)'); sunG.addColorStop(1,'transparent');
    ctx.fillStyle=sunG; ctx.beginPath(); ctx.arc(sx,sy,55*sp,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFF5AA'; ctx.beginPath(); ctx.arc(sx,sy,H*.045,0,Math.PI*2); ctx.fill();

    // Clouds
    this.clouds.forEach(cl=>{
      cl.x+=cl.speed; if(cl.x>W+cl.w) cl.x=-cl.w;
      ctx.fillStyle=`rgba(255,210,160,${cl.alpha})`;
      ctx.beginPath(); ctx.ellipse(cl.x,cl.y,cl.w*.5,cl.w*.22,0,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.ellipse(cl.x-cl.w*.3,cl.y+5,cl.w*.32,cl.w*.16,0,0,Math.PI*2); ctx.fill();
    });

    // Sea
    const seaY=gY*.88;
    const seaG=ctx.createLinearGradient(0,seaY,0,gY);
    seaG.addColorStop(0,'#1848a0'); seaG.addColorStop(.5,'#1e5fc0'); seaG.addColorStop(1,'#3a80d0');
    ctx.fillStyle=seaG; ctx.fillRect(0,seaY,W,gY-seaY);

    // Sun reflection
    const refG=ctx.createLinearGradient(sx-25,seaY,sx+25,gY);
    refG.addColorStop(0,'rgba(255,180,50,.35)'); refG.addColorStop(1,'transparent');
    ctx.fillStyle=refG; ctx.fillRect(sx-20,seaY,40,gY-seaY);

    // Waves
    this.wOff+=0.02;
    [0,.33,.66].forEach((off,wi)=>{
      const wy=gY*(.88+wi*.025), a=.55-wi*.12;
      ctx.strokeStyle=`rgba(150,215,255,${a})`; ctx.lineWidth=2-wi*.3;
      ctx.beginPath();
      for(let x=0;x<=W;x+=4){
        const y=wy+Math.sin(x/W*Math.PI*5+this.wOff+off*Math.PI*2)*(6-wi*1.5);
        x===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
      }
      ctx.stroke();
    });

    // Sandy beach
    const sandG=ctx.createLinearGradient(0,gY,0,H);
    sandG.addColorStop(0,'#C4A882'); sandG.addColorStop(.4,'#D4B896'); sandG.addColorStop(1,'#E8D5B0');
    ctx.fillStyle=sandG; ctx.fillRect(0,gY,W,H-gY);

    // Palms
    this._palm(ctx,W*.04,gY,H*.28,-0.22);
    this._palm(ctx,W*.93,gY,H*.24,0.28);

    // Seagulls
    this.gulls.forEach(g=>{
      g.x+=g.vx; g.ph+=0.09; g.y+=Math.sin(g.ph)*.35;
      if(g.x>W+20) g.x=-20;
      ctx.strokeStyle='rgba(20,10,5,.7)'; ctx.lineWidth=1.3;
      ctx.beginPath(); ctx.moveTo(g.x-g.sz,g.y+Math.sin(g.ph)*2.5); ctx.quadraticCurveTo(g.x,g.y-g.sz*.5,g.x+g.sz,g.y+Math.sin(g.ph)*2.5); ctx.stroke();
    });
  }
  _palm(ctx,x,gY,h,lean){
    ctx.strokeStyle='#8B6914'; ctx.lineWidth=Math.max(3,h*.04);
    ctx.beginPath(); ctx.moveTo(x,gY); ctx.quadraticCurveTo(x+lean*h*.3,gY-h*.5,x+lean*h*.6,gY-h); ctx.stroke();
    const tx=x+lean*h*.6, ty=gY-h;
    [[-0.8,-0.6],[0.8,-0.5],[-0.3,-0.9],[0.3,-0.85],[0,-1]].forEach(([dx,dy])=>{
      ctx.strokeStyle='rgba(30,100,30,.9)'; ctx.lineWidth=Math.max(2,h*.025);
      ctx.beginPath(); ctx.moveTo(tx,ty); ctx.quadraticCurveTo(tx+dx*h*.25,ty+dy*h*.15,tx+dx*h*.44,ty+dy*h*.3); ctx.stroke();
    });
  }
}

// ══════════════════════════════════════════════════════════
// NOCHE — full moon night with fireflies, mist, stars
// ══════════════════════════════════════════════════════════
class ScenaNoche extends ScenarioCanvas {
  setupParticles() {
    const W=this.W,H=this.H;
    this.stars=Array.from({length:90},()=>({x:Math.random()*W,y:Math.random()*H*.65,r:.5+Math.random()*1.6,ph:Math.random()*Math.PI*2,sp:.5+Math.random()*1.8}));
    this.flies=Array.from({length:14},()=>({x:Math.random()*W,y:H*(.45+Math.random()*.4),vx:(Math.random()-.5)*.55,vy:(Math.random()-.5)*.35,ph:Math.random()*Math.PI*2,sz:2+Math.random()*2.2}));
    this.mist=Array.from({length:3},(_,i)=>({x:Math.random()*W,speed:.1+i*.08,y:H*(.55+i*.065),a:.05+i*.025}));
  }
  draw() {
    const {ctx,W,H,t}=this;
    ctx.clearRect(0,0,W,H);
    const gY=H*.62;

    // Night sky
    const sg=ctx.createLinearGradient(0,0,0,H);
    sg.addColorStop(0,'#000408'); sg.addColorStop(.4,'#010b16'); sg.addColorStop(.8,'#031422'); sg.addColorStop(1,'#051d32');
    ctx.fillStyle=sg; ctx.fillRect(0,0,W,H);

    // Stars
    this.stars.forEach(s=>{
      const a=.35+Math.sin(t*s.sp+s.ph)*.5, r=s.r*(0.75+Math.sin(t*s.sp+s.ph)*.3);
      ctx.fillStyle=`rgba(255,250,228,${a})`; ctx.beginPath(); ctx.arc(s.x,s.y,r,0,Math.PI*2); ctx.fill();
    });

    // Moon
    const mx=W*.78, my=H*.17, mr=Math.min(W,H)*.078;
    const halo=ctx.createRadialGradient(mx,my,mr,mx,my,mr*3.5);
    halo.addColorStop(0,'rgba(255,240,175,.14)'); halo.addColorStop(1,'transparent');
    ctx.fillStyle=halo; ctx.beginPath(); ctx.arc(mx,my,mr*3.5,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='#FFF9E6'; ctx.beginPath(); ctx.arc(mx,my,mr,0,Math.PI*2); ctx.fill();
    ctx.fillStyle='rgba(195,185,148,.3)';
    [[.3,-.2,.15],[-.2,.3,.1],[.1,.1,.08]].forEach(([dx,dy,cr])=>{ctx.beginPath();ctx.arc(mx+dx*mr,my+dy*mr,cr*mr,0,Math.PI*2);ctx.fill();});

    // Ground
    const gg=ctx.createLinearGradient(0,gY,0,H);
    gg.addColorStop(0,'#071307'); gg.addColorStop(.5,'#040d04'); gg.addColorStop(1,'#020602');
    ctx.fillStyle=gg; ctx.fillRect(0,gY,W,H-gY);

    // Tree silhouettes
    ctx.fillStyle='rgba(2,7,2,.96)';
    [[.03,.35],[.07,.28],[.88,.3],[.93,.25],[.97,.32]].forEach(([px,ph])=>{
      const tx=px*W,th=ph*H;
      ctx.fillRect(tx-3,gY-th*.1+th*.6,6,th*.4);
      ctx.beginPath(); ctx.moveTo(tx,gY-th); ctx.lineTo(tx-th*.2,gY-th*.3); ctx.lineTo(tx+th*.2,gY-th*.3); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(tx,gY-th*.7); ctx.lineTo(tx-th*.26,gY-th*.05); ctx.lineTo(tx+th*.26,gY-th*.05); ctx.closePath(); ctx.fill();
    });

    // Mist
    this.mist.forEach(m=>{
      m.x+=m.speed; if(m.x>W+200) m.x=-200;
      const mg=ctx.createLinearGradient(m.x-100,0,m.x+200,0);
      mg.addColorStop(0,'transparent'); mg.addColorStop(.35,`rgba(140,170,195,${m.a})`); mg.addColorStop(.65,`rgba(140,170,195,${m.a})`); mg.addColorStop(1,'transparent');
      ctx.fillStyle=mg; ctx.fillRect(0,m.y-18,W,36);
    });

    // Fireflies
    this.flies.forEach(f=>{
      f.x+=f.vx+Math.sin(t*.9+f.ph)*.35; f.y+=f.vy+Math.cos(t*.7+f.ph)*.22; f.ph+=.02;
      if(f.x<0||f.x>W) f.vx*=-1; if(f.y<gY*.7||f.y>H*.93) f.vy*=-1;
      const glow=.45+Math.sin(t*3.5+f.ph)*.5;
      const g=ctx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.sz*5);
      g.addColorStop(0,`rgba(175,255,90,${glow*.95})`); g.addColorStop(.4,`rgba(140,220,75,${glow*.4})`); g.addColorStop(1,'transparent');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(f.x,f.y,f.sz*5,0,Math.PI*2); ctx.fill();
    });
  }
}

// ══════════════════════════════════════════════════════════
// Dispatcher
// ══════════════════════════════════════════════════════════
const CANVAS_SCENES = {
  campo: ScenaCampo,
  galaxia: ScenaGalaxia,
  estadio: ScenaEstadio,
  futbol: ScenaFutbol,
  cueva: ScenaCueva,
  playa: ScenaPlaya,
  noche: ScenaNoche,
  reves: ScenaReves,
  nieve: ScenaNieve,
  lavanda: ScenaLavanda,
};

let _activeScene = null;

function initCanvasScene(sceneName, canvasId) {
  if (_activeScene) { _activeScene.destroy(); _activeScene = null; }
  const Cls = CANVAS_SCENES[sceneName];
  if (!Cls) return;
  const id = canvasId || 'scene-canvas';
  _activeScene = new Cls(id, {});
  // Retry until canvas has dimensions
  let tries = 0;
  const go = () => {
    const c = document.getElementById(id);
    const hasSize = c && (c.offsetWidth > 0 || (c.parentElement && c.parentElement.offsetWidth > 0));
    if (hasSize || tries++ > 10) { if (_activeScene) _activeScene.init(); }
    else setTimeout(go, 60);
  };
  setTimeout(go, 30);
}

function destroyCanvasScene() {
  if (_activeScene) { _activeScene.destroy(); _activeScene = null; }
}

// ══════════════════════════════════════════════════════════
// MUNDO DEL REVÉS — Stranger Things
// Cielo rojo carmesí, árboles retorcidos negros, partículas
// de Polvo de Arriba, relámpagos violetas, niebla roja
// ══════════════════════════════════════════════════════════
class ScenaReves extends ScenarioCanvas {
  setupParticles() {
    const W = this.W || 400, H = this.H || 500;
    // Upside-down ash/spore particles floating
    this.spores = Array.from({length:80}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 2.5,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -0.15 - Math.random() * 0.35, // float upward
      ph: Math.random() * Math.PI * 2,
      type: Math.random() < 0.6 ? 'spore' : 'ash',
      alpha: 0.3 + Math.random() * 0.6,
    }));
    // Lightning bolts
    this.bolts = [];
    this.nextBolt = 60 + Math.random() * 120;
    // Twisted trees
    this.trees = [
      { x: 0.04, lean: 0.12 },
      { x: 0.12, lean: -0.08 },
      { x: 0.82, lean: 0.09 },
      { x: 0.91, lean: -0.11 },
      { x: 0.72, lean: 0.06 },
    ];
    // Fog layers
    this.fogs = Array.from({length:5}, (_, i) => ({
      x: (i / 5) * W * 2,
      y: H * (0.55 + i * 0.05),
      w: W * (0.8 + Math.random() * 0.8),
      h: H * (0.06 + Math.random() * 0.08),
      speed: 0.25 + Math.random() * 0.3,
      alpha: 0.08 + Math.random() * 0.12,
    }));
    // Pulsating veins on ground
    this.veins = Array.from({length:8}, () => ({
      x: Math.random(),
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  draw() {
    const { ctx, W, H, t } = this;
    if (!ctx || !W || !H) return;

    // ── Sky: deep crimson gradient with red pulse ─────────
    const pulse = 0.5 + Math.sin(t * 0.4) * 0.5;
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, `rgba(${Math.round(40+pulse*15)},0,0,1)`);
    sky.addColorStop(0.3, `rgba(${Math.round(85+pulse*20)},5,8,1)`);
    sky.addColorStop(0.6, `rgba(${Math.round(110+pulse*15)},10,15,1)`);
    sky.addColorStop(1, `rgba(60,0,5,1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // ── Blood-red atmospheric glow ────────────────────────
    const glow = ctx.createRadialGradient(W*0.5, H*0.25, 0, W*0.5, H*0.25, W*0.7);
    glow.addColorStop(0, `rgba(180,0,20,${0.06+pulse*0.04})`);
    glow.addColorStop(0.5, `rgba(120,0,10,0.03)`);
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // ── Cracked ground veins pulsing red ──────────────────
    const gY = H * 0.60;
    this.veins.forEach(v => {
      v.pulse += 0.025;
      const vAlpha = 0.15 + Math.sin(v.pulse) * 0.12;
      ctx.strokeStyle = `rgba(220,30,30,${vAlpha})`;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = `rgba(255,50,50,${vAlpha * 1.5})`;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      const x0 = v.x * W;
      ctx.moveTo(x0, gY);
      ctx.bezierCurveTo(
        x0 + (Math.random()-0.5)*30, gY + 15,
        x0 + (Math.random()-0.5)*20, gY + 30,
        x0 + (Math.random()-0.5)*40, H
      );
      ctx.stroke();
    });
    ctx.shadowBlur = 0;

    // ── Ground: dark reddish earth ────────────────────────
    const gr = ctx.createLinearGradient(0, gY, 0, H);
    gr.addColorStop(0, '#2a0505');
    gr.addColorStop(0.4, '#1a0303');
    gr.addColorStop(1, '#0d0101');
    ctx.fillStyle = gr;
    ctx.fillRect(0, gY, W, H - gY);

    // ── Twisted trees ─────────────────────────────────────
    this.trees.forEach(tree => {
      const tx = tree.x * W;
      const sway = Math.sin(t * 0.5 + tree.lean * 10) * 2;
      ctx.strokeStyle = '#0d0000';
      ctx.lineWidth = 8;
      ctx.lineCap = 'round';
      // Trunk
      ctx.beginPath();
      ctx.moveTo(tx, gY + 5);
      ctx.bezierCurveTo(
        tx + sway + tree.lean * W * 0.12, gY - H * 0.1,
        tx + sway * 1.5 + tree.lean * W * 0.18, gY - H * 0.22,
        tx + sway * 2 + tree.lean * W * 0.22, gY - H * 0.35
      );
      ctx.stroke();
      // Twisted branches
      const bx = tx + sway * 2 + tree.lean * W * 0.22;
      const by = gY - H * 0.35;
      [[0.12, -0.08], [-0.1, -0.06], [0.07, -0.12], [-0.14, -0.1]].forEach(([dx, dy]) => {
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(
          bx + dx * W * 0.5 + sway, by + dy * H * 0.5,
          bx + dx * W + sway * 1.5, by + dy * H
        );
        ctx.stroke();
        // Sub-branches
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(bx + dx * W * 0.5, by + dy * H * 0.5);
        ctx.lineTo(bx + (dx + 0.07) * W * 0.5, by + (dy - 0.06) * H * 0.5);
        ctx.stroke();
      });
    });

    // ── Fog layers drifting ───────────────────────────────
    this.fogs.forEach(f => {
      f.x -= f.speed;
      if (f.x + f.w < 0) f.x = W + 10;
      const fg = ctx.createRadialGradient(
        f.x + f.w / 2, f.y + f.h / 2, 0,
        f.x + f.w / 2, f.y + f.h / 2, f.w / 1.5
      );
      fg.addColorStop(0, `rgba(180,20,20,${f.alpha})`);
      fg.addColorStop(0.5, `rgba(120,10,10,${f.alpha * 0.5})`);
      fg.addColorStop(1, 'transparent');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.ellipse(f.x + f.w / 2, f.y + f.h / 2, f.w / 2, f.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Lightning bolts ───────────────────────────────────
    this.nextBolt--;
    if (this.nextBolt <= 0) {
      this.nextBolt = 80 + Math.random() * 150;
      const bx = W * (0.1 + Math.random() * 0.8);
      this.bolts.push({ x: bx, life: 1.0, segs: this._makeBolt(bx, 0, bx + (Math.random()-0.5)*60, H*0.55) });
    }
    this.bolts = this.bolts.filter(b => {
      b.life -= 0.08;
      if (b.life <= 0) return false;
      ctx.strokeStyle = `rgba(180,0,255,${b.life * 0.9})`;
      ctx.shadowColor = `rgba(200,50,255,${b.life})`;
      ctx.shadowBlur = 20;
      ctx.lineWidth = 2;
      ctx.beginPath();
      b.segs.forEach((pt, i) => i === 0 ? ctx.moveTo(pt[0], pt[1]) : ctx.lineTo(pt[0], pt[1]));
      ctx.stroke();
      // Screen flash on fresh bolt
      if (b.life > 0.85) {
        ctx.fillStyle = `rgba(120,0,180,${(b.life-0.85)*0.3})`;
        ctx.fillRect(0, 0, W, H);
      }
      return true;
    });
    ctx.shadowBlur = 0;

    // ── Floating spores / ash ─────────────────────────────
    this.spores.forEach(s => {
      s.x += s.vx + Math.sin(t * 0.8 + s.ph) * 0.5;
      s.y += s.vy;
      s.ph += 0.01;
      if (s.y < -10) { s.y = H + 5; s.x = Math.random() * W; }
      if (s.x < -5) s.x = W + 5;
      if (s.x > W + 5) s.x = -5;
      if (s.type === 'spore') {
        const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        sg.addColorStop(0, `rgba(255,60,60,${s.alpha})`);
        sg.addColorStop(0.4, `rgba(200,20,20,${s.alpha * 0.4})`);
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(80,10,10,${s.alpha * 0.7})`;
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(t + s.ph);
        ctx.fillRect(-s.r, -s.r * 0.4, s.r * 2, s.r * 0.8);
        ctx.restore();
      }
    });

    // ── Demogorgon eye glow ambient (subtle) ─────────────
    const eyeA = 0.04 + Math.sin(t * 0.3) * 0.03;
    const eye = ctx.createRadialGradient(W * 0.5, gY - H * 0.1, 0, W * 0.5, gY - H * 0.1, W * 0.4);
    eye.addColorStop(0, `rgba(255,0,0,${eyeA})`);
    eye.addColorStop(1, 'transparent');
    ctx.fillStyle = eye;
    ctx.fillRect(0, 0, W, H);
  }

  _makeBolt(x1, y1, x2, y2) {
    const segs = [[x1, y1]];
    const steps = 8 + Math.floor(Math.random() * 6);
    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const mx = x1 + (x2 - x1) * p + (Math.random() - 0.5) * 40;
      const my = y1 + (y2 - y1) * p;
      segs.push([mx, my]);
    }
    segs.push([x2, y2]);
    return segs;
  }
}

// ══════════════════════════════════════════════════════════
// MONTE CORONA — Sinnoh peaks
// Amanecer épico, aurora boreal, nieve cayendo, lago helado
// picos nevados, nubes volumétricas
// ══════════════════════════════════════════════════════════
class ScenaNieve extends ScenarioCanvas {
  setupParticles() {
    const W = this.W || 400, H = this.H || 500;
    // Snowflakes
    this.snow = Array.from({length:120}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 0.8 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.4 + Math.random() * 0.9,
      ph: Math.random() * Math.PI * 2,
      alpha: 0.5 + Math.random() * 0.5,
      spin: (Math.random()-0.5)*0.04,
      rot: Math.random()*Math.PI*2,
    }));
    // Aurora ribbons
    this.auroras = Array.from({length:4}, (_, i) => ({
      ph: i * Math.PI * 0.5,
      color: ['rgba(0,255,180,', 'rgba(100,200,255,', 'rgba(180,100,255,', 'rgba(0,220,150,'][i],
      amp: 30 + i * 15,
      speed: 0.4 + i * 0.15,
      y: H * (0.08 + i * 0.04),
      alpha: 0.08 + Math.random() * 0.1,
    }));
    // Clouds
    this.clouds = Array.from({length:6}, (_, i) => ({
      x: (i / 6) * W * 1.5,
      y: H * (0.05 + Math.random() * 0.12),
      w: W * (0.25 + Math.random() * 0.3),
      speed: 0.2 + Math.random() * 0.25,
      alpha: 0.7 + Math.random() * 0.25,
    }));
    // Lake sparkles
    this.sparkles = Array.from({length:25}, () => ({
      x: W * (0.15 + Math.random() * 0.7),
      y: H * (0.72 + Math.random() * 0.1),
      ph: Math.random() * Math.PI * 2,
      size: 1 + Math.random() * 2,
    }));
  }

  draw() {
    const { ctx, W, H, t } = this;
    if (!ctx || !W || !H) return;

    const gY = H * 0.62;
    const lakeY = H * 0.70;

    // ── Sky: dawn over snowy peaks ────────────────────────
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    const dawnCycle = (Math.sin(t * 0.08) + 1) * 0.5; // slow day cycle
    sky.addColorStop(0, `rgba(5,8,30,1)`);
    sky.addColorStop(0.25, `rgba(${Math.round(15+dawnCycle*40)},${Math.round(10+dawnCycle*20)},${Math.round(60+dawnCycle*30)},1)`);
    sky.addColorStop(0.5, `rgba(${Math.round(80+dawnCycle*100)},${Math.round(40+dawnCycle*80)},${Math.round(100+dawnCycle*60)},1)`);
    sky.addColorStop(0.8, `rgba(${Math.round(200+dawnCycle*50)},${Math.round(120+dawnCycle*80)},${Math.round(80+dawnCycle*60)},1)`);
    sky.addColorStop(1, `rgba(${Math.round(220+dawnCycle*30)},${Math.round(160+dawnCycle*60)},${Math.round(100+dawnCycle*40)},1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // ── Aurora borealis ribbons ───────────────────────────
    this.auroras.forEach(a => {
      const aAlpha = a.alpha * (0.6 + Math.sin(t * a.speed + a.ph) * 0.4);
      ctx.beginPath();
      ctx.moveTo(0, a.y);
      for (let x = 0; x <= W; x += 8) {
        const y = a.y + Math.sin(x / (W / 4) + t * a.speed + a.ph) * a.amp
                  + Math.sin(x / (W / 8) + t * a.speed * 1.3) * (a.amp * 0.3);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.lineTo(W, 0);
      ctx.lineTo(0, 0);
      ctx.closePath();
      ctx.fillStyle = a.color + aAlpha + ')';
      ctx.fill();
    });

    // ── Stars ─────────────────────────────────────────────
    if (!this._stars) {
      this._stars = Array.from({length:80}, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.4,
        r: 0.5 + Math.random() * 1.2, ph: Math.random() * Math.PI * 2
      }));
    }
    this._stars.forEach(s => {
      const a = 0.4 + Math.sin(t * 1.5 + s.ph) * 0.3;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Distant mountain peaks ────────────────────────────
    // Far peaks (lighter, foggy)
    const peaksFar = [
      [W*-0.05, gY-H*0.45], [W*0.15, gY-H*0.55], [W*0.32, gY-H*0.48],
      [W*0.5, gY-H*0.62], [W*0.68, gY-H*0.52], [W*0.85, gY-H*0.58],
      [W*1.05, gY-H*0.44]
    ];
    ctx.beginPath();
    ctx.moveTo(-10, gY + 10);
    peaksFar.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.lineTo(W + 10, gY + 10);
    ctx.closePath();
    const mFar = ctx.createLinearGradient(0, gY - H*0.65, 0, gY);
    mFar.addColorStop(0, 'rgba(160,180,220,0.85)');
    mFar.addColorStop(0.4, 'rgba(200,215,240,0.9)');
    mFar.addColorStop(1, 'rgba(220,230,250,0.95)');
    ctx.fillStyle = mFar;
    ctx.fill();

    // Snow caps on far peaks
    peaksFar.slice(1,-1).forEach(([px, py]) => {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - W*0.06, py + H*0.06);
      ctx.lineTo(px + W*0.06, py + H*0.06);
      ctx.closePath();
      ctx.fillStyle = 'rgba(240,248,255,0.95)';
      ctx.fill();
    });

    // Near peaks (darker, detailed)
    const peaksNear = [
      [W*-0.1, gY-H*0.25], [W*0.08, gY-H*0.38], [W*0.22, gY-H*0.28],
      [W*0.38, gY-H*0.42], [W*0.52, gY-H*0.32], [W*0.68, gY-H*0.38],
      [W*0.82, gY-H*0.28], [W*0.95, gY-H*0.35], [W*1.1, gY-H*0.22]
    ];
    ctx.beginPath();
    ctx.moveTo(-10, gY + 10);
    peaksNear.forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.lineTo(W + 10, gY + 10);
    ctx.closePath();
    const mNear = ctx.createLinearGradient(0, gY - H*0.45, 0, gY);
    mNear.addColorStop(0, '#3a4a6a');
    mNear.addColorStop(0.35, '#4a5a80');
    mNear.addColorStop(1, '#2a3550');
    ctx.fillStyle = mNear;
    ctx.fill();
    // Snow on near peaks
    peaksNear.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px - W*0.05, py + H*0.05);
      ctx.lineTo(px + W*0.05, py + H*0.05);
      ctx.closePath();
      ctx.fillStyle = 'rgba(235,245,255,0.92)';
      ctx.fill();
    });

    // ── Frozen ground ─────────────────────────────────────
    const groundG = ctx.createLinearGradient(0, gY, 0, H);
    groundG.addColorStop(0, '#c8d8f0');
    groundG.addColorStop(0.15, '#b0c4e8');
    groundG.addColorStop(0.5, '#8aa8d8');
    groundG.addColorStop(1, '#6888b8');
    ctx.fillStyle = groundG;
    ctx.fillRect(0, gY, W, H - gY);

    // ── Frozen lake reflection ────────────────────────────
    ctx.fillStyle = 'rgba(150,190,240,0.5)';
    ctx.beginPath();
    ctx.ellipse(W * 0.5, lakeY, W * 0.42, H * 0.065, 0, 0, Math.PI * 2);
    ctx.fill();
    // Lake shimmer
    this.sparkles.forEach(s => {
      s.ph += 0.04;
      const a = Math.max(0, Math.sin(s.ph)) * 0.7;
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size * a, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Clouds drifting ───────────────────────────────────
    this.clouds.forEach(cl => {
      cl.x -= cl.speed;
      if (cl.x + cl.w < 0) cl.x = W + 20;
      ctx.fillStyle = `rgba(240,245,255,${cl.alpha * 0.4})`;
      ctx.beginPath();
      ctx.ellipse(cl.x, cl.y, cl.w / 2, cl.w * 0.18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cl.x - cl.w * 0.2, cl.y + 5, cl.w * 0.32, cl.w * 0.12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cl.x + cl.w * 0.18, cl.y + 3, cl.w * 0.28, cl.w * 0.1, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Snowflakes ────────────────────────────────────────
    this.snow.forEach(s => {
      s.x += s.vx + Math.sin(t * 0.6 + s.ph) * 0.6;
      s.y += s.vy;
      s.rot += s.spin;
      if (s.y > H + 5) { s.y = -5; s.x = Math.random() * W; }
      if (s.x < -5) s.x = W + 5;
      if (s.x > W + 5) s.x = -5;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.strokeStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.lineWidth = 0.8;
      for (let a = 0; a < 6; a++) {
        const angle = (a / 6) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * s.r * 3, Math.sin(angle) * s.r * 3);
        ctx.stroke();
      }
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, s.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
}

// ══════════════════════════════════════════════════════════
// CIUDAD LAVANDA — Kanto ghost town
// Noche morada, luna llena, niebla densa, lápidas, espíritus
// fantasma flotantes, lluvia suave, truenos lejanos
// ══════════════════════════════════════════════════════════
class ScenaLavanda extends ScenarioCanvas {
  setupParticles() {
    const W = this.W || 400, H = this.H || 500;
    // Mist/fog layers
    this.mists = Array.from({length:8}, (_, i) => ({
      x: Math.random() * W * 2,
      y: H * (0.50 + i * 0.055),
      w: W * (0.6 + Math.random() * 0.9),
      h: H * (0.07 + Math.random() * 0.09),
      speed: 0.15 + Math.random() * 0.25,
      ph: Math.random() * Math.PI * 2,
      alpha: 0.07 + Math.random() * 0.1,
    }));
    // Ghost orbs (Gastly-like)
    this.ghosts = Array.from({length:6}, () => ({
      x: W * (0.1 + Math.random() * 0.8),
      y: H * (0.3 + Math.random() * 0.35),
      r: 8 + Math.random() * 16,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.2,
      ph: Math.random() * Math.PI * 2,
      hue: 260 + Math.floor(Math.random() * 60),
      alpha: 0.25 + Math.random() * 0.35,
    }));
    // Rain drops
    this.rain = Array.from({length:80}, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vy: 4 + Math.random() * 4,
      len: 6 + Math.random() * 10,
      alpha: 0.15 + Math.random() * 0.2,
    }));
    // Lightning timing
    this.nextBolt = 120 + Math.random() * 200;
    this.boltFlash = 0;
    // Gravestones
    this.stones = [
      { x: 0.06, h: 0.09, w: 0.04 },
      { x: 0.14, h: 0.07, w: 0.035 },
      { x: 0.78, h: 0.08, w: 0.04 },
      { x: 0.88, h: 0.10, w: 0.045 },
      { x: 0.94, h: 0.07, w: 0.03 },
    ];
    // Tower silhouette segments
    this.towerGlow = 0;
  }

  draw() {
    const { ctx, W, H, t } = this;
    if (!ctx || !W || !H) return;

    const gY = H * 0.60;

    // ── Lightning flash ───────────────────────────────────
    this.nextBolt--;
    if (this.nextBolt <= 0) {
      this.nextBolt = 100 + Math.random() * 180;
      this.boltFlash = 1.0;
    }
    if (this.boltFlash > 0) this.boltFlash -= 0.06;

    // ── Sky: deep purple night ────────────────────────────
    const flashAdd = Math.max(0, this.boltFlash) * 40;
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.65);
    sky.addColorStop(0, `rgba(${8+flashAdd},${4+flashAdd},${22+flashAdd},1)`);
    sky.addColorStop(0.3, `rgba(${20+flashAdd},${8+flashAdd},${50+flashAdd},1)`);
    sky.addColorStop(0.6, `rgba(${35+flashAdd},${12+flashAdd},${70+flashAdd},1)`);
    sky.addColorStop(1, `rgba(${50+flashAdd},${18+flashAdd},${80+flashAdd},1)`);
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // ── Moon ──────────────────────────────────────────────
    const moonX = W * 0.75, moonY = H * 0.14, moonR = W * 0.075;
    // Moon glow
    const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, moonR * 4.5);
    moonGlow.addColorStop(0, 'rgba(220,200,255,0.18)');
    moonGlow.addColorStop(0.4, 'rgba(180,150,240,0.08)');
    moonGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = moonGlow;
    ctx.fillRect(0, 0, W, H);
    // Moon body
    const mg = ctx.createRadialGradient(moonX - moonR*0.2, moonY - moonR*0.2, 0, moonX, moonY, moonR);
    mg.addColorStop(0, '#e8deff');
    mg.addColorStop(0.7, '#c8b8f0');
    mg.addColorStop(1, '#a090d8');
    ctx.fillStyle = mg;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();
    // Moon craters
    [[0.3, -0.2, 0.12], [-0.3, 0.3, 0.08], [0.15, 0.35, 0.06]].forEach(([dx, dy, cr]) => {
      ctx.fillStyle = 'rgba(150,130,200,0.3)';
      ctx.beginPath();
      ctx.arc(moonX + dx*moonR, moonY + dy*moonR, cr*moonR, 0, Math.PI*2);
      ctx.fill();
    });

    // ── Stars ─────────────────────────────────────────────
    if (!this._stars) {
      this._stars = Array.from({length:100}, () => ({
        x: Math.random() * W, y: Math.random() * H * 0.5,
        r: 0.4 + Math.random() * 1.1, ph: Math.random() * Math.PI * 2
      }));
    }
    this._stars.forEach(s => {
      const a = 0.3 + Math.sin(t * 1.8 + s.ph) * 0.35;
      ctx.fillStyle = `rgba(200,180,255,${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Lavender Tower silhouette ─────────────────────────
    const twX = W * 0.48, twBase = gY + 5;
    const twW = W * 0.10, twH = H * 0.42;
    ctx.fillStyle = 'rgba(10,4,20,0.95)';
    // Main tower
    ctx.fillRect(twX - twW/2, twBase - twH, twW, twH);
    // Tower top spire
    ctx.beginPath();
    ctx.moveTo(twX - twW/2, twBase - twH);
    ctx.lineTo(twX, twBase - twH - H*0.08);
    ctx.lineTo(twX + twW/2, twBase - twH);
    ctx.closePath();
    ctx.fill();
    // Tower windows (glowing purple)
    this.towerGlow = (Math.sin(t * 0.7) + 1) * 0.5;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 2; col++) {
        const wx = twX - twW*0.25 + col * twW*0.5;
        const wy = twBase - twH * 0.8 + row * twH * 0.18;
        const wGlow = ctx.createRadialGradient(wx, wy, 0, wx, wy, 8);
        const wAlpha = 0.4 + this.towerGlow * 0.35;
        wGlow.addColorStop(0, `rgba(180,100,255,${wAlpha})`);
        wGlow.addColorStop(0.5, `rgba(120,50,200,${wAlpha*0.4})`);
        wGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = wGlow;
        ctx.fillRect(wx - 8, wy - 8, 16, 16);
        ctx.fillStyle = `rgba(200,150,255,${wAlpha})`;
        ctx.fillRect(wx - 2.5, wy - 3.5, 5, 7);
      }
    }

    // ── Ground: dark purple grass ─────────────────────────
    const groundG = ctx.createLinearGradient(0, gY, 0, H);
    groundG.addColorStop(0, '#1a0a28');
    groundG.addColorStop(0.3, '#120720');
    groundG.addColorStop(1, '#080412');
    ctx.fillStyle = groundG;
    ctx.fillRect(0, gY, W, H - gY);

    // ── Gravestones ───────────────────────────────────────
    this.stones.forEach(st => {
      const sx = st.x * W, sy = gY - st.h * H;
      const sw = st.w * W, sh = st.h * H;
      ctx.fillStyle = 'rgba(15,8,30,0.92)';
      // Body
      ctx.fillRect(sx - sw/2, sy, sw, sh);
      // Rounded top
      ctx.beginPath();
      ctx.arc(sx, sy + sw*0.55, sw*0.5, Math.PI, 0);
      ctx.fill();
      // Cross detail
      ctx.strokeStyle = 'rgba(80,40,120,0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx, sy + sh*0.25); ctx.lineTo(sx, sy + sh*0.7);
      ctx.moveTo(sx - sw*0.3, sy + sh*0.42); ctx.lineTo(sx + sw*0.3, sy + sh*0.42);
      ctx.stroke();
      // Moss glow
      ctx.fillStyle = 'rgba(80,0,120,0.15)';
      ctx.fillRect(sx - sw/2, sy, sw, sh);
    });

    // ── Ghost orbs floating ───────────────────────────────
    this.ghosts.forEach(g => {
      g.ph += 0.018;
      g.x += g.vx + Math.sin(t * 0.5 + g.ph) * 0.4;
      g.y += g.vy + Math.cos(t * 0.4 + g.ph) * 0.3;
      if (g.x < W*0.05) g.vx = Math.abs(g.vx);
      if (g.x > W*0.95) g.vx = -Math.abs(g.vx);
      if (g.y < H*0.2) g.vy = Math.abs(g.vy);
      if (g.y > gY - 20) g.vy = -Math.abs(g.vy);
      const pAlpha = g.alpha * (0.6 + Math.sin(g.ph * 2) * 0.4);
      const gg = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, g.r * 2.5);
      gg.addColorStop(0, `hsla(${g.hue},80%,75%,${pAlpha})`);
      gg.addColorStop(0.4, `hsla(${g.hue},70%,50%,${pAlpha*0.5})`);
      gg.addColorStop(1, 'transparent');
      ctx.fillStyle = gg;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r * 2.5, 0, Math.PI * 2);
      ctx.fill();
      // Core
      ctx.fillStyle = `hsla(${g.hue},90%,85%,${pAlpha * 1.2})`;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r * 0.4, 0, Math.PI * 2);
      ctx.fill();
    });

    // ── Fog rolling in ────────────────────────────────────
    this.mists.forEach(m => {
      m.x -= m.speed;
      m.ph += 0.008;
      if (m.x + m.w < 0) m.x = W + 20;
      const mAlpha = m.alpha * (0.7 + Math.sin(m.ph) * 0.3);
      const mG = ctx.createRadialGradient(
        m.x + m.w/2, m.y, 0,
        m.x + m.w/2, m.y + m.h/2, m.w/1.5
      );
      mG.addColorStop(0, `rgba(100,60,160,${mAlpha})`);
      mG.addColorStop(0.5, `rgba(80,40,130,${mAlpha*0.5})`);
      mG.addColorStop(1, 'transparent');
      ctx.fillStyle = mG;
      ctx.beginPath();
      ctx.ellipse(m.x + m.w/2, m.y + m.h/2, m.w/2, m.h/2, 0, 0, Math.PI*2);
      ctx.fill();
    });

    // ── Rain ──────────────────────────────────────────────
    ctx.strokeStyle = 'rgba(180,150,255,0.18)';
    ctx.lineWidth = 0.7;
    this.rain.forEach(r => {
      r.y += r.vy;
      r.x -= 0.5;
      if (r.y > H) { r.y = -10; r.x = Math.random() * W; }
      ctx.globalAlpha = r.alpha;
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 1, r.y + r.len);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;

    // ── Moon glow on ground ───────────────────────────────
    ctx.fillStyle = `rgba(180,150,255,${0.04 + Math.sin(t*0.3)*0.02})`;
    ctx.beginPath();
    ctx.ellipse(moonX, gY + H*0.03, W*0.25, H*0.04, 0, 0, Math.PI*2);
    ctx.fill();
  }
}

