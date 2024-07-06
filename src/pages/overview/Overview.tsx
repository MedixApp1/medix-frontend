import useCurrentUser from "../../hooks/useCurrentUser";
import AnalyticsCard from "../../components/analytics-card/AnalyticsCard";
import "./style.scss";
import SessionChart from "../../components/dashboard/chart/SessionChart";
import { useNavigate } from "react-router-dom";


function Overview() {
  const { currentUser } = useCurrentUser();
  const navigate = useNavigate();
  return (
    <div className="dashboard__overview">
      <div className="welcome__info">
        <div>
          <h4>Welcome back, Dr.{currentUser?.username}</h4>
          <p>
          This dashboard summarizes your recent patient consultations, including diagnoses, treatments, and follow-ups, providing a quick overview of your clinical activity.
          </p>
      <button onClick={()=>navigate("/dashboard/recording")} >Record Session <img src="/icons/record-mic.svg" alt="" /></button>
        </div>
        <img  src="/icons/welcome-doctor.svg" alt="" />
      </div>
      <div className="analytics__container">
        <AnalyticsCard
          icon="/icons/analytics/patient.svg"
          color="#c1e4ff"
          count="05"
          title="Patient encounter"
        />
         <AnalyticsCard
          icon="/icons/analytics/live.svg"
          color="#ffcece"
          count="07"
          title="Total Live session"
        />
         <AnalyticsCard
          icon="/icons/analytics/file.svg"
          color="#c8fdcb"
          count="10"
          title="Total File Uploaded"
        />
         <AnalyticsCard
          icon="/icons/analytics/calendar.svg"
          color="#fccfb7"
          count="07"
          title="Total Days"
        />
      </div>
      <SessionChart />
    </div>
  );
}
export default Overview;
