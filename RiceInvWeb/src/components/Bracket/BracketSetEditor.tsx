import { type Dispatch, type SetStateAction } from "react"
import type { TournamentSet } from "../../data/types";

interface BracketSetEditorProps {
    editorData : TournamentSet;
    setEditorData : Dispatch<SetStateAction<TournamentSet>>;
    toggleEditor : boolean;
    setToggleEditor : Dispatch<SetStateAction<boolean>>;
    allSets : TournamentSet[];
}

export const BracketSetEditor = ({} : BracketSetEditorProps) => {
    return <div></div>
}