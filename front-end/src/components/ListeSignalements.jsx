import React, { useEffect, useState } from "react";
import axios from "axios";

const ListeSignalements = ({ searchTitre }) => {
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

  const cleanParams = () => {
    const cleaned = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) {
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

  const fetchSignalements = (params = null) => {
    setLoading(true);
    setError(null);

    axios
      .get(params ? apiSearchUrl : apiUrl, {
        params: params || null,
        headers: { Accept: "application/json" },
      })
      .then((response) => {
        setSignalements(response.data);
      })
      .catch((error) => {
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "Erreur inconnue.";
        setError(`Erreur ${error.response?.status || ""}: ${message}`);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (searchTitre) {
      fetchSignalements({ titre: searchTitre });
    } else {
      fetchSignalements();
    }
  }, [searchTitre]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const cleaned = cleanParams();
    fetchSignalements(cleaned);
    setIsModalOpen(false);
  };

  const handleResetFilters = () => {
    setSearchParams({
      titre: "",
      ville: "",
      categorie: "",
      status: "",
      gravite: "",
      citizen_id: "",
      description: "",
    });
    fetchSignalements();
  };

  const GraviteBadge = ({ gravite }) => {
    const graviteLevel = gravite?.toLowerCase();
    const badgeClasses = {
      urgent: "bg-red-500 text-white",
      majeur: "bg-orange-500 text-white",
      normal: "bg-blue-500 text-white",
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${badgeClasses[graviteLevel] || "bg-gray-200 text-gray-700"}`}>
        {gravite}
      </span>
    );
  };

  const StatusIndicator = ({ status }) => {
    const statusLevel = status?.toLowerCase();
    const indicatorClasses = {
      nouveau: "bg-blue-100 text-blue-800",
      "en cours": "bg-yellow-100 text-yellow-800",
      résolu: "bg-green-100 text-green-800",
      fermé: "bg-gray-100 text-gray-800",
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${indicatorClasses[statusLevel] || "bg-gray-100 text-gray-700"}`}>
        {status}
      </span>
    );
  };

  const SignalementCard = ({ signalement }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800 mb-1">{signalement.titre}</h3>
          <div className="flex space-x-2">
            <GraviteBadge gravite={signalement.gravite} />
            <StatusIndicator status={signalement.status} />
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{signalement.ville} - {signalement.localisation}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{signalement.description}</p>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span className="bg-gray-100 px-2 py-1 rounded">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            {signalement.categorie}
          </span>
          <span className="bg-gray-100 px-2 py-1 rounded">
            <svg className="w-3 h-3 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            ID: {signalement.citizen_id}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="mb-4 sm:mb-0">
            <h2 className="text-2xl font-bold text-gray-800">Signalements</h2>
            <p className="text-gray-600">Liste des signalements enregistrés</p>
          </div>
          <div className="flex space-x-3">
            <button 
              onClick={() => setIsModalOpen(true)} 
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Filtrer
            </button>
            <button 
              onClick={() => fetchSignalements()} 
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualiser
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : signalements.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">Aucun signalement trouvé</h3>
            <p className="mt-1 text-gray-500">Essayez de modifier vos critères de recherche.</p>
            <div className="mt-6">
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Réinitialiser les filtres
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {signalements.map((s) => (
              <SignalementCard key={s.id} signalement={s} />
            ))}
          </div>
        )}
      </div>

      {/* Search Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Filtrer les signalements</h3>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleSearchSubmit} className="space-y-4">
                {["titre", "ville", "categorie", "status", "gravite", "citizen_id", "description"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</label>
                    <input
                      name={field}
                      type={field === "citizen_id" ? "number" : "text"}
                      value={searchParams[field]}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Filtrer par ${field.replace('_', ' ')}`}
                    />
                  </div>
                ))}
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button 
                    type="button" 
                    onClick={handleResetFilters}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Réinitialiser
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Appliquer les filtres
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeSignalements;