import './style.scss';

type ToogleProps = {
   id: string;
   isAttending: boolean;
   handleChange: ()=>void;
   loading: boolean;
}

function Toogle({ id, isAttending , handleChange, loading }: ToogleProps) {
	return (
		<div className={`toogle__button ${loading && "opacity"}`}>
			
			<div className="toggle-switch">
				<input
					className="toggle-input"
					id={`toggle-${id}`}
					type="checkbox"
					name={`toggle-${id}`}
					checked={isAttending}
					onChange={handleChange}
					disabled={loading}
				/>
				<label className="toggle-label" htmlFor={`toggle-${id}`}></label>
			</div>
			<p
				className={`text ${
					isAttending
						? 'active'
						: 'not__active'
				}`}
			>
				{isAttending? "Present": "Absent"}
			</p>
		</div>
	);
}
export default Toogle;