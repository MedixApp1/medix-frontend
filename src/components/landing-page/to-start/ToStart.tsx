import "./style.scss";
import { Link } from "react-router-dom";

function ToStart() {
   return (
     <div className="to__start">
      <h1>Ready to start creating  precise <br /> medical note generation?</h1>
      <Link to="/register">Sign Up</Link>
     </div>
   )
 }
 export default ToStart