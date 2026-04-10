// futbolBackground.js - Escenario de Fútbol mejorado con Canvas

class FutbolBackground extends BackgroundCanvas {
  constructor() {
    super('futbolBgCanvas', {
      name: "futbol",
      useCanvas: true
    });

    this.clouds = [
      {x: 100, y: 80, speed: 0.12, size: 180},
      {x: 450, y: 110, speed: 0.08, size: 220},
      {x: 800, y: 65, speed: 0.15, size: 150}
    ];

    this.spotlights = []; // focos que barren
    this.confettiTimer = 0;
  }

  drawBackground() {
    const w = this.width, h = this.height;
    const time = this.time;

    // === SKY ===
    const skyGrad = this.ctx.createLinearGradient(0, 0, 0, h * 0.55);
    skyGrad.addColorStop(0, '#1a3a6e');
    skyGrad.addColorStop(0.4, '#2e6db4');
    skyGrad.addColorStop(0.7, '#5ba3e0');
    skyGrad.addColorStop(1, '#87CEEB');
    this.ctx.fillStyle = skyGrad;
    this.ctx.fillRect(0, 0, w, h * 0.58);

    // Nubes lentas (parallax)
    this.ctx.globalAlpha = 0.75;
    this.clouds.forEach(cloud => {
      cloud.x -= cloud.speed;
      if (cloud.x < -cloud.size * 1.2) cloud.x = w + cloud.size * 1.2;

      this.ctx.fillStyle = 'rgba(255,255,255,0.85)';
      this.ctx.beginPath();
      this.ctx.ellipse(cloud.x, cloud.y, cloud.size*0.6, cloud.size*0.25, 0, 0, Math.PI*2);
      this.ctx.fill();
      this.ctx.beginPath();
      this.ctx.ellipse(cloud.x + cloud.size*0.35, cloud.y - 12, cloud.size*0.45, cloud.size*0.22, 0, 0, Math.PI*2);
      this.ctx.fill();
    });
    this.ctx.globalAlpha = 1;

    // === GROUND / CÉSPED ===
    const groundY = h * 0.58;
    const groundGrad = this.ctx.createLinearGradient(0, groundY, 0, h);
    groundGrad.addColorStop(0, '#1a5c1a');
    groundGrad.addColorStop(0.5, '#2d7a2d');
    groundGrad.addColorStop(1, '#0f3d0f');
    this.ctx.fillStyle = groundGrad;
    this.ctx.fillRect(0, groundY, w, h - groundY);

    // Líneas del campo de fútbol (con leve movimiento/reflejo)
    this.ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    this.ctx.lineWidth = Math.max(2, w * 0.003);

    // Línea central vertical
    this.ctx.beginPath();
    this.ctx.moveTo(w/2, groundY + 20);
    this.ctx.lineTo(w/2, h - 30);
    this.ctx.stroke();

    // Círculo central
    this.ctx.beginPath();
    this.ctx.arc(w/2, groundY + (h-groundY)*0.42, w*0.14, 0, Math.PI*2);
    this.ctx.stroke();

    // Bandas laterales (ondeando)
    this.ctx.strokeStyle = 'rgba(255,255,255,0.6)';
    for (let i = 0; i < 5; i++) {
      const y = groundY + 40 + i * ((h - groundY - 70) / 4);
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      for (let x = 0; x < w; x += 25) {
        this.ctx.lineTo(x, y + Math.sin(time * 1.8 + x * 0.02) * 4);
      }
      this.ctx.stroke();
    }

    // === Luces de focos (barrido) ===
    if (Math.sin(time * 0.6) > 0.85) {
      const spotlightX = (Math.sin(time * 1.3) * 0.4 + 0.5) * w;
      const grad = this.ctx.createRadialGradient(spotlightX, groundY - 80, 10, spotlightX, groundY + 120, 280);
      grad.addColorStop(0, 'rgba(255,240,180,0.35)');
      grad.addColorStop(1, 'rgba(255,240,180,0)');
      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, groundY - 40, w, h - groundY + 80);
    }
  }

  updateAndDrawParticles() {
    // Confeti ocasional (ambiente de estadio)
    this.confettiTimer++;
    if (this.confettiTimer > 180 && Math.random() < 0.07) {
      this.confettiTimer = 0;
      for (let i = 0; i < 18; i++) {
        this.particles.push({
          x: Math.random() * this.width,
          y: -20 - Math.random() * 80,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 1.2 + Math.random() * 2.2,
          size: 5 + Math.random() * 7,
          color: ['#EF4444','#F59E0B','#22C55E','#3B82F6','#A855F7'][Math.floor(Math.random()*5)],
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.2,
          life: 220
        });
      }
    }

    // Actualizar y dibujar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravedad suave
      p.rotation += p.rotSpeed;
      p.life--;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life / 220 * 0.9;
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.6);
      this.ctx.restore();
    }
  }
}

// Exponer para el juego
window.FutbolBackground = FutbolBackground;
