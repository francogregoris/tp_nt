// Follow this setup guide to integrate the Deno runtime into your application:
// https://deno.land/manual/getting_started/setup_your_environment

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GameState {
  id: number
  target_number: number
  attempts: number
  last_attempt: string
  user_id?: string
}

// Número fijo para adivinar (entre 1 y 100)
const targetNumber = 42

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guess } = await req.json()
    const numberGuess = Number(guess)

    if (isNaN(numberGuess) || numberGuess < 0 || numberGuess > 100) {
      return new Response(
        JSON.stringify({ 
          message: 'Por favor, ingresa un número entre 0 y 100',
          correct: false
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    const correct = numberGuess === targetNumber
    let message = ''

    if (correct) {
      message = '¡FELICITACIONES! 🎉 ¡Has adivinado el número correcto! ¡Eres un genio! 🌟'
    } else if (numberGuess < targetNumber) {
      message = 'El número es mayor. ¡Sigue intentando! 💪'
    } else {
      message = 'El número es menor. ¡No te rindas! 💪'
    }

    return new Response(
      JSON.stringify({ 
        message, 
        correct
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        message: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
        correct: false
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  }
}) 