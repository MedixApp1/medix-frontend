import "./style.scss";
import { useEffect, useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

import TranscriptItems from "../recording-page/TranscriptItems";
import NoteItem from "../recording-page/NoteItem";
import useRealTimeTranscript from "../../hooks/useRealTimeTranscript";
import useNewEncounter from "../../hooks/useNewEncounter";
import Cookies from "js-cookie";
import showToast from "../../utils/showToast";
import PatientInstructions from "../../components/dashboard/patient-instructions/PatientInstructions";

// const obj = {
//   id: "90656c3e-af12-41a0-bf1e-900dc70c9d2a",
//   text: "Of having ads related diseases so yeah that's all i have for you",
//   speaker: "unspecified",
//   start_offset_ms: 72670,
//   end_offset_ms: 78950,
//   is_final: false,
//   object: "transcript_item",
// };

// const generatedNote = [
//   {
//     key: "SOCIAL_HISTORY",
//     title: "Social history",
//     text: "- Recommended to engage in exercises for mental and physical health\n- Advised to avoid alcohol and smoking to prevent diseases like cancer and liver problems\n- Suggested to do exercises at least two times a day to strengthen muscles and reduce risk of heart diseases",
//     content: [
//       "Recommended to engage in exercises for mental and physical health",
//       "Advised to avoid alcohol and smoking to prevent diseases like cancer and liver problems",
//       "Suggested to do exercises at least two times a day to strengthen muscles and reduce risk of heart diseases",
//     ],
//   },
//   {
//     key: "CURRENT_MEDICATIONS",
//     title: "Current medications",
//     text: "Medication to be taken three times a day: morning, afternoon, and night",
//     content: [
//       "Medication to be taken three times a day: morning, afternoon, and night",
//     ],
//   },
//   {
//     key: "PLAN",
//     title: "Plan",
//     text: "- Engage in mental healing exercises like meditation\n- Regular physical exercise, at least twice a day\n- Avoidance of alcohol and smoking",
//     content: [
//       "Engage in mental healing exercises like meditation",
//       "Regular physical exercise, at least twice a day",
//       "Avoidance of alcohol and smoking",
//     ],
//   },
//   {
//     key: "PRESCRIPTION",
//     title: "Prescription",
//     text: "Medication prescribed to be taken three times a day",
//     content: ["Medication prescribed to be taken three times a day"],
//   },
// ];

// const transcriptData = Array(7).fill(obj);

function AudioIndicator() {
  const [blob, setBlob] = useState<Blob>();
  const recorder = useAudioRecorder();
  const {currentEncounter} = useNewEncounter();
  // recorder.startRecording();

  return (
    <div className="audio__indicator">
      <audio src=""></audio>
      <div style={{ display: "none" }}>
        <AudioRecorder
          onRecordingComplete={setBlob}
          recorderControls={recorder}
        />
      </div>

      {recorder.mediaRecorder && (
        <LiveAudioVisualizer
          mediaRecorder={recorder.mediaRecorder}
          width={200}
          height={75}
        />
      )}

      {blob && (
        <AudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={1}
          gap={0}
          barColor={"#f76565"}
        />
      )}

      {blob && (
        <AudioVisualizer
          blob={blob}
          width={500}
          height={75}
          barWidth={3}
          gap={2}
          barColor={"lightblue"}
        />
      )}
    </div>
  );
}

function EncounterOverview() {
  const { startRecording, transcriptData: recordingData } =
    useRealTimeTranscript();
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();

  const [currentTab, setCurrentTab] = useState<
    "transcript" | "instruction" | "note"
  >("transcript");

  const renderActiveTab = () => {
    if (currentTab == "transcript") {
      return <TranscriptItems />;
    }
    if (currentTab == "instruction") {
      return <PatientInstructions />;
    }
    if (currentTab == "note") {
      return <NoteItem  />;
    }
    return <TranscriptItems />;
  };


  return (
    <div className="recording__page">
      <div className="record__visual">
        <img src="/icons/mic.svg" alt="" />

        <AudioIndicator />
        <p>00 : 23 : 21</p>
        <button onClick={startRecording}>Play Recording</button>
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
        <div className="tab__content">{renderActiveTab()}</div>
      </div>
    </div>
  );
}
export default EncounterOverview;
