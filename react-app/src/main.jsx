import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const animals = ["Perro", "Gato", "Pájaro", "Conejo", "Tortuga"]
console.log(animals[1])

createRoot(document.getElementById('root')).render(<App />)
