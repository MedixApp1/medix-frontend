import "./style.scss";

type AnalyticCardProps = {
  icon: string;
  color: string;
  count: string;
  title: string;
};

function AnalyticsCard(props: AnalyticCardProps) {
  return (
    <div className="analytics__card">
      <span style={{backgroundColor: props.color}}>
        <img src={props.icon} alt={props.title} />
      </span>
      <div>
        <p>{props.title}</p>
        <h4>{props.count}</h4>
      </div>
    </div>
  );
}

export default AnalyticsCard;
