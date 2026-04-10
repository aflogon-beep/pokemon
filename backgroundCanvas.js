// backgroundCanvas.js - Motor genérico de fondos animados

class BackgroundCanvas {
  constructor(canvasId, scenario) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = canvasId;
      this.canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none;";
    }
    this.ctx = this.canvas.getContext('2d');
    this.scenario = scenario;
    this.width = 0;
    this.height = 0;
    this.particles = [];
    this.time = 0;
    this.isMobile = /Mobi|Android/i.test(navigator.userAgent);
    this.maxParticles = this.isMobile ? 35 : 70;
    
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    const arena = document.getElementById('arena');
    if (!arena) return;
    this.width = arena.offsetWidth;
    this.height = arena.offsetHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  start() {
    this.resize();
    this.animate();
  }

  animate() {
    this.time += 0.016; // ~60fps
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBackground();
    this.updateAndDrawParticles();
    requestAnimationFrame(() => this.animate());
  }

  // Métodos que sobreescribiremos por escenario
  drawBackground() {}
  updateAndDrawParticles() {}
}

// Exportamos para usarlo en otros archivos
window.BackgroundCanvas = BackgroundCanvas;
