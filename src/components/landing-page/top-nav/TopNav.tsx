import './style.scss';
import { Link } from 'react-router-dom';
import { useState,useEffect, useRef } from 'react';

function TopNav() {
	const [showMenu, setShowMenu] = useState(false);

	const elementRef = useRef<HTMLElement>(null)

	useEffect(() => {
		const handleScroll = () => {
			const element = elementRef.current!;
			const triggerElement = document.getElementById("home");

			if (triggerElement) {
				const triggerElementRect = triggerElement.getBoundingClientRect();
				const triggerElementTop =
					triggerElementRect.bottom + window.scrollY;

				if (window.scrollY >= triggerElementTop) {
					element.classList.add('scrolled');
				} else {
					element.classList.remove('scrolled');
				}
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);
	return (
		<nav ref={elementRef} className={`top__nav ${showMenu? "active": ""}`}>
			<div className="logo__container"> 
				<img src="/icons/logo.svg" />
				<p>Medix</p>
			</div>
			<div className={`links ${!showMenu && 'hidden'}`}>
				<a href="#home">Home</a>
				<a href="#features">Features</a>
				<a href="#reviews">Reviews</a>
			</div>
			<Link to="/login">
				Sign In <img src="/icons/sign-in.svg" alt="sign-in" />
			</Link>
			<button onClick={() => setShowMenu(!showMenu)} className="menu__btn">
				<img src={`/icons/${showMenu? "cancel": "menu"}.svg`} alt="" />
			</button>
		</nav>
	);
}
export default TopNav;
