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
  ctx: any;
  width: number = 0;
  height: number = 0;
  x: number = 50;
  y: number = 50;
  paddleX: number = 0;
  rightPressed: boolean = false;
  leftPressed: boolean = false;

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
  }

  async performUpdate() {
    await new Promise<void>((resolve) => {
      setInterval(() => {
        if (this._canvas) {
          this.draw();
        }
        return resolve();
      }, 10);
    });
    super.performUpdate();
  }

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, BreakoutGame.ballRadius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawPaddle() {
    this.ctx.beginPath();
    this.ctx.rect(
      this.paddleX,
      this.height - BreakoutGame.paddleHeight,
      BreakoutGame.paddleWidth,
      BreakoutGame.paddleHeight
    );
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.drawBall();
    this.drawPaddle();
    // left-right collision detection
    if (
      this.x + BreakoutGame.dx > this._canvas.width - BreakoutGame.ballRadius ||
      this.x + BreakoutGame.dx < BreakoutGame.ballRadius
    ) {
      BreakoutGame.dx = -BreakoutGame.dx;
    }
    // top-bottom collision detection
    if (
      this.y + BreakoutGame.dy >
        this._canvas.height - BreakoutGame.ballRadius ||
      this.y + BreakoutGame.dy < BreakoutGame.ballRadius
    ) {
      BreakoutGame.dy = -BreakoutGame.dy;
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
