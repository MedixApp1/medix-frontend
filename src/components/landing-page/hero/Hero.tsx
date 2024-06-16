import { useNavigate } from "react-router-dom";
import "./style.scss";

function Hero() {
  const navigate = useNavigate();

  return (
    <section id="home" className="hero__section">
      <img className="hero__img" src="/images/hero.jpg" alt="" />
      <div className="hero__content">
         <div className="hero__description">
            <h1>Empowering Doctors with Artificial Intelligence</h1>
            <p>Combining AI capabilities with medical knowledge for top-quality care. Leverage the power of artificial intelligence while retaining human expertise and oversight for optimal patient outcomes.</p>
               <button onClick={()=>navigate("/register")}>Get Started <img src="/icons/arrow-right.svg" alt="" /></button>
         </div>
         <div>

         </div>
      </div>
    </section>
  )
}
export default Hero