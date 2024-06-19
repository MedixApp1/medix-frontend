import { useState } from "react";
import { sleep, msToTime } from "../utils/realtime.utils";
// import {
//   enableElementById,
//   sleep,
//   getTranscriptLocale,
//   msToTime,
//   disableAll,
//   enableAll,
//   clearNoteContent,
//   getNoteSectionStyle,
//   getNoteTemplate,
//   getNoteLanguage,
//   getPatientContext,
//   startThinking,
//   stopThinking,
// } from "../utils/nabla.utils";
import showToast from "../utils/showToast";
import toast from "react-hot-toast";

const API_KEY =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzZXJ2ZXJfVXBxMWxEajQ4WmFiIiwiY2xvdWRfcmVnaW9uIjoidXMtY2VudHJhbDEiLCJpc3MiOiJwcm9kOnNlcnZlcjpkbXMtMzU3OTZiYiIsInR5cCI6InNlcnZlcl9rZXkiLCJleHAiOjIxNDc0NzIwMDAsIm9yZ2FuaXphdGlvblN0cmluZ0lkIjoiZG1zLTM1Nzk2YmIifQ.mIWy2xGLNo96V4ZjnpxskFHumvBIFucaCYuN4vhUmiU";

type NablaState = {
  websocket: WebSocket | null;
  audioContext: AudioContext | null;
  pcmWorker: AudioWorkletNode | null;
  mediaSource: MediaStreamAudioSourceNode | null;
  mediaStream: MediaStream | null;
};

type NablaResult = {
  id: string;
  text: string;
  speaker: string;
  start_offset_ms: number;
  end_offset_ms: number;
  is_final: boolean;
  object: string;
  message: string;
  sections: NabalaNotes;
};

type NabalaNotes = {
  key: string;
  title: string;
  text: string;
};

export default function useRealTimeTranscript() {
  const [realTimeTranscript, setRealTimeTranscript] = useState<NablaState>({
    websocket: null,
    audioContext: null,
    pcmWorker: null,
    mediaSource: null,
    mediaStream: null,
  });

  const handleNablaState = (newvalue: Partial<NablaState>) => {
    setRealTimeTranscript((prev) => ({
      ...prev,
      ...newvalue,
    }));
  };

  const [isLoading, setIsLoading] = useState({
    transcript: false,
    note: false,
  });

  const [transcriptData, setTranscriptData] = useState<string[]>([]);
  const [noteData, setNoteData] = useState<NabalaNotes[]>([]);
  const [noteSections] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)

  const rawPCM16WorkerName = "raw-pcm-16-worker";

  const initializeTranscriptConnection = async () => {
    // Ideally we'd send the authentication token in an 'Authorization': 'Bearer <YOUR_TOKEN>' header.
    // But since JS WS client does not support sending additional headers,
    // we rely on this alternative authentication mechanism.
    // Keep in mind that, except for prototyping purposes, the Server API is not meant to be called from a browser
    // because an API_KEY is too sensitive to be embedded in a front-end app.
    const websocket = new WebSocket(
      "wss://api.nabla.com/v1/copilot-api/server/listen-ws",
      ["copilot-listen-protocol", "jwt-" + API_KEY]
    );

    websocket.onclose = (e) => {
      console.log(`Websocket closed: ${e.code} ${e.reason}`);
      setTranscriptData((prevTranscript) => [...prevTranscript, "-----"]);
      setIsLoading({
        transcript: false,
        note: false,
      });
    };

    websocket.onmessage = (mes) => {
      if (websocket.readyState !== WebSocket.OPEN) return;
      if (typeof mes.data === "string") {
        const data = JSON.parse(mes.data) as NablaResult;
        if (data.object === "transcript_item") {
          insertTranscriptItem(data);
        } else if (data.object === "error_message") {
          console.error(data.message);
          showToast.error(data.message);
        }
      }
    };
    return websocket;
  };

  const startRecording = async () => {
    showToast.loading("Starting Section");
   //  enableElementById("generate-btn");

    const websocket = await initializeTranscriptConnection();

    // Await websocket being open
    for (let i = 0; i < 10; i++) {
      if (websocket.readyState !== WebSocket.OPEN) {
        await sleep(100);
      } else {
        break;
      }
    }
    if (websocket.readyState !== WebSocket.OPEN) {
      // await startRecording()
      showToast.error("Websocket did not open")
      throw new Error("Websocket did not open");
    }

    if (navigator.mediaDevices) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          deviceId: "default",
          sampleRate: 16000,
          sampleSize: 16,
          channelCount: 1,
        },
        video: false,
      });
      const mediaRecorder = new MediaRecorder(mediaStream);

      setMediaRecorder(mediaRecorder);
      const audioContext = new AudioContext({ sampleRate: 16000 });
      await audioContext.audioWorklet
        .addModule("/scripts/rawPcm16Processor.js")
        .catch((err) => showToast.error(err));
      const pcmWorker = new AudioWorkletNode(audioContext, rawPCM16WorkerName, {
        outputChannelCount: [1],
      });
      const mediaSource = audioContext.createMediaStreamSource(mediaStream);
      mediaSource.connect(pcmWorker);

      // pcm post on message
      pcmWorker.port.onmessage = (msg) => {
        const pcm16iSamples = msg.data;
        const audioAsBase64String = btoa(
          String.fromCodePoint(...new Uint8Array(pcm16iSamples.buffer))
        );
        if (websocket?.readyState !== websocket?.OPEN) {
          console.error("Websocket is no longer open");
          return;
        }

        websocket?.send(
          JSON.stringify({
            object: "audio_chunk",
            payload: audioAsBase64String,
            stream_id: "stream1",
          })
        );
      };

      const config = {
        object: "listen_config",
        output_objects: ["transcript_item"],
        encoding: "pcm_s16le",
        sample_rate: 16000,
        language: "en-US", //getTranscriptLocale(),
        streams: [{ id: "stream1", speaker_type: "unspecified" }],
      };
      websocket.send(JSON.stringify(config));

      // pcm start
      handleNablaState({
        mediaSource,
        mediaStream,
        audioContext,
        pcmWorker,
        websocket,
      });
      pcmWorker?.port.start();
      showToast.success("Started session", { duration: Infinity });
    } else {
      // startRecording()
      showToast.error(
        "Microphone audio stream is not accessible on this browser"
      );
      console.error(
        "Microphone audio stream is not accessible on this browser"
      );
    }
  };

  const digest = async () => {
    const response = await fetch(
      "https://api.nabla.com/v1/copilot-api/server/digest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          output_objects: ["note"],
          section_style: "auto", //getNoteSectionStyle(),
          note_template: "GENERAL_MEDICINE", // getNoteTemplate(),
          language: "en-US",// getNoteLanguage(),
          patient_context: "",// getPatientContext(),
          transcript_items: Object.values(transcriptData).map((it) => ({
            text: it,
            speaker: "unspecified",
          })),
        }),
      }
    );

    const note = <HTMLDivElement>document.getElementById("note")!;
   //  stopThinking(note, thinkingID);

    if (!response.ok) {
      console.error("Error during note generation:", response.status);
      const errData = await response.json();
      const errText = document.createElement("p");
      errText.classList.add("error");
      errText.innerHTML = errData.message;
      note.appendChild(errText);
      return;
    }

    const data = (await response.json()) as NabalaNotes[];
    // generatedNote = data.note;
    console.log(data);

    // data.note.sections.forEach((section) => {
    // 	const title = document.createElement('h4');
    // 	title.innerHTML = section.title;
    // 	const text = document.createElement('p');
    // 	text.innerHTML = section.text;
    // 	note.appendChild(title);
    // 	note.appendChild(text);
    // });
  };

  const stopAudio = () => {
    try {
      realTimeTranscript.audioContext?.close();
    } catch (e) {
      console.error("Error while closing AudioContext", e);
    }

    try {
      realTimeTranscript.pcmWorker?.port.close();
      realTimeTranscript.pcmWorker?.disconnect();
    } catch (e) {
      console.error("Error while closing PCM worker", e);
    }

    try {
      realTimeTranscript.mediaSource?.mediaStream
        .getTracks()
        .forEach((track) => track.stop());
      realTimeTranscript.mediaSource?.disconnect();
    } catch (e) {
      console.error("Error while closing media stream", e);
    }
  };

  const generateNote = async () => {
    if (Object.keys(transcriptData).length === 0) return;

   //  disableAll();

    stopAudio();
    await endConnection({ object: "end" });

   //  clearNoteContent();
    await digest();

   //  enableAll();
  };

  const endConnection = async (endObject: { object: string }) => {
    if (!realTimeTranscript.websocket || realTimeTranscript.websocket.readyState !== WebSocket.OPEN)
      return;

    realTimeTranscript.websocket.send(JSON.stringify(endObject));

    // Await server closing the WS
    for (let i = 0; i < 50; i++) {
      if (realTimeTranscript.websocket.readyState === WebSocket.OPEN) {
        await sleep(100);
      } else {
        break;
      }
    }
  };

  const insertTranscriptItem = (data: NablaResult) => {
    if (data.object === "transcript_item") {
      const newTranscript = `[${msToTime(data.start_offset_ms)} to ${msToTime(
        data.end_offset_ms
      )}]: ${data.text}`;

      setTranscriptData((prevTranscript) => {
        const newArray = [...prevTranscript];
        newArray[newArray.length - 1] = newTranscript;

        return data.is_final ? [...prevTranscript, ""] : newArray;
      });
      console.log(data)
      //   setTranscriptData((prevTranscript) => {
      //   const newArray = [...prevTranscript];
      // //   newArray[newArray.length - 1] = newTranscript;

      //   return [...newArray, data]
      // });
    } else if (data.object === "note") {
      setNoteData((prev) => [...prev, data.sections]);
      setIsLoading({
        transcript: false,
        note: false,
      });
      toast.remove();
    }
  };

  return {
    isLoading,
    noteSections,
    transcriptData,
    noteData,
    startRecording,
    generateNote,
    mediaRecorder: mediaRecorder
  };
}
