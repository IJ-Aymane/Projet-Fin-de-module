import React, { useState } from 'react';
import AjouterSignalement from './AjouterSignalement';
import ListeSignalements from './ListeSignalements';

const Signalements = () => {
  const [refreshKey, setRefreshKey] = useState(0);


  const handleSignalementAdded = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestion des signalements</h2>
        <p className="text-gray-600">
          Utilisez ce tableau de bord pour signaler des incidents et consulter la liste des signalements existants.
        </p>
      </div>

      {/* Onglets */}
      <div className="mb-6">
        <nav className="flex border-b border-gray-200">
          <button className="py-2 px-4 border-b-2 border-blue-500 font-medium text-sm text-blue-600">
            Tous les signalements
          </button>
          <button className="py-2 px-4 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300">
            Mes signalements
          </button>
        </nav>
      </div>

      {/* Formulaire d'ajout de signalement */}
      <AjouterSignalement onSignalementAdded={handleSignalementAdded} />

      {/* Liste des signalements */}
      <ListeSignalements key={refreshKey} />
    </div>
  );
};

export default Signalements;