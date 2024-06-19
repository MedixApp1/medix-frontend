import { useNavigate } from "react-router-dom";
import NoteTemplate from "../../components/dashboard/selectors/NoteTemplate";
import SectionStyle from "../../components/dashboard/selectors/SectionStyle";
import "./style.scss";
import { Fragment } from "react/jsx-runtime";
import { useRef, useState } from "react";
import Cookies from "js-cookie";
import showToast from "../../utils/showToast";
import useRealTimeTranscript from "../../hooks/useRealTimeTranscript";
import useNewEncounter from "../../hooks/useNewEncounter";
import { bytesToMegabytes } from "../../utils/utils";
import Loader from "../../components/shared/loader/circle-loader/Loader";

const exmple = {
  "success": true,
  "data": {
      "transcript": [
          "May I come in doctor?",
          "Yes come in. Take your seat.",
          "Thank you doctor.",
          "What's your name?",
          "I am Simran Parveen",
          "And how old are you?",
          "I am 29",
          "Okay. Now tell me, what are the problems that you're facing?",
          "Since yesterday night I've been having severe stomach ache. I took an antacid last night but the pain was still the same.",
          "Any other symptoms?",
          "Yeah, I also had bouts of vomiting last night and today morning as well.",
          "Do you have a headache?",
          "No",
          "Did you have this kind of stomach ache before?",
          "Yes doctor I had it once before.",
          "How many days ago?",
          "Almost 3 months ago but at that time the pain stopped after I took an antacid",
          "Please lie on that bed. I have to check.",
          "Okay doctor.",
          "Does it hurt here?",
          "Yes doctor it hurts a lot.",
          "Okay you can get up now.",
          "Is it something serious doctor?",
          "I can't say now. I'm writing down some tests. Try to do this by today.",
          "But what about now? I can't even work properly because of the pain.",
          "I understand. I'm giving you an injection for temporary relief.",
          "Injection? Don't you have any medicine?",
          "Why? Are you scared of injections?",
          "It's not like that. I mean it would be better if you could give me some medicine",
          "Nothing will happen. You won't even feel it. Look at that side.",
          "Please doctor be careful.",
          "You can open your eyes now. It's already done.",
          "Oh it's done? Thank you so much I did not feel anything at all.",
          "After receiving the test reports, bring them to me as soon as possible.",
          "There's nothing to fear, right?",
          "Don't be so scared beforehand. Let's see the reports first.",
          "Won't you give me any medicines doctor?",
          "I am prescribing this medicine. It's just for today. Take it after your dinner.",
          "Okay doctor.",
          "Where shall I submit the fees?",
          "Please submit that in the cash counter.",
          "Thank you doctor.",
          "Welcome.",
          "May I come in doctor?",
          "Oh yes, come in please.",
          "Here are the reports of the tests that you gave.",
          "Oh yeah, let me check them.",
          "It's not that serious. Nothing to worry about. It was just food poisoning. I'm writing down some medicines. Please take them for 1 week after dinner.",
          "Oh okay doctor.",
          "And if you face this problem again, come back immediately.",
          "Sure doctor. Thank you.",
          "You're welcome. So, this was the conversation. I hope you liked it. Now is the time for the question. The question is: What was the age of the patient? Make sure to answer this question in the comment box below. I'd eagerly be waiting for your answers. And if you like this conversation, then click on the like button. And if you want more such conversations like this and haven't subscribed my channel yet, then make sure to click on the subscribe button. And share this video with your friends and family. That's it for today. Meet you in the next video with another interesting topic. Thank you. Bye."
      ],
      "note": {
          "sections": []
      },
      "patientInstructions": {
          "medication": [],
          "lifestyleChanges": [],
          "followUp": [],
          "otherInstructions": []
      },
      "_id": "66721a381b6e52a985a86ec2",
      "createdAt": "2024-06-18T23:37:28.157Z",
      "updatedAt": "2024-06-18T23:37:28.157Z",
      "__v": 0
  },
  "message": "Appointment Created Successfully"
}

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



function NewRecord() {
  const { setCurrentEncounter, currentEncounter, resetCurrentEncounter } =
    useNewEncounter();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [loading, setIsLoading] = useState(false);

  const disableElement: React.CSSProperties = {
    opacity: loading ? 0.5 : 1,
    pointerEvents: loading ? "none" : "all",
  };

  const generateSpeech = async () => {
    try {
      setIsLoading(true);
      if (currentFile) {
        showToast.loading("Uploading Audio file");
        const token = Cookies.get("doctor-token");
        const formData = new FormData();
        formData.append("file", currentFile);
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
        console.log(result)
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
          appointmentId: fileUploadResult.data._id,
          
        });
        navigate("/dashboard/encounter-overview");
      }
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      resetCurrentEncounter();

      const file = event.target.files && event.target.files[0];
      setCurrentFile(file);
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
      }
      console.log(error);
    }
  };
  const handleUploadClick = () => {
    fileRef.current?.click();
  };
  return (
    <Fragment>
      <div className="record__modal">
        <p>Create New Record</p>
        <div className="modal__details">
          <img className="upload__icon" src="/icons/record.svg" alt="" />
          <input
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileRef}
            type="file"
          />
          {currentFile ? (
            <Fragment>
              <p>{currentFile.name}</p>
              <span>{bytesToMegabytes(currentFile.size).toFixed(2)}MB</span>
            </Fragment>
          ) : (
            <Fragment>
              {" "}
              <p>Record in realtime or upload audio file</p>
              <span>Audio file must not exceed 50mb</span>
            </Fragment>
          )}
          <div className="btn__container">
            <button style={disableElement} onClick={handleUploadClick}>
              Upload audio
            </button>
            <button
              style={disableElement}
              onClick={() => navigate("/dashboard/recording")}
            >
              Record audio
            </button>
          </div>
        </div>
        <div className="result__settings">
          <NoteTemplate />
          <SectionStyle />

          <button
            disabled={!Boolean(currentFile) || loading}
            onClick={generateSpeech}
          >
            {loading ? <Loader /> : "Generate speech"}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
export default NewRecord;
