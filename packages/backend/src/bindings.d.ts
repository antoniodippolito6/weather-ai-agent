/**
 * bindings.ts
 * Definisce le interfacce per le variabili d'ambiente e i binding di Cloudflare Workers.
 */

import { Ai } from '@cloudflare/workers-types'

export type Bindings = {
  // Binding per l'accesso ai modelli di Intelligenza Artificiale di Cloudflare (Workers AI)
  AI: Ai;
}