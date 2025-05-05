import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ListeSignalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const apiUrl = 'http://127.0.0.1:8000/signalements/';

  const fetchSignalements = () => {
    setLoading(true);
    setError(null);

    axios.get(apiUrl, {
      headers: { Accept: 'application/json' }
    })
      .then(response => {
        setSignalements(response.data);
        setLoading(false);
      })
      .catch(error => {
        handleError(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSignalements();
  }, []);

  const handleError = (error) => {
    if (error.response) {
      const message = error.response.data?.detail || error.response.data?.message || JSON.stringify(error.response.data);
      setError(`Erreur ${error.response.status}: ${message}`);
    } else if (error.request) {
      setError('Aucune réponse du serveur. Vérifiez que votre API est en cours d\'exécution.');
    } else {
      setError(`Erreur: ${error.message}`);
    }
  };

  // Badge de gravité personnalisé
  const GraviteBadge = ({ gravite }) => {
    const badgeClasses = {
      urgent: "bg-red-100 text-red-800 border border-red-200",
      majeur: "bg-orange-100 text-orange-800 border border-orange-200",
      normal: "bg-blue-100 text-blue-800 border border-blue-200"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${badgeClasses[gravite] || badgeClasses.normal}`}>
        {gravite}
      </span>
    );
  };

  // Carte de signalement
  const SignalementCard = ({ signalement }) => {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 truncate">{signalement.titre}</h3>
            <GraviteBadge gravite={signalement.gravite} />
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <div className="flex items-center mb-1">
              <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{signalement.localisation}, {signalement.ville}</span>
            </div>
          </div>
          
          <div className="mb-3">
            <div className="flex items-center mb-1">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded px-2 py-1 mr-2">
                {signalement.categorie}
              </span>
              <span className="text-xs text-gray-500">
                {signalement.created_at ? new Date(signalement.created_at).toLocaleDateString('fr-FR') : 'N/A'}
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

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4 text-gray-800">Liste des signalements</h3>
        <div className="flex justify-center items-center py-10">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="ml-2 text-gray-600">Chargement des données...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Liste des signalements</h3>
        <button 
          onClick={fetchSignalements}
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md flex items-center text-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Actualiser
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
          <div className="flex">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p>{error}</p>
              <p className="mt-1">Vérifiez que votre API est en cours d'exécution et que CORS est correctement configuré.</p>
            </div>
          </div>
        </div>
      )}

      {signalements.length === 0 && !error ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <svg className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-600">Aucun signalement disponible pour le moment</p>
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-600 mb-4">
            {signalements.length} signalement{signalements.length > 1 ? 's' : ''} trouvé{signalements.length > 1 ? 's' : ''}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {signalements.map((signalement) => (
              <SignalementCard key={signalement.id} signalement={signalement} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeSignalements;