import "./style.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import Toogle from "../toogle/Toogle";
import useCurrentUser from "../../../hooks/useCurrentUser";

function TopNav() {
  const [loading, setLoading] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const handlePresentChange = () => {
    setIsPresent(!isPresent);
  };
  const { setSideBar , sideBar} = useCurrentUser();
  return (
    <nav className="dash__nav">
      <div className="logo__container">
        <img src="/icons/logo.svg" />
        <p>Medix</p>
      </div>
      <h1>Overview</h1>
      <Toogle
        isAttending={isPresent}
        loading={loading}
        handleChange={handlePresentChange}
        id="23"
      />

      <button onClick={() => setSideBar(!sideBar)} className="menu__btn">
        <img src={`/icons/${sideBar ? "cancel" : "menu"}.svg`} alt="" />
      </button>
    </nav>
  );
}
export default TopNav;
