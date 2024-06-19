import "./style.scss";

function Features() {
	return (
		<section className="features__section" id="features">
			<span className="small">Features</span>
			<h3>Our Amazing Features</h3>
			<p className="sub__text">
				From genration of doctors note to synchronized accessibility
				across devices, our app empowers doctors to stay organized,
				focused, and in control of your daily agenda.
			</p>
			<div className="features__first">
				<div className="feature">
					<img
						src="/icons/features/doctor-note.svg"
						alt="category"
					/>
					<h4>Doctors Note</h4>
					<p>
					Automatically generate draft clinical notes based on the doctor's conversational inputs and the patient's electronic health record data. This can save physicians significant time compared to manually typing out notes.
					</p>
				</div>
				<div className="feature">
					<img
						src="/icons/features/patient.svg"
						alt="list"
					/>
					<h4>Patient Instruction</h4>
					<p>
					It helps ensure patients receive clear guidance on medications, follow-up care, home treatment, warning signs to watch for, and educational information about their condition - all tailored to their specific situation. 
					</p>
				</div>
				<div className="feature">
					<img
						src="/icons/features/nlp.svg"
						alt="sync"
					/>
					<h4>Natural Language Processing</h4>
					<p>
					It utilizes advanced natural language processing (NLP) to understand the doctor's spoken words and extract relevant details to include in the note. This allows for a more natural and conversational interaction.
					</p>
				</div>
			</div>
			<div className="features__second">
				<div className="feature__collaborate">
					<div className="feature__image__container">
						<img
							src="/images/specialty.jpg"
							alt=""
						/>
					</div>
					<div className="feature__details">
						<span className="small">Specialization Customization</span>
						<h3>
						Tailor Medix Copilot for Your Medical Specialty.
						</h3>
						<p className="sub__text">
						Medix offers specialization capabilities that enable healthcare providers to fine-tune the app's note generation and documentation features to their specific medical domain. This customization ensures that the AI assistant aligns with the unique terminology, documentation requirements, and workflows of different clinical specialties.
						</p>
						<hr />
                  <div className="checks">
                     <div >
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Enhance Accurace</p>
                     </div>
                     <div>
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Steamline Workflows</p>
                     </div>
                     <div>
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Stay Compliant</p>
                     </div>
                  </div>
					</div>
				</div>
            <div className="feature__collaborate">
            
					<div className="feature__image__container">
						<img
							src="/images/note-gen.jpg"
							alt=""
						/>
					</div>
               <div className="feature__details">
						<span className="small">Automated Documentation</span>
						<h3>
                  AI-Powered Clinical Note Generation 
						</h3>
						<p className="sub__text">
                  Medix  automatic note generation functionality enables doctors to effortlessly create comprehensive draft notes by simply narrating the patient encounter details. Leveraging AI and voice recognition, the app intelligently captures the doctor's spoken inputs along with relevant data from the electronic health record to compose an initial draft documentation seamlessly.
						</p>
						<hr />
                  <div className="dashboard__checks">
                     <div>
                        <img src="/icons/features/world.svg" className="world" alt="" />
                        <h4>Patient-Centric Documentation</h4>
                        <p> Generated note can be highly contextualized and tailored to each unique patient case.</p>
                     </div>
                     <div>
                        <img src="/icons/features/setting.svg" className="setting" alt="" />
                        <h4>Time-Saving Efficiency</h4>
                        <p>Alleviates the burdensome task of manually typing out detailed notes after every patient visit.</p>
                     </div>
                  </div>
					</div>
					
				</div>
            
				
			</div>
		</section>
	);
}
export default Features;