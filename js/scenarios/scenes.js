// PokéBattle Scenarios — data only (no SVG, canvas handles rendering)
// SVG code removed — all visual rendering is in canvas-scenes.js

const SCENARIOS=[
  // 1. Campo de hierba - d-a
  {
    name:"campo",
    sky:`linear-gradient(180deg,#87CEEB 0%,#B0E0FF 45%,#C8EBFF 65%,#D4F1C4 80%,#8DB96A 100%)`,
    clouds:true,
    ground:`linear-gradient(180deg,#8DB96A 0%,#6A9A4A 60%,#4A7A2A 100%)`,
    groundH:42,
    trees:`<g>
      <rect x="-2%" y="52%" width="5%" height="30%" fill="#6A9A4A"/>
      <ellipse cx="0%" cy="52%" rx="7%" ry="9%" fill="#4A7A2A"/>
      <ellipse cx="0%" cy="49%" rx="6%" ry="8%" fill="#5A8A3A"/>
      <rect x="88%" y="52%" width="5%" height="30%" fill="#6A9A4A"/>
      <ellipse cx="91%" cy="52%" rx="7%" ry="9%" fill="#4A7A2A"/>
      <ellipse cx="91%" cy="49%" rx="6%" ry="8%" fill="#5A8A3A"/>
      <rect x="78%" y="56%" width="4%" height="22%" fill="#7AAA5A"/>
      <ellipse cx="80%" cy="56%" rx="5%" ry="7%" fill="#5A8A3A"/>
    </g>`,
    groundDeco:`<g opacity=".6">
      <ellipse cx="15%" cy="72%" rx="6%" ry="3%" fill="#7AAA5A"/>
      <ellipse cx="75%" cy="78%" rx="5%" ry="2.5%" fill="#7AAA5A"/>
    </g>`,
    p1ground:"72%",p2ground:"72%",
    msgBg:"rgba(0,80,0,.85)",msgBorder:"#22C55E"
  },
  // 2. Galaxia / espacio
  {
    name:"galaxia",
    weather:"thunder",
    sky:`linear-gradient(180deg,#020618 0%,#0B1A3E 30%,#1a0a3e 60%,#2d1060 100%)`,
    clouds:false,
    stars:true,
    ground:`linear-gradient(180deg,#1a1040 0%,#0d0820 100%)`,
    groundH:40,
    nebula:true,
    groundDeco:`<g>
      <ellipse cx="50%" cy="82%" rx="40%" ry="8%" fill="rgba(100,0,200,.15)"/>
      <circle cx="20%" cy="75%" r="2%" fill="rgba(150,100,255,.3)"/>
      <circle cx="80%" cy="78%" r="1.5%" fill="rgba(100,200,255,.3)"/>
    </g>`,
    p1ground:"75%",p2ground:"75%",
    msgBg:"rgba(30,0,80,.9)",msgBorder:"#A855F7"
  },
  // 3. Estadio Pok-mon
  {
    name:"estadio",
    sky:`linear-gradient(180deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)`,
    clouds:false,
    stadium:true,
    ground:`linear-gradient(180deg,#2D4A6A 0%,#1a3050 100%)`,
    groundH:42,
    groundDeco:`<g>
      <ellipse cx="50%" cy="78%" rx="38%" ry="6%" fill="rgba(59,130,246,.2)" stroke="rgba(59,130,246,.4)" stroke-width="1.5"/>
      <ellipse cx="50%" cy="78%" rx="20%" ry="3%" fill="none" stroke="rgba(59,130,246,.3)" stroke-width="1"/>
      <line x1="50%" y1="72%" x2="50%" y2="84%" stroke="rgba(59,130,246,.3)" stroke-width="1"/>
    </g>`,
    p1ground:"74%",p2ground:"74%",
    msgBg:"rgba(0,20,60,.9)",msgBorder:"#3B82F6"
  },
  // 4. Campo de fútbol — mejorado
  {
    name:"futbol",
    sky:`linear-gradient(180deg,#1a3a6e 0%,#2e6db4 30%,#5ba3e0 60%,#87CEEB 100%)`,
    clouds:true,
    ground:`linear-gradient(180deg,#1a5c1a 0%,#2d7a2d 30%,#1a5c1a 60%,#0f3d0f 100%)`,
    groundH:42,
    groundDeco:`<g>
      <rect x="0%" y="58%" width="100%" height="1%" fill="rgba(255,255,255,.3)"/>
      <rect x="0%" y="66%" width="100%" height="1%" fill="rgba(255,255,255,.2)"/>
      <rect x="0%" y="74%" width="100%" height="1%" fill="rgba(255,255,255,.15)"/>
      <rect x="0%" y="82%" width="100%" height="1%" fill="rgba(255,255,255,.1)"/>
      <rect x="49.5%" y="58%" width="1%" height="35%" fill="rgba(255,255,255,.5)"/>
      <ellipse cx="50%" cy="75%" rx="14%" ry="6%" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1.5"/>
      <rect x="8%" y="58%" width="16%" height="12%" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <rect x="76%" y="58%" width="16%" height="12%" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.5"/>
      <rect x="14%" y="58%" width="4%" height="6%" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
      <rect x="82%" y="58%" width="4%" height="6%" fill="none" stroke="rgba(255,255,255,.25)" stroke-width="1"/>
    </g>`,
    fans:true,
    p1ground:"73%",p2ground:"73%",
    msgBg:"rgba(0,60,0,.88)",msgBorder:"#22C55E"
  },
  // 5. Cueva
  {
    name:"cueva",
    weather:"fog",
    sky:`linear-gradient(180deg,#0a0a0a 0%,#1a1008 40%,#2d1f05 70%,#3d2a08 100%)`,
    clouds:false,
    ground:`linear-gradient(180deg,#3d2a08 0%,#2d1f05 40%,#1a1008 100%)`,
    groundH:40,
    groundDeco:`<g>
      <polygon points="0,58 8,45 16,58" fill="#2a1f0a" stroke="#1a1008" stroke-width=".5"/>
      <polygon points="12,58 22,38 32,58" fill="#1f1608" stroke="#1a1008" stroke-width=".5"/>
      <polygon points="60,58 72,42 84,58" fill="#2a1f0a" stroke="#1a1008" stroke-width=".5"/>
      <polygon points="78,58 86,48 94,58" fill="#1f1608" stroke="#1a1008" stroke-width=".5"/>
      <polygon points="88,58 96,44 100,58" fill="#2a1f0a" stroke="#1a1008" stroke-width=".5"/>
      <!-- stalactites top -->
      <polygon points="5,0 8,12 11,0" fill="#1a1008"/>
      <polygon points="25,0 29,18 33,0" fill="#1a1008"/>
      <polygon points="55,0 58,10 61,0" fill="#1a1008"/>
      <polygon points="75,0 79,15 83,0" fill="#1a1008"/>
      <!-- glowing crystals -->
      <ellipse cx="20%" cy="50%" rx="2%" ry="3%" fill="rgba(100,200,255,.15)" filter="url(#glow)"/>
      <ellipse cx="70%" cy="52%" rx="1.5%" ry="2.5%" fill="rgba(150,100,255,.15)"/>
      <ellipse cx="45%" cy="48%" rx="1%" ry="2%" fill="rgba(100,255,150,.1)"/>
      <!-- lava pools -->
      <ellipse cx="15%" cy="92%" rx="8%" ry="3%" fill="rgba(255,80,0,.4)"/>
      <ellipse cx="80%" cy="95%" rx="6%" ry="2.5%" fill="rgba(255,100,0,.35)"/>
    </g>`,
    p1ground:"74%",p2ground:"74%",
    msgBg:"rgba(10,5,0,.9)",msgBorder:"#F59E0B"
  },
  // 6. Playa
  {
    name:"playa",
    weather:"rain",
    sky:`linear-gradient(180deg,#FF6B35 0%,#FF8C42 15%,#FFB347 30%,#87CEEB 55%,#4AA8D8 100%)`,
    clouds:true,
    ground:`linear-gradient(180deg,#C4A882 0%,#D4B896 30%,#E8D5B0 60%,#F0E0C0 100%)`,
    groundH:38,
    groundDeco:`<g>
      <!-- Sun setting -->
      <circle cx="75%" cy="35%" r="6%" fill="#FFD700" opacity=".9" filter="blur(2px)"/>
      <circle cx="75%" cy="35%" r="5%" fill="#FFF176" opacity=".95"/>
      <!-- Waves -->
      <path d="M0,72 Q5,69 10,72 Q15,75 20,72 Q25,69 30,72 Q35,75 40,72 Q45,69 50,72 Q55,75 60,72 Q65,69 70,72 Q75,75 80,72 Q85,69 90,72 Q95,75 100,72" fill="none" stroke="rgba(100,180,255,.6)" stroke-width="1.5"/>
      <path d="M0,76 Q5,73 10,76 Q15,79 20,76 Q25,73 30,76 Q35,79 40,76 Q45,73 50,76 Q55,79 60,76 Q65,73 70,76 Q75,79 80,76 Q85,73 90,76 Q95,79 100,76" fill="none" stroke="rgba(100,180,255,.4)" stroke-width="1"/>
      <!-- Water reflection -->
      <rect x="0%" y="58%" width="100%" height="6%" fill="rgba(70,150,255,.25)"/>
      <!-- Palm tree left -->
      <rect x="3%" y="32%" width="1.5%" height="28%" fill="#8B6914"/>
      <ellipse cx="5.5%" cy="32%" rx="8%" ry="5%" fill="#2d7a2d" transform="rotate(-15,5.5,32)"/>
      <ellipse cx="3%" cy="30%" rx="7%" ry="4%" fill="#22C55E" transform="rotate(10,3,30)"/>
      <!-- Palm right -->
      <rect x="92%" y="35%" width="1.5%" height="26%" fill="#8B6914"/>
      <ellipse cx="90%" cy="35%" rx="7%" ry="4.5%" fill="#2d7a2d" transform="rotate(15,90,35)"/>
      <ellipse cx="93.5%" cy="33%" rx="6%" ry="3.5%" fill="#22C55E" transform="rotate(-10,93.5,33)"/>
    </g>`,
    p1ground:"74%",p2ground:"74%",
    msgBg:"rgba(0,40,80,.85)",msgBorder:"#60A5FA"
  },
  // 7. Noche
  {
    name:"noche",
    weather:"mist",
    sky:`linear-gradient(180deg,#000510 0%,#020c1b 40%,#041628 70%,#0a1f35 100%)`,
    clouds:false,
    stars:true,
    ground:`linear-gradient(180deg,#0a1f10 0%,#061408 50%,#030d05 100%)`,
    groundH:38,
    groundDeco:`<g>
      <!-- Full moon -->
      <circle cx="80%" cy="18%" r="7%" fill="#FFF9E6" opacity=".95"/>
      <circle cx="80%" cy="18%" r="7%" fill="none" stroke="rgba(255,240,150,.4)" stroke-width="2"/>
      <!-- Moon glow -->
      <circle cx="80%" cy="18%" r="11%" fill="rgba(255,240,150,.08)"/>
      <!-- Silhouette trees -->
      <rect x="0%" y="48%" width="3%" height="30%" fill="#030d05"/>
      <polygon points="1.5,48 -2,62 5,62" fill="#041408"/>
      <polygon points="1.5,42 -3,58 6,58" fill="#030d05"/>
      <rect x="5%" y="50%" width="2.5%" height="28%" fill="#030d05"/>
      <polygon points="6.25,50 3,64 9.5,64" fill="#041408"/>
      <rect x="88%" y="46%" width="3%" height="32%" fill="#030d05"/>
      <polygon points="89.5,46 86,62 93,62" fill="#041408"/>
      <polygon points="89.5,40 86,56 93,56" fill="#030d05"/>
      <rect x="93%" y="50%" width="2.5%" height="28%" fill="#030d05"/>
      <!-- Fireflies -->
      <circle cx="25%" cy="55%" r=".8%" fill="rgba(200,255,100,.6)" opacity=".7"/>
      <circle cx="60%" cy="52%" r=".6%" fill="rgba(150,255,100,.6)" opacity=".6"/>
      <circle cx="40%" cy="58%" r=".7%" fill="rgba(180,255,120,.5)" opacity=".8"/>
      <!-- Moon reflection on ground -->
      <ellipse cx="80%" cy="70%" rx="15%" ry="3%" fill="rgba(255,240,150,.06)"/>
    </g>`,
    p1ground:"74%",p2ground:"74%",
    msgBg:"rgba(2,5,15,.92)",msgBorder:"#818CF8"
  }
];

const _scLabels={
  campo:"CAMPO",galaxia:"GALAXIA",estadio:"ESTADIO",futbol:"FUTBOL",
  playa:"PLAYA",volcan:"VOLCAN",noche:"NOCHE",nieve:"NIEVE",
  ciudad:"CIUDAD",cueva:"CUEVA",dojo:"DOJO",templo:"TEMPLO"
};
