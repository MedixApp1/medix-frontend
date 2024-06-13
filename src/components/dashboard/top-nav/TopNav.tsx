import './style.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function TopNav() {
	const [showMenu, setShowMenu] = useState(false);
	return (
		<nav className="top__nav">
			<div className="logo__container"> 
				<img src="/icons/logo.svg" />
				<p>Medix</p>
			</div>
			<h1 className={`links ${!showMenu && 'hidden'}`}>
				Dashbaord
			</h1>
         <div className='action'>
            <img src="/icons/settings.svg" alt="" />
            {/* <button onClick={() => setShowMenu(!showMenu)} className="menu__btn">
               <img src="/images/no-profile.svg" alt="" />
            </button> */}

         </div>
		</nav>
	);
}
export default TopNav;
