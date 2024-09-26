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
    <div className="p-4">
      <h1 className="text-2xl font-bold">
          🍔 <span className="text-gray-500">Burger</span><span className="text-amber-500">Queen</span>
      </h1>
      <h2 className="text-3xl font-semibold text-center mt-4">Log in</h2>
      <form onSubmit={handleSubmit} className="flex flex-col mt-6 gap-5 w-1/4 m-auto">
        <label className="flex flex-col self-center w-full">Email:
          <input
            className="p-1 border border-gray-300 rounded-lg"
            data-testid="emailInput"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            name="email"
            required
          />
        </label>
        <label className="flex flex-col self-center w-full">Password:
          <input
            className="p-1 border border-gray-300 rounded-lg"
            data-testid="passwordInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            name="password"
            required
          />
        </label>
        <button className="w-24 self-center bg-rose-500 text-white p-2 border rounded-lg disabled:bg-rose-400" data-testid="submitButton" type="submit">Log in</button>
      </form>
      {error && <p className="text-center mt-3 text-rose-500 font-semibold" data-testid="errorLogin">Incorrect email or password</p>}
    </div>
  );
}

export default Login
