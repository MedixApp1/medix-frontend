import { useNavigate } from 'react-router-dom';
import NoteTemplate from '../../components/dashboard/selectors/NoteTemplate';
import SectionStyle from '../../components/dashboard/selectors/SectionStyle';
import './style.scss';
import { Fragment } from 'react/jsx-runtime';

function NewRecord() {
	const navigate = useNavigate();
	return (
		<Fragment>
			<div className="record__modal">
				<p>Create New Record</p>
				<div className="modal__details">
					<img className="upload__icon" src="/icons/record.svg" alt="" />
					<p>Record in realtime or upload audio file</p>
					<span>Audio file must not exceed 50mb</span>
					<div className="btn__container">
						<button onClick={()=> navigate("/dashboard/recording")}>Upload audio</button>
						<button onClick={()=> navigate("/dashboard/recording")}>Record audio</button>
					</div>
				</div>
				<div className="result__settings">
					<NoteTemplate />
					<SectionStyle />

					<button>Generate speech</button>
				</div>
			</div>
		</Fragment>
	);
}
export default NewRecord;
