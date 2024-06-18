import { useEffect, useState } from "react";
import Loader from "../../components/shared/loader/circle-loader/Loader";

export type NoteSection = {
  key: string;
  title: string;
  text: string;
  content: string[];
};

type GeneratedNoteProps = {
  note: NoteSection[] | undefined;
};

function NoteItem(props: GeneratedNoteProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="note__tab">
      {props.note?.map((item) => (
        <div className="note__section">
          <h4 className="title">{item.title}</h4>
          <div className="note__content">
            {item.content.map((content) => (
              <p>- {content}</p>
            ))}
          </div>
        </div>
      ))}
      {!props.note && (
        <div className="tab__loader">
          <Loader />
        </div>
      )}
    </div>
  );
}

export default NoteItem;
