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
      this.timeBetweenFrames = 60;
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
        const ch = { 
          yAt: -5*this.getNewCharHeight(), 
          yPrev: -1, 
          ch: ' ',
          chPrev: ' ',
        };
        this.columns.push(ch);
      }
    }

    update(dt) {
      // dt = Math.min(20, dt);
      this.dt += dt;
      let bDraw = (this.dt > this.timeBetweenFrames);
      if (bDraw) {
        this.dt -= this.timeBetweenFrames;

        const numChs = allSymbols.length;
        this.columns.forEach((column) => {

          column.chPrev = column.ch;
          column.yPrev = column.yAt;

          column.yAt += this.charHeight;
          column.ch = allSymbols.charAt(Math.floor(numChs * Math.random()));
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

      this.ctx.textAlign = "center";
      this.ctx.font = this.font;

      this.ctx.fillStyle = "#00aa00";
      let xAt = 0.5 * this.charWidth;
      this.columns.forEach((column) => {

        this.ctx.fillText(column.chPrev, xAt, column.yPrev);
        xAt += this.charWidth;
      });

      this.ctx.fillStyle = "#aaff55";
      xAt = 0.5 * this.charWidth;
      this.columns.forEach((column) => {
        this.ctx.fillText(column.ch, xAt, column.yAt);
        xAt += this.charWidth;
      });
    }
  }

  const animUpdate = (time) => {

    const deltaTime = time - lastTime;
    lastTime = time;

    if (matrixRain.update(deltaTime)) {
      matrixRain.draw();
    }

    requestAnimationFrame(animUpdate);
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
