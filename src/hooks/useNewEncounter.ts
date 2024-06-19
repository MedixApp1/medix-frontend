import { create } from 'zustand';

interface Note {
	title: string;
	sections: Section[];
 }
 
 interface Section {
	key: string;
	title: string;
	text: string;
	content: string[];
	_id: string;
 }
 
 interface PatientInstructions {
	messageFromDoctor: string;
	medication: {
	  action: string;
	  details: string;
	  _id: string;
	}[];
	lifestyleChanges: {
		action: string;
		details: string;
		_id: string;
	 }[];
	followUp: {
	  action: string;
	  details: string;
	  _id: string;
	}[];
	otherInstructions: {
	  action: string;
	  details: string;
	  _id: string;
	}[];
 }
 
 export interface EncounterType {
	note: Note;
	patientInstructions: PatientInstructions;
	_id: string;
	transcript: string[];
	memeType: string;
	fileName:string;
	createdAt: string;
	updatedAt: string;
	mediaLink: string;
	appointmentId:string;
	__v: number;
 }

 export type ResponseType<T> = {
	data: T;
	message: string;
	success: boolean;
 };

 

// export type EncounterType = {
// 	mediaLink: string;
// 	transcript: string[];
// 	note: NoteSection[];
// 	instructions: string[];
// 	appointemntId: string;
// };

interface CurrentEncounterState {
	currentEncounter: Partial<EncounterType> | null;
	allEncounters: EncounterType[];
	setAllEncounters: (encounters: EncounterType[]) => void;
	setCurrentEncounter: (encounter: Partial<EncounterType>) => void;
	resetCurrentEncounter: ()=>void;
}

const initialState = {
	currentEncounter: null,
	allEncounters: [],
};

const useNewEncounter = create<CurrentEncounterState>()((set) => ({
	...initialState,
	setAllEncounters:(encounters)=> set(()=> ({allEncounters: encounters})),
	setCurrentEncounter: (encounter) => set((state) => ({ currentEncounter: {...state.currentEncounter, ...encounter} })),
	resetCurrentEncounter:()=>set(()=>({currentEncounter: null}))
}));

export default useNewEncounter;
