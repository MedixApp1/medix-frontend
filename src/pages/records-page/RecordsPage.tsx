import { useEffect } from "react";
import EncounterCard from "../../components/encounter/EncounterCard";
import useNewEncounter, {
  EncounterType,
  ResponseType,
} from "../../hooks/useNewEncounter";
import "./style.scss";
import Cookies from "js-cookie";
import showToast from "../../utils/showToast";

interface User {
  _id: string;
  username: string;
  email: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  appointments: EncounterType[];
}

function RecordsPage() {
  const { setAllEncounters, allEncounters } = useNewEncounter();
  console.log(allEncounters)

  useEffect(() => {
    const getAllEncounters = async () => {
      try {
        const token = Cookies.get("doctor-token");
        const resp = await fetch(
          `${import.meta.env.VITE_BASE_URL}/user/appointments`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = (await resp.json()) as ResponseType<User>;
        if (!resp.ok) {
          return showToast.error(result.message);
        }

        setAllEncounters(result.data.appointments);
      } catch (error) {
        if (error instanceof Error) {
          showToast.error(error.message);
        }
        console.log(error);
      }
    };
    getAllEncounters();
  }, []);
  return (
    <div className="encounter__page">
      {allEncounters.map((encounter, index) => (
        <EncounterCard
          title={encounter.note.title}
          key={index}
          {...encounter}
        />
      ))}
    </div>
  );
}
export default RecordsPage;
