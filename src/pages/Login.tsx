import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession, loginService } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginService(email, password)
    .then((data) => {
      createSession(data.accessToken, data.user);
      navigate("/");
    })
    .catch((error) => {
      console.error("Incorrect email or password", error);
      setError(true);
    })
  };

  return (
    <>
      <h1>Log in</h1>
      <form onSubmit={handleSubmit}>
        <label>Email:
          <input
            data-testid="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
          />
        </label>
        <label>Password:
          <input
            data-testid="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
          />
        </label>
        <button data-testid="submitButton" type="submit">Log in</button>
      </form>
      {error && <p data-testid="errorLogin">Incorrect email or password</p>}
    </>
  );
}

export default Login
