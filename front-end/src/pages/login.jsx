import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);
      params.append("grant_type", "password");

      const response = await axios.post("http://127.0.0.1:8000/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      const { access_token, role, user_id, email: userEmail } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("role", role);
      localStorage.setItem("user_id", user_id);
      localStorage.setItem("email", userEmail);

      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "citizen") {
        navigate("/citizen/dashboard");
      } else {
        setError("Rôle non pris en charge.");
      }
    } catch (err) {
      setError("Email ou mot de passe incorrect.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Connexion</h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Connexion
          </button>
        </form>

        {/* Create Account Link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Vous n'avez pas de compte ?{" "}
          <Link to="/create-account"  className="text-blue-600 hover:underline font-medium">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
