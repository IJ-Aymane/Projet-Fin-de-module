import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const CreateAccount = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password confirmation
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    // Validate password length (basic validation)
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/citizens/", {
        email: email,
        numero_telephone: "0000000",
        password_hash: password
      }, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Account created successfully
      console.log("Account created successfully:", response.data);
      
      // Redirect to login page with success message
      navigate("/login", { 
        state: { 
          message: "Compte créé avec succès ! Vous pouvez maintenant vous connecter." 
        } 
      });

    } catch (err) {
      console.error("Registration error:", err);
      
      if (err.response?.status === 422) {
        // Validation error
        const details = err.response.data.detail;
        if (details && details.length > 0) {
          setError(details[0].msg || "Erreur de validation.");
        } else {
          setError("Données invalides. Veuillez vérifier vos informations.");
        }
      } else if (err.response?.status === 400) {
        setError("Cet email est déjà utilisé.");
      } else {
        setError("Erreur lors de la création du compte. Veuillez réessayer.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Créer un compte</h2>
        <form onSubmit={handleCreateAccount} className="space-y-5">
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
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
            <input
              type="password"
              placeholder="Confirmez votre mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full font-semibold py-2 rounded-lg transition duration-200 ${
              isLoading 
                ? "bg-gray-400 cursor-not-allowed text-gray-700" 
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {isLoading ? "Création en cours..." : "Créer un compte"}
          </button>
        </form>

        {/* Back to Login Link */}
        <p className="text-sm text-center text-gray-600 mt-6">
          Vous avez déjà un compte ?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CreateAccount;