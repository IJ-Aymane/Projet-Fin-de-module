import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AjouterSignalement from './components/Ajouter_signalement.jsx';
import ListeSignalements from './components/ListeSignalements.jsx';
import Header from './pages/header.jsx';
// Import react-icons if not already imported in your main file
import { FiSearch, FiUser } from 'react-icons/fi';

function App() {
  const isAuthenticated = !!localStorage.getItem('currentUser');

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/signalements" replace />} />
            <Route 
              path="/ajouter" 
              element={isAuthenticated ? <AjouterSignalement /> : <Navigate to="/signalements" replace />} 
            />
            <Route path="/signalements" element={<ListeSignalements />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;