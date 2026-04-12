// ═══════════════════════════════════════════════════════════════
// PokéBattle — Sistema de Perfiles
// Gestiona perfiles, XP, medallas, avatares, frases del rival
// ═══════════════════════════════════════════════════════════════

// ── Trainers oficiales (PokeAPI sprites) ────────────────────────
const TRAINERS = [
  { id:"red",       name:"Red",      url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/red.png" },
  { id:"misty",     name:"Misty",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/misty.png" },
  { id:"brock",     name:"Brock",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brock.png" },
  { id:"gary",      name:"Gary",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/gary.png" },
  { id:"ash",       name:"Ash",      url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ash.png" },
  { id:"dawn",      name:"Dawn",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/dawn.png" },
  { id:"may",       name:"May",      url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/may.png" },
  { id:"lucas",     name:"Lucas",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lucas.png" },
  { id:"ethan",     name:"Gold",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/ethan.png" },
  { id:"kris",      name:"Kris",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/kris.png" },
  { id:"brendan",   name:"Brendan",  url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/brendan.png" },
  { id:"lyra",      name:"Lyra",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/lyra.png" },
  { id:"rosa",      name:"Rosa",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/rosa.png" },
  { id:"nate",      name:"Nate",     url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/nate.png" },
  { id:"serena",    name:"Serena",   url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/serena.png" },
  { id:"calem",     name:"Calem",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/calem.png" },
  { id:"hilda",     name:"Hilda",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilda.png" },
  { id:"hilbert",   name:"Hilbert",  url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/hilbert.png" },
  { id:"wally",     name:"Wally",    url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/wally.png" },
  { id:"silver",    name:"Silver",   url:"https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/trainers/silver.png" },
];

// Fallback: si la imagen falla, se muestra inicial con color
function trainerAvatarHtml(trainerId, size=60) {
  const tr = TRAINERS.find(t=>t.id===trainerId) || TRAINERS[0];
  const colors = ['#EF4444','#3B82F6','#22C55E','#F59E0B','#8B5CF6','#EC4899','#14B8A6','#F97316'];
  const colorIdx = tr.name.charCodeAt(0) % colors.length;
  return `<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;background:${colors[colorIdx]};flex-shrink:0;">
    <img src="${tr.url}" style="width:100%;height:100%;object-fit:cover;" 
      onerror="this.style.display='none';this.nextSibling.style.display='flex'">
    <div style="display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-weight:900;font-size:${Math.round(size*0.45)}px;color:#fff;">${tr.name[0]}</div>
  </div>`;
}

// ── XP & Nivel ──────────────────────────────────────────────────
const XP_PER_LEVEL = [0,100,250,450,700,1000,1350,1750,2200,2700,3250,3850,4500,5200,5950,6750,7600,8500,9450,10450,11500,12600,13750,14950,16200,17500,18850,20250,21700,23200,24750,26350,28000,29700,31450,33250,35100,37000,39000,41050,43150,45300,47500,49750,52050,54400,56800,59250,61750,64300,67000];

function xpForLevel(lvl) { return XP_PER_LEVEL[Math.min(lvl, XP_PER_LEVEL.length-1)] || lvl*1200; }
function levelFromXp(xp) {
  for (let i = XP_PER_LEVEL.length-1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) return i;
  }
  return 0;
}

// ── Títulos automáticos ──────────────────────────────────────────
function trainerTitle(profile) {
  const { wins=0, losses=0, bestStreak=0, medals=[], totalBattles=0 } = profile;
  const wr = totalBattles > 0 ? wins/totalBattles : 0;
  if (medals.length >= 30) return "🏆 Maestro Pokémon";
  if (bestStreak >= 10) return "🔥 Leyenda Viviente";
  if (wins >= 100) return "⚡ Campeón Total";
  if (bestStreak >= 5) return "💪 Imparable";
  if (wr >= 0.8 && totalBattles >= 20) return "🎯 El Estratega";
  if (losses > wins && totalBattles >= 10) return "😅 El Valiente";
  if (wins === 0 && totalBattles >= 3) return "🌱 Aprendiz";
  if (wins >= 50) return "⭐ Veterano";
  if (wins >= 20) return "🥊 Contendiente";
  if (wins >= 5) return "🏅 Prometedor";
  if (wins === 1) return "✨ Primera Victoria";
  return "🎮 Entrenador Novato";
}

// ── Definición de medallas ───────────────────────────────────────
const MEDALS_DEF = [
  // Primera victoria
  { id:"first_win",   icon:"🌟", name:"Primera Estrella",  desc:"Gana tu primera batalla",     check: p => p.wins >= 1 },
  { id:"win5",        icon:"🥉", name:"En Forma",          desc:"Gana 5 batallas",             check: p => p.wins >= 5 },
  { id:"win20",       icon:"🥈", name:"Veterano",          desc:"Gana 20 batallas",            check: p => p.wins >= 20 },
  { id:"win50",       icon:"🥇", name:"Maestro",           desc:"Gana 50 batallas",            check: p => p.wins >= 50 },
  { id:"win100",      icon:"🏆", name:"Campeón Total",     desc:"Gana 100 batallas",           check: p => p.wins >= 100 },
  // Rachas
  { id:"streak3",     icon:"🔥", name:"En Racha",          desc:"3 victorias seguidas",        check: p => p.bestStreak >= 3 },
  { id:"streak5",     icon:"🔥🔥",name:"Imparable",        desc:"5 victorias seguidas",        check: p => p.bestStreak >= 5 },
  { id:"streak10",    icon:"💥", name:"Legendario",        desc:"10 victorias seguidas",       check: p => p.bestStreak >= 10 },
  // Batallas
  { id:"bat10",       icon:"⚔️",  name:"Luchador",          desc:"Juega 10 batallas",           check: p => p.totalBattles >= 10 },
  { id:"bat50",       icon:"🎖️",  name:"Dedicado",          desc:"Juega 50 batallas",           check: p => p.totalBattles >= 50 },
  // Tipos derrotados
  { id:"fire10",      icon:"🔥", name:"Bombero",           desc:"Derrota 10 Pokémon de Fuego", check: p => (p.typeKills?.fire||0) >= 10 },
  { id:"water10",     icon:"💧", name:"Surfero",           desc:"Derrota 10 Pokémon de Agua",  check: p => (p.typeKills?.water||0) >= 10 },
  { id:"grass10",     icon:"🌿", name:"Jardinero",         desc:"Derrota 10 Pokémon de Planta",check: p => (p.typeKills?.grass||0) >= 10 },
  { id:"electric10",  icon:"⚡", name:"Electricista",      desc:"Derrota 10 Pokémon Eléct.",   check: p => (p.typeKills?.electric||0) >= 10 },
  { id:"psychic10",   icon:"🔮", name:"Vidente",           desc:"Derrota 10 Pokémon Psíquicos",check: p => (p.typeKills?.psychic||0) >= 10 },
  { id:"dragon10",    icon:"🐉", name:"Cazadragones",      desc:"Derrota 10 Pokémon Dragón",   check: p => (p.typeKills?.dragon||0) >= 10 },
  { id:"ghost10",     icon:"👻", name:"Cazafantasmas",     desc:"Derrota 10 Pokémon Fantasma", check: p => (p.typeKills?.ghost||0) >= 10 },
  { id:"dark10",      icon:"🌑", name:"Oscuro Interior",   desc:"Derrota 10 Pokémon Oscuros",  check: p => (p.typeKills?.dark||0) >= 10 },
  { id:"ice10",       icon:"❄️",  name:"Rey del Hielo",     desc:"Derrota 10 Pokémon de Hielo", check: p => (p.typeKills?.ice||0) >= 10 },
  { id:"fighting10",  icon:"👊", name:"Maestro del Dojo",  desc:"Derrota 10 Pokémon Lucha",    check: p => (p.typeKills?.fighting||0) >= 10 },
  // Hazañas de combate
  { id:"critico5",    icon:"⚡", name:"Golpe Afortunado",  desc:"5 críticos en una partida",   check: p => (p.maxCritsInBattle||0) >= 5 },
  { id:"perfecto",    icon:"💎", name:"Sin Rasguños",      desc:"Gana sin perder ningún Pokémon",check:p=>(p.perfectWins||0)>=1 },
  { id:"remontada",   icon:"💪", name:"Remontada Épica",   desc:"Gana habiendo perdido 2 Pokémon",check:p=>(p.comebacks||0)>=1 },
  { id:"maximo_dmg",  icon:"💣", name:"Bazuka",            desc:"Más de 150 daño de un golpe",  check: p => (p.maxHit||0) >= 150 },
  // Legendaros
  { id:"legendary",   icon:"🌠", name:"Cazador Legendario",desc:"Derrota a un Pokémon legendario",check:p=>(p.legendaryKills||0)>=1},
  { id:"shiny_foe",   icon:"✨", name:"Rareza Extrema",    desc:"Lucha contra un Pokémon shiny", check:p=>(p.shinyEncounters||0)>=1},
  // Pokédex de combate
  { id:"seen50",      icon:"📖", name:"Explorador",        desc:"Combate contra 50 Pokémon distintos",check:p=>(p.seen||[]).length>=50},
  { id:"seen200",     icon:"📚", name:"Investigador",      desc:"Combate contra 200 Pokémon distintos",check:p=>(p.seen||[]).length>=200},
  // Especiales
  { id:"allgens",     icon:"🌍", name:"Viajero del Tiempo",desc:"Usa Pokémon de las 5 generaciones",check:p=>(p.gensUsed||new Set()).size>=5},
  { id:"nivel10",     icon:"📈", name:"En Crecimiento",    desc:"Alcanza el nivel 10",          check: p => levelFromXp(p.xp||0) >= 10 },
  { id:"nivel25",     icon:"🚀", name:"Alto Nivel",        desc:"Alcanza el nivel 25",          check: p => levelFromXp(p.xp||0) >= 25 },
];

const LEGENDARY_IDS = new Set([144,145,146,150,151,243,244,245,249,250,251,377,378,379,380,381,382,383,384,385,386,480,481,482,483,484,485,486,487,488,489,490,491,492,493,638,639,640,641,642,643,644,645,646,647,648,649]);

// ── Profile storage ──────────────────────────────────────────────
function getProfiles() {
  try { return JSON.parse(localStorage.getItem('pb_profiles') || '[]'); } catch { return []; }
}
function saveProfiles(arr) {
  try { localStorage.setItem('pb_profiles', JSON.stringify(arr)); } catch {}
}
function getActiveProfileId() {
  return localStorage.getItem('pb_active_profile') || null;
}
function setActiveProfileId(id) {
  localStorage.setItem('pb_active_profile', id);
}
function getActiveProfile() {
  const id = getActiveProfileId();
  if (!id) return null;
  return getProfiles().find(p => p.id === id) || null;
}
function saveProfile(profile) {
  const profiles = getProfiles();
  const idx = profiles.findIndex(p => p.id === profile.id);
  if (idx >= 0) profiles[idx] = profile;
  else profiles.push(profile);
  saveProfiles(profiles);
}
function createProfile(name, trainerId) {
  const id = 'p_' + Date.now() + '_' + Math.random().toString(36).slice(2,7);
  const profile = {
    id, name, trainerId,
    xp: 0, wins: 0, losses: 0,
    streak: 0, bestStreak: 0,
    totalBattles: 0,
    medals: [],
    typeKills: {},
    seen: [],
    gensUsed: [],
    perfectWins: 0,
    comebacks: 0,
    maxHit: 0,
    maxCritsInBattle: 0,
    legendaryKills: 0,
    shinyEncounters: 0,
    createdAt: Date.now(),
  };
  saveProfile(profile);
  return profile;
}
function deleteProfile(id) {
  const profiles = getProfiles().filter(p => p.id !== id);
  saveProfiles(profiles);
  if (getActiveProfileId() === id) {
    localStorage.removeItem('pb_active_profile');
  }
}

// ── Medal checking ───────────────────────────────────────────────
function checkMedals(profile) {
  const newMedals = [];
  MEDALS_DEF.forEach(m => {
    if (!profile.medals.includes(m.id) && m.check(profile)) {
      profile.medals.push(m.id);
      newMedals.push(m);
    }
  });
  return newMedals;
}

// ── XP rewards ───────────────────────────────────────────────────
function xpForBattle(won, stats, profile) {
  let xp = 0;
  if (won) xp += 50;
  else xp += 15;
  xp += Math.min(stats.moves || 0, 20) * 2;
  xp += (stats.defeated || 0) * 8;
  if (profile.streak >= 3) xp = Math.round(xp * 1.2); // streak bonus
  return xp;
}

// ── Post-battle profile update ────────────────────────────────────
function updateProfileAfterBattle(won, stats, battleData) {
  const profile = getActiveProfile();
  if (!profile) return { newMedals: [], levelUp: false, xpGained: 0 };

  const oldLevel = levelFromXp(profile.xp);
  const xpGained = xpForBattle(won, stats, profile);
  profile.xp = (profile.xp || 0) + xpGained;
  profile.totalBattles = (profile.totalBattles || 0) + 1;

  if (won) {
    profile.wins = (profile.wins || 0) + 1;
    profile.streak = (profile.streak || 0) + 1;
    profile.bestStreak = Math.max(profile.bestStreak || 0, profile.streak);
  } else {
    profile.losses = (profile.losses || 0) + 1;
    profile.streak = 0;
  }

  // Track type kills
  if (stats.typeKills) {
    Object.entries(stats.typeKills).forEach(([type, count]) => {
      profile.typeKills = profile.typeKills || {};
      profile.typeKills[type] = (profile.typeKills[type] || 0) + count;
    });
  }

  // Track seen pokemon
  if (battleData?.seenIds) {
    const seen = new Set(profile.seen || []);
    battleData.seenIds.forEach(id => seen.add(id));
    profile.seen = Array.from(seen);
  }

  // Track generations used
  if (battleData?.gensUsed) {
    const gu = new Set(profile.gensUsed || []);
    battleData.gensUsed.forEach(g => gu.add(g));
    profile.gensUsed = Array.from(gu);
  }

  // Combat stats
  if (stats.maxHit) profile.maxHit = Math.max(profile.maxHit || 0, stats.maxHit);
  if (stats.critsInBattle) profile.maxCritsInBattle = Math.max(profile.maxCritsInBattle || 0, stats.critsInBattle);
  if (battleData?.perfectWin) profile.perfectWins = (profile.perfectWins || 0) + 1;
  if (battleData?.comeback) profile.comebacks = (profile.comebacks || 0) + 1;
  if (battleData?.legendaryKill) profile.legendaryKills = (profile.legendaryKills || 0) + 1;
  if (battleData?.shinyEncounter) profile.shinyEncounters = (profile.shinyEncounters || 0) + 1;

  const newMedals = checkMedals(profile);
  const newLevel = levelFromXp(profile.xp);
  const levelUp = newLevel > oldLevel;

  saveProfile(profile);
  return { newMedals, levelUp, xpGained, newLevel, oldLevel };
}

// ── Frases del rival (100 frases) ────────────────────────────────
const RIVAL_QUOTES = {
  before: [
    "¿Has practicado? Porque se nota que no.",
    "Mi tortuga de peluche pelea mejor que tú.",
    "Esto va a ser tan rápido que ni lo verás.",
    "Avísame cuando quieras rendirte, que tengo cosas que hacer.",
    "¿Ese es tu equipo? Qué... original. Y qué malo.",
    "Mi abuela ganaría con los ojos cerrados.",
    "He visto mejores equipos en un tutorial para bebés.",
    "Tranquilo, que no duele mucho perder. Bueno, un poco.",
    "Ah, ¿vienes a perder otra vez? ¡Qué constante eres!",
    "He ganado más veces de las que tú has intentado.",
    "¿Pikachu? En serio, ¿Pikachu? Esto ya lo he ganado.",
    "Prepara la excusa porque vas a necesitarla.",
    "Mi Magikarp en nivel 5 te daría una paliza.",
    "¿Seguro que quieres hacer esto? Es tu última oportunidad de escapar.",
    "He desayunado victorias. Hoy también.",
    "No es que sea bueno. Es que tú eres muy malo.",
    "Relájate, que voy a ser rápido. Para que no sufras mucho.",
    "Ya sé cuál es tu estrategia: ninguna.",
    "¿Lloras fácilmente? Porque te voy a hacer llorar.",
    "Mi equipo está afilado. El tuyo parece de cartón.",
    "He soñado con esta victoria. Y en el sueño también ganaba yo.",
    "¿Eres principiante? Se te nota en la cara y en el equipo.",
    "Voy a ser tan bueno que vas a pedirme autógrafo después.",
    "Tómate tu tiempo eligiendo. Total, da igual.",
    "Esto va a ser épico. Bueno, para mí.",
  ],
  winning: [
    "¿Eso era todo? Qué decepción tan grande.",
    "Hasta mi Magikarp te daría una paliza. Y solo sabe Salpicadura.",
    "Oye, no te preocupes. El primer paso para mejorar es perder. Tú vas por buen camino.",
    "Fue un honor destruirte con estilo.",
    "Practica un poco más. Un poco más. Y otro poco más.",
    "Si la vida fuera un videojuego, acabas de perder todas tus vidas.",
    "¿Quieres el número del psicólogo pokémon? Te lo voy a hacer falta.",
    "Bonita batalla. Bueno, para mí.",
    "Mi estrategia era brillante. La tuya... existía, supongo.",
    "No te rindas. El fracaso es el maestro del éxito. Tú ya tienes mucho maestro.",
    "Ha sido como jugar contra la IA en fácil. Pero más fácil.",
    "Guarda ese equipo y vuelve cuando crezcas un poco.",
    "¿Ves? Así es como se juega esto.",
    "Deberías haber comido más zanahoria para ver mejor mis movimientos.",
    "Gracias por venir. Ahora ya puedes irte.",
    "Tengo más victorias que tú años de vida.",
    "Próxima vez trae refuerzos.",
    "Lo que tú llamas combate, yo lo llamo calentamiento.",
    "Hasta mis sueños juegan mejor que tú.",
    "No ha sido una batalla. Ha sido un trámite.",
  ],
  losing: [
    "¡El sol me daba en los ojos!",
    "Estaba distraído. Vamos a la revancha, anda.",
    "Mi Pokémon estaba con fiebre. No es excusa, es la verdad.",
    "¿Has hecho trampa? Juraría que has hecho trampa.",
    "He perdido a propósito para darte confianza. Eso es ser un gran rival.",
    "Esto no vale. Mis dedos resbalaron en todos los ataques.",
    "Bah, es que hoy no he dormido bien.",
    "Muy bien, muy bien. Disfruta mientras puedas.",
    "El viento soplaba en dirección contraria. Mala suerte.",
    "He perdido para que el universo se mantenga equilibrado.",
    "Esto es un error estadístico. Normalmente gano siempre.",
    "¡Trampa! ¡Foul! ¡Tarjeta roja! ¡Algo!",
    "Vale, vale. Pero en el fondo yo soy mejor entrenador.",
    "¿Ganaste? No me acordaré de esto mañana.",
    "Mi equipo tenía laringitis. Es una enfermedad real.",
    "Acabas de tener el día de tu vida. Fue de chiripa.",
    "Esto no ha pasado. Borramos y repetimos.",
    "Si me das la revancha te prometo que no pierdo... tanto.",
    "¡Qué suerte tan increíble la tuya! ¡Increíble!",
    "He dejado ganar. Para motivarte. Eres bienvenido.",
  ],
  faint: [
    "¡NO MI BEBÉ!",
    "¡IMPOSIBLE! ¡ERA MI MEJOR POKÉMON!",
    "Eso ha dolido. No al Pokémon, a mí.",
    "¡Levántate! ¡LEVÁNTATE! ...no se levanta.",
    "¡Traición! ¡Pura traición!",
    "Era mi favorito. El mundo es injusto.",
    "¡NOOOOOOO! ...bueno, tengo más.",
    "No sufras, amiguito. Algún día... no, es mentira, esto es horrible.",
    "¡Cómo te atreves! ¡Acabas de despertar a mi furia!",
    "¡Eso es un crimen! ¡Llamo a la policía Pokémon!",
    "Pasará a la historia como el más valiente. Y el más derrotado.",
    "¡Mi campeón ha caído! ...¿Tenía otro campeón?",
    "¡Dramáticamente cierro los ojos para no ver esto!",
    "¡Se acabó tu suerte! ¡Ahora soy PELIGROSO!",
    "...No digo nada. Estoy procesando.",
  ],
};

function getRivalQuote(moment) {
  const arr = RIVAL_QUOTES[moment] || RIVAL_QUOTES.before;
  return arr[Math.floor(Math.random() * arr.length)];
}

// ── Pantalla: selección de perfil ────────────────────────────────
function screenProfiles() {
  const profiles = getProfiles();
  const hasProfiles = profiles.length > 0;

  const profileCards = profiles.map(p => {
    const lvl = levelFromXp(p.xp || 0);
    const title = trainerTitle(p);
    const nextXp = xpForLevel(lvl + 1);
    const curXp = p.xp || 0;
    const prevXp = xpForLevel(lvl);
    const xpPct = nextXp > prevXp ? Math.round((curXp - prevXp) / (nextXp - prevXp) * 100) : 100;
    const avatarHtml = trainerAvatarHtml(p.trainerId || 'red', 56);
    return `<div onclick="selectProfile('${p.id}')" style="background:rgba(255,255,255,.06);border:2px solid rgba(59,130,246,.3);border-radius:14px;padding:14px 16px;display:flex;align-items:center;gap:12px;cursor:pointer;transition:all .15s;active:scale(.97);" onpointerdown="this.style.transform='scale(.97)'" onpointerup="this.style.transform='scale(1)'">
      ${avatarHtml}
      <div style="flex:1;min-width:0;">
        <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.1rem;color:#fff;letter-spacing:.04em;">${p.name}</div>
        <div style="font-family:'Roboto',sans-serif;font-size:.65rem;color:rgba(255,255,255,.5);margin-bottom:4px;">${title}</div>
        <div style="display:flex;align-items:center;gap:6px;">
          <span style="font-family:'Press Start 2P',monospace;font-size:.55rem;color:#F59E0B;">Nv.${lvl}</span>
          <div style="flex:1;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden;">
            <div style="width:${xpPct}%;height:100%;background:linear-gradient(90deg,#F59E0B,#EF4444);border-radius:2px;"></div>
          </div>
          <span style="font-family:'Roboto',sans-serif;font-size:.55rem;color:rgba(255,255,255,.4);">${p.wins||0}V ${p.losses||0}D</span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:center;gap:4px;">
        <span style="font-size:1.1rem;">${p.medals&&p.medals.length>0?'🏅':''}</span>
        <span style="font-family:'Roboto',sans-serif;font-size:.55rem;color:rgba(255,255,255,.3);">${p.medals?.length||0} medallas</span>
        <button onclick="event.stopPropagation();if(confirm('¿Borrar perfil de ${p.name}?'))deleteProfile('${p.id}');go('profiles');" style="background:rgba(239,68,68,.15);border:1px solid rgba(239,68,68,.3);color:#EF4444;font-size:.55rem;padding:3px 8px;border-radius:4px;cursor:pointer;font-family:'Roboto',sans-serif;font-weight:700;">🗑️</button>
      </div>
    </div>`;
  }).join('');

  return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#0F172A,#1E1A3F);display:flex;flex-direction:column;overflow:hidden;">
    <!-- Header -->
    <div style="padding:20px 20px 12px;flex-shrink:0;">
      <div style="font-family:'Rajdhani',sans-serif;font-size:1.6rem;font-weight:700;color:#fff;letter-spacing:.08em;">👤 PERFILES</div>
      <div style="font-family:'Roboto',sans-serif;font-size:.75rem;color:rgba(255,255,255,.4);">Elige tu entrenador o crea uno nuevo</div>
    </div>
    <!-- Profile list -->
    <div style="flex:1;overflow-y:auto;padding:0 20px;display:flex;flex-direction:column;gap:10px;">
      ${hasProfiles ? profileCards : `<div style="text-align:center;padding:40px 20px;font-family:'Roboto',sans-serif;color:rgba(255,255,255,.3);font-size:.9rem;">No hay perfiles aún.<br>¡Crea el primero!</div>`}
    </div>
    <!-- New profile button -->
    <div style="padding:16px 20px;flex-shrink:0;">
      <button onclick="go('newprofile')" style="width:100%;border:2px dashed rgba(59,130,246,.4);background:rgba(59,130,246,.08);color:#60A5FA;font-family:'Roboto',sans-serif;font-size:.95rem;font-weight:700;padding:16px;border-radius:12px;cursor:pointer;letter-spacing:.04em;">
        ＋ CREAR NUEVO PERFIL
      </button>
    </div>
  </div>`;
}

// ── Pantalla: crear perfil ────────────────────────────────────────
function screenNewProfile() {
  const selTrainer = G._selTrainer || 'red';
  const trainerPage = G._trainerPage || 0;
  const perPage = 10;
  const totalPages = Math.ceil(TRAINERS.length / perPage);
  const pageTr = TRAINERS.slice(trainerPage * perPage, (trainerPage+1) * perPage);

  const trainerGrid = pageTr.map(tr => {
    const sel = selTrainer === tr.id;
    return `<div onclick="G._selTrainer='${tr.id}';render()" style="display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer;padding:6px;border-radius:10px;border:2px solid ${sel?'#3B82F6':'rgba(255,255,255,.08)'};background:${sel?'rgba(59,130,246,.15)':'rgba(255,255,255,.04)'};transition:all .12s;">
      ${trainerAvatarHtml(tr.id, 44)}
      <span style="font-family:'Roboto',sans-serif;font-size:.55rem;color:${sel?'#60A5FA':'rgba(255,255,255,.4)'};font-weight:700;">${tr.name}</span>
    </div>`;
  }).join('');

  return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#0F172A,#1E1A3F);display:flex;flex-direction:column;overflow:hidden;">
    <div style="padding:16px 20px 10px;flex-shrink:0;display:flex;align-items:center;gap:12px;">
      <button onclick="go('profiles')" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);font-size:.85rem;cursor:pointer;font-weight:700;padding:8px 16px;border-radius:6px;font-family:'Roboto',sans-serif;">← ATRÁS</button>
      <div style="font-family:'Rajdhani',sans-serif;font-size:1.3rem;font-weight:700;color:#fff;letter-spacing:.06em;">NUEVO PERFIL</div>
    </div>
    <div style="flex:1;overflow-y:auto;padding:0 20px 20px;">
      <!-- Avatar preview -->
      <div style="text-align:center;margin-bottom:20px;">
        ${trainerAvatarHtml(selTrainer, 80)}
        <div style="font-family:'Roboto',sans-serif;font-size:.75rem;color:rgba(255,255,255,.5);margin-top:6px;">${TRAINERS.find(t=>t.id===selTrainer)?.name||'Entrenador'}</div>
      </div>
      <!-- Name input -->
      <div style="margin-bottom:20px;">
        <div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.75rem;color:#60A5FA;letter-spacing:.1em;margin-bottom:6px;">NOMBRE</div>
        <input id="pname" placeholder="Escribe tu nombre..." maxlength="14"
          style="width:100%;background:rgba(0,0,0,.4);border:2px solid rgba(255,255,255,.15);border-radius:8px;padding:13px 16px;font-size:1rem;font-weight:700;outline:none;font-family:inherit;color:#fff;box-sizing:border-box;"
          onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='rgba(255,255,255,.15)'">
      </div>
      <!-- Trainer picker -->
      <div style="margin-bottom:20px;">
        <div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.75rem;color:#60A5FA;letter-spacing:.1em;margin-bottom:10px;">ELIGE TU ENTRENADOR</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:10px;">
          ${trainerGrid}
        </div>
        <div style="display:flex;justify-content:center;gap:8px;">
          <button onclick="G._trainerPage=Math.max(0,(G._trainerPage||0)-1);render()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:'Roboto',sans-serif;font-size:.75rem;" ${trainerPage===0?'disabled style="opacity:.3"':''}>◀</button>
          <span style="font-family:'Roboto',sans-serif;font-size:.7rem;color:rgba(255,255,255,.4);padding:6px;">${trainerPage+1}/${totalPages}</span>
          <button onclick="G._trainerPage=Math.min(${totalPages-1},(G._trainerPage||0)+1);render()" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:#fff;padding:6px 14px;border-radius:6px;cursor:pointer;font-family:'Roboto',sans-serif;font-size:.75rem;" ${trainerPage===totalPages-1?'disabled style="opacity:.3"':''}>▶</button>
        </div>
      </div>
      <!-- Create button -->
      <button onclick="createNewProfile()" style="width:100%;border:none;cursor:pointer;background:linear-gradient(135deg,#3B82F6,#1D4ED8);color:#fff;font-family:'Roboto',sans-serif;font-weight:700;font-size:1rem;letter-spacing:.06em;padding:16px;border-radius:10px;box-shadow:0 4px 20px rgba(59,130,246,.5);">
        ✓ CREAR PERFIL
      </button>
    </div>
  </div>`;
}

// ── Pantalla: ver perfil ──────────────────────────────────────────
function screenViewProfile() {
  const profile = getActiveProfile();
  if (!profile) { go('profiles'); return ''; }

  const lvl = levelFromXp(profile.xp || 0);
  const nextXp = xpForLevel(lvl + 1);
  const curXp = profile.xp || 0;
  const prevXp = xpForLevel(lvl);
  const xpPct = nextXp > prevXp ? Math.round((curXp - prevXp) / (nextXp - prevXp) * 100) : 100;
  const xpToNext = Math.max(0, nextXp - curXp);
  const title = trainerTitle(profile);
  const wr = profile.totalBattles > 0 ? Math.round(profile.wins / profile.totalBattles * 100) : 0;

  // Medals grid
  const medalsHtml = MEDALS_DEF.map(m => {
    const earned = profile.medals.includes(m.id);
    return `<div title="${m.name}: ${m.desc}" style="display:flex;flex-direction:column;align-items:center;gap:3px;padding:8px 4px;border-radius:10px;background:${earned?'rgba(245,158,11,.15)':'rgba(255,255,255,.04)'};border:1px solid ${earned?'rgba(245,158,11,.4)':'rgba(255,255,255,.08)'};opacity:${earned?1:0.35};">
      <span style="font-size:1.4rem;${earned?'':'filter:grayscale(1)'}">${m.icon}</span>
      <span style="font-family:'Roboto',sans-serif;font-size:.45rem;color:${earned?'#F59E0B':'rgba(255,255,255,.3)'};font-weight:700;text-align:center;line-height:1.2;">${m.name}</span>
    </div>`;
  }).join('');

  return `<div style="position:absolute;inset:0;background:linear-gradient(160deg,#0F172A,#1E1A3F);display:flex;flex-direction:column;overflow:hidden;">
    <!-- Header -->
    <div style="padding:16px 20px 12px;flex-shrink:0;display:flex;align-items:center;gap:12px;background:rgba(0,0,0,.3);border-bottom:1px solid rgba(255,255,255,.08);">
      <button onclick="go('mode')" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.7);font-size:.85rem;cursor:pointer;font-weight:700;padding:8px 14px;border-radius:6px;font-family:'Roboto',sans-serif;">← JUGAR</button>
      <div style="flex:1;font-family:'Rajdhani',sans-serif;font-size:1.2rem;font-weight:700;color:#fff;letter-spacing:.06em;">MI PERFIL</div>
      <button onclick="go('profiles')" style="background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);color:rgba(255,255,255,.6);font-size:.75rem;cursor:pointer;padding:8px 12px;border-radius:6px;font-family:'Roboto',sans-serif;">CAMBIAR</button>
    </div>
    <div style="flex:1;overflow-y:auto;padding:16px 20px;">
      <!-- Profile hero -->
      <div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;background:rgba(255,255,255,.05);border-radius:14px;padding:16px;">
        ${trainerAvatarHtml(profile.trainerId || 'red', 70)}
        <div style="flex:1;min-width:0;">
          <div style="font-family:'Rajdhani',sans-serif;font-size:1.4rem;font-weight:700;color:#fff;">${profile.name}</div>
          <div style="font-family:'Roboto',sans-serif;font-size:.7rem;color:#F59E0B;margin-bottom:6px;">${title}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-family:'Press Start 2P',monospace;font-size:.6rem;color:#F59E0B;background:rgba(245,158,11,.15);padding:3px 8px;border-radius:4px;">NV ${lvl}</span>
            <span style="font-family:'Roboto',sans-serif;font-size:.65rem;color:rgba(255,255,255,.4);">${xpToNext} XP para siguiente nivel</span>
          </div>
          <div style="height:6px;background:rgba(255,255,255,.1);border-radius:3px;overflow:hidden;">
            <div style="width:${xpPct}%;height:100%;background:linear-gradient(90deg,#F59E0B,#EF4444);border-radius:3px;transition:width .6s;"></div>
          </div>
        </div>
      </div>
      <!-- Stats -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px;">
        ${[
          ['⚔️ Victorias', profile.wins||0, '#22C55E'],
          ['💀 Derrotas', profile.losses||0, '#EF4444'],
          ['🔥 Mejor racha', profile.bestStreak||0, '#F59E0B'],
          ['🎮 Batallas', profile.totalBattles||0, '#3B82F6'],
          ['📖 Pokémon vistos', (profile.seen||[]).length, '#8B5CF6'],
          ['🏅 Medallas', (profile.medals||[]).length+'/'+MEDALS_DEF.length, '#F59E0B'],
          ['📊 % Victorias', wr+'%', wr>=50?'#22C55E':'#EF4444'],
          ['✨ XP Total', profile.xp||0, '#60A5FA'],
        ].map(([label,val,col])=>`<div style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:10px;padding:12px;text-align:center;">
          <div style="font-family:'Rajdhani',sans-serif;font-size:1.3rem;font-weight:700;color:${col};">${val}</div>
          <div style="font-family:'Roboto',sans-serif;font-size:.62rem;color:rgba(255,255,255,.4);margin-top:2px;">${label}</div>
        </div>`).join('')}
      </div>
      <!-- Medals -->
      <div style="margin-bottom:16px;">
        <div style="font-family:'Roboto',sans-serif;font-weight:700;font-size:.75rem;color:rgba(255,255,255,.5);letter-spacing:.08em;margin-bottom:10px;">🏅 MEDALLAS (${(profile.medals||[]).length}/${MEDALS_DEF.length})</div>
        <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;">
          ${medalsHtml}
        </div>
      </div>
    </div>
  </div>`;
}

// ── Functions called from HTML ────────────────────────────────────
function selectProfile(id) {
  setActiveProfileId(id);
  go('mode');
}

function createNewProfile() {
  const inp = document.getElementById('pname');
  const nm = inp ? inp.value.trim() : '';
  if (!nm) {
    if (inp) { inp.style.borderColor='#EF4444'; inp.style.animation='shake .4s'; inp.focus(); setTimeout(()=>{inp.style.borderColor='';inp.style.animation='';},500); }
    return;
  }
  const trainerId = G._selTrainer || 'red';
  const profile = createProfile(nm, trainerId);
  setActiveProfileId(profile.id);
  G._selTrainer = null;
  G._trainerPage = 0;
  go('mode');
}

// ── Level up overlay ─────────────────────────────────────────────
function showLevelUp(newLevel, newMedals, xpGained) {
  const app = document.getElementById('app');
  if (!app) return;
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:absolute;inset:0;z-index:200;display:flex;flex-direction:column;align-items:center;justify-content:center;background:rgba(0,0,0,.85);animation:splashFadeIn .3s ease;';

  const medalsHtml = newMedals.length > 0 ? `
    <div style="margin-top:16px;text-align:center;">
      <div style="font-family:'Roboto',sans-serif;font-size:.8rem;color:#F59E0B;font-weight:700;margin-bottom:8px;">🏅 ¡NUEVA MEDALLA!</div>
      ${newMedals.map(m=>`<div style="font-family:'Roboto',sans-serif;font-size:.85rem;color:#fff;margin-bottom:4px;">${m.icon} ${m.name}</div><div style="font-size:.7rem;color:rgba(255,255,255,.5);">${m.desc}</div>`).join('')}
    </div>` : '';

  overlay.innerHTML = `
    <div style="text-align:center;padding:30px 24px;background:linear-gradient(135deg,rgba(245,158,11,.2),rgba(239,68,68,.15));border:2px solid rgba(245,158,11,.5);border-radius:20px;max-width:300px;width:90%;">
      <div style="font-size:3rem;margin-bottom:10px;animation:vsSlam .4s ease both;">⭐</div>
      ${newLevel?`<div style="font-family:'Press Start 2P',monospace;font-size:.75rem;color:#F59E0B;letter-spacing:.06em;margin-bottom:4px;">¡SUBISTE DE NIVEL!</div>
      <div style="font-family:'Rajdhani',sans-serif;font-size:3rem;font-weight:700;color:#fff;line-height:1;">NV \${newLevel}</div>`:`<div style="font-family:'Press Start 2P',monospace;font-size:.75rem;color:#F59E0B;letter-spacing:.06em;margin-bottom:4px;">¡NUEVA MEDALLA!</div>`}
      <div style="font-family:'Roboto',sans-serif;font-size:.75rem;color:rgba(255,255,255,.5);margin-top:4px;">+${xpGained} XP ganados</div>
      ${medalsHtml}
      <button onclick="this.parentElement.parentElement.remove()" style="margin-top:20px;border:none;cursor:pointer;background:linear-gradient(135deg,#F59E0B,#D97706);color:#000;font-family:'Roboto',sans-serif;font-weight:700;font-size:.9rem;padding:12px 32px;border-radius:8px;letter-spacing:.06em;">¡GENIAL! 🎉</button>
    </div>`;
  app.appendChild(overlay);
}

function showNewMedals(newMedals, xpGained) {
  // Only medals, no level up
  if (newMedals.length === 0) return;
  showLevelUp(null, newMedals, xpGained);
}
