# Juego de Adivinar Número con Supabase Edge Functions

Este proyecto es un juego simple donde debes adivinar un número entre 0 y 100. Utiliza React para el frontend y Supabase Edge Functions para la lógica del juego.

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm (viene con Node.js)
- Una cuenta en [Supabase](https://supabase.com)

## Pasos para Ejecutar el Proyecto

### 1. Clonar el Repositorio

```bash
git clone https://github.com/francogregoris/tp_nt.git
cd tp_nt
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Supabase

1. Ve a [Supabase](https://supabase.com) y crea una cuenta si no tienes una
2. Crea un nuevo proyecto
3. Una vez creado el proyecto, ve a Project Settings > API
4. Copia la URL y la anon key
5. Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:
```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
```

### 4. Configurar la Edge Function

1. En el dashboard de Supabase, ve a "Edge Functions"
2. Haz clic en "Create a new function"
3. Nombra la función como `number-game`
4. Copia y pega el siguiente código en el editor:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { guess } = await req.json()
    const numberGuess = Number(guess)
    const targetNumber = 42

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
```

5. Haz clic en "Deploy"

### 5. Ejecutar el Proyecto

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:5173`

## Cómo Jugar

1. Abre la aplicación en tu navegador
2. Ingresa un número entre 0 y 100
3. El juego te indicará si el número es mayor o menor
4. ¡Sigue intentando hasta adivinar el número correcto!

## Estructura del Proyecto

```
tp_nt/
├── src/
│   ├── components/
│   │   ├── Auth.tsx
│   │   └── NumberGame.tsx
│   ├── lib/
│   │   └── supabase.ts
│   └── App.tsx
├── supabase/
│   └── functions/
│       └── number-game/
│           └── index.ts
└── package.json
```

## Tecnologías Utilizadas

- React
- TypeScript
- Vite
- Supabase
- Edge Functions

## Solución de Problemas

Si encuentras algún error:

1. Verifica que las variables de entorno estén correctamente configuradas
2. Asegúrate de que la Edge Function esté desplegada correctamente
3. Revisa la consola del navegador para ver mensajes de error
4. Verifica que estés usando las versiones correctas de Node.js y npm

## Contribuir

Si quieres contribuir al proyecto:

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request
