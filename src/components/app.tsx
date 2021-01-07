import { FunctionalComponent, h } from "preact";
import AppCanvas from "./AppCanvas";
import { RecoilRoot } from "recoil";
const App: any = () => {
    return (
        <RecoilRoot>
            <AppCanvas />
        </RecoilRoot>
    );
};

export default App;
