class FutbolBackground extends BackgroundCanvas {
  constructor() {
    super();
    this.clouds = [
      {x: 120, y: 85, size: 130, speed: 0.10},
      {x: 550, y: 115, size: 155, speed: 0.07},
      {x: 920, y: 70, size: 105, speed: 0.13}
    ];
    this.confetti = [];
    this.time = 0;
  }

  drawBackground() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Cielo
    const grad = ctx.createLinearGradient(0, 0, 0, h*0.62);
    grad.addColorStop(0, "#1e40af");
    grad.addColorStop(1, "#60a5fa");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Nubes
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    this.clouds.forEach(c => {
      const cx = (c.x + this.time * c.speed) % (w + 400) - 180;
      ctx.beginPath();
      ctx.ellipse(cx, c.y, c.size, c.size*0.58, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + 50, c.y - 25, c.size*0.75, c.size*0.48, 0, 0, Math.PI*2);
      ctx.fill();
    });

    // Césped
    ctx.fillStyle = "#166534";
    ctx.fillRect(0, h*0.58, w, h*0.42);

    // Líneas del campo (FIJAS)
    ctx.strokeStyle = "#f1f5f9";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255,255,255,0.6)";

    ctx.beginPath();
    ctx.moveTo(40, h*0.63); ctx.lineTo(w-40, h*0.63);
    ctx.moveTo(40, h*0.73); ctx.lineTo(w-40, h*0.73);
    ctx.moveTo(40, h*0.68); ctx.lineTo(w-40, h*0.68);
    ctx.moveTo(w/2, h*0.63); ctx.lineTo(w/2, h*0.73);
    ctx.arc(w/2, h*0.68, 72, 0, Math.PI*2);
    ctx.stroke();

    // Áreas y porterías
    ctx.strokeRect(60, h*0.63, 150, h*0.11);
    ctx.strokeRect(w-210, h*0.63, 150, h*0.11);
    ctx.strokeRect(28, h*0.635, 22, h*0.155);
    ctx.strokeRect(w-50, h*0.635, 22, h*0.155);

    ctx.shadowBlur = 0;
    this.time += 0.9;
  }

  updateAndDrawParticles() {
    if (Math.random() < 0.35) {
      this.confetti.push({
        x: Math.random() * this.canvas.width,
        y: -30,
        vx: (Math.random()-0.5)*2.2,
        vy: 1.8 + Math.random()*2.8,
        color: ["#ef4444","#3b82f6","#eab308","#22c55e","#a855f7"][Math.floor(Math.random()*5)],
        size: 6 + Math.random()*9,
        life: 110
      });
    }

    for (let i = this.confetti.length-1; i >= 0; i--) {
      const p = this.confetti[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.1;
      p.life--;

      this.ctx.globalAlpha = p.life / 110;
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(p.x, p.y, p.size, p.size*0.55);

      if (p.life <= 0) this.confetti.splice(i,1);
    }
    this.ctx.globalAlpha = 1;
  }
}
