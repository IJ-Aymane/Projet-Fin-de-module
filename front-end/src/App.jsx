import './App.css'
import Users from './components/Users'

function App() {

  const fun = ()=>{
    console.log("click")
  }

  return (
    <>
      <h1 class="text-3xl font-bold underline text-red-300">
        Hello world!
      </h1>     
      <button className='bg-blue-300 border rounded px-2 ' onClick={fun}>ok</button>  
      <Users />
    </>
  )
}

export default App
