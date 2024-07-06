import "./style.scss";
import { useRef, useState } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import Cookies from "js-cookie";
import TranscriptItems from "../recording-page/TranscriptItems";
import NoteItem from "../recording-page/NoteItem";
import useNewEncounter from "../../hooks/useNewEncounter";
import showToast from "../../utils/showToast";
import PatientInstructions from "../../components/dashboard/patient-instructions/PatientInstructions";
import html2pdf from "html2pdf.js";
import { handleCopy } from "../../utils/handleCopy";
import { ResponseType, EncounterType } from "../../hooks/useNewEncounter";


function AudioIndicator({ audiosrc }: { audiosrc: string; type: string }) {
  const [_, setBlob] = useState<Blob>();
  const recorder = useAudioRecorder();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);


  const playAudio = () => {
    setIsPlaying(true);
    recorder.startRecording();
    audioRef.current?.play();
  };
  const pauseAudio = () => {
    setIsPlaying(false);
    recorder.stopRecording();
    audioRef.current?.pause();
  };

  return (
    <div className="audio__indicator">
      <audio
        style={{ display: "none" }}
        ref={audioRef}
        onPause={pauseAudio}
        onPlay={playAudio}
        src={audiosrc}
        controls
      ></audio>
      <div style={{ display: "none" }}>
        <AudioRecorder
          onRecordingComplete={setBlob}
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

      <p>00 : 23 : 21</p>
      {!isPlaying ? (
        <button onClick={playAudio}>Play Recording</button>
      ) : (
        <button onClick={pauseAudio}>Pause Recording</button>
      )}
    </div>
  );
}

function EncounterOverview() {
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();
  const [showOptions, setShowOptions] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "transcript" | "instruction" | "note"
  >("transcript");

  const [isLoadingNote, setIsLoadingNote] = useState(false);

  const getEncounterNote = async () => {
    try {
      setIsLoadingNote(true);
      setCurrentEncounter({ note: undefined });
      const token = Cookies.get("doctor-token");
      const resp = await fetch(
        `${import.meta.env.VITE_BASE_URL}/appointment/note`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId: currentEncounter?.appointmentId,
           
          }),
        }
        
      );
      const result = (await resp.json()) as ResponseType<EncounterType>;
      console.log(result)
      setCurrentEncounter({ note: result.data?.note });
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
      margin: 0,
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

  const renderActiveTab = () => {
    if (currentTab == "transcript") {
      return <TranscriptItems />;
    }
    if (currentTab == "instruction") {
      return <PatientInstructions />;
    }
    if (currentTab == "note") {
      return (
        <NoteItem generateNote={getEncounterNote} isLoading={isLoadingNote} />
      );
    }
    return <TranscriptItems />;
  };

  return (
    <div className="recording__page">
      <div className="record__visual">
        <img src="/icons/mic.svg" alt="" />

        <AudioIndicator
          audiosrc={currentEncounter?.mediaLink!}
          type={currentEncounter?.memeType!}
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
                src={`/icons/${showOptions ? "up-arrow" : "down-arrow"}.svg`}
                alt=""
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default EncounterOverview;
