import Loader from "../../shared/loader/circle-loader/Loader";
import { useState, useEffect } from "react";
import useNewEncounter, {
  EncounterType,
  ResponseType,
} from "../../../hooks/useNewEncounter";
import Cookies from "js-cookie";
import showToast from "../../../utils/showToast";

function PatientInstructions() {
  const [loading, setLoading] = useState(false);
  const { currentEncounter, setCurrentEncounter } = useNewEncounter();
  useEffect(() => {
    const getEncounterInstructions = async () => {
      try {
        setLoading(true);
        const token = Cookies.get("doctor-token");
        const resp = await fetch(
          `${import.meta.env.VITE_BASE_URL}/appointment/patient-instructions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              appointmentId: currentEncounter?._id,
              country: "Nigeria",
            }),
          }
        );
        const result = (await resp.json()) as ResponseType<EncounterType>;
        setCurrentEncounter({
          patientInstructions: result.data.patientInstructions,
        });
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
    console.log(currentEncounter);
    if (
      currentEncounter?.appointmentId &&
      currentEncounter?.patientInstructions?.followUp.length! <= 0
    ) {
      getEncounterInstructions();
    }
  }, []);
  return (
    <div className="instructions__tab">
      <div>
      {currentEncounter?.patientInstructions?.messageFromDoctor && (
        <div className="note__section">
          <h4 contentEditable className="title">
            Doctor Message
          </h4>
          <div className="note__content">
            <p contentEditable>
              - {currentEncounter?.patientInstructions.messageFromDoctor}
            </p>
          </div>
        </div>
      )}
      {currentEncounter?.patientInstructions?.medication && (
        <div className="note__section">
          <h4 contentEditable className="title">
            Medication
          </h4>
          <div className="note__content">
          { currentEncounter?.patientInstructions.medication.map((item, index)=> <p key={index} contentEditable>
              - {item.action} {item.details}
            </p>) }
          </div>
        </div>
      )}
      {currentEncounter?.patientInstructions?.messageFromDoctor && (
        <div className="note__section">
          <h4 contentEditable className="title">
           Instructions
          </h4>
          <div className="note__content">
          { currentEncounter.patientInstructions.otherInstructions.map((item, index)=> <p key={index} contentEditable>
              - {item.action} {item.details}
            </p>) }
          </div>
        </div>
      )}
      {currentEncounter?.patientInstructions?.lifestyleChanges && (
        <div className="note__section">
          <h4 contentEditable className="title">
           Life Style Changes
          </h4>
          <div className="note__content">
          { currentEncounter.patientInstructions.lifestyleChanges.map((item, index)=> <p key={index} contentEditable>
              - {item.action} {item.details}
            </p>) }
          </div>
        </div>
      )}
      {currentEncounter?.patientInstructions?.followUp && (
        <div className="note__section">
          <h4 contentEditable className="title">
           Instructions
          </h4>
          <div className="note__content">
          { currentEncounter?.patientInstructions.followUp.map((item, index)=> <p key={index} contentEditable>
              - {item.action} {item.details}
            </p>) }
          </div>
        </div>
      )}
      </div>
      {loading && (
        <div className="loading__container">
          <Loader color="#316596" />
        </div>
      )}
    </div>
  );
}
export default PatientInstructions;
