import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { streamText, tool } from 'ai'
import { createWorkersAI } from 'workers-ai-provider'
import { z } from 'zod'
import { getCoordinates, getWeather } from './tools'
import { Bindings } from './bindings'

const app = new Hono<{ Bindings: Bindings }>()

// Configurazione CORS per permettere chiamate dal frontend locale
app.use('/*', cors({
  origin: '*',
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}))

app.post('/api/chat', async (c) => {
  // Parsing del body della richiesta
  const { messages } = await c.req.json()

  // Inizializzazione del provider AI (Workers AI)
  // biome-ignore lint/suspicious/noExplicitAny: Casting necessario per compatibilità con i binding di Cloudflare
  const workersai = createWorkersAI({ binding: c.env.AI as any });
  
  // Data corrente formattata per fornire contesto temporale all'LLM
  const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  /**
   * Definizione degli strumenti (Tools) disponibili per l'AI.
   * Utilizziamo 'any' per bypassare i conflitti di tipizzazione tra Zod e AI SDK in modalità strict.
   */
  // biome-ignore lint/suspicious/noExplicitAny: Bypass dei controlli di tipo complessi per i tools
  const availableTools: any = {
    geocode: tool({
      description: 'Restituisce latitudine e longitudine di una città specificata.',
      parameters: z.object({
        city: z.string().describe('Nome della città (es. Milano, Roma)'),
      }),
      // @ts-ignore: Disabilitazione controllo tipi per compatibilità overload della libreria AI
      execute: async ({ city }: any) => {
        const coords = await getCoordinates(city);
        if (!coords) return "Città non trovata.";
        return JSON.stringify(coords);
      },
    }),
    
    forecast: tool({
      description: 'Restituisce i dati meteorologici basati sulle coordinate fornite.',
      parameters: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
      // @ts-ignore: Disabilitazione controllo tipi per compatibilità overload della libreria AI
      execute: async ({ latitude, longitude }: any) => {
        const weather = await getWeather(latitude, longitude);
        return JSON.stringify(weather);
      },
    }),
  };

  // Esecuzione della chiamata all'LLM con supporto per Function Calling
  const result = streamText({
    model: workersai('@cf/meta/llama-3-8b-instruct'),
    messages: messages,
    system: `Oggi è ${today}. Sei un assistente meteorologico professionale. Rispondi in italiano in modo chiaro e conciso. Utilizza gli strumenti a disposizione per recuperare dati reali. Non inventare informazioni.`,
    tools: availableTools,
  })

  // Restituzione della risposta stream (gestita internamente dalla libreria)
  return result.toTextStreamResponse()
})

export default app