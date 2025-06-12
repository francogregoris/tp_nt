import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import AuthComponent from './components/Auth'
import NumberGame from './components/NumberGame'
import './App.css'

function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className="app-container">
      {!session ? (
        <AuthComponent />
      ) : (
        <div>
          <button onClick={() => supabase.auth.signOut()}>Cerrar Sesión</button>
          <NumberGame />
        </div>
      )}
    </div>
  )
}

export default App
