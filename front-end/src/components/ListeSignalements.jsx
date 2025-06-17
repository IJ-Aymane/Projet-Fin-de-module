import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeSignalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchParams, setSearchParams] = useState({
    titre: "",
    ville: "",
    categorie: "",
    status: "",
    gravite: "",
    citizen_id: "",
    description: "",
  });

  const apiBaseUrl = "http://127.0.0.1:8000";
  const apiUrl = `${apiBaseUrl}/signalements/`;
  const apiSearchUrl = `${apiBaseUrl}/signalements/search`;

  // Nettoyer les paramètres vides
  const cleanParams = () => {
    const cleaned = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        // Pour citizen_id, convertir en nombre si possible
        if (key === "citizen_id") {
          const parsed = Number(value);
          if (!isNaN(parsed)) cleaned[key] = parsed;
        } else {
          cleaned[key] = value;
        }
      }
    });
    return cleaned;
  };

  const fetchSignalements = (params) => {
    setLoading(true);
    setError(null);

    axios
      .get(params ? apiSearchUrl : apiUrl, {
        params: params || null,
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        setSignalements(response.data);
        setLoading(false);
      })
      .catch((error) => {
        handleError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSignalements();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      let message = "";
      if (typeof error.response.data === "string") {
        message = error.response.data;
      } else if (error.response.data?.detail) {
        message = error.response.data.detail;
      } else if (error.response.data?.message) {
        message = error.response.data.message;
      } else {
        message = JSON.stringify(error.response.data, null, 2);
      }
      setError(`Erreur ${error.response.status}: ${message}`);
    } else if (error.request) {
      setError(
        "Aucune réponse du serveur. Vérifiez que votre API est en cours d'exécution."
      );
    } else {
      setError(`Erreur: ${error.message}`);
    }
  };

  const GraviteBadge = ({ gravite }) => {
    const badgeClasses = {
      urgent: "bg-red-100 text-red-800 border border-red-200",
      majeur: "bg-orange-100 text-orange-800 border border-orange-200",
      normal: "bg-blue-100 text-blue-800 border border-blue-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          badgeClasses[gravite?.toLowerCase()] || badgeClasses.normal
        }`}
      >
        {gravite}
      </span>
    );
  };

  const SignalementCard = ({ signalement }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 truncate">
              {signalement.titre}
            </h3>
            <GraviteBadge gravite={signalement.gravite} />
          </div>

          <div className="text-sm text-gray-600 mb-4">
            <div className="flex items-center mb-1">
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>
                {signalement.localisation}, {signalement.ville}
              </span>
            </div>
          </div>

          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded px-2 py-1 mr-2">
                {signalement.categorie}
              </span>
              <span className="text-xs text-gray-500">
                {signalement.created_at
                  ? new Date(signalement.created_at).toLocaleDateString("fr-FR")
                  : "N/A"}
              </span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-3 line-clamp-2">
            {signalement.description}
          </p>

          <div className="border-t border-gray-100 pt-2 mt-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>ID: {signalement.id}</span>
              <span>Citoyen: {signalement.citizen_id}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Gérer la saisie dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Soumettre la recherche
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleaned = cleanParams();
    fetchSignalements(cleaned);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Liste des signalements</h3>
        <div className="space-x-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Rechercher / Filtrer
          </button>
          <button
            onClick={() => fetchSignalements()}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition"
          >
            Actualiser
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
            <svg
              className="h-5 w-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p>{error}</p>
              <p className="mt-1">
                Vérifiez que votre API est en cours d'exécution et que CORS est
                correctement configuré.
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="ml-2 text-gray-600">Chargement des données...</span>
        </div>
      ) : signalements.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <svg
            className="h-12 w-12 text-gray-400 mx-auto mb-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600">Aucun signalement disponible pour le moment</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600 mb-4">
            {signalements.length} signalement
            {signalements.length > 1 ? "s" : ""} trouvé
            {signalements.length > 1 ? "s" : ""}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {signalements.map((signalement) => (
              <SignalementCard key={signalement.id} signalement={signalement} />
            ))}
          </div>
        </>
      )}

      {/* Modal de recherche */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Rechercher / Filtrer</h2>

            <form onSubmit={handleSearchSubmit} className="space-y-4">
              {[
                { label: "Titre", name: "titre", type: "text" },
                { label: "Ville", name: "ville", type: "text" },
                { label: "Catégorie", name: "categorie", type: "text" },
                { label: "Statut", name: "status", type: "text" },
                { label: "Gravité", name: "gravite", type: "text" },
                { label: "ID Citoyen", name: "citizen_id", type: "number" },
                { label: "Description", name: "description", type: "text" },
              ].map(({ label, name, type }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-1 font-medium text-gray-700"
                  >
                    {label}
                  </label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    value={searchParams[name]}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Rechercher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeSignalements;
