import SideBar from "../../components/dashboard/sidebar/SideBar";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import TopNav from "../../components/dashboard/top-nav/TopNav";
import "./style.scss";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import showToast from "../../utils/showToast";
import { LoginResponse } from "../auth/Login";
import useCurrentUser from "../../hooks/useCurrentUser";

function DashboardLayout() {
  const token = Cookies.get("doctor-token");
  const [isLoading, setIsLoading] = useState(false);
  console.log(token);

  const isAuthenticated = token !== undefined;
  const navigate = useNavigate();
  const { setCurrentUser, currentUser } = useCurrentUser();

  const getCurrentUserInfo = async () => {
    try {
      setIsLoading(true);
      const resp = await fetch(`${import.meta.env.VITE_BASE_URL}/user`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      console.log("I was checked");
      const result = (await resp.json()) as LoginResponse;
      if (!resp.ok) {
        console.log("returned nothing");
        setIsLoading(false);
        navigate("/login");
        return showToast.error(result.message);
      }
      console.log("result", result);
      setCurrentUser(result.data);
      showToast.success("User Successful");
      navigate("/dashboard");
    } catch (error) {
      if (error instanceof Error) {
        showToast.error(error.message);
        console.log(error);
        navigate("/login");
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !currentUser) {
      getCurrentUserInfo();
    }
  }, []);

  if (isLoading) {
    return <h1>Loading</h1>;
  }

  if (isAuthenticated && currentUser) {
    return (
      <div className="dashboard__layout">
        <TopNav />
        <SideBar />
        <div className="dashboard__outlet">
          <Outlet />
        </div>
      </div>
    );
  }
  if (!isAuthenticated && !currentUser) {
    return <Navigate to="/login" />;
  }
}

export default DashboardLayout;
