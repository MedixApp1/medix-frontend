import { useEffect, useState } from "react";
import Loader from "../../components/shared/loader/circle-loader/Loader";
import Cookies from "js-cookie";
import useNewEncounter, { EncounterType, ResponseType } from "../../hooks/useNewEncounter";
import showToast from "../../utils/showToast";

interface Section {
  key: string;
  title: string;
  text: string;
  content: string[];
  _id: string;
}

interface Note {
  title: string;
  sections: Section[];
}

interface AppointmentNoteResponse {
  success: boolean;
  data: {
    note: Note;
    _id: string;
    transcript: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  message: string;
}

export type NoteSection = {
  key: string;
  title: string;
  text: string;
  content: string[];
};



function NoteItem() {
  const [loading, setLoading] = useState(false);
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();

  useEffect(() => {
    const getEncounterNote = async () => {
      try {
        setLoading(true);
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
        setCurrentEncounter({ note: result.data.note });
      } catch (error) {
        if (error instanceof Error) {
          console.log(error);
          showToast.error(error.message);
        }
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (currentEncounter?.appointmentId && currentEncounter.note?.sections?.length! <= 0) {
      getEncounterNote();
    }
  }, []);

  return (
    <div className="note__tab">
      {currentEncounter?.note?.sections.map(
        (item) =>
          item.content.length > 0 && (
            <div className="note__section">
              <h4 contentEditable className="title">
                {item.title}
              </h4>
              <div className="note__content">
                {item.content.map((content) => (
                  <p contentEditable>- {content}</p>
                ))}
              </div>
            </div>
          )
      )}
      {loading && (
        <div className="loading__container">
          <Loader color="#316596" />
        </div>
      )}
    </div>
  );
}

export default NoteItem;
