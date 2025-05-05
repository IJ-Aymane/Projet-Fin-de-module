import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AjouterSignalement from '../components/Ajouter_signalement'; // Chemin corrigé

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSignalementForm, setShowSignalementForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('currentUser');
    
    if (!userData) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (!parsedUser?.email) {
        throw new Error('Données utilisateur invalides');
      }
      setUser(parsedUser);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message);
      localStorage.removeItem('currentUser');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const toggleSignalementForm = () => {
    setShowSignalementForm(!showSignalementForm);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 max-w-md">
          <p className="font-bold">Erreur</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/login')}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retour à la connexion
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barre de navigation */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Tableau de bord</h1>
          <div className="flex space-x-4">
            <button
              onClick={toggleSignalementForm}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-150"
            >
              {showSignalementForm ? 'Masquer le formulaire' : 'Ajouter un signalement'}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-150"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {showSignalementForm && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Nouveau signalement</h2>
            <AjouterSignalement />
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Profil utilisateur</h2>
          
          {user ? (
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="text-sm font-medium text-gray-500">Téléphone</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {user.numero_telephone || 'Non renseigné'}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Membre depuis</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(user.created_at).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Aucune donnée utilisateur disponible</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;