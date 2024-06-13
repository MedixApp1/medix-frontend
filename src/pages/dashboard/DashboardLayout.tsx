import SideBar from '../../components/dashboard/sidebar/SideBar';
import { Outlet } from 'react-router-dom';
import TopNav from '../../components/dashboard/top-nav/TopNav';
import './style.scss';

function DashboardLayout() {
	return (
		<div className="dashboard__layout">
			<video
				src="/video/wave-loop.mp4"
				poster="/video/wave-loop.jpg"
				autoPlay
				loop
				muted
				playsInline
				className="video__cover"
			></video>
			<TopNav />
			<SideBar />
			<div className="dashboard__outlet">
				<Outlet />
			</div>
		</div>
	);
}
// style="filter: blur(6px) saturate(0%) opacity(0.5); transform: none;"
export default DashboardLayout;
