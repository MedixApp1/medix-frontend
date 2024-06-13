import "./style.scss";

function Features() {
	return (
		<section className="features__section" id="features">
			<span className="small">Features</span>
			<h3>Our Amazing Features</h3>
			<p className="sub__text">
				From customizable categories to synchronized accessibility
				across devices, our todo app empowers you to stay organized,
				focused, and in control of your daily agenda.
			</p>
			<div className="features__first">
				<div className="feature">
					<img
						src="/icons/features/category.svg"
						alt="category"
					/>
					<h4>Custom Categories</h4>
					<p>
						Intelligent categorization that organizes tasks based on
						priority and completion status. Ensures a streamlined
						view of your todos for effective management.
					</p>
					<a className="learn__more">
						Learn More{" "}
						<img
							src="/icons/features/arrow_right.svg"
							alt=""
						/>
					</a>
				</div>
				<div className="feature">
					<img
						src="/icons/features/list.svg"
						alt="list"
					/>
					<h4>Due Date Reminders</h4>
					<p>
						{" "}
						Set due dates for your tasks and receive timely
						reminders, helping you stay on top of deadlines and
						prioritize your work effectively.
					</p>
					<a className="learn__more">
						Learn More{" "}
						<img
							src="/icons/features/arrow_right.svg"
							alt=""
						/>
					</a>
				</div>
				<div className="feature">
					<img
						src="/icons/features/sync.svg"
						alt="sync"
					/>
					<h4>Sync Across Devices</h4>
					<p>
						Synchronized data ensures that your todos are updated in
						real-time across all your devices, providing a
						consistent and reliable experience.
					</p>
					<a className="learn__more">
						Learn More{" "}
						<img
							src="/icons/features/arrow_right.svg"
							alt=""
						/>
					</a>
				</div>
				<div className="feature">
					<img
						src="/icons/features/attachment.svg"
						alt="category"
					/>
					<h4>Notes and Attachments</h4>
					<p>
						Attach additional notes, documents, or relevant files to
						tasks. Keep all necessary information in one place for a
						comprehensive overview of each task..
					</p>
					<a className="learn__more">
						Learn More{" "}
						<img
							src="/icons/features/arrow_right.svg"
							alt=""
						/>
					</a>
				</div>
			</div>
			<div className="features__second">
				<div className="feature__collaborate">
					<div className="feature__image__container">
						<img
							src="/icons/features/collaboration.jpg"
							alt=""
						/>
					</div>
					<div className="feature__details">
						<span className="small">Collaborate</span>
						<h3>
							Collaborative Task Management in TaskHub anytime,
							anywhere.
						</h3>
						<p className="sub__text">
							Collaborative capabilities enable users to share
							tasks with team members or collaborators. This
							shared visibility ensures that everyone involved in
							a project has a clear understanding of the tasks at
							hand, fostering transparency and alignment.
						</p>
						<hr />
                  <div className="checks">
                     <div >
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Organize your data</p>
                     </div>
                     <div>
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Always in sync</p>
                     </div>
                     <div>
                        <img
                           src="/icons/features/check.svg"
                           alt=""
                        />
                        <p>Work with any team</p>
                     </div>
                  </div>
					</div>
				</div>
            <div className="feature__collaborate">
            
					<div className="feature__image__container">
						<img
							src="/icons/features/dashboard.jpg"
							alt=""
						/>
					</div>
               <div className="feature__details">
						<span className="small">Collaborate</span>
						<h3>
                  Effortlessly Manage All Your Task with Our Intuitive Dashboard.
						</h3>
						<p className="sub__text">
                  The dashboard provides users with a quick, at-a-glance overview of their entire task landscape. Key information such as upcoming deadlines, task priorities, and overall completion status is presented in a visually digestible format.
						</p>
						<hr />
                  <div className="dashboard__checks">
                     <div>
                        <img src="/icons/features/world.svg" className="world" alt="" />
                        <h4>Powerful Dashboard</h4>
                        <p>Facilitates quick task creation and editing directly from the main view.</p>
                     </div>
                     <div>
                        <img src="/icons/features/setting.svg" className="setting" alt="" />
                        <h4>Customizable Widgets</h4>
                        <p>Customizable dashboard with widgets that align with their specific needs.</p>
                     </div>
                  </div>
					</div>
					
				</div>
            
				
			</div>
		</section>
	);
}
export default Features;