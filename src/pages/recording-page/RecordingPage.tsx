import "./style.scss";
import { useState, useRef } from "react";
import { LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import TranscriptItems from "./TranscriptItems";
import NoteItem from "./NoteItem";
import useNewEncounter from "../../hooks/useNewEncounter";
import showToast from "../../utils/showToast";
import Cookies from "js-cookie";
import html2pdf from "html2pdf.js";
import { handleCopy } from "../../utils/handleCopy";
import PatientInstructions from "../../components/dashboard/patient-instructions/PatientInstructions";
import useTimer from "../../hooks/useTimer";
import { ResponseType, EncounterType } from "../../hooks/useNewEncounter";

interface AudioUploadResponse {
  success: boolean;
  data: {
    name: string;
    size: string;
    mimeType: string;
    url: string;
    publicUrl: string;
  };
  message: string;
}

interface AppointmentResponse {
  success: boolean;
  data: {
    transcript: string[];
    appointmentId: string;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
}

function AudioIndicator() {
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();
  const { startTimer, resetTimer, elapsedTime } = useTimer();
  const [blob, setBlob] = useState<Blob>();
  const recorder = useAudioRecorder();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sendAudioToSever = async () => {
    console.log(blob);
    try {
      setIsLoading(true);
      if (blob) {
        showToast.loading("Uploading Audio file");
        const token = Cookies.get("doctor-token");
        const formData = new FormData();
        formData.append("file", blob);
        const resp = await fetch(
          `${import.meta.env.VITE_BASE_URL}/appointment/audio/upload`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );
        const result = (await resp.json()) as AudioUploadResponse;
        if (!resp.ok) {
          return showToast.error(result.message);
        }
        showToast.loading("Generating Transcript");
        console.log(result);
        setCurrentEncounter({ mediaLink: result.data.publicUrl });
        const fileUploadResp = await fetch(
          `${import.meta.env.VITE_BASE_URL}/appointment`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              url: result.data.url,
              mimeType: result.data.mimeType,
            }),
          }
        );

        const fileUploadResult =
          (await fileUploadResp.json()) as AppointmentResponse;
        if (!resp.ok) {
          return showToast.error(fileUploadResult.message);
        }
        showToast.success(fileUploadResult.message);
        console.log(fileUploadResult);
        setCurrentEncounter({
          ...fileUploadResult.data,
          memeType: result.data.mimeType,
          fileName: result.data.name,
          appointmentId: fileUploadResult.data._id,
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const playAudio = async () => {
    setIsPlaying(true);

    startTimer();
    recorder.startRecording();
    recorder.startRecording();
  };
  const pauseAudio = async () => {
    setIsPlaying(false);
    recorder.stopRecording();
    resetTimer();
    await sendAudioToSever();
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

      <p>{elapsedTime}</p>
      {!isPlaying ? (
        <button disabled={isLoading} onClick={playAudio}>
          Record encounter
        </button>
      ) : (
        <button disabled={isLoading} onClick={pauseAudio}>
          Generate Transcript
        </button>
      )}
    </div>
  );
}

function RecordingPage() {
  const [currentTab, setCurrentTab] = useState<
    "transcript" | "instruction" | "note"
  >("transcript");

  const [showOptions, setShowOptions] = useState(false);
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();

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
            country: "Nigeria",
          }),
        }
      );
      const result = (await resp.json()) as ResponseType<EncounterType>;
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
        <AudioIndicator />
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
export default RecordingPage;
