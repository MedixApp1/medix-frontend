import "./style.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import Toogle from "../toogle/Toogle";

function TopNav() {
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPresent, setIsPresent] = useState(false);
  const handlePresentChange = () => {
    setIsPresent(!isPresent);
  };
  return (
    <nav className="dash__nav">
      <div className="logo__container">
        <img src="/icons/logo.svg" />
        <p>Medix</p>
      </div>
      <h1 className={`links ${!showMenu && "hidden"}`}>Overview</h1>
      <Toogle
        isAttending={isPresent}
        loading={loading}
        handleChange={handlePresentChange}
        id="23"
      />

      <button onClick={() => setShowMenu(!showMenu)} className="menu__btn">
        <img src={`/icons/${showMenu ? "cancel" : "menu"}.svg`} alt="" />
      </button>
    </nav>
  );
}
export default TopNav;
