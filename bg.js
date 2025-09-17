const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Hero content bounds
const heroEl = document.getElementById("heroContent");
function getHeroRect() {
  return heroEl.getBoundingClientRect();
}

// Colors for Tetris blocks
const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FFB5E8"];

// Tetris shapes (4x4 grid patterns)
const shapes = [
  [[1,1,1,1]],             // I
  [[1,1],[1,1]],           // O
  [[1,1,1],[0,1,0]],       // T
  [[1,1,0],[0,1,1]],       // S
  [[0,1,1],[1,1,0]],       // Z
  [[1,0,0],[1,1,1]],       // L
  [[0,0,1],[1,1,1]]        // J
];

class TetrisPiece {
  constructor() {
    this.reset();
  }
  reset() {
    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.size = 20;
    this.x = Math.random() * (canvas.width - 100);
    this.y = -50;
    this.speed = 0.3 + Math.random() * 0.7;
  }
  update() {
    this.y += this.speed;

    // Stop blocks at hero bottom instead of falling forever
    const heroRect = getHeroRect();
    if (this.y + this.shape.length * this.size > heroRect.bottom + 50) {
      this.reset();
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    for (let r = 0; r < this.shape.length; r++) {
      for (let c = 0; c < this.shape[r].length; c++) {
        if (this.shape[r][c]) {
          let bx = this.x + c * this.size;
          let by = this.y + r * this.size;

          ctx.fillRect(bx, by, this.size, this.size);
          ctx.strokeRect(bx, by, this.size, this.size);
        }
      }
    }
  }
}

// Moving clouds
class Cloud {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * (canvas.height / 3);
    this.size = 40 + Math.random() * 40;
    this.speed = 0.2 + Math.random() * 0.3;
  }
  update() {
    this.x += this.speed;
    if (this.x > canvas.width + 100) {
      this.x = -100;
      this.y = Math.random() * (canvas.height / 3);
    }
  }
  draw() {
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.arc(this.x + this.size, this.y + 10, this.size * 0.8, 0, Math.PI * 2);
    ctx.arc(this.x - this.size, this.y + 10, this.size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }
}

const blocks = Array.from({ length: 15 }, () => new TetrisPiece());
const clouds = Array.from({ length: 5 }, () => new Cloud());

function animate() {
  // Sky gradient background
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#87CEEB"); // sky blue
  gradient.addColorStop(1, "#E0F7FA"); // lighter at bottom
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  clouds.forEach(cloud => {
    cloud.update();
    cloud.draw();
  });

  blocks.forEach(block => {
    block.update();
    block.draw();
  });

  requestAnimationFrame(animate);
}

animate();
