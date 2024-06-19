import "./style.scss";
import { useRef, useState } from "react";
import {  LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import TranscriptItems from "../recording-page/TranscriptItems";
import NoteItem from "../recording-page/NoteItem";
import useNewEncounter from "../../hooks/useNewEncounter";
import showToast from "../../utils/showToast";
import PatientInstructions from "../../components/dashboard/patient-instructions/PatientInstructions";
import html2pdf from "html2pdf.js";

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast.success("Copied Successfully");
  } catch (err) {
    showToast.error("Couldn't copy");
  }
};

function AudioIndicator({
  audiosrc
}: {
  audiosrc: string;
  type: string;
}) {
  const [_, setBlob] = useState<Blob>();
  const recorder = useAudioRecorder();
  // recorder.startRecording();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [audioUrl, setAudioUrl] = useState("")
  // const visualizerRef = useRef<HTMLCanvasElement>(null)

  // useEffect(() => {
  //   audioRef.current!.src = audiosrc;
  //   getBlobFromAudio(audioRef.current!, type)
  //     .then((audioBlob) => {
  //       console.log(audioBlob);
  //       setBlob(audioBlob);
  //       // Do something with the audioBlob, e.g., upload it or create a URL
  //       const audioUrl = URL.createObjectURL(audioBlob);

  //       setAudioUrl(audioUrl)
  //       console.log("Audio URL:", audioUrl);
  //     })
  //     .catch((error) => {
  //       console.error("Error:", error);
  //     });
  // });

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


  const { currentEncounter } = useNewEncounter();
  const [showOptions, setShowOptions] = useState(false);
  const [currentTab, setCurrentTab] = useState<
    "transcript" | "instruction" | "note"
  >("transcript");

  const copyTranscript = async () => {
    let body = "";
    for (let i = 0; i < currentEncounter!.transcript!.length; i++) {
      body += `${currentEncounter!.transcript!}\n\n`;
    }
    await handleCopy(body);
  };

  // const copyNote = async () => {
  //   let body = "";
  //   const sections = Object.keys(currentEncounter?.note?.sections || {});

  //   for (let i = 0; i < currentEncounter?.note?.sections?.length!; i++) {
  //     body += `${sections[i]}\n${currentEncounter?.note?.sections[i].content}\n\n`;
  //   }
  //   await handleCopy(body);
  // };

  const regenerateNote = async (generateNewNote: () => Promise<void>) => {
    generateNewNote();
  };

  const generateNotePdf = () => {
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

    // const followUpContent = currentEncounter?.patientInstructions?.followUp.map(
    //   (item, index) => `- ${item.action} ${item.details}\n`
    // );

    const followUp = `
    Medication
  \n
      - ${medicationContent}
    `;

    const mailToLink = `mailto:${"email"}?subject=${encodeURIComponent(
      "Patient Instruction"
    )}&body=${encodeURIComponent(`${message} ${medications} ${followUp}`)}`;
    window.location.href = mailToLink;
  };


  const tabOptions = {
    transcript: [
      {
        text: "Copy Transcript",
        icon: "/icons/copy.svg",
        action: copyTranscript,
      },
      {
        text: "Save Encounter",
        icon: "/icons/save.svg",
        action: copyTranscript,
      },
    ],
    instruction: [
      {
        text: "Generate PDF",
        icon: "/icons/pdf.svg",
        action: copyTranscript,
      },
      {
        text: "Save Encounter",
        icon: "/icons/save.svg",
        action: copyTranscript,
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
        action: copyTranscript,
      },
      {
        text: "Regenerate Note",
        icon: "/icons/cycle.svg",
        action: copyTranscript,
      },
      {
        text: "Generate PDF",
        icon: "/icons/pdf.svg",
        action: generateNotePdf,
      },
      {
        text: "Save Encounter",
        icon: "/icons/save.svg",
        action: copyTranscript,
      },
    ],
  };

  const renderActiveTab = () => {
    if (currentTab == "transcript") {
      return <TranscriptItems />;
    }
    if (currentTab == "instruction") {
      return <PatientInstructions />;
    }
    if (currentTab == "note") {
      return <NoteItem generateNote={regenerateNote} />;
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
            onClick={() => setCurrentTab("transcript")}
          >
            Transcript
          </p>
          <p
            className={currentTab === "note" ? "active" : ""}
            onClick={() => setCurrentTab("note")}
          >
            Note
          </p>
          <p
            className={currentTab === "instruction" ? "active" : ""}
            onClick={() => setCurrentTab("instruction")}
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
