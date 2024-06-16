import { NavLink, useNavigate } from "react-router-dom";
import SidebarItem from "./SidebarItem";
import useCurrentUser from "../../../hooks/useCurrentUser";
import "./style.scss";
import Toogle from "../toogle/Toogle";
import { useState } from "react";

function SideBar() {
  const setSideBar = useCurrentUser((state) => state.setSideBar);
  const currentUser = useCurrentUser((state) => state.currentUser);
  const sideBarState = useCurrentUser((state) => state.sideBar);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const handlePresentChange = () => {
    setIsPresent(!isPresent);
  };

  const handleNavLinkClick = () => {
    setSideBar(false);
  };

  const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // showToast.success('Signed Out');
    navigate("/login", { replace: true });
  };
  return (
    <nav className="side__bar">
      <div className="user__info">
        <div className="user__image">
          <img src="/images/no-profile.jpg" alt="" />
          <span className="online__indicator" />
        </div>
        <h2>{currentUser?.username}</h2>
        <p>{currentUser?.email}</p>
      </div>
      <Toogle
        isAttending={isPresent}
        loading={loading}
        handleChange={handlePresentChange}
        id="28"
      />
      <SidebarItem
        link="/dashboard/"
        icon="/icons/dashboard.svg"
        title="Overview"
        handleClick={handleNavLinkClick}
      />
      <SidebarItem
        link="/dashboard/new-record"
        icon="/icons/appointments.svg"
        title="New Record"
        handleClick={handleNavLinkClick}
      />
      <SidebarItem
        link="/dashboard/records"
        icon="/icons/records.svg"
        title="Records"
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
