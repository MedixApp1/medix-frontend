import useNewEncounter from "../../hooks/useNewEncounter";

function TranscriptItems() {
  const { currentEncounter } = useNewEncounter();
  console.log(currentEncounter)
  return (
    <div>
      {currentEncounter?.transcript?.map((item, index) => (
        <div key={index} className="transcript__item">
          {/* <span className="time">{msToTime(item["start_offset_ms"])}</span> */}
          <p className="text">{item}</p>
        </div>
      ))}
    </div>
  );
}

export default TranscriptItems;
