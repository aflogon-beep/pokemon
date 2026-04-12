// PokéBattle Screens

function mkGenBtns(){
  return [["TODAS",0],["GEN I",1],["GEN II",2],["GEN III",3],["GEN IV",4],["GEN V",5]].map(function(pair){
    var lbl=pair[0],g=pair[1];
    var a=(G._selGen||0)===g;
    return '<button onclick="G._selGen='+g+';render()" style="flex-shrink:0;border:none;cursor:pointer;padding:5px 10px;border-radius:20px;font-size:.65rem;font-weight:800;background:'+(a?'#6366F1':'rgba(255,255,255,.08)')+';color:'+(a?'#fff':'rgba(255,255,255,.5)')+';border:1px solid '+(a?'#6366F1':'transparent')+';white-space:nowrap;">'+lbl+'</button>';
  }).join("");
}

const SCREENS={
intro(){
  const b=G.bat,sc=G.scenario;
  const t1=b.t1,t2=b.t2;
  // vmin-based sizes work on both portrait mobile and landscape desktop
  const pkImg="width:min(80px,20vmin);height:min(80px,20vmin)";
  const team1imgs=t1.map(pk=>`
    <div style="text-align:center;flex:1;min-width:0;">
      <img src="${su(pk.id)}" style="${pkImg};object-fit:contain;display:block;margin:0 auto;">
      <div style="color:#fff;font-weight:800;font-size:min(.82rem,3.5vmin);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pk.name}</div>
      <div style="margin-top:2px;display:flex;flex-wrap:wrap;justify-content:center;gap:2px;">${pk.types.map(t=>bdg(t)).join("")}</div>
    </div>`).join("");
  const team2imgs=t2.map(pk=>`
    <div style="text-align:center;flex:1;min-width:0;">
      <img src="${su(pk.id)}" style="${pkImg};object-fit:contain;display:block;margin:0 auto;">
      <div style="color:#fff;font-weight:800;font-size:min(.82rem,3.5vmin);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pk.name}</div>
      <div style="margin-top:2px;display:flex;flex-wrap:wrap;justify-content:center;gap:2px;">${pk.types.map(t=>bdg(t)).join("")}</div>
    </div>`).join("");
  startMusic();
  if(typeof initCanvasScene==='function'){setTimeout(()=>initCanvasScene(sc?sc.name:'campo','intro-canvas'),30);}
  return`<div style="position:absolute;inset:0;overflow:hidden;display:flex;flex-direction:column;">
    <canvas id="intro-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;"></canvas>
    <div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.65) 0%,rgba(0,0,0,.2) 50%,rgba(0,0,0,.75) 100%);"></div>
    <div style="position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:space-between;padding:min(16px,3%) min(12px,2%);">
      <!-- Title -->
      <div style="text-align:center;flex-shrink:0;">
        <div style="display:inline-block;background:linear-gradient(135deg,#F59E0B,#D97706);color:#fff;font-family:'Roboto',sans-serif;font-weight:700;font-size:min(.95rem,4vmin);padding:7px 20px;border-radius:999px;letter-spacing:.15em;box-shadow:0 4px 20px rgba(245,158,11,.6);">⚡ ¡COMBATE POKÉMON! ⚡</div>
      </div>
      <!-- Cards — column on portrait, row on landscape -->
      <div style="display:flex;flex-direction:${window.innerWidth<window.innerHeight?"column":"row"};align-items:stretch;flex:1;margin:min(10px,2%) 0;min-height:0;gap:${window.innerWidth<window.innerHeight?"8px":"0"};">
        ${(()=>{
          const portrait=window.innerWidth<window.innerHeight;
          const vsEl=`<div style="${portrait?"display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:4px 0":"width:min(70px,12vmin);flex-shrink:0;display:flex;align-items:center;justify-content:center"}">
            <div style="background:linear-gradient(135deg,#F59E0B,#EF4444);border-radius:50%;width:min(48px,9vmin);height:min(48px,9vmin);display:flex;align-items:center;justify-content:center;box-shadow:0 0 30px rgba(245,158,11,.9);border:2px solid rgba(255,255,255,.4);animation:vsSlam .7s cubic-bezier(.175,.885,.32,1.275) .7s both;">
              <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:min(1.4rem,5.5vmin);color:#fff;">VS</span>
            </div>
          <!-- Liga Pokémon -->
          <button class="btn" style="background:rgba(15,23,42,.4);border:1px solid rgba(255,180,0,.35);border-radius:14px;padding:20px 20px;text-align:left;display:flex;align-items:center;gap:16px;transition:all .15s;" onclick="sfxMenu();startTournament()">
            <div style="width:min(60px,14vw);height:min(60px,14vw);flex-shrink:0;background:linear-gradient(135deg,#FFD700,#FF8C00);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:min(2rem,7vw);box-shadow:0 4px 16px rgba(255,215,0,.5);">🏆</div>
            <div>
              <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:min(1.1rem,4.5vw);color:#FFD700;letter-spacing:.06em;">LIGA POKÉMON</div>
              <div style="font-family:'Roboto',sans-serif;font-size:min(.8rem,3.2vw);color:rgba(255,255,255,.5);margin-top:3px;">Torneo de 8 entrenadores. ¡Conquista la Liga!</div>
            </div>
          </button>
          </div>`;
          const card1=`<div style="flex:1;min-width:0;${portrait?"min-height:0":"height:100%"};animation:p1Slide .5s ease .2s both;">
            <div style="background:rgba(0,0,0,.68);backdrop-filter:blur(14px);border-radius:14px;border:2px solid rgba(255,200,50,.5);padding:10px 12px;height:100%;box-sizing:border-box;display:flex;${portrait?"flex-direction:row;align-items:center;gap:10px":"flex-direction:column"}">
              <div style="${portrait?"flex-shrink:0":"margin-bottom:8px"};display:flex;align-items:center;gap:6px;${portrait?"":"flex-shrink:0"}">
                <span style="font-size:min(1.2rem,5vmin);">${A[G.p1.avatar]}</span>
                <div><div style="color:#FCD34D;font-weight:900;font-size:min(.95rem,4vmin);white-space:nowrap;">${G.p1.name}</div>
                <div style="color:rgba(255,255,255,.45);font-family:'Roboto',sans-serif;font-size:min(.6rem,2.4vmin);font-weight:600;letter-spacing:.04em;">ENTRENADOR</div></div>
              </div>
              <div style="display:flex;gap:${portrait?"8px":"4px"};align-items:center;${portrait?"flex:1;justify-content:space-around":"flex:1;align-items:flex-end"}">${team1imgs}</div>
            </div>
          </div>`;
          const card2=`<div style="flex:1;min-width:0;${portrait?"min-height:0":"height:100%"};animation:p2Slide .5s ease .2s both;">
            <div style="background:rgba(0,0,0,.68);backdrop-filter:blur(14px);border-radius:14px;border:2px solid rgba(96,165,250,.5);padding:10px 12px;height:100%;box-sizing:border-box;display:flex;${portrait?"flex-direction:row;align-items:center;gap:10px":"flex-direction:column"}">
              <div style="${portrait?"flex-shrink:0":"margin-bottom:8px;justify-content:flex-end"};display:flex;align-items:center;gap:6px;${portrait?"":"flex-shrink:0;flex-direction:row-reverse"}">
                <span style="font-size:min(1.2rem,5vmin);">${A[G.p2.avatar]}</span>
                <div style="${portrait?"":"text-align:right"}"><div style="color:#93C5FD;font-weight:900;font-size:min(.95rem,4vmin);white-space:nowrap;">${G.p2.name}</div>
                <div style="color:rgba(255,255,255,.45);font-family:'Roboto',sans-serif;font-size:min(.6rem,2.4vmin);font-weight:600;letter-spacing:.04em;">${G.p2.isCPU?"CPU":"ENTRENADOR"}</div></div>
              </div>
              <div style="display:flex;gap:${portrait?"8px":"4px"};align-items:center;${portrait?"flex:1;justify-content:space-around":"flex:1;align-items:flex-end"}">${team2imgs}</div>
            </div>
          </div>`;
          return card1+vsEl+card2;
        })()}
      </div>
      <!-- Bottom -->
      <div style="text-align:center;display:flex;flex-direction:column;align-items:center;gap:10px;flex-shrink:0;">
        <div style="background:rgba(0,0,0,.55);color:rgba(255,255,255,.65);font-size:min(.7rem,3vmin);font-weight:700;padding:3px 12px;border-radius:999px;letter-spacing:.08em;">${_scLabels[sc.name]||sc.name}</div>
        <button onclick="sfxMenu();go('battle')" style="border:none;cursor:pointer;background:linear-gradient(135deg,#22C55E,#15803D);color:#fff;font-family:'Roboto',sans-serif;font-weight:700;font-size:min(.95rem,4vmin);padding:13px min(40px,8vmin);border-radius:999px;box-shadow:0 4px 25px rgba(34,197,94,.6);letter-spacing:.08em;transition:transform .1s;animation:battleIntro .6s ease 1.2s both;" onpointerdown="this.style.transform='scale(.94)'" onpointerup="this.style.transform='scale(1)'">⚔️ ¡INICIAR BATALLA!</button>
      </div>
    </div>
  </div>`;
},
title(){
  const hs=gs().length>0;
  let stars="";for(let i=0;i<28;i++){const x=Math.random()*100,y=Math.random()*100,s=1+Math.random()*3,d=2+Math.random()*4,dl=Math.random()*3;stars+=`<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:#fff;border-radius:50%;animation:twinkle ${d}s ease-in-out ${dl}s infinite;"></div>`;}
    // Animated silhouette system
  const silIds=[6,25,150,149,130,143,94,131,59,68,65,135,196,248,445,448,571,637,643,644];
  const sil=silIds[Math.floor(Math.random()*silIds.length)];
  const silName=(PKS.find(p=>p.id===sil)||{name:'charizard'}).name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/-$/,'');
  const silUrl="https://img.pokemondb.net/sprites/black-white/anim/normal/"+silName+".gif";
  // Second silhouette
  const sil2Ids=[3,9,154,157,160,254,257,260,384,383,382,487,491,492,493];
  const sil2=sil2Ids[Math.floor(Math.random()*sil2Ids.length)];
  const sil2Name=(PKS.find(p=>p.id===sil2)||{name:'venusaur'}).name.toLowerCase().replace(/[^a-z0-9]/g,'-').replace(/-+/g,'-').replace(/-$/,'');
  const sil2Url="https://img.pokemondb.net/sprites/black-white/anim/normal/"+sil2Name+".gif";
  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F172A,#1E3A5F,#1E40AF);overflow:hidden;">
    <!-- Animated silhouettes background -->
    <div style="position:absolute;left:-5%;bottom:8%;z-index:0;opacity:.18;filter:brightness(0) invert(1);transform:scaleX(-1);animation:idleBreath 3s ease-in-out infinite;">
      <img src="${silUrl}" style="width:min(220px,55vw);height:auto;" onerror="this.style.display='none'">
    </div>
    <div style="position:absolute;right:-5%;bottom:5%;z-index:0;opacity:.15;filter:brightness(0) invert(1);animation:idleBreath2 3.5s ease-in-out infinite;">
      <img src="${sil2Url}" style="width:min(180px,45vw);height:auto;" onerror="this.style.display='none'">
    </div>
    ${stars}
    <div style="display:flex;flex-direction:column;align-items:center;z-index:1;padding:0 28px;width:100%;max-width:400px;">
      <div style="position:relative;margin-bottom:16px;">
        <div style="position:absolute;inset:-14px;border-radius:50%;background:radial-gradient(circle,rgba(204,0,0,.22),transparent 70%);animation:pulseGlow 2s ease-in-out infinite;pointer-events:none;"></div>
        <div style="animation:spin 12s linear infinite;filter:drop-shadow(0 0 18px rgba(204,0,0,.7));">${POKEBALL}</div>
      </div>
      <div style="text-align:center;margin-bottom:5px;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:clamp(2.6rem,10vw,4.2rem);line-height:.95;letter-spacing:.05em;background:linear-gradient(180deg,#FFDE00 0%,#FFC107 45%,#FF9800 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(2px 3px 0 rgba(0,0,0,.9)) drop-shadow(-1px -1px 0 rgba(0,0,0,.9));">POKÉBATTLE</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:clamp(.85rem,3.5vw,1.1rem);color:#fff;letter-spacing:.5em;font-weight:700;text-shadow:1px 1px 0 #000;margin-top:2px;margin-left:.5em;">GENERACIÓN I</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:24px;width:min(220px,70vw);">
        <div style="flex:1;height:2px;background:linear-gradient(90deg,transparent,#FFDE00);border-radius:2px;"></div>
        <span style="font-size:.8rem;">⚡</span>
        <div style="flex:1;height:2px;background:linear-gradient(90deg,#FFDE00,transparent);border-radius:2px;"></div>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;width:100%;">
        <button class="btn" style="background:linear-gradient(135deg,#3B82F6,#1D4ED8);font-size:1.15rem;padding:18px;box-shadow:0 4px 20px rgba(59,130,246,.5);" onclick="sfxMenu();go('mode')">🎮 Nueva Partida</button>
        <button class="btn" style="background:${hs?"linear-gradient(135deg,#8B5CF6,#6D28D9)":"#1E293B"};" onclick="sfxMenu();oSaves('load')" ${hs?"":"disabled"}>💾 Cargar Partida</button>
        <button class="btn" style="background:${hs?"linear-gradient(135deg,#475569,#1E293B)":"#1E293B"};" onclick="sfxMenu();oSaves('del')" ${hs?"":"disabled"}>🗑️ Borrar Partidas</button>
        <!-- Settings row -->
        <div style="display:flex;gap:10px;margin-top:4px;">
          <button onclick="toggleMusic()" style="flex:1;border:none;cursor:pointer;border-radius:10px;padding:12px 8px;font-family:'Roboto',sans-serif;font-weight:700;font-size:.9rem;background:${CFG.music?"rgba(34,197,94,.2)":"rgba(255,255,255,.06)"};border:2px solid ${CFG.music?"#22C55E":"rgba(255,255,255,.12)"};color:${CFG.music?"#22C55E":"rgba(255,255,255,.4)"};transition:all .15s;">
            ${CFG.music?"🎵":"🔇"} Música
          </button>
          <button onclick="toggleSfx()" style="flex:1;border:none;cursor:pointer;border-radius:10px;padding:12px 8px;font-family:'Roboto',sans-serif;font-weight:700;font-size:.9rem;background:${CFG.sfx?"rgba(59,130,246,.2)":"rgba(255,255,255,.06)"};border:2px solid ${CFG.sfx?"#3B82F6":"rgba(255,255,255,.12)"};color:${CFG.sfx?"#3B82F6":"rgba(255,255,255,.4)"};transition:all .15s;">
            ${CFG.sfx?"🔊":"🔕"} Efectos
          </button>
        </div>
        <div style="text-align:center;margin-top:8px;color:rgba(255,255,255,.25);font-size:.7rem;letter-spacing:.15em;font-family:'Roboto',monospace;font-weight:700;">v9.3.4</div>
      </div>
    </div>
  </div>`;
},
mode(){
  let sparks="";
  for(let i=0;i<16;i++){
    const x=Math.random()*100,y=Math.random()*100,d=1.5+Math.random()*3,dl=Math.random()*4,sz=1+Math.random()*2.5;
    const col=["#EF4444","#F59E0B","#A855F7","#3B82F6"][i%4];
    sparks+=`<div style="position:absolute;left:${x}%;top:${y}%;width:${sz}px;height:${sz}px;background:${col};border-radius:50%;animation:twinkle ${d}s ease-in-out ${dl}s infinite;opacity:.5;"></div>`;
  }
  return`<div style="position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at 50% 30%,#0F172A 0%,#1E3A5F 80%);">
    ${sparks}
    <button onclick="sfxMenu();go('title')" style="position:absolute;top:16px;left:16px;z-index:10;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);font-size:.85rem;cursor:pointer;font-weight:800;padding:8px 16px;border-radius:6px;font-family:'Roboto',sans-serif;font-weight:700;letter-spacing:.04em;">← ATRÁS</button>
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;">
      <div style="width:100%;max-width:380px;">
        <!-- Title -->
        <div style="text-align:center;margin-bottom:32px;">
          <div style="font-size:min(64px,18vw);line-height:1;margin-bottom:12px;filter:drop-shadow(0 0 24px #3B82F6);">⚔️</div>
          <div style="font-family:'Rajdhani',Impact,sans-serif;font-size:min(2.2rem,7.5vw);color:#fff;font-weight:700;letter-spacing:.12em;text-shadow:0 0 30px rgba(239,68,68,.6);">MODO DE JUEGO</div>
          <div style="width:80px;height:3px;background:linear-gradient(90deg,#3B82F6,#60A5FA);margin:10px auto 0;border-radius:2px;box-shadow:0 0 12px #3B82F6;"></div>
        </div>
        <!-- Buttons -->
        <div style="display:flex;flex-direction:column;gap:12px;">
          <!-- CPU -->
          <button onclick="sfxMenu();sMode('cpu')" style="border:none;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(59,130,246,.35);border-radius:14px;padding:20px 20px;text-align:left;display:flex;align-items:center;gap:16px;transition:all .15s;" onpointerdown="this.style.background='rgba(59,130,246,.15)';this.style.boxShadow='0 0 30px rgba(59,130,246,.3)'" onpointerup="this.style.background='rgba(255,255,255,.04)';this.style.boxShadow='none'">
            <div style="font-size:min(2.8rem,10vw);flex-shrink:0;filter:drop-shadow(0 0 10px #3B82F6);">🤖</div>
            <div>
              <div style="font-family:'Roboto',sans-serif;font-size:min(1.1rem,4.5vw);color:#fff;font-weight:700;letter-spacing:.06em;">VS CPU</div>
              <div style="font-size:min(.8rem,3vw);color:rgba(255,255,255,.45);margin-top:3px;font-weight:600;">Desafía a la Inteligencia Artificial</div>
              <div style="margin-top:6px;display:flex;gap:4px;">
                <span style="background:rgba(59,130,246,.25);color:#60A5FA;font-family:'Roboto',sans-serif;font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:.04em;border:1px solid rgba(59,130,246,.3);">1 JUGADOR</span>
              </div>
            </div>
            <div style="margin-left:auto;color:rgba(255,255,255,.3);font-size:1.4rem;">›</div>
          </button>
          <!-- PVP -->
          <button onclick="sfxMenu();sMode('pvp')" style="border:none;cursor:pointer;background:rgba(255,255,255,.04);border:1px solid rgba(59,130,246,.4);border-radius:14px;padding:20px 20px;text-align:left;display:flex;align-items:center;gap:16px;transition:all .15s;" onpointerdown="this.style.background='rgba(59,130,246,.15)';this.style.boxShadow='0 0 30px rgba(59,130,246,.3)'" onpointerup="this.style.background='rgba(255,255,255,.04)';this.style.boxShadow='none'">
            <div style="font-size:min(2.8rem,10vw);flex-shrink:0;filter:drop-shadow(0 0 10px #3B82F6);">👥</div>
            <div>
              <div style="font-family:'Roboto',sans-serif;font-size:min(1.1rem,4.5vw);color:#fff;font-weight:700;letter-spacing:.06em;">VS JUGADOR</div>
              <div style="font-size:min(.8rem,3vw);color:rgba(255,255,255,.45);margin-top:3px;font-weight:600;">Batalla local en el mismo dispositivo</div>
              <div style="margin-top:6px;display:flex;gap:4px;">
                <span style="background:rgba(59,130,246,.25);color:#3B82F6;font-family:'Roboto',sans-serif;font-size:.6rem;font-weight:700;padding:2px 8px;border-radius:4px;letter-spacing:.04em;border:1px solid rgba(59,130,246,.3);">2 JUGADORES</span>
              </div>
            </div>
            <div style="margin-left:auto;color:rgba(255,255,255,.3);font-size:1.4rem;">›</div>
          </button>
          <!-- Difficulty selector (CPU only) -->
          <div id="diff-row" style="margin-top:16px;${G.mode==='pvp'?'display:none':''}">
            <div style="font-family:'Roboto',sans-serif;font-size:.7rem;color:rgba(255,255,255,.4);letter-spacing:.12em;margin-bottom:8px;text-align:center;">DIFICULTAD CPU</div>
            <div style="display:flex;gap:8px;">
              ${["easy","normal","hard"].map(d=>{
                const labels={easy:"😊 FÁCIL",normal:"⚔ NORMAL",hard:"💀 DIFÍCIL"};
                const cols={easy:"#22C55E",normal:"#3B82F6",hard:"#EF4444"};
                const active=G.diff===d;
                return`<button onclick="G.diff='${d}';render()" style="flex:1;border:none;cursor:pointer;padding:10px 4px;border-radius:8px;font-family:'Roboto',sans-serif;font-size:.75rem;font-weight:700;background:${active?`rgba(${d==='easy'?'34,197,94':d==='normal'?'59,130,246':'239,68,68'},.2)`:'rgba(255,255,255,.05)'};border:2px solid ${active?cols[d]:'rgba(255,255,255,.1)'};color:${active?cols[d]:'rgba(255,255,255,.35)'};">${labels[d]}</button>`;
              }).join("")}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;
},
create(){
  const s=G.cstep,av=s===1?G.av1:G.av2;
  const isP2=s===2;
  const accentCol=isP2?'#818CF8':'#3B82F6';
  const accentGlow=isP2?'rgba(129,140,248,.6)':'rgba(59,130,246,.6)';
  const accentGrad=isP2?'linear-gradient(135deg,#818CF8,#4F46E5)':'linear-gradient(135deg,#3B82F6,#1D4ED8)';
  const title=G.mode==="cpu"?"ELIGE TU ENTRENADOR":`JUGADOR ${s}`;
  const btnLabel=s===1&&G.mode==="pvp"?"JUGADOR 2 →":"ELEGIR POKÉMON";
  const avs=A.map((a,i)=>{
    const sel=av===i;
    return`<button onclick="sfxSel();sAv(${i})" style="font-size:min(28px,7vw);padding:10px 4px;border-radius:10px;border:2px solid ${sel?accentCol:"rgba(255,255,255,.1)"};background:${sel?"rgba(255,255,255,.12)":"rgba(255,255,255,.04)"};cursor:pointer;transition:all .12s;transform:${sel?"scale(1.15)":"scale(1)"};box-shadow:${sel?"0 0 16px "+accentGlow:"none"};">${a}</button>`;
  }).join("");
  // Shooting sparks background
  let sparks="";
  for(let i=0;i<12;i++){
    const x=Math.random()*100,d=1.5+Math.random()*3,dl=Math.random()*4,sz=1+Math.random()*2;
    sparks+=`<div style="position:absolute;left:${x}%;top:${Math.random()*100}%;width:${sz}px;height:${sz}px;background:${accentCol};border-radius:50%;animation:twinkle ${d}s ease-in-out ${dl}s infinite;opacity:.6;"></div>`;
  }
  return`<div style="position:absolute;inset:0;overflow:hidden;background:radial-gradient(ellipse at 50% 0%,${isP2?'#1a0a3e':'#0F172A'} 0%,#1E3A5F 80%);">
    ${sparks}
    <!-- Back button -->
    <button onclick="sfxMenu();${s===2?"bkCreate()":"go('mode')"}" style="position:absolute;top:16px;left:16px;z-index:10;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);font-size:.85rem;cursor:pointer;font-weight:800;padding:8px 16px;border-radius:6px;font-family:'Roboto',sans-serif;font-weight:700;letter-spacing:.04em;">← ATRÁS</button>
    <!-- Main card -->
    <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:16px;">
      <div style="width:100%;max-width:400px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:16px;padding:24px 20px;backdrop-filter:blur(20px);box-shadow:0 0 60px ${accentGlow},inset 0 1px 0 rgba(255,255,255,.1);">
        <!-- Avatar big display -->
        <div style="text-align:center;margin-bottom:20px;">
          <div style="font-size:min(72px,18vw);line-height:1;margin-bottom:8px;filter:drop-shadow(0 0 20px ${accentCol});">${A[av]}</div>
          <div style="font-family:'Rajdhani',Impact,sans-serif;font-size:min(1.5rem,5.5vw);color:#fff;font-weight:700;letter-spacing:.12em;text-shadow:0 0 20px ${accentCol};">${title}</div>
          <div style="width:60px;height:3px;background:${accentCol};margin:8px auto 0;box-shadow:0 0 12px ${accentCol};border-radius:2px;"></div>
        </div>
        <!-- Name input -->
        <div style="margin-bottom:18px;">
          <div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.75rem;color:${accentCol};letter-spacing:.1em;margin-bottom:6px;">NOMBRE DEL ENTRENADOR</div>
          <input id="cname" placeholder="Escribe tu nombre..." maxlength="12"
            style="width:100%;background:rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.15);border-radius:8px;padding:13px 16px;font-size:1.05rem;font-weight:700;outline:none;font-family:inherit;color:#fff;letter-spacing:.02em;"
            onfocus="this.style.borderColor='${accentCol}';this.style.boxShadow='0 0 16px ${accentGlow}'"
            onblur="this.style.borderColor='rgba(255,255,255,.15)';this.style.boxShadow='none'">
        </div>
        <!-- Avatar grid -->
        <div style="margin-bottom:20px;">
          <div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.75rem;color:${accentCol};letter-spacing:.1em;margin-bottom:10px;">ELIGE TU AVATAR</div>
          <div style="display:flex;gap:4px;margin-bottom:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:2px;">
            ${[["👦 TRAINER",0],["🧙 EXPERTO",8],["⚡ ELEMENTO",16],["🦊 ANIMAL",24],["😎 ESTILO",32],["🚀 EXTRA",40]].map(([lbl,st])=>`<button onclick="G._avCat=${st};render()" style="border:none;cursor:pointer;white-space:nowrap;font-family:'Roboto',sans-serif;font-size:.58rem;font-weight:700;padding:4px 8px;border-radius:20px;background:${(G._avCat||0)===st?accentCol:'rgba(255,255,255,.1)'};color:${(G._avCat||0)===st?'#fff':'rgba(255,255,255,.45)'};">${lbl}</button>`).join("")}
          </div>
          <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:6px;">
            ${(()=>{const cat=G._avCat||0;return A.slice(cat,cat+8).map((em,i)=>{const idx=cat+i;const sel=av===idx;return`<button onclick="sfxSel();G['av'+${isP2?2:1}]=${idx};render()" style="background:${sel?'rgba(59,130,246,.25)':'rgba(255,255,255,.06)'};border:2px solid ${sel?accentCol:'rgba(255,255,255,.1)'};border-radius:12px;font-size:min(1.8rem,6.5vw);padding:8px;cursor:pointer;aspect-ratio:1;display:flex;align-items:center;justify-content:center;${sel?'transform:scale(1.1)':''}">${em}</button>`;}).join('');})()}
          </div>
        </div>
        <!-- CTA button -->
        <button onclick="sfxMenu();cNext()" style="width:100%;border:none;cursor:pointer;background:${accentGrad};color:#fff;font-family:'Roboto',sans-serif;font-weight:700;font-size:min(1rem,4vw);letter-spacing:.06em;padding:16px;border-radius:8px;box-shadow:0 4px 24px ${accentGlow};transition:transform .1s,filter .1s;" onpointerdown="this.style.transform='scale(.95)'" onpointerup="this.style.transform='scale(1)'">
          ${btnLabel} ▶
        </button>
      </div>
    </div>
  </div>`;
},
select(){
  const pl=G.sfor===1?G.p1:G.p2;
  const isP2=G.sfor===2;
  const acc=isP2?"#A855F7":"#EF4444";
  const accG=isP2?"rgba(168,85,247,.5)":"rgba(239,68,68,.5)";

  // ── FILTER ──────────────────────────────────────────────
  const allTypes=["all","fire","water","grass","electric","psychic","normal","fighting","poison","ground","rock","flying","ghost","bug","ice","dragon","dark","steel"];
  const typeLabels={all:"TODOS",fire:"FUEGO",water:"AGUA",grass:"PLANTA",electric:"ELÉCT.",psychic:"PSÍQ.",normal:"NORMAL",fighting:"LUCHA",poison:"VENENO",ground:"TIERRA",rock:"ROCA",flying:"VOLAD.",ghost:"FANTASMA",bug:"BICHO",ice:"HIELO",dragon:"DRAGÓN",dark:"OSCURO",steel:"ACERO"};
  const filterBtns=allTypes.map(t=>{
    const active=G.fType===t;
    const bg=(TC[t]||{bg:"#374151"}).bg;
    return`<button onclick="G.fType='${t}';render()" style="flex-shrink:0;border:none;cursor:pointer;padding:5px 10px;border-radius:20px;font-size:.65rem;font-weight:800;background:${active?bg:"rgba(255,255,255,.08)"};color:${active?"#fff":"rgba(255,255,255,.5)"};letter-spacing:.04em;border:1px solid ${active?bg:"transparent"};white-space:nowrap;">${typeLabels[t]}</button>`;
  }).join("");

  // ── FILTERED LIST ────────────────────────────────────────
  const q=(G.fSearch||"").toLowerCase();
  // ── GEN FILTER ──────────────────────────────────────────

  const filtered=PKS.filter(pk=>{
    const typeOk=G.fType==="all"||pk.types.includes(G.fType);
    const nameOk=!q||pk.name.toLowerCase().includes(q);
    const genOk=!G._selGen||(G._selGen===1&&pk.id<=151)||(G._selGen===2&&pk.id>=152&&pk.id<=251)||(G._selGen===3&&pk.id>=252&&pk.id<=386)||(G._selGen===4&&pk.id>=387&&pk.id<=493)||(G._selGen===5&&pk.id>=494);
    return typeOk&&nameOk&&genOk;
  });

  // ── TEAM SLOTS ───────────────────────────────────────────
  const slots=[0,1,2].map(i=>{
    const pk=G.sel[i];
    return`<div onclick="${pk?"sfxSel();dePk("+pk.id+")":""}" style="width:min(58px,13vw);height:min(58px,13vw);border-radius:10px;border:2px solid ${pk?acc:"rgba(255,255,255,.12)"};display:flex;flex-direction:column;align-items:center;justify-content:center;background:${pk?"rgba(255,255,255,.07)":"rgba(255,255,255,.02)"};cursor:${pk?"pointer":"default"};position:relative;${pk?"box-shadow:0 0 10px "+accG:""}">
      ${pk?`<img src="${suStatic(pk.id)}" style="width:min(42px,10vw);height:min(42px,10vw);object-fit:contain;"><div style="position:absolute;top:-6px;right:-6px;background:#EF4444;color:#fff;border-radius:50%;width:16px;height:16px;font-size:10px;font-weight:900;display:flex;align-items:center;justify-content:center;">✕</div>`:'<span style="color:rgba(255,255,255,.15);font-size:min(20px,5vw);">?</span>'}
    </div>`;
  }).join("");

  // ── POKEMON GRID ─────────────────────────────────────────
  const grid=filtered.map(pk=>{
    const iS=!!G.sel.find(s=>s.id===pk.id);
    const iD=G.sel.length>=3&&!iS;
    return`<div onclick="${iD?"":"G.modal="+pk.id+";render()"}" style="background:${iS?"rgba(59,130,246,.15)":"rgba(255,255,255,.04)"};border-radius:10px;padding:7px 4px 6px;border:${iS?"3px":"2px"} solid ${iS?acc:"rgba(255,255,255,.07)"};cursor:${iD?"not-allowed":"pointer"};text-align:center;opacity:${iD?.3:1};box-shadow:${iS?"0 0 16px "+accG+",0 0 4px "+accG:"none"};position:relative;transform:${iS?"scale(1.04)":"scale(1)"};transition:all .12s;">
      ${iS?`<div style="position:absolute;top:-6px;right:-6px;background:#3B82F6;border-radius:50%;width:22px;height:22px;font-size:13px;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:900;box-shadow:0 0 10px rgba(59,130,246,.8),0 0 20px rgba(59,130,246,.4);">✓</div>`:""}
      <img src="${suStatic(pk.id)}" style="width:min(66px,17vw);height:min(66px,17vw);object-fit:contain;display:block;margin:0 auto;">
      <div style="font-weight:800;font-size:min(.68rem,2.3vw);color:${iS?"#fff":"rgba(255,255,255,.6)"};margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${pk.name}</div>
      <div style="margin-top:2px;display:flex;flex-wrap:wrap;justify-content:center;gap:2px;">${pk.types.map(t=>bdg(t)).join("")}</div>
    </div>`;
  }).join("");

  // ── MODAL TCG CARD ───────────────────────────────────────
  let modal="";
  if(G.modal){
    const pk=PKS.find(p=>p.id===G.modal);
    if(pk){
      const iS=!!G.sel.find(s=>s.id===pk.id);
      const canAdd=!iS&&G.sel.length<3;
      const tc0=TC[pk.types[0]]||TC.normal;
      const dexText=(DEX[String(pk.id)]||DEX[pk.id]||"Un Pokémon misterioso del que poco se sabe.");
      const typeIcon={fire:"🔥",water:"💧",grass:"🌿",electric:"⚡",psychic:"🔮",normal:"⭐",fighting:"👊",poison:"☠️",ground:"🌍",flying:"🌪️",rock:"🪨",ice:"❄️",bug:"🐛",ghost:"👻",dragon:"🐉"}[pk.types[0]]||"✨";
      const weakMap={fire:"💧",water:"⚡",grass:"🔥",electric:"🌍",psychic:"👻",normal:"👊",fighting:"🔮",poison:"🌍",ground:"💧",flying:"⚡",rock:"💧",ice:"🔥",bug:"🔥",ghost:"👻",dragon:"❄️"};
      const sb=(val,col,lbl)=>`<div style="margin-bottom:4px;"><div style="display:flex;justify-content:space-between;margin-bottom:1px;"><span style="font-family:'Roboto',sans-serif;font-size:.7rem;font-weight:700;color:rgba(255,255,255,.5);letter-spacing:.04em;">${lbl}</span><span style="font-family:'Rajdhani',sans-serif;font-size:.95rem;font-weight:700;color:rgba(255,255,255,.9);">${val}</span></div><div style="height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;"><div style="width:${Math.min(100,val/160*100)}%;height:100%;background:${col};border-radius:2px;"></div></div></div>`;
      modal=`<div onclick="G.modal=null;render()" style="position:absolute;inset:0;background:rgba(0,0,0,.85);z-index:50;display:flex;align-items:center;justify-content:center;padding:10px;">
        <div onclick="event.stopPropagation()" style="width:min(300px,90vw);max-height:90vh;overflow-y:auto;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.8),0 0 0 3px ${tc0.bg},0 0 0 6px rgba(255,215,0,.6);animation:vsSlam .3s ease both;">
          <!-- Header -->
          <div style="background:linear-gradient(135deg,${tc0.bg},${tc0.grd});padding:10px 14px 8px;border-radius:16px 16px 0 0;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
              <div style="display:flex;align-items:center;gap:6px;">
                <span style="background:rgba(255,255,255,.25);color:#fff;font-family:'Roboto',sans-serif;font-size:.55rem;font-weight:800;padding:2px 6px;border-radius:3px;letter-spacing:.06em;">BÁSICO</span>
                <span style="font-family:'Rajdhani',sans-serif;font-size:min(1.4rem,6vw);color:#fff;font-weight:700;">${pk.name.toUpperCase()}</span>
              </div>
              <div style="display:flex;align-items:center;gap:2px;">
                <span style="font-family:'Roboto',sans-serif;font-size:.6rem;font-weight:700;color:rgba(255,255,255,.8);">PS</span>
                <span style="font-family:'Rajdhani',sans-serif;font-size:1.25rem;font-weight:700;color:#fff;">${pk.hp*2}</span>
                <span>${typeIcon}</span>
              </div>
            </div>
            <div style="display:flex;gap:3px;flex-wrap:wrap;">${pk.types.map(t=>bdg(t)).join("")}${pk.shiny?'<span style="background:linear-gradient(135deg,#FFD700,#FFA500);color:#000;font-size:.52rem;font-weight:800;padding:2px 5px;border-radius:3px;">✨SHINY</span>':''}</div>
          </div>
          <!-- Image -->
          <div style="background:linear-gradient(180deg,${tc0.bg}66,#f0e8d0);position:relative;height:min(170px,42vw);overflow:hidden;">
            <div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.5),transparent 65%);"></div>
            <img src="${su(pk.id)}" style="width:100%;height:100%;object-fit:contain;filter:drop-shadow(0 6px 12px rgba(0,0,0,.25))${pk.shiny?' drop-shadow(0 0 10px #FFD700)':''};">
            <div style="position:absolute;bottom:4px;right:8px;font-family:'Roboto',sans-serif;font-size:.5rem;color:rgba(0,0,0,.35);">N°${String(pk.id).padStart(3,'0')} · Altura y Peso desconocidos</div>
          </div>
          <!-- Body -->
          <div style="background:#1a1a2e;padding:10px 12px;">
            <!-- Dex text -->
            <div style="background:rgba(255,255,255,.07);border-radius:7px;padding:8px 10px;margin-bottom:8px;border-left:3px solid ${tc0.bg};">
              <div style="font-family:'Roboto',sans-serif;font-size:.84rem;color:rgba(255,255,255,.85);line-height:1.55;font-style:italic;">"${dexText}"</div>
            </div>
            <!-- Stats -->
            <div style="background:rgba(255,255,255,.06);border-radius:7px;padding:8px 10px;margin-bottom:8px;border:1px solid rgba(255,255,255,.08);">
              ${sb(pk.hp,"#22C55E","HP")}
              ${sb(pk.atk,"#EF4444","ATAQUE")}
              ${sb(pk.def,"#3B82F6","DEFENSA")}
              ${sb(pk.spd,"#F59E0B","VELOCIDAD")}
            </div>
            <!-- Moves -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;margin-bottom:8px;">
              ${(pk.moves||[]).filter(m=>m&&m.n&&m.p>0).slice(0,4).map(m=>`<div style="background:linear-gradient(135deg,${(TC[m.t]||TC.normal).bg},${(TC[m.t]||TC.normal).grd});border-radius:7px;padding:6px 7px;"><div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.76rem;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.n}</div><div style="font-size:.56rem;color:rgba(255,255,255,.7);margin-top:1px;">${bdg(m.t)} ${m.p}⚡ PP${m.pp}</div></div>`).join("")}
            </div>
            <!-- Weakness row -->
            <div style="display:flex;gap:5px;margin-bottom:10px;">
              <div style="flex:1;background:rgba(255,255,255,.07);border-radius:6px;padding:5px;text-align:center;border:1px solid rgba(255,255,255,.08);"><div style="font-family:'Roboto',sans-serif;font-size:.52rem;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:2px;">DEBILIDAD</div><div>${weakMap[pk.types[0]]||"⭐"} ×2</div></div>
              <div style="flex:1;background:rgba(255,255,255,.07);border-radius:6px;padding:5px;text-align:center;border:1px solid rgba(255,255,255,.08);"><div style="font-family:'Roboto',sans-serif;font-size:.52rem;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:2px;">RESISTENCIA</div><div>-30</div></div>
              <div style="flex:1;background:rgba(255,255,255,.07);border-radius:6px;padding:5px;text-align:center;border:1px solid rgba(255,255,255,.08);"><div style="font-family:'Roboto',sans-serif;font-size:.52rem;font-weight:700;color:rgba(255,255,255,.4);margin-bottom:2px;">RETIRADA</div><div>${"⚪".repeat(Math.max(1,Math.min(4,Math.round(pk.hp/50))))}</div></div>
            </div>
            <!-- Buttons -->
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
              <button onclick="G.modal=null;render()" style="border:2px solid rgba(59,130,246,.4);cursor:pointer;background:rgba(15,23,42,.85);color:#60A5FA;font-family:'Roboto',sans-serif;font-size:.88rem;font-weight:700;padding:12px;border-radius:8px;letter-spacing:.04em;">✕ CERRAR</button>
              <button onclick="${canAdd||iS?'modalAct('+pk.id+')':''}" style="border:none;cursor:${canAdd||iS?'pointer':'not-allowed'};background:${iS?'linear-gradient(135deg,#EF4444,#991B1B)':canAdd?'linear-gradient(135deg,#3B82F6,#1D4ED8)':'rgba(0,0,0,.15)'};color:${canAdd||iS?'#fff':'rgba(0,0,0,.3)'};font-family:'Roboto',sans-serif;font-size:.88rem;font-weight:700;padding:12px;border-radius:8px;letter-spacing:.04em;box-shadow:${canAdd?'0 4px 14px rgba(59,130,246,.4)':'none'};">
                ${iS?"✕ QUITAR":canAdd?"＋ AÑADIR":"EQUIPO LLENO"}
              </button>
            </div>
          </div>
          <!-- Footer -->
          <div style="background:#0d0d1e;padding:5px 14px;border-radius:0 0 16px 16px;text-align:center;border-top:1px solid rgba(255,255,255,.06);">
            <span style="font-family:'Roboto',sans-serif;font-size:.5rem;color:rgba(255,255,255,.25);">Illus. PokéBattle Studio · ${String(pk.id).padStart(3,'0')}/151 ©PokéBattle</span>
          </div>
        </div>
      </div>`;
    }
  }
  const n=G.sel.length,ready=n===3;
  return`<div style="background:radial-gradient(ellipse at 50% 0%,${isP2?'#1a0a3e':'#0F172A'} 0%,#1E3A5F 80%);display:flex;flex-direction:column;position:absolute;inset:0;overflow:hidden;">
    <!-- Header -->
    <div style="padding:10px 12px 8px;flex-shrink:0;background:rgba(15,23,42,.85);border-bottom:1px solid rgba(59,130,246,.15);">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:min(1.2rem,5vw);color:${acc};letter-spacing:.08em;white-space:nowrap;">${A[pl.avatar]} ${pl.name.toUpperCase()}</div>
        <div style="display:flex;gap:5px;flex-shrink:0;">${slots}</div>
      </div>
      <!-- Search -->
      <input placeholder="🔍 Buscar Pokémon..." value="${G.fSearch||""}" oninput="G.fSearch=this.value;render()" style="width:100%;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:7px 12px;font-size:.85rem;color:#fff;outline:none;margin-bottom:7px;font-family:inherit;">
      <!-- Type filters scrollable -->
        <div style="display:flex;gap:4px;overflow-x:auto;scrollbar-width:none;padding-bottom:3px;margin-bottom:4px;">${mkGenBtns()}</div>
      <div style="display:flex;gap:5px;overflow-x:auto;padding-bottom:2px;scrollbar-width:none;">${filterBtns}</div>
      ${(()=>{const fv=getFavs();return fv&&G.sel.length<3?`<button onclick="sfxSel();const fv=getFavs();if(fv){G.sel=fv.map(id=>PKS.find(p=>p.id===id)).filter(Boolean).map(pk=>({...pk,currentHp:pk.hp,ppLeft:pk.moves.map(m=>m.pp)}));render();}" style="margin-top:5px;width:100%;border:none;cursor:pointer;background:rgba(245,158,11,.12);border:1px solid rgba(245,158,11,.3);color:#F59E0B;font-family:'Roboto',sans-serif;font-size:.75rem;font-weight:700;padding:6px;border-radius:6px;letter-spacing:.04em;">⭐ CARGAR EQUIPO FAVORITO</button>`:'';})()}
    </div>
    <!-- Grid -->
    <div style="flex:1;overflow-y:auto;padding:8px 8px 2px;">
      ${filtered.length?`<div style="display:grid;grid-template-columns:repeat(${window.innerWidth<500?2:3},1fr);gap:8px;">${grid}</div>`:`<div style="text-align:center;padding:40px 20px;font-family:'Roboto',sans-serif;font-weight:700;font-size:1rem;color:rgba(96,165,250,.5);">SIN RESULTADOS</div>`}
    </div>
    <!-- Bottom bar -->
    <div style="display:grid;grid-template-columns:auto 1fr;gap:0;background:#0a0a0a;border-top:2px solid #222;flex-shrink:0;">
      <button onclick="sfxMenu();go('create')" style="background:#111;border:none;border-right:1px solid #333;font-family:'Roboto',sans-serif;font-size:min(.9rem,3.8vw);font-weight:700;color:#60A5FA;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);padding:8px 16px;border-radius:6px;cursor:pointer;">← ATRÁS</button>
      <button onclick="if(${ready}){sfxMenu();cSel();}" style="background:${ready?"linear-gradient(180deg,#15803D,#0f5f2e)":"#0a0a0a"};border:none;color:${ready?"#fff":"rgba(255,255,255,.2)"};font-family:'Roboto',sans-serif;font-size:min(1rem,4vw);font-weight:700;letter-spacing:.06em;padding:16px;cursor:${ready?"pointer":"not-allowed"};">
        ${ready?"⚔  ¡A COMBATIR!":"SELECCIONA "+(3-n)+" MÁS..."}
      </button>
    </div>
    ${modal}
  </div>`;
},

pass(){
  const p=G.pp;
  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F172A,#1E3A5F 80%);padding:0 28px;text-align:center;">
    <div id="pi">
      <div style="font-size:80px;margin-bottom:20px;animation:floatup 1.5s ease-in-out infinite;">📱</div>
      <h2 style="color:#fff;font-weight:900;font-size:1.8rem;margin:0 0 10px;">¡Pasa el dispositivo!</h2>
      <p style="color:#93C5FD;font-weight:700;font-size:1.05rem;margin:0 0 6px;">Turno de: ${A[p.avatar]} ${p.name}</p>
      <p style="color:#475569;font-size:.9rem;margin-bottom:32px;">No mires hasta que sea tu turno</p>
      <button class="btn" style="background:linear-gradient(135deg,#F59E0B,#D97706);max-width:300px;font-size:1.1rem;" onclick="sfxMenu();pRdy()">✋ ¡Listo, soy ${p.name}!</button>
    </div>
  </div>`;
},
fswitch(){
  const b=G.bat,who=G.fsfor,tm=who==="p1"?b.t1:b.t2,pl=who==="p1"?G.p1:G.p2,ai=who==="p1"?b.a1:b.a2;
  const pks=tm.map((pk,i)=>{const d=pk.currentHp<=0||i===ai;return`<button ${d?"disabled":""} onclick="sfxSel();fsTo(${i})" style="background:${d?"rgba(255,255,255,.06)":"#fff"};border-radius:18px;padding:14px 10px;border:none;cursor:${d?"not-allowed":"pointer"};opacity:${d?.25:1};min-width:100px;text-align:center;transition:transform .1s;" onpointerdown="if(!this.disabled)this.style.transform='scale(.92)'" onpointerup="this.style.transform='scale(1)'">
    <img src="${su(pk.id)}" width="72" height="72" style="margin:0 auto;object-fit:contain;${pk.currentHp<=0?"filter:grayscale(1) opacity(.25);":""}">
    <div style="font-weight:800;font-size:.82rem;color:${d?"rgba(255,255,255,.3)":"#1E293B"};margin-top:4px;">${pk.name}</div>
    <div style="font-size:.72rem;color:${d?"rgba(255,255,255,.2)":"#64748B"};">${pk.currentHp}/${pk.hp}</div>
  </button>`;}).join("");
  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(160deg,#0F172A,#1E3A5F 80%);padding:0 20px;text-align:center;">
    <div style="font-size:56px;margin-bottom:10px;filter:drop-shadow(0 0 16px #3B82F6);">😔</div>
    <h2 style="color:#fff;font-weight:900;font-size:1.4rem;margin:0 0 6px;">${A[pl.avatar]} ${pl.name}</h2>
    <p style="color:#FCD34D;font-weight:700;margin-bottom:28px;font-size:.95rem;">¡Tu Pokémon se ha debilitado!<br>Elige el siguiente</p>
    <div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center;">${pks}</div>
  </div>`;
},
battle(){
  const b=G.bat,sc=G.scenario;
  const pk1=b.t1[b.a1],pk2=b.t2[b.a2];
  const ap=b.ct==="p1"?G.p1:G.p2,apk=b.ct==="p1"?pk1:pk2;
  const at=b.ct==="p1"?b.t1:b.t2,ai=b.ct==="p1"?b.a1:b.a2;
  const cd=b.ct==="p1"?(b.cd1||[0,0,0,0]):(b.cd2||[0,0,0,0]);
  const p1faint=pk1.currentHp<=0,p2faint=pk2.currentHp<=0;

  // ── SF-STYLE TOP BAR ──────────────────────────────────────
  // ── POKÉMON-STYLE HUD — stacked bars ─────────────────────
  const hp1pct=Math.max(0,pk1.currentHp/pk1.hp*100);
  const hp2pct=Math.max(0,pk2.currentHp/pk2.hp*100);
  const hpBarCol=(pct)=>pct>50?"#22C55E":pct>20?"#FACC15":"#EF4444";
  const hudRow=(barId,pct,pk,trName,isP2)=>{
    const col=hpBarCol(pct);
    const teamDots=(isP2?b.t2:b.t1).map((p,i)=>`<div style="width:8px;height:8px;border-radius:50%;background:${p.currentHp>0?(p.status&&STATUS[p.status]?STATUS[p.status].color:"#22C55E"):"#1a1a1a"};outline:${i===(isP2?b.a2:b.a1)?"2px solid "+(isP2?"#93C5FD":"#FCD34D"):"1px solid #333"};outline-offset:1px;"></div>`).join("");
    return`<div style="display:flex;align-items:center;gap:7px;padding:5px 8px;">
      <div style="width:40px;height:40px;flex-shrink:0;border:2px solid ${isP2?"#3B6CB7":"#7a5a10"};border-radius:3px;overflow:hidden;background:#050505;">
        <img src="${su(pk.id)}" style="width:120%;height:120%;object-fit:cover;object-position:center 10%;transform:${isP2?"none":"scaleX(-1)"};filter:saturate(1.2) contrast(1.05);">
      </div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
          <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:min(1rem,4.2vw);color:${isP2?"#93C5FD":"#FCD34D"};letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:38%;">${trName.toUpperCase()}</span>
          <span style="font-family:'Roboto',sans-serif;font-size:min(.72rem,3vw);color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.03em;">${pk.shiny?"✨":""}${pk.name}</span>
          <span style="font-family:'Press Start 2P',monospace;font-size:min(.52rem,2.1vw);color:${col};text-shadow:0 0 6px ${col}44;">${pk.currentHp}/${pk.hp}</span>
        </div>
        <div style="position:relative;height:11px;background:rgba(0,0,0,.7);border:1px solid rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
          <div id="${barId}" style="position:absolute;${isP2?"right":"left"}:0;top:0;bottom:0;width:${pct.toFixed(1)}%;background:${col};transition:width .5s ease,background .4s ease;">
            <div style="position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(180deg,rgba(255,255,255,.3),transparent);"></div>
          </div>
        </div>
        <div style="display:flex;gap:3px;margin-top:3px;${isP2?"justify-content:flex-end":""}">
          ${teamDots}${statusBadge(pk.status)}
        </div>
      </div>
    </div>`;
  };
  const sfTop=`<div id="sfbar" style="flex-shrink:0;background:#070710;border-bottom:1px solid rgba(255,255,255,.06);max-height:22vh;overflow:hidden;">
    ${hudRow("hpbar1",hp1pct,pk1,G.p1.name,false)}
    <div style="height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);margin:0 8px;"></div>
    ${hudRow("hpbar2",hp2pct,pk2,G.p2.isCPU?"CPU":G.p2.name,true)}
  </div>`;

  // ── ARENA (Canvas-powered) ───────────────────────────────
  const scLabel=_scLabels[sc.name]||sc.name;
  // Init canvas scene after DOM renders
  if(typeof initCanvasScene==='function'){
    setTimeout(()=>initCanvasScene(sc.name),30);
  }
  const arena=`<div id="arena" style="position:relative;overflow:hidden;flex:1;min-height:150px;max-height:46vh;">
    <canvas id="scene-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;min-height:0;"></canvas>
    <!-- ground shadow overlay for depth -->
    <div style="position:absolute;bottom:0;left:0;right:0;height:${sc.groundH+5}%;background:linear-gradient(0deg,rgba(0,0,0,.35) 0%,transparent 100%);pointer-events:none;z-index:1;"></div>
    <div style="position:absolute;top:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.6);color:rgba(255,255,255,.7);font-family:'Roboto',sans-serif;font-size:.62rem;font-weight:700;padding:3px 12px;border-radius:4px;z-index:5;letter-spacing:.08em;text-transform:uppercase;">${scLabel}</div>
    <!-- shadows -->
    <div id="sh1" style="position:absolute;z-index:2;pointer-events:none;"></div>
    <div id="sh2" style="position:absolute;z-index:2;pointer-events:none;"></div>
    <!-- P1 sprite — left side, mirrored to face right -->
    <div id="sp1wrap" style="position:absolute;z-index:3;left:0;bottom:0;">
      <img id="sp1" src="${su(pk1.id)}"
        style="display:block;transform:scaleX(-1);${p1faint?"filter:grayscale(1) opacity(.25);":""}"
        onload="onSpriteLoad(this,'sp1wrap','sh1',true,${sc.groundH})">
    </div>
    <!-- P2 sprite — right side -->
    <div id="sp2wrap" style="position:absolute;z-index:3;right:0;bottom:0;">
      <img id="sp2" src="${su(pk2.id)}"
        style="display:block;${p2faint?"filter:grayscale(1) opacity(.25);":""}"
        onload="onSpriteLoad(this,'sp2wrap','sh2',false,${sc.groundH})">
    </div>
    <div id="sfx-center" style="position:absolute;z-index:15;pointer-events:none;"></div>
    <div id="amsg" style="position:absolute;z-index:20;pointer-events:none;display:none;"></div>
  </div>`;

  // ── ACTIONS ───────────────────────────────────────────────
  let ac="";
  const bottomBar=`<div style="display:grid;grid-template-columns:1fr 1fr 1fr 1fr 1fr;gap:0;background:rgba(10,18,36,.98);border-top:2px solid rgba(59,130,246,.2);flex-shrink:0;">
    <button class="btn" style="background:${!b.locked&&b.ph==='action'?'linear-gradient(180deg,#2563EB,#1D4ED8)':'rgba(15,23,42,.7)'};border-radius:0;border-right:1px solid rgba(59,130,246,.2);font-family:'Roboto',sans-serif;font-size:.88rem;font-weight:700;padding:14px 4px;" onclick="${b.locked?'':'sfxMenu();bPh(\'attack\')'}" ${b.locked?'disabled':''}>⚔ ATACAR</button>
    <button class="btn" style="background:${!b.locked&&b.ph==='switch'?'linear-gradient(180deg,#1565C0,#0D47A1)':'rgba(15,23,42,.7)'};border-radius:0;border-right:1px solid rgba(59,130,246,.2);font-family:'Roboto',sans-serif;font-size:.88rem;font-weight:700;padding:14px 4px;" onclick="${b.locked?'':'sfxMenu();bPh(\'switch\')'}" ${b.locked?'disabled':''}>↕ CAMBIAR</button>
    <button class="btn" onclick="${b.locked||!b.potions1?'':'usePotion()'}" style="background:${b.potions1&&!b.locked?'linear-gradient(180deg,#065f46,#047857)':'rgba(15,23,42,.7)'};border-radius:0;border-right:1px solid rgba(59,130,246,.15);font-size:.78rem;font-weight:700;padding:14px 4px;color:${b.potions1&&!b.locked?'#4ade80':'rgba(255,255,255,.2)'};">💊${b.potions1?'':'✗'}</button>
    <button class="btn" onclick="dSave()" style="background:rgba(15,23,42,.7);border-radius:0;border-right:1px solid rgba(59,130,246,.15);font-size:.75rem;padding:14px 4px;color:rgba(255,255,255,.35);">💾</button>
    <button id="exit-confirm" data-step="0" class="btn" onclick="exitBattle()" style="background:rgba(15,23,42,.7);border-radius:0;font-size:.75rem;padding:14px 4px;color:rgba(255,255,255,.35);">🚪</button>
  </div>`;
  const turnBanner=G.mode==="cpu"?`<div style="text-align:center;padding:5px;background:linear-gradient(90deg,transparent,rgba(59,130,246,.1),transparent);border-bottom:1px solid rgba(59,130,246,.15);"><span style="font-family:'Roboto',sans-serif;font-size:.7rem;font-weight:700;color:#60A5FA;letter-spacing:.1em;">⚔ TU TURNO — ${G.p1.name.toUpperCase()}</span></div>`:"";
  if(!b.locked){
    if(b.ph==="action"){
      const turnBanner=G.mode==="cpu"&&!b.locked?`<div style="text-align:center;padding:5px;background:linear-gradient(90deg,transparent,rgba(59,130,246,.1),transparent);border-bottom:1px solid rgba(59,130,246,.15);"><span style="font-family:'Roboto',sans-serif;font-size:.7rem;font-weight:700;color:#60A5FA;letter-spacing:.1em;">⚔ TU TURNO — ${G.p1.name.toUpperCase()}</span></div>`:"";
      ac="";
      const defPk=b.ct==="p1"?pk2:pk1;
      const effLabels={2:"▲ SÚPER EFECTIVO",0.5:"▼ POCO EFECTIVO",0:"✗ SIN EFECTO"};
      const effColors={2:"#FCD34D",0.5:"#93C5FD",0:"#6B7280"};
      const effBgs={2:"rgba(252,211,77,.15)",0.5:"rgba(147,197,253,.12)",0:"rgba(107,114,128,.12)"};
      const moveDescs={
        "Descanso":"Recupera todo el HP y cura estados",
        "Afilar":"Sube el ataque del usuario",
        "Refugio":"Sube la defensa del usuario",
        "Amnesia":"Sube mucho el ataque especial",
        "Barrera":"Sube mucho la defensa",
        "Canto":"Hace dormir al rival",
      };
      const ms=(apk.moves||[]).map((m,i)=>{
        if(!m||!m.n)return"";
        const isCd=(cd[i]||0)>0;
        const ppLeft=(apk.ppLeft||[])[i]??m.pp;
        const ppPct=Math.max(0,ppLeft/m.pp);
        const ppCol=ppPct>.5?"#22C55E":ppPct>.25?"#F59E0B":"#EF4444";
        const tc=TC[m.t]||TC.normal;
        const isStatus=m.p===0;
        const eff=isStatus?1:te(m.t,(defPk||{types:[]}).types||[]);
        // Effectiveness badge
        const effKey=eff>=2?2:eff===0?0:eff<=.5?0.5:1;
        const effBadge=effKey!==1?`<div style="display:inline-flex;align-items:center;gap:3px;background:${effBgs[effKey]};border:1px solid ${effColors[effKey]}44;border-radius:4px;padding:2px 6px;margin-top:4px;"><span style="font-size:.6rem;font-weight:800;color:${effColors[effKey]};letter-spacing:.04em;">${effLabels[effKey]}</span></div>`:"";
        // Power bar (only for attacking moves)
        const pwrBar=!isStatus?`<div style="margin-top:5px;"><div style="height:3px;background:rgba(255,255,255,.15);border-radius:2px;overflow:hidden;"><div style="width:${Math.min(100,m.p/150*100)}%;height:100%;background:rgba(255,255,255,.7);border-radius:2px;"></div></div></div>`:"";
        // PP dots
        const ppMax=Math.min(m.pp,5);
        const ppFilled=Math.ceil(ppLeft/m.pp*ppMax);
        const ppDots=Array.from({length:ppMax},(_,di)=>{
          return '<div style="width:7px;height:7px;border-radius:50%;background:'+(di<ppFilled?ppCol:'rgba(255,255,255,.15)')+'"></div>';
        }).join("");
        // Status description
        const statusDesc=moveDescs[m.n]?`<div style="font-size:.6rem;color:rgba(255,255,255,.6);margin-top:3px;font-style:italic;">${moveDescs[m.n]}</div>`:"";
        // Glow border for super effective
        const border=eff>=2?"box-shadow:0 0 0 2px #FCD34D,0 0 16px rgba(252,211,77,.3);":isCd?"":"";
        return`<button onclick="${isCd?"":"sfxAtk();doAtk("+i+")"}"
          style="border:none;cursor:${isCd?"not-allowed":"pointer"};border-radius:10px;overflow:hidden;text-align:left;padding:0;${isCd?"opacity:.4;filter:saturate(.2);":""}${border};transition:transform .1s,box-shadow .1s;"
          ${isCd?"disabled":""}
          onpointerdown="if(!this.disabled){this.style.transform='scale(.94)';this.style.filter='brightness(.85)';}"
          onpointerup="this.style.transform='scale(1)';this.style.filter='';">
          <!-- Top: type color band -->
          <div style="background:linear-gradient(135deg,${tc.bg},${tc.grd});padding:8px 12px 6px;">
            <div style="display:flex;align-items:center;justify-content:space-between;">
              <div style="display:flex;align-items:center;gap:6px;">
                ${bdg(m.t)}
                <span style="font-family:'Rajdhani',sans-serif;font-size:min(1rem,3.5vw);font-weight:700;color:#fff;letter-spacing:.04em;">${m.n.toUpperCase()}</span>
              </div>
              ${!isStatus?`<div style="display:flex;align-items:baseline;gap:2px;"><span style="font-family:'Press Start 2P',monospace;font-size:.75rem;color:#fff;line-height:1;">${m.p}</span><span style="font-size:.55rem;color:rgba(255,255,255,.6);font-family:'Roboto',sans-serif;">POD</span></div>`:`<span style="font-size:.7rem;background:rgba(255,255,255,.2);color:#fff;padding:2px 6px;border-radius:4px;font-family:'Roboto',sans-serif;font-weight:700;">ESTADO</span>`}
            </div>
            ${pwrBar}
          </div>
          <!-- Bottom: details -->
          <div style="background:rgba(5,10,25,.88);padding:6px 12px 8px;">
            ${effBadge}
            ${statusDesc}
            <div style="display:flex;align-items:center;justify-content:space-between;margin-top:5px;">
              <div style="display:flex;gap:2px;align-items:center;">
                ${ppDots}
                <span style="font-family:'Roboto',sans-serif;font-size:.6rem;color:${ppCol};font-weight:700;margin-left:4px;">PP ${ppLeft}/${m.pp}</span>
              </div>
              ${isCd?`<span style="font-size:.6rem;color:#F59E0B;font-weight:700;">⏳ ${cd[i]} turnos</span>`:""}
            </div>
          </div>
        </button>`;
      }).filter(Boolean).join("");

      // Header showing who's attacking vs who's defending
      const atkHeader=`<div style="display:flex;align-items:center;justify-content:space-between;padding:5px 10px 3px;background:rgba(5,10,25,.8);border-bottom:1px solid rgba(59,130,246,.15);">
        <div style="display:flex;align-items:center;gap:5px;">
          <img src="${su(apk.id)}" width="24" height="24" style="object-fit:contain;filter:drop-shadow(0 0 5px ${(TC[apk.types[0]]||TC.normal).bg});">
          <span style="font-family:'Rajdhani',sans-serif;font-size:min(.9rem,3.5vw);font-weight:700;color:#fff;">${apk.name.toUpperCase()}</span>
          <span style="font-size:.6rem;color:rgba(255,255,255,.3);font-family:'Roboto',sans-serif;">— elige ataque</span>
        </div>
        <div style="display:flex;align-items:center;gap:4px;opacity:.55;">
          <span style="font-size:.55rem;color:rgba(255,255,255,.4);">VS</span>
          <img src="${su(defPk.id)}" width="20" height="20" style="object-fit:contain;filter:grayscale(.4);">
          <span style="font-family:'Roboto',sans-serif;font-size:min(.6rem,2.5vw);color:rgba(255,255,255,.4);">${defPk.name}</span>
        </div>
      </div>`;

      ac=`<div style="background:rgba(5,10,25,.96);border-top:1px solid rgba(59,130,246,.2);overflow-y:auto;flex:1;min-height:0;">
        ${atkHeader}
        <div style="padding:6px 8px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">${ms}</div>
        </div>
      </div>`;
    } else if(b.ph==="switch"){
      const pks=at.map((pk,i)=>{
        const d=pk.currentHp<=0||i===ai;
        return`<button ${d?"disabled":""} onclick="sfxSel();doSw(${i})" style="flex:1;background:${d?"#111":"#1a1a1a"};border:1px solid ${d?"#222":"#444"};border-radius:8px;padding:10px 6px;cursor:${d?"not-allowed":"pointer"};opacity:${d?.25:1};text-align:center;" onpointerdown="if(!this.disabled)this.style.transform='scale(.92)'" onpointerup="this.style.transform='scale(1)'">
          <img src="${su(pk.id)}" width="50" height="50" style="margin:0 auto;object-fit:contain;display:block;${pk.currentHp<=0?"filter:grayscale(1) opacity(.2);":""}">
          <div style="font-weight:800;font-size:.68rem;color:${d?"#444":"#ccc"};margin-top:2px;">${pk.name}</div>
          <div style="font-size:.6rem;color:${d?"#333":"#666"};">${pk.currentHp}/${pk.hp}</div>
        </button>`;
      }).join("");
      ac=`<div style="background:#0a0a0a;border-top:2px solid #222;padding:8px 10px;overflow-y:auto;flex:1;min-height:0;">
        <div style="font-family:'Roboto',sans-serif;font-size:.7rem;color:rgba(255,255,255,.4);margin-bottom:6px;letter-spacing:.06em;">↕ ELIGE POKÉMON</div>
        <div style="display:flex;gap:6px;">${pks}</div>
      </div>`;
    }
  } else {
    ac=`<div style="padding:14px;background:#0a0a0a;border-top:2px solid #222;text-align:center;flex:1;"><span style="font-family:'Roboto',sans-serif;color:rgba(96,165,250,.4);font-size:.9rem;font-weight:700;letter-spacing:.1em;">COMBATIENDO...</span></div>`;
  }

  const blogPanel=`<div id="blog" style="background:rgba(5,10,25,.92);border-top:1px solid rgba(59,130,246,.15);padding:4px 8px;display:flex;flex-direction:column;gap:2px;min-height:28px;max-height:90px;overflow:hidden;flex-shrink:0;"></div>`;
  const tb=G.mode==="pvp"&&!b.locked?`<div style="text-align:center;padding:4px;background:#0a0a0a;"><span style="background:#F59E0B;color:#000;font-family:'Roboto',sans-serif;font-size:.85rem;font-weight:700;padding:3px 16px;border-radius:3px;letter-spacing:.06em;">TURNO: ${G[b.ct==="p1"?"p1":"p2"].name.toUpperCase()}</span></div>`:"";

  // Show enter quotes ONCE per battle (not on every render)
  setTimeout(()=>{
    startMusic();
    if(G.tutorial&&!G._tutLaunched){G._tutLaunched=true;setTimeout(startTutorial,1500);}
  if(!G._enterShown){
      G._enterShown=true;
      if(Math.random()<0.5){
        const eq1=qGet(pk1.id,"enter");
        const eq2=qGet(pk2.id,"enter");
        if(eq1){setTimeout(()=>amsgPoke(true,`<span style="color:#FCD34D;font-weight:900;font-size:1rem;font-style:italic;">"${eq1}"</span>`,2200),600);}
        if(eq2){setTimeout(()=>amsgPoke(false,`<span style="color:#93C5FD;font-weight:900;font-size:1rem;font-style:italic;">"${eq2}"</span>`,2200),eq1?3000:600);}
      }
    }
  },100);
  const contentZone=ac||`<div id="blog" style="background:rgba(5,10,25,.92);border-top:1px solid rgba(59,130,246,.15);padding:4px 8px;flex:1;min-height:60px;overflow-y:auto;"></div>`;
  return`<div style="background:#000;display:flex;flex-direction:column;position:absolute;inset:0;overflow:hidden;">${sfTop}${arena}${tb}${turnBanner||""}${contentZone}${bottomBar}</div>`;
},

victory(){
  const{winner,loser,stats,isP1Win}=G.vd;
  const isWin=isP1Win!==false;
  const rec=getRec();

  // MVP: pokemon that dealt most (approx by type usage)
  const topType=stats.dmgTypes?Object.entries(stats.dmgTypes).sort((a,b)=>b[1]-a[1])[0]:null;
  const mvpPk=G.p1&&G.p1.team?G.p1.team.reduce((b,p)=>p.currentHp>b.currentHp?p:b,G.p1.team[0]):null;

  // Confetti (win) or rain (lose)
  let fx="";
  if(isWin){
    for(let i=0;i<60;i++){
      const x=Math.random()*100,dl=Math.random()*2.5;
      const col=["#F59E0B","#22C55E","#3B82F6","#A855F7","#fff"][i%5];
      const s=6+Math.random()*10;
      fx+=`<div style="position:absolute;left:${x}%;top:-10px;width:${s}px;height:${s*.5}px;background:${col};border-radius:2px;animation:conffall ${2+dl}s linear ${dl}s infinite;"></div>`;
    }
  } else {
    for(let i=0;i<40;i++){
      const x=Math.random()*100,dl=Math.random()*3;
      fx+=`<div style="position:absolute;left:${x}%;top:-10px;width:2px;height:${12+Math.random()*16}px;background:rgba(150,180,255,.35);border-radius:1px;animation:conffall ${1.5+Math.random()*2}s linear ${dl}s infinite;"></div>`;
    }
  }

  const bg=isWin
    ?'radial-gradient(ellipse at center,#0a2010 0%,#0F172A 60%,#1E3A5F 100%)'
    :'radial-gradient(ellipse at center,#0a0a1a 0%,#050510 60%,#0a0a20 100%)';

  const statsCards=`
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:16px;">
      <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px 6px;text-align:center;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.6rem;color:#F59E0B;">${stats.moves}</div>
        <div style="font-family:'Roboto',sans-serif;font-size:.6rem;color:#888;font-weight:700;letter-spacing:.04em;">TURNOS</div>
      </div>
      <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px 6px;text-align:center;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.6rem;color:#EF4444;">${stats.defeated||0}</div>
        <div style="font-family:'Roboto',sans-serif;font-size:.6rem;color:#888;font-weight:700;letter-spacing:.04em;">DERROTADOS</div>
      </div>
      <div style="background:rgba(59,130,246,.1);border:1px solid rgba(59,130,246,.2);border-radius:8px;padding:10px 6px;text-align:center;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.6rem;color:#22C55E;">${stats.dmgDone||0}</div>
        <div style="font-family:'Roboto',sans-serif;font-size:.6rem;color:#888;font-weight:700;letter-spacing:.04em;">DAÑO TOTAL</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
      ${topType?`<div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:8px;padding:8px 10px;text-align:center;"><div style="font-size:.75rem;color:#60A5FA;font-weight:700;margin-bottom:2px;">TIPO FAVORITO</div><div>${bdg(topType[0])}</div></div>`:''}
      ${mvpPk?`<div style="background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.15);border-radius:8px;padding:8px 10px;text-align:center;"><div style="font-size:.75rem;color:#60A5FA;font-weight:700;margin-bottom:2px;">SOBREVIVIENTE</div><div style="font-family:'Roboto',sans-serif;font-size:.8rem;font-weight:700;color:#fff;">${mvpPk.name}</div></div>`:''}
    </div>
    <div style="text-align:center;margin-bottom:14px;font-family:'Roboto',sans-serif;font-size:.72rem;color:rgba(255,255,255,.35);">
      🏆 ${rec.wins}V · 💀 ${rec.losses}D · ⚡ Racha: ${rec.streak} · 🔥 Mejor: ${rec.bestStreak}
    </div>`;

  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:${bg};overflow:hidden;">
    ${fx}
    <div style="position:relative;z-index:1;text-align:center;padding:16px;width:min(340px,95vw);overflow-y:auto;max-height:100%;">
      <div style="font-family:'Press Start 2P',monospace;font-size:min(2rem,7vw);color:${isWin?'#F59E0B':'#6B7280'};text-shadow:0 0 40px ${isWin?'rgba(245,158,11,.8)':'rgba(100,100,150,.5)'},0 4px 0 ${isWin?'#7c3e00':'#333'};letter-spacing:.08em;line-height:1.2;animation:vsSlam .6s cubic-bezier(.175,.885,.32,1.275) both;">${isWin?'K.O.!':'DERROTA'}</div>
      <div style="font-family:'Rajdhani',sans-serif;font-size:min(1.6rem,5.5vw);color:${isWin?'#fff':'#94A3B8'};font-weight:700;letter-spacing:.1em;margin:8px 0 16px;">${A[winner.avatar]} ${winner.name.toUpperCase()} ${isWin?'WINS!':'GANA'}</div>
      ${statsCards}
      <div style="display:flex;flex-direction:column;gap:8px;width:100%;">
        <button class="btn" style="background:linear-gradient(135deg,#3B82F6,#1D4ED8);font-family:'Roboto',sans-serif;font-weight:700;font-size:.95rem;letter-spacing:.04em;border-radius:6px;" onclick="sfxMenu();doRm()">⟳ REVANCHA</button>
        <button class="btn" style="background:linear-gradient(135deg,#F59E0B,#7c3e00);font-family:'Roboto',sans-serif;font-weight:700;font-size:.95rem;letter-spacing:.04em;border-radius:6px;" onclick="sfxMenu();go('mode')">◉ NUEVA PARTIDA</button>
        <button class="btn" style="background:rgba(15,23,42,.9);border:1px solid rgba(59,130,246,.2);font-family:'Roboto',sans-serif;font-weight:700;font-size:.9rem;letter-spacing:.04em;border-radius:6px;color:rgba(255,255,255,.4);" onclick="sfxMenu();go('title')">← INICIO</button>
      </div>
    </div>
  </div>`;
},

saves(){
  const svs=gs(),m=G.smode;
  const list=svs.length===0?`<div style="text-align:center;color:rgba(255,255,255,.4);margin-top:60px;"><div style="font-size:60px;margin-bottom:12px;">📭</div><div style="font-weight:700;">No hay partidas guardadas</div></div>`
    :svs.map(s=>`<div style="background:rgba(255,255,255,.95);border-radius:18px;padding:14px 16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div><div style="font-weight:800;color:#1E293B;">${s.p1n} vs ${s.p2n}</div><div style="font-size:.75rem;color:#94A3B8;">${new Date(s.ts).toLocaleString("es-ES")}</div></div>
        <div style="display:flex;gap:3px;">${(s.ids||[]).slice(0,6).map(id=>`<img src="${su(id)}" width="28" height="28" style="object-fit:contain;">`).join("")}</div>
      </div>
      ${m==="load"?`<button class="btn" onclick="sfxMenu();lSave(${s.id})" style="background:linear-gradient(135deg,#22C55E,#15803D);padding:10px;font-size:.9rem;">▶ Cargar</button>`:`<button class="btn" onclick="dSaveItem(${s.id},this)" style="background:linear-gradient(135deg,#EF4444,#B91C1C);padding:10px;font-size:.9rem;" data-c="0">🗑️ Borrar</button>`}
    </div>`).join("");
  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;background:linear-gradient(160deg,#0F172A,#1E3A5F 80%);">
    <div style="display:flex;align-items:center;gap:12px;padding:20px 18px 14px;flex-shrink:0;background:rgba(15,23,42,.7);">
      <button onclick="sfxMenu();go('title')" style="background:rgba(59,130,246,.15);border:1px solid rgba(59,130,246,.3);color:#60A5FA;font-family:'Roboto',sans-serif;font-size:.85rem;cursor:pointer;font-weight:700;padding:8px 14px;border-radius:6px;letter-spacing:.04em;">← ATRÁS</button>
      <h2 style="color:#fff;font-weight:900;font-size:1.3rem;margin:0;">${m==="load"?"💾 Cargar":"🗑️ Borrar"} Partidas</h2>
    </div>
    <div style="flex:1;overflow-y:auto;padding:12px 14px 16px;">${list}</div>
  </div>`;
},
scenepick(){
  const SC_INFO=[
    {idx:0,name:"Campo",tagline:"HIERBA Y NATURALEZA",desc:"Batalla bajo el sol entre árboles",emoji:"🌿",accent:"#22C55E",glow:"rgba(34,197,94,.6)",bg:"linear-gradient(135deg,#052e16,#14532d,#166534)",sky:"linear-gradient(180deg,#4AA8D8,#87CEEB,#B0E0FF,#8DB96A)",icon:"🌳"},
    {idx:1,name:"Galaxia",tagline:"ESPACIO PROFUNDO",desc:"Las estrellas serán testigos",emoji:"🌌",accent:"#A855F7",glow:"rgba(168,85,247,.6)",bg:"linear-gradient(135deg,#0d0020,#1E0A3C,#4C1D95)",sky:"linear-gradient(180deg,#020618,#0B1A3E,#1a0a3e)",icon:"⭐"},
    {idx:2,name:"Estadio",tagline:"ARENA OFICIAL",desc:"Focos encendidos, gradas rugiendo",emoji:"⚡",accent:"#3B82F6",glow:"rgba(59,130,246,.6)",bg:"linear-gradient(135deg,#0c1a2e,#1E3A5F,#1D4ED8)",sky:"linear-gradient(180deg,#1a1a2e,#16213e,#0f3460)",icon:"🏟️"},
    {idx:3,name:"Fútbol",tagline:"ESTADIO LLENO",desc:"Fans enloquecidos, césped mojado",emoji:"⚽",accent:"#F59E0B",glow:"rgba(245,158,11,.6)",bg:"linear-gradient(135deg,#052e16,#14532D,#166534)",sky:"linear-gradient(180deg,#1a3a6e,#2e6db4,#5ba3e0,#87CEEB)",icon:"🏆",weather:null},
    {idx:4,name:"Cueva",tagline:"LAS PROFUNDIDADES",desc:"Piedra, lava y cristales brillantes",emoji:"🦇",accent:"#F59E0B",glow:"rgba(245,158,11,.5)",bg:"linear-gradient(135deg,#1a0f00,#2d1f05,#3d2a08)",sky:"linear-gradient(180deg,#0a0a0a,#1a1008,#2d1f05)",icon:"🔥"},
    {idx:5,name:"Playa",tagline:"ATARDECER TROPICAL",desc:"Olas, palmeras y sol poniente",emoji:"🌊",accent:"#60A5FA",glow:"rgba(96,165,250,.6)",bg:"linear-gradient(135deg,#0a2a4a,#1a4a7a,#2a6aaa)",sky:"linear-gradient(180deg,#FF6B35,#FFB347,#87CEEB,#4AA8D8)",icon:"🌅"},
    {idx:6,name:"Noche",tagline:"BAJO LA LUNA LLENA",desc:"Estrellas, luna y luciérnagas",emoji:"🌙",accent:"#818CF8",glow:"rgba(129,140,248,.6)",bg:"linear-gradient(135deg,#05051a,#0a0a2e,#10104a)",sky:"linear-gradient(180deg,#000510,#020c1b,#041628)",icon:"🌕"},
  ];

  // Animated particles background
  let sparks="";
  for(let i=0;i<20;i++){
    const x=Math.random()*100,y=Math.random()*100;
    const s=1+Math.random()*2,d=2+Math.random()*5,dl=Math.random()*4;
    const col=["#EF4444","#F59E0B","#A855F7","#3B82F6","#22C55E"][i%5];
    sparks+=`<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;height:${s}px;background:${col};border-radius:50%;animation:twinkle ${d}s ease-in-out ${dl}s infinite;opacity:.4;pointer-events:none;"></div>`;
  }

  const cards=SC_INFO.map(si=>`
    <button onclick="sfxSel();pickScene(${si.idx})"
      style="border:none;cursor:pointer;padding:0;background:transparent;display:block;width:100%;border-radius:16px;overflow:hidden;
             box-shadow:0 4px 24px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06);
             transition:transform .15s,box-shadow .15s;"
      onpointerdown="this.style.transform='scale(.94)';this.style.boxShadow='0 2px 10px rgba(0,0,0,.8),0 0 0 2px ${si.accent}'"
      onpointerup="this.style.transform='scale(1)';this.style.boxShadow='0 4px 24px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06)'"
      onmouseenter="this.style.boxShadow='0 8px 32px ${si.glow},0 0 0 2px ${si.accent}'"
      onmouseleave="this.style.boxShadow='0 4px 24px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.06)'">
      <!-- Preview sky -->
      <div style="height:min(100px,22vw);background:${si.sky};position:relative;overflow:hidden;">
        <!-- Decorative shine -->
        <div style="position:absolute;top:-30%;left:-10%;width:120%;height:80%;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.18) 0%,transparent 70%);pointer-events:none;"></div>
        <!-- Big emoji center -->
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:min(3.2rem,10vw);filter:drop-shadow(0 4px 12px rgba(0,0,0,.5));">${si.icon}</div>
        <!-- Bottom fade -->
        <div style="position:absolute;bottom:0;left:0;right:0;height:40%;background:linear-gradient(0deg,rgba(0,0,0,.7),transparent);"></div>
        <!-- Tag top-right -->
        <div style="position:absolute;top:8px;right:8px;background:rgba(0,0,0,.6);color:${si.accent};font-family:'Roboto',sans-serif;font-weight:700;font-size:min(.6rem,2.2vw);letter-spacing:.08em;padding:3px 8px;border-radius:4px;border:1px solid ${si.accent}44;">${si.tagline}</div>
      </div>
      <!-- Info strip -->
      <div style="background:${si.bg};padding:10px 14px 12px;text-align:left;position:relative;">
        <div style="position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,${si.accent},transparent);opacity:.7;"></div>
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:min(1.1rem,4vw);color:#fff;letter-spacing:.06em;">${si.emoji} ${si.name.toUpperCase()}</div>
        <div style="font-size:min(.7rem,2.4vw);color:rgba(255,255,255,.55);margin-top:3px;font-weight:600;">${si.desc}</div>
        <!-- Arrow -->
        <div style="position:absolute;right:12px;bottom:50%;transform:translateY(50%);color:${si.accent};font-size:1.2rem;opacity:.7;">›</div>
      </div>
    </button>`).join("");

  return`<div style="position:absolute;inset:0;display:flex;flex-direction:column;background:radial-gradient(ellipse at 50% 0%,#0F172A 0%,#1E3A5F 80%);overflow:hidden;">
    ${sparks}
    <!-- Back button -->
    <button onclick="sfxMenu();go('select')" style="position:absolute;top:14px;left:14px;z-index:10;background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);color:#60A5FA;font-family:'Roboto',sans-serif;font-size:.85rem;cursor:pointer;font-weight:700;padding:8px 16px;border-radius:6px;letter-spacing:.04em;">← ATRÁS</button>
    <!-- Header -->
    <div style="position:relative;z-index:2;padding:min(20px,4%) min(20px,4%) min(12px,3%);flex-shrink:0;text-align:center;">
      <div style="font-size:min(2.4rem,8vw);line-height:1;margin-bottom:8px;filter:drop-shadow(0 0 20px #F59E0B);">🗺️</div>
      <div style="font-family:'Rajdhani',Impact,sans-serif;font-size:min(1.8rem,6.5vw);color:#fff;font-weight:700;letter-spacing:.12em;text-shadow:0 0 30px rgba(245,158,11,.5);">ELIGE EL ESCENARIO</div>
      <div style="color:rgba(255,255,255,.4);font-size:min(.8rem,3vw);font-weight:700;letter-spacing:.08em;margin-top:4px;">¿DÓNDE COMBATIRÁN ${G.p1.name.toUpperCase()} Y ${(G.p2.isCPU?"LA CPU":G.p2.name.toUpperCase())}?</div>
      <div style="width:60px;height:2px;background:linear-gradient(90deg,#3B82F6,#60A5FA,#3B82F6);margin:10px auto 0;border-radius:2px;box-shadow:0 0 10px #3B82F6;"></div>
    </div>
    <!-- Grid -->
    <div style="position:relative;z-index:2;flex:1;overflow-y:auto;padding:0 min(16px,4%) min(14px,3%);">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:min(12px,2.5vw);margin-bottom:min(12px,2.5vw);">
        ${cards}
      </div>
      <!-- Random button -->
      <button onclick="sfxSel();pickScene(-1)"
        style="width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#92400E,#F59E0B,#D97706);color:#fff;font-family:'Roboto',sans-serif;font-weight:700;font-size:min(1rem,4vw);letter-spacing:.06em;padding:min(16px,4%) 20px;border-radius:12px;box-shadow:0 4px 24px rgba(245,158,11,.5);transition:transform .1s,filter .1s;display:flex;align-items:center;justify-content:center;gap:12px;"
        onpointerdown="this.style.transform='scale(.97)';this.style.filter='brightness(.9)'"
        onpointerup="this.style.transform='scale(1)';this.style.filter='brightness(1)'">
        <span style="font-size:min(1.4rem,5vw);">🎲</span>
        <span>¡SORPRÉNDEME! (ALEATORIO)</span>
      </button>
    </div>
  </div>`;
}
};

// ========================================
// GAME LOGIC
// ========================================
function sMode(m){G.mode=m;G.cstep=1;G.p1=null;G.p2=null;go("create");}
function sAv(i){
  const inp=document.getElementById("cname");
  if(inp)G._draftName=inp.value;
  if(G.cstep===1)G.av1=i;else G.av2=i;
  render();
  requestAnimationFrame(()=>{
    const inp2=document.getElementById("cname");
    if(inp2){
      if(G._draftName)inp2.value=G._draftName;
      // Don't steal focus
    }
  });
}
function bkCreate(){G.cstep=1;render();}
function cNext(){
  const inp=document.getElementById("cname");
  let nm=inp?inp.value.trim():"";
  if(!nm){
    // Shake the input to signal it's required
    if(inp){inp.style.border="2px solid #EF4444";inp.style.animation="shake .4s";inp.focus();setTimeout(()=>{inp.style.border="2px solid #E2E8F0";inp.style.animation="";},500);}
    return;
  }
  if(G.cstep===1){G.p1={name:nm,avatar:G.av1};if(G.mode==="pvp"){G.cstep=2;render();}else{G.p2={name:"CPU",avatar:7,isCPU:true};G.sel=[];G.sfor=1;go("select");}}
  else{G.p2={name:nm,avatar:G.av2};G.sel=[];G.sfor=1;go("select");}
}
function tPk(id){const pk=PKS.find(p=>p.id===id);G.pvpk=pk;const i=G.sel.findIndex(s=>s.id===id);if(i>=0)G.sel.splice(i,1);else if(G.sel.length<3)G.sel.push(pk);render();}
function dePk(id){sfxSel();const i=G.sel.findIndex(s=>s.id===id);if(i>=0){G.sel.splice(i,1);if(G.pvpk&&G.pvpk.id===id)G.pvpk=null;}render();}
function modalAct(id){
  const iS=!!G.sel.find(s=>s.id===id);
  if(iS){dePk(id);G.modal=null;render();return;}
  if(G.sel.length<3){sfxSel();const pk=PKS.find(p=>p.id===id);if(pk)G.sel.push(pk);G.modal=null;render();}
}
function cSel(){
  if(G.sel.length<3)return;
  const team=G.sel.map(pk=>({...pk,currentHp:pk.hp,ppLeft:pk.moves.map(m=>m.pp)}));
  if(G.sfor===1){
    G.p1.team=team;
    if(G.mode==="cpu"){
      const u=team.map(p=>p.id);
      // CPU picks a themed team based on difficulty
      const affinities={
        fire:[257,157,244,6,59,126,146,78,5,136,38,77],
        water:[260,245,382,9,130,131,121,55,73,87,62,99],
        psychic:[386,282,196,249,150,65,97,121,124,80,103,49],
        ghost:[354,200,94,93,92],
        dragon:[445,487,484,483,644,643,646,384,373,376,149],dark:[635,571,491,248,229,197,359,332,215],psychic:[488,482,481,480,386,282,196,249,150,65],
        dark:[248,229,197,359,332,215,198,262],
        steel:[376,306,227,205,212,208,379,374],
        electric:[243,310,181,135,125,26,82,125],
        ice:[378,365,362,221,238,131,87,124],
        fighting:[297,286,214,68,107,106,237,66],
        grass:[254,192,182,3,154,45,103,114],
        ghost:[354,200,94,93,92],
        dragon:[149,148,147],                    // Dragonite,Dragonair,Dratini
        fighting:[68,57,107,106,62],             // Machamp,Primeape...
        random:null
      };
      const affinityKeys=Object.keys(affinities);
      const chosenAff=G.diff==="hard"
        ? affinityKeys[Math.floor(Math.random()*(affinityKeys.length-1))] // hard: themed
        : "random";
      let cpuPool;
      if(chosenAff==="random"||!affinities[chosenAff]){
        cpuPool=PKS.filter(p=>!u.includes(p.id)).sort(()=>Math.random()-.5).slice(0,3);
      } else {
        const ids=affinities[chosenAff];
        const themed=ids.map(id=>PKS.find(p=>p.id===id)).filter(Boolean).filter(p=>!u.includes(p.id));
        cpuPool=themed.slice(0,3);
        // Fill with random if not enough
        if(cpuPool.length<3){
          const extra=PKS.filter(p=>!u.includes(p.id)&&!cpuPool.find(x=>x.id===p.id)).sort(()=>Math.random()-.5);
          cpuPool=[...cpuPool,...extra].slice(0,3);
        }
      }
      const av=cpuPool;
      G.p2.team=av.map(pk=>({...pk,currentHp:pk.hp,ppLeft:pk.moves.map(m=>m.pp)}));
      go("scenepick");
    } else {
      G.sel=[];G.sfor=2;G.pvpk=null;go("select");
    }
  } else {
    G.p2.team=team;
    go("scenepick");
  }
}

// ══════════════════════════════════════════════════════
// LIGA POKÉMON — Tournament mode
// ══════════════════════════════════════════════════════
function startTournament(){
  sfxMenu();
  G.mode="cpu";
  G.diff="normal";
  G.tournament={
    round:0,
    bracket:[
      {name:"Entrenador Pepe", avatar:1, team:null},
      {name:"Rival Azul",      avatar:8, team:null},
      {name:"La Experta Roca", avatar:9, team:null},
      {name:"El Maestro Agua", avatar:18,team:null},
      {name:"La Élite Fuego",  avatar:16,team:null},
      {name:"El Psíquico",     avatar:11,team:null},
      {name:"Campeona Azalea", avatar:7, team:null},
      {name:"",                avatar:0, team:null}, // player
    ],
    results:[],
    playerPos:7,
  };
  // Generate CPU teams for bracket
  const typeThemes=["fire","water","grass","electric","psychic","dragon","dark","fighting","ghost","rock"];
  G.tournament.bracket.forEach((trainer,i)=>{
    if(i===7)return; // player fills in later
    const theme=typeThemes[i%typeThemes.length];
    const pool=PKS.filter(p=>p.types.includes(theme)&&p.hp>40);
    const team=[];
    while(team.length<3&&pool.length){
      const pk=pool.splice(Math.floor(Math.random()*pool.length),1)[0];
      team.push({...pk,currentHp:pk.hp,ppLeft:pk.moves.map(m=>m.pp),status:null,statusTurns:0});
    }
    if(team.length<3){
      const fill=PKS.filter(p=>!team.find(t=>t.id===p.id));
      while(team.length<3)team.push({...fill[Math.floor(Math.random()*fill.length)],currentHp:0,ppLeft:[],status:null});
    }
    trainer.team=team;
  });
  go("create"); // Player creates trainer first
}

function pickScene(idx){
  if(idx===-1) G.scenario=SCENARIOS[Math.floor(Math.random()*SCENARIOS.length)];
  else G.scenario=SCENARIOS[idx];
  sBattle();
}