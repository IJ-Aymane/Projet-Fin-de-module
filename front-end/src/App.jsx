import './App.css';
import Signalements from './components/Signalements';

function App() {

  const fun = () => {
    console.log("click");
  };

  return (
    <>
      <button className='bg-blue-300 border rounded px-2' onClick={fun}>
        ok
      </button>
      
      <div>
        <p>Test simple sans appel à l'API</p>
      </div>

      {/* Vérifie si le composant Signalements s'affiche */}
      <Signalements />
    </>
  );
}

export default App;
