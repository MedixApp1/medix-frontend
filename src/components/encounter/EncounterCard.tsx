import "./style.scss";

type EncounterProps = {
  title:string;
  description: string;
}

function EncounterCard(props: EncounterProps) {
  return (
    <div className="encounter__card">
      <div className="image">
      </div>
      <div className="details">
        <h2 className="title">{props.title}</h2>
        <p className="description">
          Recommended to engage in exercises for mental and physical health.
          Advised to avoid alcohol and smoking to prevent diseases like cancer
          and liver problems\n- Suggested to do exercises at least two times a
          day to strengthen muscles and reduce risk of heart diseases
        </p>
        <div className="tags">
          <p>General Medicine</p>
          <p>Sebastian</p>
          <p>Bullet</p>
        </div>
      </div>
      <div className="others">
        <img src="/icons/options.svg" alt="" />
        <div className="time">
          <h4>23:23</h4>
          <span>seconds</span>
        </div>
      </div>
    </div>
  );
}
export default EncounterCard;
