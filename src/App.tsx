import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import confetti from 'canvas-confetti'

function App() {
  const [count, setCount] = useState(0)

  const handleCount = () => setCount(count => count + 1)

  const handleDecrement = () => setCount(count => count - 1)

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  }

  const showConfeti = () => confetti({
    angle: randomInRange(55, 125),
    spread: randomInRange(50, 70),
    particleCount: randomInRange(50, 100),
    origin: { y: 0.6 }
  });

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
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>

      </div>
      <button onClick={showConfeti}>Show conffeti</button>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
