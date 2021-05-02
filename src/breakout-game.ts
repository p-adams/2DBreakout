import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

@customElement("breakout-game")
export class BreakoutGame extends LitElement {
  static styles = css`
    canvas {
      background: #eee;
    }
  `;

  @query("canvas")
  _canvas!: HTMLCanvasElement;
  firstUpdated() {
    const ctx = this._canvas.getContext("2d");
    ctx!.fillStyle = "green";
    ctx!.fillRect(10, 10, 150, 100);
  }

  render() {
    return html`<canvas width="480" height="320"></canvas>`;
  }
}
