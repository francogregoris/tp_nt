import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function NumberGame() {
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [score, setScore] = useState(0)

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Solo permitir números positivos
    if (value === '' || (parseInt(value) >= 0 && parseInt(value) <= 100)) {
      setGuess(value)
    }
  }

  const makeGuess = async () => {
    if (!guess || parseInt(guess) < 0 || parseInt(guess) > 100) {
      setMessage('Por favor, ingresa un número entre 0 y 100')
      return
    }

    try {
      console.log('Enviando intento:', parseInt(guess))
      
      const { data, error } = await supabase.functions.invoke('number-game', {
        body: { guess: parseInt(guess) }
      })

      console.log('Respuesta del servidor:', { data, error })

      if (error) {
        console.error('Error de Supabase:', error)
        setMessage(`Error al procesar tu intento: ${error.message}`)
        return
      }

      if (!data) {
        console.error('No se recibió data del servidor')
        setMessage('No se recibió respuesta del servidor. Por favor, intenta de nuevo.')
        return
      }

      setMessage(data.message)
      if (data.correct) {
        setScore(prev => prev + 1)
        setGuess('') // Limpiar el input después de una respuesta correcta
      }
    } catch (error) {
      console.error('Error completo:', error)
      setMessage(`Error al procesar tu intento: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  return (
    <div className="game-container">
      <h2>Juego de Adivinar el Número</h2>
      <p>Puntuación: {score}</p>
      <p>Ingresa un número entre 0 y 100</p>
      <input
        type="number"
        value={guess}
        onChange={handleGuessChange}
        placeholder="Ingresa un número"
        min="0"
        max="100"
      />
      <button onClick={makeGuess}>Adivinar</button>
      {message && <p className={message.includes('Error') ? 'error-message' : 'success-message'}>{message}</p>}
    </div>
  )
} 