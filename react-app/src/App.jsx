import { useState, useReducer, useEffect } from 'react'
import './App.css'
import image from './assets/images_test.jpg'

let language = "Java"

function Header({name, year}) {
  return (
    <header>
      <h1>{name}, Aprendiendo React</h1>
      <p>El año es {year}</p>
    </header>
  );
}

const items_list = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
]

const itemsObjects =
  items_list.map((item, i) => ({
    id: i,
    title: item
  }));

function Main({ dishes, openStatus, onStatus }) {
  return (
    <>
      <div>
        <button onClick={() => onStatus(true)}>
          I want to be open
        </button>
        <h2>Welcome to this beautiful app, we are learning {language} and React! Status is {openStatus ? "Open" : "Closed"}</h2>
      </div>
      <main>
        <img 
          src={image}
          height={200} 
          alt="Imagen de ejemplo" 
        />
        <ul>
        {dishes.map((dish, i) => (
          <li key={dish.id} style={{listStyleType: "none"}}>
            {dish.title}
          </li>
        ))}
        </ul>
      </main>
    </>
  );
}

function App() {
  const [status, toggle] = useReducer(
    (state) => !state, 
    true
  )
  useEffect(() => {
    console.log(
      `The status is ${status ? "Open" : "Closed"}.`)
  })
  return (
  <div>
    <h1>The restaurant is {status ? "Open" : "Closed"}</h1>
    <button onClick={toggle}>
      {status ? "Close" : "Open"} restaurant
    </button>
    <Header name="Jeffer" year={new Date().getFullYear()}/>
    <Main 
      dishes={itemsObjects} 
      openStatus={status} 
      onStatus={toggle}
    />
  </div>
  );
}

export default App
