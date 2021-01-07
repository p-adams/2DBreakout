import { atom, useRecoilState, SetterOrUpdater } from "recoil";
const gameScores = atom({
    key: "scores",
    default: { wins: 0, losses: 0 }
});

interface UseGameScores {
    scores: { wins: number; losses: number };
    setScores: SetterOrUpdater<{ wins: number; losses: number }>;
}
function useGameScores(): UseGameScores {
    const [scores, setScores] = useRecoilState(gameScores);
    return {
        scores,
        setScores
    };
}

export default useGameScores;
