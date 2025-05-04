import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Signalements = () => {
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Afficher un message pendant le chargement
    console.log('Tentative de récupération des signalements...');
    setLoading(true);
    
    // URL de l'API sans préfixe /api puisque votre route est directement configurée
    const apiUrl = 'http://127.0.0.1:8000/api/signalements/';
    
    axios.get(apiUrl, {
      headers: {
        'Accept': 'application/json'
      }
    })
      .then(response => {
        console.log('Données récupérées:', response.data);
        setSignalements(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur détaillée:', error);
        
        if (error.response) {
          console.error('Statut de la réponse:', error.response.status);
          console.error('Données de la réponse:', error.response.data);
          setError(`Erreur ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
          console.error('Requête sans réponse:', error.request);
          setError('Aucune réponse du serveur. Vérifiez que votre API est en cours d\'exécution.');
        } else {
          console.error('Erreur de configuration:', error.message);
          setError(`Erreur: ${error.message}`);
        }
        
        setLoading(false);
      });
  }, []);

  // Afficher un état de chargement
  if (loading) {
    return (
      <div>
        <h2>Liste des signalements</h2>
        <p>Chargement des données...</p>
      </div>
    );
  }

  // Afficher l'erreur s'il y en a une
  if (error) {
    return (
      <div>
        <h2>Liste des signalements</h2>
        <p style={{ color: 'red' }}>Erreur: {error}</p>
        <p>Vérifiez que votre API est en cours d'exécution et que CORS est correctement configuré.</p>
      </div>
    );
  }

  // Afficher les signalements
  return (
    <div>
      <h2>Liste des signalements</h2>
      {signalements.length === 0 ? (
        <p>Aucun signalement disponible</p>
      ) : (
        <div>
          <p>Nombre de signalements: {signalements.length}</p>
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {signalements.map((signalement) => (
              <li key={signalement.id} className="border p-4 rounded shadow">
                <h3 className="text-xl font-bold">{signalement.titre}</h3>
                <div className="mt-2">
                  <p><strong>Localisation:</strong> {signalement.localisation}, {signalement.ville}</p>
                  <p><strong>Description:</strong> {signalement.description}</p>
                  <p><strong>Commentaire:</strong> {signalement.commentaire || 'Aucun commentaire'}</p>
                  <p><strong>Catégorie:</strong> {signalement.categorie}</p>
                  <p><strong>Gravité:</strong> <span className={
                    signalement.gravite === 'urgent' ? 'text-red-600 font-bold' : 
                    signalement.gravite === 'majeur' ? 'text-orange-500 font-bold' : 
                    'text-blue-500'
                  }>{signalement.gravite}</span></p>
                  <p><strong>Status:</strong> <span className={
                    signalement.status === 'nouveau' ? 'text-green-600' : 
                    signalement.status === 'en_cours' ? 'text-yellow-600' : 
                    'text-gray-600'
                  }>{signalement.status}</span></p>
                  <p><strong>Créé le:</strong> {new Date(signalement.created_at).toLocaleString()}</p>
                  <p><strong>Mis à jour le:</strong> {new Date(signalement.updated_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Signalements;