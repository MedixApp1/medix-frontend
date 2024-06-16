import useCurrentUser from "../../hooks/useCurrentUser";
import AnalyticsCard from "../../components/analytics-card/AnalyticsCard";
import "./style.scss";
import SessionChart from "../../components/dashboard/chart/SessionChart";


function Overview() {
  const { currentUser } = useCurrentUser();
  return (
    <div className="dashboard__overview">
      <div className="welcome__info">
        <div>
          <h4>Welcome back, {currentUser?.username}</h4>
          <p>
            This page gives a brief overview of your recent sessions,
            encounters, and interactions with your patients. It provides a
            summary of the consultations, diagnoses, treatment plans, and
            follow-up notes for each patient you've seen recently.
          </p>
        </div>
        <img src="/" alt="" />
      </div>
      <div className="analytics__container">
        <AnalyticsCard
          icon="/icons/analytics/patient.svg"
          color="#a8d9ff"
          count="23,490"
          title="Patient encounter"
        />
         <AnalyticsCard
          icon="/icons/analytics/patient.svg"
          color="#a8d9ff"
          count="23,490"
          title="Patient encounter"
        />
         <AnalyticsCard
          icon="/icons/analytics/patient.svg"
          color="#a8d9ff"
          count="23,490"
          title="Patient encounter"
        />
         <AnalyticsCard
          icon="/icons/analytics/patient.svg"
          color="#a8d9ff"
          count="23,490"
          title="Patient encounter"
        />
      </div>
      <SessionChart />
    </div>
  );
}
export default Overview;
