import { create } from 'zustand';
import { NoteSection } from '../pages/recording-page/NoteItem';

export type EncounterType = {
	mediaLink: string;
	transcript: string[];
	note: NoteSection[];
	instructions: string[];
};

interface CurrentEncounterState {
	currentEncounter: Partial<EncounterType> | null;
	setCurrentEncounter: (encounter: Partial<EncounterType>) => void;
	resetCurrentEncounter: ()=>void;
}

const initialState = {
	currentEncounter: null
};

const useNewEncounter = create<CurrentEncounterState>()((set) => ({
	...initialState,
	setCurrentEncounter: (encounter) => set((state) => ({ currentEncounter: {...state, ...encounter} })),
	resetCurrentEncounter:()=>set(()=>({currentEncounter: null}))
}));

export default useNewEncounter;
