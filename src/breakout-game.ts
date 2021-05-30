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
  ctx: any;
  width: number = 0;
  height: number = 0;
  x: number = 50;
  y: number = 50;

  @query("canvas")
  _canvas!: HTMLCanvasElement;

  firstUpdated() {
    this.ctx = this._canvas.getContext("2d");
    this.width = this._canvas.width;
    this.height = this._canvas.height;
    this.x = this.width / 2;
    this.y = this.height - 30;
  }

  async performUpdate() {
    await new Promise<void>((resolve) => {
      setInterval(() => {
        if (this._canvas) {
          this.draw({ x: this.x, y: this.y });
        }
        return resolve();
      }, 10);
    });
    super.performUpdate();
  }

  draw({ x, y }: { x?: number; y?: number }) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();
    this.ctx.arc(x, y, 10, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
    this.x += BreakoutGame.dx;
    this.y += BreakoutGame.dy;
  }

  render() {
    return html`<canvas width="480" height="320"></canvas>`;
  }
}
