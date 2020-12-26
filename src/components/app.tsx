import { FunctionalComponent, h } from "preact";
import { RecoilRoot } from "recoil";
const App: FunctionalComponent = () => {
    return (
        <RecoilRoot>
            <div id="app">
                <h1>2D Breakout</h1>
            </div>
        </RecoilRoot>
    );
};

export default App;
