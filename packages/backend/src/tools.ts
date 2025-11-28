/**
 * tools.ts
 * Contiene le funzioni di utilità per interagire con API esterne (Open-Meteo).
 */

// Interfaccia per il risultato delle coordinate
interface GeocodingResult {
  latitude: number;
  longitude: number;
  name: string;
  country: string;
}

/**
 * Recupera le coordinate geografiche (latitudine/longitudine) dato il nome di una città.
 * Utilizza l'API di geocoding di Open-Meteo.
 *
 * @param city - Il nome della città da cercare.
 * @returns Un oggetto con le coordinate o null se la città non viene trovata.
 */
export async function getCoordinates(city: string): Promise<GeocodingResult | null> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=it&format=json`;
    const response = await fetch(url);
    
    // biome-ignore lint/suspicious/noExplicitAny: La struttura della risposta API esterna non è tipizzata rigorosamente
    const data = await response.json() as any;

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      latitude: result.latitude,
      longitude: result.longitude,
      name: result.name,
      country: result.country,
    };
  } catch (error) {
    console.error(`Errore durante il geocoding per la città ${city}:`, error);
    return null;
  }
}

/**
 * Recupera le previsioni meteo attuali e giornaliere per le coordinate fornite.
 *
 * @param latitude - Latitudine della località.
 * @param longitude - Longitudine della località.
 * @returns Un oggetto JSON contenente i dati meteorologici grezzi.
 */
export async function getWeather(latitude: number, longitude: number): Promise<object | null> {
  try {
    // Richiediamo meteo corrente, temperature min/max e codici meteo
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,pressure_msl,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    
    const response = await fetch(url);
    
    // biome-ignore lint/suspicious/noExplicitAny: Dati complessi provenienti da API esterna
    const data = await response.json() as any;
    
    return data;
  } catch (error) {
    console.error(`Errore durante il recupero del meteo per lat:${latitude} long:${longitude}:`, error);
    return null;
  }
}