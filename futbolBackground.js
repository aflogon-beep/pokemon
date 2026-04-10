// futbolBackground.js - Escenario de Fútbol mejorado con Canvas

class FutbolBackground extends BackgroundCanvas {
  constructor() {
    super();
    this.clouds = [
      {x: 120, y: 80, size: 110, speed: 0.12},
      {x: 520, y: 110, size: 140, speed: 0.08},
      {x: 850, y: 65, size: 95, speed: 0.15}
    ];
    this.confetti = [];
    this.spotlightTime = 0;
    this.maxParticles = isMobile ? 35 : 65;
  }

  drawBackground() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Cielo
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    grad.addColorStop(0, "#1e3a8a");
    grad.addColorStop(1, "#60a5fa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Nubes (lentas y suaves)
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    this.clouds.forEach(c => {
      ctx.beginPath();
      ctx.ellipse(c.x % (w + 300) - 100, c.y, c.size, c.size * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(c.x % (w + 300) + 40, c.y - 18, c.size * 0.75, c.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Césped (verde fútbol)
    ctx.fillStyle = "#15803d";
    ctx.fillRect(0, h * 0.58, w, h * 0.42);

    // Líneas del campo FIJAS (sin onda)
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 4.5;
    ctx.shadowColor = "rgba(255,255,255,0.6)";
    ctx.shadowBlur = 8;

    // Bordes y líneas horizontales
    ctx.beginPath();
    ctx.moveTo(40, h*0.62);
    ctx.lineTo(w-40, h*0.62);
    ctx.moveTo(40, h*0.78);
    ctx.lineTo(w-40, h*0.78);
    ctx.moveTo(40, h*0.70);
    ctx.lineTo(w-40, h*0.70);

    // Línea central vertical
    ctx.moveTo(w/2, h*0.62);
    ctx.lineTo(w/2, h*0.78);

    // Círculo central
    ctx.arc(w/2, h*0.70, 68, 0, Math.PI * 2);
    ctx.stroke();

    // Áreas grandes (simplificado)
    ctx.beginPath();
    ctx.rect(80, h*0.62, 140, h*0.16);
    ctx.rect(w-220, h*0.62, 140, h*0.16);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.lineWidth = 2.5;

    // Porterías simples
    ctx.strokeRect(35, h*0.64, 18, h*0.14);
    ctx.strokeRect(w-53, h*0.64, 18, h*0.14);

    // Texto "FÚTBOL" sutil en el centro
    ctx.fillStyle = "rgba(255,255,255,0.12)";
    ctx.font = "bold 92px Arial";
    ctx.textAlign = "center";
    ctx.fillText("FÚTBOL", w/2, h*0.72);
  }

  updateAndDrawParticles() {
    // Confeti
    if (Math.random() < 0.25) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -20,
        vx: (Math.random() - 0.5) * 1.8,
        vy: 1.2 + Math.random() * 2,
        color: ["#ef4444","#3b82f6","#eab308","#22c55e","#a855f7"][Math.floor(Math.random()*5)],
        size: 6 + Math.random() * 7,
        rot: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12
      });
    }

    this.ctx.shadowBlur = 0;
    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.08;
      p.rot += p.rotSpeed;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rot * Math.PI / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size * 0.4);
      this.ctx.restore();

      if (p.y > this.canvas.height + 20) this.confetti.splice(i, 1);
    }

    // Spotlight sutil (opcional, se puede quitar si molesta)
    this.spotlightTime += 0.018;
    const sx = this.canvas.width * (0.5 + Math.sin(this.spotlightTime) * 0.35);
    const grad = this.ctx.createRadialGradient(sx, 90, 20, sx, 220, 280);
    grad.addColorStop(0, "rgba(250,240,180,0.08)");
    grad.addColorStop(1, "rgba(250,240,180,0)");
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height * 0.65);
  }
}

// Exponer para el juego
window.FutbolBackground = FutbolBackground;
