import "./style.scss";
import { useState } from "react";
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

function AudioIndicator() {
  const [blob, setBlob] = useState<Blob>();
  const recorder = useAudioRecorder();
  recorder.startRecording()

  return (
    <div className="audio__indicator">
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

function RecordingPage() {
  return (
    <div className="recording__page">
      <div className="record__visual">
        <img src="/icons/mic.svg" alt="" />
        <AudioIndicator />
        <p>23: 21</p>
      </div>
      <div className="record__data">
        <div className="tabs">
          <p className="active">Transcript</p>
          
        </div>
      
      </div>
    </div>
  );
}
export default RecordingPage;
