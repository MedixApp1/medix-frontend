import { msToTime } from "../../utils/msToTime";

type TranscriptItem = {
  id: string;
  text: string;
  speaker: string;
  start_offset_ms: number;
  end_offset_ms: number;
  is_final: boolean;
  object: string;
};

function TranscriptItems({
  transcriptItems,
}: {
  transcriptItems: TranscriptItem[];
}) {
  return (
    <div>
      {transcriptItems.map((item) => (
        <div className="transcript__item">
          <span className="time">{msToTime(item["start_offset_ms"])}</span>
          <p className="text">{item["text"]}</p>
        </div>
      ))}
    </div>
  );
}

export default TranscriptItems;
