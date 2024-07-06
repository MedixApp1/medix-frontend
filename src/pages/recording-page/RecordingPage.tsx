import "./style.scss";
import { useState, useRef, useEffect } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import TranscriptItems from "./TranscriptItems";
import NoteItem from "./NoteItem";
import useNewEncounter, { Note } from "../../hooks/useNewEncounter";
import showToast from "../../utils/showToast";
import html2pdf from "html2pdf.js";
import { handleCopy } from "../../utils/handleCopy";
import PatientInstructions from "../../components/dashboard/patient-instructions/PatientInstructions";
import useTimer from "../../hooks/useTimer";
import useWhisper from "@chengsokdara/use-whisper";
import useRealTimeTranscript from "@/hooks/useRealTimeTranscript";

// interface AudioUploadResponse {
// 	success: boolean;
// 	data: {
// 		name: string;
// 		size: string;
// 		mimeType: string;
// 		url: string;
// 		publicUrl: string;
// 	};
// 	message: string;
// }

// interface AppointmentResponse {
// 	success: boolean;
// 	data: {
// 		transcript: string[];
// 		appointmentId: string;
// 		_id: string;
// 		createdAt: string;
// 		updatedAt: string;
// 		__v: number;
// 	};
// 	message: string;
// }

type AdudioProps = {
	transcriptData: string[];
	startRecording: ()=>void;
	noteData: Note | null;
	generateNote: ()=>Promise<void>;
	generateInstructions: ()=>Promise<void>;
}

function AudioIndicator(props: AdudioProps) {
	const { currentEncounter, setCurrentEncounter } = useNewEncounter();
	const { startTimer, resetTimer, elapsedTime } = useTimer();
	// const [blob, setBlob] = useState<Blob>();

	const recorder = useAudioRecorder();
	const audioRef = useRef<HTMLAudioElement>(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isLoading] = useState(false);
	const [intervalID, _] = useState<NodeJS.Timeout>();

	const { transcript, stopRecording } = useWhisper({
		apiKey: import.meta.env.VITE_OPENAI_API_KEY, // YOUR_OPEN_AI_TOKEN
		streaming: true,
		timeSlice: 1_000,
		removeSilence: true,
		nonStop: true,
		mode: "transcriptions",
		autoTranscribe: true,
		whisperConfig: {
			prompt:
				'You are an assistant for doctors. You receive an audio recording of conversation between patient and doctor and generate an array of text separated by commas, based on this schema: ["Hi doctor", "I am feeling unwell", "When did it start?"] Extract relevant information from the transcript. If a section has no relevant information, leave it as an empty string. Use appropriate medical terminology.',
			response_format: "verbose_json",
		}, // 1 second
	});



	// const getDataONTranscript = async (blob: Blob) => {
	// 	const base64 = await new Promise<string | ArrayBuffer | null>(
	// 		(resolve) => {
	// 			const reader = new FileReader();
	// 			reader.onloadend = () => resolve(reader.result);
	// 			reader.readAsDataURL(blob!);
	// 		}
	// 	);
	// 	const body = JSON.stringify({ file: base64, model: "whisper-1" });
	// 	const headers = { "Content-Type": "application/json" };
	// 	const resp = await fetch("/api/whisper", {
	// 		headers,
	// 		body,
	// 	});

	// 	const result = await resp.text();
	// 	console.log("result", result);
	// 	// you must return result from your server in Transcript format
	// 	return {
	// 		blob: blob,
	// 		text: result,
	// 	};
	// };

	// const addNewTranscript = () => {
	// 	const newItnterval = setInterval(() => {
	// 		console.log("settng ttanscript data");
	// 		setCurrentEncounter({ transcript: transcriptData });
	// 	}, 2000);
	// 	return newItnterval;
	// };

	useEffect(() => {
		setCurrentEncounter({transcript: props.transcriptData})
	}, [props.transcriptData]);

	useEffect(() => {
		setCurrentEncounter({note: props.noteData!})
		console.log("noteDAa",props.noteData)
	}, [props.noteData]);


	const playAudio = async () => {

		startTimer();
		console.log(transcript);
		// await startRecording();
		props.startRecording();

		// currentTranscipt?.push(transcript.text!);
		// setCurrentEncounter({ transcript: currentTranscipt });
		// setIntervalID(addNewTranscript());
		setIsPlaying(true);
	};

	const pauseAudio = async () => {
		setIsPlaying(false);
		stopRecording();
		resetTimer();
		// await sendAudioToSever();
		await props.generateNote();
		await props.generateInstructions()
		clearInterval(intervalID);
	};

	return (
		<div className="audio__indicator">
			{currentEncounter?.mediaLink && (
				<audio
					style={{ display: "none" }}
					ref={audioRef}
					onPause={pauseAudio}
					onPlay={playAudio}
					src={currentEncounter?.mediaLink}
					controls
				></audio>
			)}
			<div style={{ display: "none" }}>
				<AudioRecorder
					// onRecordingComplete={setBlob}
					recorderControls={recorder}
				/>
			</div>
			<div className="live__visualizer">
				{recorder.mediaRecorder && (
					<LiveAudioVisualizer
						mediaRecorder={recorder.mediaRecorder}
						width={200}
						height={75}
					/>
				)}
			</div>

			<p>{elapsedTime}</p>
			{!isPlaying ? (
				<button disabled={isLoading} onClick={playAudio}>
					Record encounter
				</button>
			) : (
				<button disabled={isLoading} onClick={pauseAudio}>
					Generate Note
				</button>
			)}
		</div>
	);
}

function RecordingPage() {
	const [currentTab, setCurrentTab] = useState<
		"transcript" | "instruction" | "note"
	>("transcript");
	const {
		transcriptData,
		noteData,
		patientNote,
		generateNote,
		startRecording,
		generatePatientInstructions
	} = useRealTimeTranscript();

	const [showOptions, setShowOptions] = useState(false);
	const { currentEncounter, setCurrentEncounter } = useNewEncounter();

	const [isLoadingNote, setIsLoadingNote] = useState(false);

	const getEncounterNote = async () => {
		try {
			setIsLoadingNote(true);
			setCurrentEncounter({ note: undefined });
			await generateNote();
			setCurrentEncounter({ note: noteData! });
		} catch (error) {
			if (error instanceof Error) {
				console.log(error);
				showToast.error(error.message);
			}
			console.log(error);
		} finally {
			setIsLoadingNote(false);
		}
	};

	const generateNotePdf = () => {
		if (!currentEncounter?.note)
			return showToast.error("You don't have not generated a Note");
		const element = document.getElementById("note-item");
		var opt = {
			margin: 1,
			filename: "myfile.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
			pagebreak: { mode: ["avoid-all", "css", "legacy"] },
		};
		// New Promise-based usage:
		html2pdf().set(opt).from(element).save();
	};

	const emailToPatient = () => {
		if (!currentEncounter?.patientInstructions?.messageFromDoctor)
			return showToast.error("You dont have any patient Instructions");
		const message = `
            Doctor Message
          \n
              - ${currentEncounter?.patientInstructions?.messageFromDoctor}
            `;

		const medicationContent =
			currentEncounter?.patientInstructions?.medication.map(
				(item) => `- ${item.action} ${item.details}\n`
			);

		const medications = `
    Medication
  \n
      - ${medicationContent}
    `;

		const followUp = `
    Medication
  \n
      - ${medicationContent}
    `;

		const lifeContent =
			currentEncounter?.patientInstructions?.lifestyleChanges.map(
				(item) => `- ${item.action} ${item.details}\n`
			);

		const lifeChanges = `
    Life Style Changes
  \n
      - ${lifeContent}
    `;

		const instructionContent =
			currentEncounter?.patientInstructions?.otherInstructions.map(
				(item) => `- ${item.action} ${item.details}\n`
			);

		const otherInstruction = `
  Life Style Changes
\n
    - ${instructionContent}
  `;

		const mailToLink = `mailto:${"email"}?subject=${encodeURIComponent(
			"Patient Instruction"
		)}&body=${encodeURIComponent(
			`${message} ${medications} ${followUp} ${lifeChanges} ${otherInstruction}`
		)}`;
		window.location.href = mailToLink;
	};

	const copyTranscript = async () => {
		if (!currentEncounter?.transcript) return;
		let body = "";
		for (let i = 0; i < currentEncounter!.transcript!.length; i++) {
			body += `${currentEncounter!.transcript!}\n\n`;
		}
		await handleCopy(body);
	};

	const copyNote = async () => {
		if (!currentEncounter?.note) return;
		let body = "";
		body += `${currentEncounter.note.title}\n\n\n`;
		for (let i = 0; i < currentEncounter!.note!.sections.length; i++) {
			body += `${currentEncounter!.note!.sections[i]?.text}\n\n`;
		}
		await handleCopy(body);
	};

	const handleCurrentTab = (tab: "transcript" | "instruction" | "note") => {
		if (currentTab == tab) return;
		if (!currentEncounter?.transcript) {
			return showToast.error("You have not generated a transcript");
		}
		setCurrentTab(tab);
	};

	const generatePatientPDf = () => {
		if (!currentEncounter?.patientInstructions?.medication)
			return showToast.error("No patient Instuction");
		const element = document.getElementById("patient-item");
		var opt = {
			margin: 1,
			filename: "myfile.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2 },
			jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
			pagebreak: { mode: ["avoid-all", "css", "legacy"] },
		};
		// New Promise-based usage:
		html2pdf().set(opt).from(element).save();
	};

	const tabOptions = {
		transcript: [
			{
				text: "Copy Transcript",
				icon: "/icons/copy.svg",
				action: copyTranscript,
			},
		],
		instruction: [
			{
				text: "Generate PDF",
				icon: "/icons/pdf.svg",
				action: generatePatientPDf,
			},
			{
				text: "Send To Patient",
				icon: "/icons/send.svg",
				action: emailToPatient,
			},
		],
		note: [
			{
				text: "Copy Note",
				icon: "/icons/copy.svg",
				action: copyNote,
			},
			{
				text: "Regenerate Note",
				icon: "/icons/cycle.svg",
				action: getEncounterNote,
			},
			{
				text: "Generate PDF",
				icon: "/icons/pdf.svg",
				action: generateNotePdf,
			},
		],
	} as const;

	console.log("patientNote", patientNote)

	const renderActiveTab = () => {
		if (currentTab == "transcript") {
			return <TranscriptItems />;
		}
		if (currentTab == "instruction") {
			return <PatientInstructions />;
		}
		if (currentTab == "note") {
			return (
				<NoteItem
					generateNote={getEncounterNote}
					isLoading={isLoadingNote}
				/>
			);
		}
		return <TranscriptItems />;
	};
	return (
		<div className="recording__page">
			<div className="record__visual">
				<img src="/icons/mic.svg" alt="" />
				<AudioIndicator
					transcriptData={transcriptData}
					startRecording={startRecording}
					noteData={noteData}
					generateNote={generateNote}
					generateInstructions={generatePatientInstructions}
				/>
			</div>
			<div className="record__data">
				<div className="tabs">
					<p
						className={currentTab === "transcript" ? "active" : ""}
						onClick={() => handleCurrentTab("transcript")}
					>
						Transcript
					</p>
					<p
						className={currentTab === "note" ? "active" : ""}
						onClick={() => handleCurrentTab("note")}
					>
						Note
					</p>
					<p
						className={currentTab === "instruction" ? "active" : ""}
						onClick={() => handleCurrentTab("instruction")}
					>
						Patient Instruction
					</p>
				</div>
				<div className="tab__content">
					{renderActiveTab()}
					<div className="options__btn">
						{showOptions && (
							<div className="encounter__options">
								{tabOptions[currentTab].map((item, index) => (
									<div key={index} onClick={() => item.action()}>
										<img src={item.icon} alt="" />
										<p>{item.text}</p>
									</div>
								))}
							</div>
						)}
						<div className="opt">
							<img src="/icons/menu.svg" alt="" />
							<p>Options</p>
						</div>
						<button onClick={() => setShowOptions(!showOptions)}>
							<img
								src={`/icons/${
									showOptions ? "up-arrow" : "down-arrow"
								}.svg`}
								alt=""
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
export default RecordingPage;
