import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [citizen, setCitizen] = useState({ email: "", numero_telephone: "" });
  const [signalements, setSignalements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [editingSignalement, setEditingSignalement] = useState(null);
  const [formData, setFormData] = useState({
    titre: "",
    localisation: "",
    ville: "",
    description: "",
    categorie: "police",
    gravite: "mineur",
    commentaire: "",
  });
  const [profileFormData, setProfileFormData] = useState({
    email: "",
    numero_telephone: "",
  });
  const [passwordFormData, setPasswordFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // API base URLs
  const API_BASE = "http://127.0.0.1:8000";
  const SIGNALEMENT_API = `${API_BASE}/signalements`;
  const CITIZEN_API = `${API_BASE}/citizens`;

  // Mock data for fallback
  const mockSignalements = [
    {
      id: 1,
      citizen_id: 1,
      titre: "Feux de signalisation défaillants",
      localisation: "Avenue Mohammed V",
      ville: "Fès",
      description: "Les feux de signalisation ne fonctionnent plus depuis hier",
      categorie: "infrastructure",
      gravite: "moyen",
      status: "nouveau",
      commentaire: "Urgence de réparation",
      created_at: "2025-06-03T10:30:00.000Z",
      updated_at: "2025-06-03T10:30:00.000Z",
    },
  ];

  // Check authentication and role on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const storedUserId = localStorage.getItem("user_id");

    if (!token || !storedUserId) {
      navigate("/login");
      return;
    }

    if (role !== "citizen") {
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/login");
      }
      return;
    }

    setUserId(parseInt(storedUserId, 10));
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchCitizen();
      fetchSignalements();
    }
  }, [userId]);

  const fetchCitizen = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${CITIZEN_API}/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch citizen data");
      }
      const data = await response.json();
      setCitizen(data);
      setProfileFormData({
        email: data.email,
        numero_telephone: data.numero_telephone,
      });
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
      alert("Erreur lors du chargement des données du profil");
    } finally {
      setLoading(false);
    }
  };

  const fetchSignalements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SIGNALEMENT_API}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to fetch signalements");
      }
      const data = await response.json();
      // Filter signalements to show only those where citizen_id matches userId
      const userSignalements = data.filter((signalement) => signalement.citizen_id === userId);
      setSignalements(userSignalements);
    } catch (error) {
      console.error("Erreur lors du chargement des signalements:", error);
      // Filter mock data to match userId
      setSignalements(mockSignalements.filter((signalement) => signalement.citizen_id === userId));
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${CITIZEN_API}/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: profileFormData.email,
          numero_telephone: profileFormData.numero_telephone,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to update profile");
      }

      const updatedCitizen = await response.json();
      setCitizen(updatedCitizen);
      setShowProfileForm(false);
      alert("Profil mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error);
      alert("Erreur lors de la mise à jour du profil");
    }
  };

  const changePassword = async () => {
    if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
      alert("Les nouveaux mots de passe ne correspondent pas");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${CITIZEN_API}/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          password_hash: passwordFormData.newPassword,
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to change password");
      }

      setPasswordFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
      alert("Mot de passe changé avec succès");
    } catch (error) {
      console.error("Erreur lors du changement de mot de passe:", error);
      alert("Erreur lors du changement de mot de passe");
    }
  };

  const createSignalement = async (data) => {
    try {
      const token = localStorage.getItem("token");
      const signalementData = {
        ...data,
        citizen_id: userId,
        status: "nouveau",
      };

      const response = await fetch(`${SIGNALEMENT_API}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(signalementData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error(`Failed to create signalement: ${await response.text()}`);
      }

      const newSignalement = await response.json();
      setSignalements((prev) => [...prev, newSignalement]);
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la création:", error);
      alert(`Erreur lors de la création du signalement: ${error.message}`);
    }
  };

  const updateSignalement = async (id, data) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SIGNALEMENT_API}/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to update signalement");
      }

      const updatedSignalement = await response.json();
      setSignalements((prev) =>
        prev.map((s) => (s.id === id ? updatedSignalement : s))
      );
      resetForm();
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      alert("Erreur lors de la mise à jour du signalement");
    }
  };

  const deleteSignalement = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce signalement ?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${SIGNALEMENT_API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate("/login");
          return;
        }
        throw new Error("Failed to delete signalement");
      }

      setSignalements((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert("Erreur lors de la suppression du signalement");
    }
  };

  const handleSubmit = () => {
    if (editingSignalement) {
      updateSignalement(editingSignalement.id, formData);
    } else {
      createSignalement(formData);
    }
  };

  const handleEdit = (signalement) => {
    setEditingSignalement(signalement);
    setFormData({
      titre: signalement.titre,
      localisation: signalement.localisation,
      ville: signalement.ville,
      description: signalement.description,
      categorie: signalement.categorie,
      gravite: signalement.gravite,
      commentaire: signalement.commentaire,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      titre: "",
      localisation: "",
      ville: "",
      description: "",
      categorie: "police",
      gravite: "mineur",
      commentaire: "",
    });
    setEditingSignalement(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "nouveau":
        return "bg-blue-100 text-blue-800";
      case "en_cours":
        return "bg-yellow-100 text-yellow-800";
      case "resolu":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGraviteColor = (gravite) => {
    switch (gravite) {
      case "mineur":
        return "bg-green-100 text-green-800";
      case "moyen":
        return "bg-yellow-100 text-yellow-800";
      case "urgent":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!userId) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord du citoyen</h1>
        <p className="text-lg text-gray-600">Bienvenue, utilisateur ID : {userId}</p>
      </div>

      {/* Profile Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Profil</h2>
        <div className="space-y-2 mb-4">
          <p><strong>Email:</strong> {citizen.email}</p>
          <p><strong>Numéro de téléphone:</strong> {citizen.numero_telephone}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowProfileForm(!showProfileForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showProfileForm ? "Annuler" : "Modifier le profil"}
          </button>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {showPasswordForm ? "Annuler" : "Changer le mot de passe"}
          </button>
        </div>

        {/* Edit Profile Form */}
        {showProfileForm && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={profileFormData.email}
                onChange={(e) => setProfileFormData({ ...profileFormData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
              <input
                type="tel"
                value={profileFormData.numero_telephone}
                onChange={(e) => setProfileFormData({ ...profileFormData, numero_telephone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={updateProfile}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => setShowProfileForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Change Password Form */}
        {showPasswordForm && (
          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe actuel</label>
              <input
                type="password"
                value={passwordFormData.currentPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordFormData.newPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confirmer le nouveau mot de passe</label>
              <input
                type="password"
                value={passwordFormData.confirmPassword}
                onChange={(e) => setPasswordFormData({ ...passwordFormData, confirmPassword: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={changePassword}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Changer
              </button>
              <button
                onClick={() => setShowPasswordForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Signalement Form Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {showForm ? "Annuler" : "Nouveau signalement"}
        </button>
      </div>

      {/* Signalement Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingSignalement ? "Modifier le signalement" : "Nouveau signalement"}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Localisation</label>
              <input
                type="text"
                value={formData.localisation}
                onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Catégorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="police">Police</option>
                  <option value="hopital">Hopital</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Gravité</label>
                <select
                  value={formData.gravite}
                  onChange={(e) => setFormData({ ...formData, gravite: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="mineur">Mineur</option>
                  <option value="moyen">Moyen</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Commentaire</label>
              <textarea
                value={formData.commentaire}
                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingSignalement ? "Mettre à jour" : "Créer"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Signalements List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Mes signalements</h2>
        </div>
        {loading ? (
          <div className="p-8 text-center">
            <p>Chargement...</p>
          </div>
        ) : signalements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>Aucun signalement trouvé</p>
          </div>
        ) : (
          <div className="divide-y">
            {signalements.map((signalement) => (
              <div key={signalement.id} className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">{signalement.titre}</h3>
                  <div className="flex gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        signalement.status
                      )}`}
                    >
                      {signalement.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getGraviteColor(
                        signalement.gravite
                      )}`}
                    >
                      {signalement.gravite}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  <p>
                    <strong>Localisation:</strong> {signalement.localisation}, {signalement.ville}
                  </p>
                  <p>
                    <strong>Catégorie:</strong> {signalement.categorie}
                  </p>
                </div>
                <p className="text-gray-700 mb-2">{signalement.description}</p>
                {signalement.commentaire && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Commentaire:</strong> {signalement.commentaire}
                  </p>
                )}
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>Créé le: {new Date(signalement.created_at).toLocaleString()}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(signalement)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => deleteSignalement(signalement.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;