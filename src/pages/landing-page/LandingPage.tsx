import "./style.scss"
import Features from "../../components/landing-page/features/Features"
import Footer from "../../components/landing-page/footer/Footer"
import Hero from "../../components/landing-page/hero/Hero"
import Reviews from "../../components/landing-page/reviews/Reviews"
import ToStart from "../../components/landing-page/to-start/ToStart"
import TopNav from "../../components/landing-page/top-nav/TopNav";
import { Outlet } from "react-router-dom";

function LandingPage() {
  return (
    <div className="landing__page">
      <TopNav />
      <Hero />
      <Features />
      <Reviews />
      <ToStart />
      <Footer />
      <Outlet />
    </div>
  )
}
export default LandingPage