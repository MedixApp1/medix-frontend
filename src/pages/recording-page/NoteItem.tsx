import { useEffect } from "react";
import Loader from "../../components/shared/loader/circle-loader/Loader";
import useNewEncounter from "../../hooks/useNewEncounter";


// interface Section {
//   key: string;
//   title: string;
//   text: string;
//   content: string[];
//   _id: string;
// }

// interface Note {
//   title: string;
//   sections: Section[];
// }

// interface AppointmentNoteResponse {
//   success: boolean;
//   data: {
//     note: Note;
//     _id: string;
//     transcript: string[];
//     createdAt: string;
//     updatedAt: string;
//     __v: number;
//   };
//   message: string;
// }

export type NoteSection = {
  key: string;
  title: string;
  text: string;
  content: string[];
};

function NoteItem({
  generateNote,
  isLoading
}: {
  generateNote: () => Promise<void>;
  isLoading: boolean
}) {
  const { currentEncounter } = useNewEncounter();

  useEffect(() => {
    if (
      currentEncounter?.appointmentId &&
      currentEncounter.note?.sections?.length! <= 0
    ) {
      generateNote();
    }
  }, []);

  return (
    <div className="note__tab" id="note-item" >
       <h1 style={{ borderTop: "10px solid #407BFF", marginBottom: "2rem", fontSize: "1.5rem", fontWeight: "600" }}>Medix</h1>
      {currentEncounter?.note?.sections.map(
        (item) =>
          item.content.length > 0 && (
            <div className="note__section"style={{marginBottom: "1.5rem"}} >
              <h4 contentEditable className="title">
                {item.title}
              </h4>
              <div className="note__content">
                {item.content.map((content) => (
                  <p contentEditable> {content}</p>
                ))}
              </div>
            </div>
          )
      )}
      {isLoading && (
        <div className="loading__container">
          <Loader color="#316596" />
        </div>
      )}
    </div>
  );
}

export default NoteItem;
