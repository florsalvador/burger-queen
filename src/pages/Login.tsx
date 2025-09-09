import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSession, loginService } from "../services/authService";
import { healthService } from "../services/healthService";
import MessageModal from "../components/MessageModal";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [backendReady, setBackendReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loginService(email, password)
    .then((data) => {
      createSession(data.accessToken, data.user);
      navigate("/");
    })
    .catch((error) => {
      console.error(error);
      if (error.message === "Invalid credentials") {
        setMessageError("Incorrect email or password");
      } else {
        setMessageError("Something went wrong. Please try again.");
      }
    })
    .finally(() => {
      setLoading(false);
    })
  };

  useEffect(() => {
    const checkHealth = async () => { 
      try {
        await healthService();
        setBackendReady(true);
      } catch (error) {
        console.error(error);
        setMessageError("Server is not available right now. Please try again later.");
      }
    }
    checkHealth();
  }, [navigate]);

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
        <button 
          className="w-40 self-center bg-rose-500 text-white p-2 border rounded-lg hover:bg-rose-600 disabled:bg-rose-400" 
          data-testid="submitButton" type="submit" disabled={!backendReady || loading}
        >
          {backendReady ? "Login" : (
            <>
              <svg aria-hidden="true" role="status" className="inline mr-2 w-4 h-4 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#FFC107"></path>
              </svg>
              Getting ready...
            </>
          )}
        </button>
      </form>
      {messageError && 
        <p className="text-center mt-3 text-rose-500 font-semibold" data-testid="errorLogin">
          {messageError}
        </p>}
      <MessageModal isOpen={loading} title="Loading...">
        <div className="flex justify-center items-center space-x-2">
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce" />
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-150" />
          <div className="w-4 h-4 bg-amber-500 rounded-full animate-bounce delay-300" />
        </div>
      </MessageModal>
    </div>
  );
}

export default Login
