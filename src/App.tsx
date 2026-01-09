import { useLayoutEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import confetti from 'canvas-confetti'

function App() {
  const [count, setCount] = useState(0)

  const handleCount = () => setCount(count => count + 1)

  const handleDecrement = () => setCount(count => count - 1)

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min + 2;
  }

  const showConfeti = () => confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 }
  });

  useLayoutEffect(() => {
    localStorage.setItem("prueba", "test")
  }, [])

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={handleDecrement}>
          -
        </button>
        {count}
        <button onClick={handleCount}>
          +
        </button>
        <button onClick={handleCount}>
          +
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <button onClick={showConfeti}>Throw confetti</button>
      <button onClick={showConfeti}>Throw 2 confetti</button>
      <button onClick={showConfeti}>Throw 3 confetti</button>
      <button onClick={showConfeti}>Throw 4 confetti</button>
    </>
  )
}

export default App
