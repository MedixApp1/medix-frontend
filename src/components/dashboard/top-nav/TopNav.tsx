import "./style.scss";
import { useState } from "react";
import Toogle from "../toogle/Toogle";
import useCurrentUser from "../../../hooks/useCurrentUser";

function TopNav() {
  const [loading] = useState(false);
  const [isPresent, setIsPresent] = useState(true);
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
