import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("breakout-game")
export class BreakoutGame extends LitElement {
  static styles = css`
    canvas {
      background: #eee;
    }
  `;
  static dx = 2;
  static dy = -2;
  static ballRadius = 10;
  static paddleHeight = 10;
  static paddleWidth = 75;
  // bricks
  static brickRowCount = 3;
  static brickColumnCount = 5;
  static brickWidth = 75;
  static brickHeight = 20;
  static brickPadding = 10;
  static brickOffsetTop = 30;
  static brickOffsetLeft = 30;

  ctx!: CanvasRenderingContext2D | null;
  width: number = 0;
  height: number = 0;
  x: number = 50;
  y: number = 50;
  paddleX: number = 0;
  rightPressed: boolean = false;
  leftPressed: boolean = false;
  bricks: { x: number; y: number; status: number }[][] = [];
  score: number = 0;
  constructor() {
    super();
  }

  @query("canvas")
  _canvas!: HTMLCanvasElement;

  firstUpdated() {
    this._canvas.focus();
    this.ctx = this._canvas.getContext("2d");
    this.width = this._canvas.width;
    this.height = this._canvas.height;
    this.x = this.width / 2;
    this.y = this.height - 30;
    this.paddleX = (this.width - BreakoutGame.paddleWidth) / 2;
    for (let c = 0; c < BreakoutGame.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < BreakoutGame.brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: 1 };
      }
    }
  }

  async performUpdate() {
    await new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (this._canvas) {
          const gameOver = this.draw(interval);
          if (gameOver) {
            document.location.reload();
            clearInterval(interval);
          }
        }
        return resolve();
      }, 10);
    });
    super.performUpdate();
  }

  drawScore() {
    this.ctx!.font = "16px Arial";
    this.ctx!.fillStyle = "#0095DD";
    this.ctx?.fillText(`Score: ${this.score}`, 8, 20);
  }

  collisionDetection(interval: number) {
    for (let c = 0; c < BreakoutGame.brickColumnCount; c++) {
      for (let r = 0; r < BreakoutGame.brickRowCount; r++) {
        const b = this.bricks[c][r];
        if (b.status === 1) {
          if (
            this.x > b.x &&
            this.x < b.x + BreakoutGame.brickWidth &&
            this.y > b.y &&
            this.y < b.y + BreakoutGame.brickHeight
          ) {
            BreakoutGame.dy = -BreakoutGame.dy;
            b.status = 0;
            this.score++;
            if (
              this.score ===
              BreakoutGame.brickRowCount * BreakoutGame.brickColumnCount
            ) {
              alert("YOU WIN!");
              document.location.reload();
              clearInterval(interval);
            }
          }
        }
      }
    }
  }

  drawBricks() {
    for (let c = 0; c < BreakoutGame.brickColumnCount; c++) {
      for (let r = 0; r < BreakoutGame.brickRowCount; r++) {
        if (this.bricks[c][r].status === 1) {
          const brickX =
            c * (BreakoutGame.brickWidth + BreakoutGame.brickPadding) +
            BreakoutGame.brickOffsetLeft;
          const brickY =
            r * (BreakoutGame.brickHeight + BreakoutGame.brickPadding) +
            BreakoutGame.brickOffsetTop;
          this.bricks[c][r].x = brickX;
          this.bricks[c][r].y = brickY;
          this.ctx?.beginPath();
          this.ctx?.rect(
            brickX,
            brickY,
            BreakoutGame.brickWidth,
            BreakoutGame.brickHeight
          );
          this.ctx!.fillStyle = "#0095DD";
          this.ctx?.fill();
          this.ctx?.closePath();
        }
      }
    }
  }

  drawBall() {
    this.ctx?.beginPath();
    this.ctx?.arc(this.x, this.y, BreakoutGame.ballRadius, 0, Math.PI * 2);
    this.ctx!.fillStyle = "#0095DD";
    this.ctx?.fill();
    this.ctx?.closePath();
  }

  drawPaddle() {
    this.ctx?.beginPath();
    this.ctx?.rect(
      this.paddleX,
      this.height - BreakoutGame.paddleHeight,
      BreakoutGame.paddleWidth,
      BreakoutGame.paddleHeight
    );
    this.ctx!.fillStyle = "#0095DD";
    this.ctx?.fill();
    this.ctx?.closePath();
  }

  draw(interval: number) {
    this.ctx?.clearRect(0, 0, this.width, this.height);
    this.drawBricks();
    this.drawBall();
    this.drawPaddle();
    this.drawScore();
    this.collisionDetection(interval);
    // left-right collision detection
    if (
      this.x + BreakoutGame.dx > this._canvas.width - BreakoutGame.ballRadius ||
      this.x + BreakoutGame.dx < BreakoutGame.ballRadius
    ) {
      BreakoutGame.dx = -BreakoutGame.dx;
    }
    if (this.y + BreakoutGame.dy < BreakoutGame.ballRadius) {
      BreakoutGame.dy = -BreakoutGame.dy;
    } else if (
      this.y + BreakoutGame.dy >
      this.height - BreakoutGame.ballRadius
    ) {
      if (
        this.x > this.paddleX &&
        this.x < this.paddleX + BreakoutGame.paddleWidth
      ) {
        BreakoutGame.dy = -BreakoutGame.dy;
      } else {
        alert("Game Over");
        return 1;
      }
    }

    if (this.rightPressed) {
      this.paddleX += 7;
      // prevent paddle from leaving right
      if (this.paddleX + BreakoutGame.paddleWidth > this.width) {
        this.paddleX = this.width - BreakoutGame.paddleWidth;
      }
    } else if (this.leftPressed) {
      // prevent paddle from leaving left
      this.paddleX -= 7;
      if (this.paddleX < 0) {
        this.paddleX = 0;
      }
    }

    this.x += BreakoutGame.dx;
    this.y += BreakoutGame.dy;
    return 0;
  }
  _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.leftPressed = true;
    }
  }
  _handleKeyup(e: KeyboardEvent) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      this.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      this.leftPressed = false;
    }
  }
  render() {
    return html`<canvas
      tabindex="1"
      @keydown="${this._handleKeydown}"
      @keyup="${this._handleKeyup}"
      width="480"
      height="320"
    ></canvas>`;
  }
}
