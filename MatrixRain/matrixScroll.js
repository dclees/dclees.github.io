// console.log("matrixScroll - begin");

function doMatrixRain() {
  const allSymbols =
    'ABCDEFGHIJKLMNOPQRSTUVXYZﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789:・."=*+-<>';

  let matrixRain = undefined; // the main class, draws the canvas
  let lastTime = 0; // timer - last time the update was called

  const sizeCanvas = (cv) => {
    cv.width = innerWidth;
    cv.height = innerHeight;
  };

  class MatrixRain {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.resize();
      this.dt = 0;
      this.timeToDraw = 100;
    }

    getNewCharHeight() {
      return -this.charHeight * Math.floor(12 * Math.random());
    }

    resize() {
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.charWidth = 24;
      this.font = this.charWidth + "px monospace";

      this.ctx.font = this.font;
      let metrics = this.ctx.measureText(allSymbols);
      // let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
      this.charHeight =
        metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

      const numColumns = this.width / this.charWidth;
      this.columns = [];
      for (let n = 0; n < numColumns; n++) {
        const ch = { yAt: this.getNewCharHeight() };
        this.columns.push(ch);
      }
    }

    update(dt) {
      dt = Math.min(20, dt);
      this.dt += dt;
      let bDraw = this.dt > this.timeToDraw;
      if (bDraw) {
        this.dt -= this.timeToDraw;
        this.columns.forEach((column) => {
          column.yAt += this.charHeight;
          if (column.yAt > this.height) {
            column.yAt = this.getNewCharHeight();
          }
        });
      }
      return bDraw;
    }

    draw() {
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      this.ctx.fillRect(0, 0, this.width, this.height);

      this.ctx.fillStyle = "#00aa00";
      this.ctx.textAlign = "center";
      this.ctx.font = this.font;
      let xAt = 0.5 * this.charWidth;
      this.columns.forEach((column) => {
        const numChs = allSymbols.length;
        const ch = allSymbols.charAt(Math.floor(numChs * Math.random()));

        this.ctx.fillText(ch, xAt, column.yAt);
        xAt += this.charWidth;
      });
    }
  }

  const animUpdate = (time) => {
    // const cv = document.getElementById("canvasMatrixRain");

    const deltaTime = time - lastTime;
    lastTime = time;

    if (matrixRain.update(deltaTime)) {
      matrixRain.draw();
    }

    requestAnimationFrame(animUpdate);
    // console.log("frame");
  };

  getCanvas = () => {
    return document.getElementById("canvasMatrixRain");
  };

  const onResize = () => {
    const cv = getCanvas();
    sizeCanvas(cv);
    matrixRain.resize(cv);
  };

  const cv = getCanvas();
  window.onresize = onResize;

  sizeCanvas(cv);
  matrixRain = new MatrixRain(cv);
  animUpdate(0);
}

window.onload = doMatrixRain;
