import "./style.scss";
import { useNavigate } from "react-router-dom";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import useNewEncounter, { EncounterType} from "@/hooks/useNewEncounter";

type OptionProps = {
	handleNextPage: ()=>void;
}


const EncounterOptions = (props: OptionProps) => {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<img className="cursor-pointer" src="/icons/options.svg" alt="" />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="bg-white shadow-xl  text-sm"
			>
				<DropdownMenuItem onClick={props.handleNextPage} className="flex px-3 py-2 gap-1 cursor-pointer hover:bg-slate-100">
					<img className="block" src="/icons/eye-opened.svg" alt="" />{" "}
					<p className="text-[.75rem] text-blue-600 ">View Encounter</p>
				</DropdownMenuItem>
				<DropdownMenuItem className="flex px-3 py-2 gap-1 cursor-pointer hover:bg-slate-100">
					<img
						className="block invert-[.7]"
						src="/icons/delete.svg"
						alt=""
					/>{" "}
					<p className="text-[.75rem] text-red-600 ">Delete Encounter</p>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

function EncounterCard(props: EncounterType ) {
	const navigate = useNavigate();
	const { setCurrentEncounter } = useNewEncounter();



	const moveToNextPage = () => {
		setCurrentEncounter({...props})
		navigate("/dashboard/encounter-overview");
	};
	return (
		<div className="encounter__card">
			<div className="image"></div>
			<div className="details">
				<h2
					onClick={moveToNextPage}
					className="cursor-pointer title hover:underline"
				>
					{props.title}
				</h2>
				<p className="description">
					Recommended to engage in exercises for mental and physical
					health. Advised to avoid alcohol and smoking to prevent diseases
					like cancer and liver problems\n- Suggested to do exercises at
					least two times a day to strengthen muscles and reduce risk of
					heart diseases
				</p>
				<div className="tags">
					<p>General Medicine</p>
					<p>Celestine</p>
					<p>Auto</p>
				</div>
			</div>
			<div className="others">
				<EncounterOptions handleNextPage={moveToNextPage} />
				<div className="time">
					<h4>23:23</h4>
					<span>seconds</span>
				</div>
			</div>
		</div>
	);
}
export default EncounterCard;
