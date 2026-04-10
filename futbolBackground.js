// futbolBackground.js - Escenario de Fútbol mejorado con Canvas

class FutbolBackground extends BackgroundCanvas {
  constructor() {
    super();
    this.clouds = [
      {x: 150, y: 90, size: 120, speed: 0.09},
      {x: 580, y: 120, size: 150, speed: 0.07},
      {x: 920, y: 75, size: 100, speed: 0.11}
    ];
    this.confetti = [];
    this.time = 0;
  }

  drawBackground() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Cielo azul estadio
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.62);
    grad.addColorStop(0, "#1e40af");
    grad.addColorStop(1, "#60a5fa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Nubes lentas
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    this.clouds.forEach(c => {
      const cx = (c.x + this.time * c.speed) % (w + 400) - 150;
      ctx.beginPath();
      ctx.ellipse(cx, c.y, c.size, c.size * 0.58, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 45, c.y - 22, c.size * 0.72, c.size * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    // Césped verde fútbol
    ctx.fillStyle = "#166534";
    ctx.fillRect(0, h * 0.58, w, h * 0.42);

    // Líneas del campo FIJAS (sin movimiento)
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = "rgba(255,255,255,0.5)";

    // Bordes y líneas horizontales
    ctx.beginPath();
    ctx.moveTo(30, h*0.63);
    ctx.lineTo(w-30, h*0.63);
    ctx.moveTo(30, h*0.73);
    ctx.lineTo(w-30, h*0.73);
    ctx.moveTo(30, h*0.68);
    ctx.lineTo(w-30, h*0.68);

    // Línea central
    ctx.moveTo(w/2, h*0.63);
    ctx.lineTo(w/2, h*0.73);

    // Círculo central
    ctx.arc(w/2, h*0.68, 75, 0, Math.PI * 2);
    ctx.stroke();

    // Áreas
    ctx.strokeRect(55, h*0.63, 160, h*0.10);
    ctx.strokeRect(w-215, h*0.63, 160, h*0.10);

    ctx.shadowBlur = 0;
    ctx.lineWidth = 3;

    // Porterías
    ctx.strokeRect(25, h*0.64, 22, h*0.16);
    ctx.strokeRect(w-47, h*0.64, 22, h*0.16);

    this.time += 0.8;
  }

  updateAndDrawParticles() {
    // Confetti simple pero visible
    if (Math.random() < 0.4) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * -50,
        vx: (Math.random() - 0.5) * 2.5,
        vy: 1.5 + Math.random() * 2.5,
        color: ["#ef4444","#3b82f6","#eab308","#22c55e","#a855f7"][Math.floor(Math.random()*5)],
        size: 7 + Math.random() * 8,
        life: 120
      });
    }

    for (let i = this.confetti.length - 1; i >= 0; i--) {
      const p = this.confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.09;
      p.life--;

      this.ctx.save();
      this.ctx.globalAlpha = p.life / 120;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size * 0.6);
      this.ctx.restore();

      if (p.life <= 0) this.confetti.splice(i, 1);
    }
  }
}

// Exponer para el juego
window.FutbolBackground = FutbolBackground;
