import { useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import useCurrentUser from "../../../hooks/useCurrentUser";
import "./style.scss";
import showToast from "../../../utils/showToast";
import Cookies from "js-cookie";

function SideBar() {
  const setSideBar = useCurrentUser((state) => state.setSideBar);
  const currentUser = useCurrentUser((state) => state.currentUser);
  // const sideBarState = useCurrentUser((state) => state.sideBar);
  const navigate = useNavigate();

  const {sideBar} = useCurrentUser();


 

  const handleNavLinkClick = () => {
    setSideBar(false);
  };
  console.log(currentUser)

  const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    Cookies.remove("doctor-token");
    showToast.success('Signed Out');
    navigate("/login", { replace: true });
  };
  return (
    <nav className={`side__bar ${!sideBar && "hide__sidebar"}`}>
      <div className="user__info">
        <div className="user__image">
          <img src="/images/no-profile.jpg" alt="" />
          <span className="online__indicator" />
        </div>
        <h2>{currentUser?.username}</h2>
        <p>{currentUser?.email}</p>
      </div>
      <SidebarItem
        link="/dashboard"
        icon="/icons/dashboard.svg"
        title="Overview"
        handleClick={handleNavLinkClick}
      />
      <SidebarItem
        link="/dashboard/new-record"
        icon="/icons/appointments.svg"
        title="New Encounter"
        handleClick={handleNavLinkClick}
      />
      <SidebarItem
        link="/dashboard/records"
        icon="/icons/records.svg"
        title="All Encounters"
        handleClick={handleNavLinkClick}
      />
      <div className="logout__container">
        <SidebarItem
          link="/login"
          icon="/icons/logout.svg"
          title="Sign Out"
          handleClick={handleLogOut}
        />
      </div>
    </nav>
  );
}
export default SideBar;
