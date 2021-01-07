import App from "./app";

import { h } from "preact";
import { atom, selector, useRecoilState } from "recoil";
let gameScores = atom({
    key: "gameScores",
    default: { win: 0, loss: 0 }
});

function AppCanvas({ width = 480, height = 320 }) {
    let [score, setScore] = useRecoilState(gameScores);
    let { win, loss } = score;
    return <canvas width={width} height={height} />;
}

export default AppCanvas;
