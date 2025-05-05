import React, { useState } from 'react';
import axios from 'axios';

const AjouterSignalement = ({ onSignalementAdded }) => {
  const [newSignalement, setNewSignalement] = useState({
    titre: '',
    localisation: '',
    ville: '',
    description: '',
    categorie: 'police',
    gravite: 'normal',
    citizen_id: 1
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const apiUrl = 'http://127.0.0.1:8000/signalements/';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSignalement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');
    setLoading(true);

    axios.post(apiUrl, newSignalement, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    })
      .then(response => {
        setSuccessMessage('Signalement créé avec succès !');
        setNewSignalement({
          titre: '',
          localisation: '',
          ville: '',
          description: '',
          categorie: 'police',
          gravite: 'normal',
          citizen_id: 1
        });
        setLoading(false);
        
        // Informer le composant parent qu'un nouveau signalement a été ajouté
        if (onSignalementAdded) {
          onSignalementAdded();
        }
      })
      .catch(error => {
        handleError(error);
        setLoading(false);
      });
  };

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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Ajouter un nouveau signalement</h3>

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow-sm">
          <div className="flex items-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p>{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">ID du citoyen *</label>
            <input
              type="number"
              name="citizen_id"
              value={newSignalement.citizen_id}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Titre *</label>
            <input
              type="text"
              name="titre"
              value={newSignalement.titre}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Ville *</label>
            <input
              type="text"
              name="ville"
              value={newSignalement.ville}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Localisation *</label>
            <input
              type="text"
              name="localisation"
              value={newSignalement.localisation}
              onChange={handleInputChange}
              required
              placeholder="Adresse ou coordonnées"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Catégorie *</label>
            <select
              name="categorie"
              value={newSignalement.categorie}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="police">Police</option>
              <option value="hopital">Hôpital</option>
              <option value="admin">Administration</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Gravité *</label>
            <select
              name="gravite"
              value={newSignalement.gravite}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="normal">Normal</option>
              <option value="majeur">Majeur</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">Description *</label>
          <textarea
            name="description"
            value={newSignalement.description}
            onChange={handleInputChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
            ) : 'Envoyer le signalement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AjouterSignalement;