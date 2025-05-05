import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import AjouterSignalement from './components/Ajouter_signalement.jsx';
import ListeSignalements from './components/ListeSignalements.jsx';
import Login from './pages/login.jsx';
import CreateAccount from './pages/create-account.jsx';
import Dashboard from './pages/dashboard.jsx'; 

function App() {
  const isAuthenticated = !!localStorage.getItem('currentUser');

  return (
    <Router>
      <header style={{ display: 'flex', alignItems: 'center', padding: '10px', background: '#f0f0f0' }}>
        <img src="/logo.png" alt="Logo" style={{ height: '40px', marginRight: '20px' }} />
        <nav style={{ display: 'flex', gap: '10px' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard">
                <button>Tableau de bord</button>
              </Link>
              <Link to="/liste-signalements">
                <button>Liste des signalements</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <button>Connexion</button>
              </Link>
              <Link to="/create-account">
                <button>Créer un compte</button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/dashboard" element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
          } />
          <Route path="/liste-signalements" element={<ListeSignalements />} />
          <Route path="/ajouter-signalement" element={<AjouterSignalement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/" element={
            isAuthenticated ? (
              <Navigate to="/dashboard" />
            ) : (
              <div>
                <p>Test simple sans appel à l'API</p>
                <h1>Voir les signalements</h1>
                <ListeSignalements />
              </div>
            )
          } />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
