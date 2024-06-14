import './App.scss';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LandingPage from './pages/landing-page/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import Overview from './pages/overview/Overview';
import NewRecord from './pages/new-record/NewRecord';
import RecordsPage from './pages/records-page/RecordsPage';
import { Fragment } from 'react/jsx-runtime';
import { Toaster } from 'react-hot-toast';

const router = createBrowserRouter([
	{
		path: '/',
		element: <LandingPage />,
		children: [
			{
				path: '/login',
				element: <Login />,
			},
			{
				path: '/register',
				element: <Register />,
			},
		],
	},
	{
		path: "/dashboard",
		element: <DashboardLayout />,
		children: [
			{
				element: <Overview />,
				index: true
			},
			{
				path: "/dashboard/new-record",
				element: <NewRecord />
			},
			{
				path: "/dashboard/records",
				element: <RecordsPage />
			}
		]
	}
]);

function App() {
	return (
		<Fragment>
			<Toaster />
			<RouterProvider router={router} />
		</Fragment>
	)
	;
}

export default App;
