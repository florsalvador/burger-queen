import { useNavigate } from "react-router-dom";
import { clearSession } from "../services/authService";

function Home() {
  const navigate = useNavigate();
  const handleLogout = () => {
    clearSession();
    navigate("/login");
  };

  return (
    <>
      <h1>Home</h1>
      <button data-testid="logoutBtn" onClick={handleLogout}>Logout</button>
    </>
  );
}

export default Home
