import './App.css'

let language = "Java"

function Header({name, year}) {
  return (
    <header>
      <h1>{name}, Aprendiendo React</h1>
      <p>El año es {year}</p>
    </header>
  );
}

function App() {
  return (
  <div>
    <Header name="Jeffer" year={new Date().getFullYear()}/>
    <main>
      <h2>Esto es un componente</h2>
    </main>
  </div>
  );
}

export default App
