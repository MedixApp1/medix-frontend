import { useEffect, useState } from "react";
import EncounterCard from "../../components/encounter/EncounterCard";
import useNewEncounter, {
  EncounterType,
  ResponseType,
} from "../../hooks/useNewEncounter";
import "./style.scss";
import Cookies from "js-cookie";
import showToast from "../../utils/showToast";
import Loader from "@/components/shared/loader/circle-loader/Loader";

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
  const [loading, setLoading] = useState(false);
  console.log(allEncounters)

  useEffect(() => {
    const getAllEncounters = async () => {
      try {
        setLoading(true)
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
      }finally {
        setLoading(false)
      }
    };
    if(allEncounters.length === 0) {
      getAllEncounters();

    }
  }, []);
  return (
    <div className="encounter__page">
      {allEncounters.map((encounter, index) => (
        <EncounterCard
          title={encounter.note.title}
          key={index}
          description={encounter.description}
          {...encounter}
        />
      ))}
      {loading && <div className="fixed top-0 left-[20%] h-full w-[80%] flex items-center justify-center"><Loader color="#407BFF" /></div>}
    </div>
  );
}
export default RecordsPage;
