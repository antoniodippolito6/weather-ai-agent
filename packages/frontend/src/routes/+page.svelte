<script lang="ts">
  let input = '';
  
  // Struttura dati per lo storico dei messaggi (User e Assistant)
  let messages: { role: 'user' | 'assistant'; content: string }[] = [];

  // biome-ignore lint/correctness/noUnusedVariables: Variabile utilizzata nel blocco #if del template
  let isLoading = false;

  /**
   * Converte la sintassi Markdown di base in HTML.
   * Utilizzato per renderizzare il grassetto (**testo**) nelle risposte dell'AI.
   */
  // biome-ignore lint/correctness/noUnusedVariables: Funzione utilizzata nel blocco @html del template
  function parseMarkdown(text: string) {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }

  /**
   * Gestisce l'invio del form.
   * Invia il messaggio al backend e attende la risposta completa.
   */
  // biome-ignore lint/correctness/noUnusedVariables: Funzione utilizzata come event handler nel form
  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;

    // Aggiorna lo stato locale aggiungendo il messaggio dell'utente
    messages = [...messages, { role: 'user', content: userMessage }];
    input = '';
    isLoading = true;

    try {
      // Chiamata POST all'API del backend
      const response = await fetch('http://127.0.0.1:8787/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messages })
      });

      if (!response.ok) throw new Error('Errore nella risposta del server');

      // Recupera il testo della risposta (senza streaming)
      const fullResponse = await response.text();

      // Aggiorna lo stato locale con la risposta dell'assistente
      messages = [...messages, { role: 'assistant', content: fullResponse }];

    } catch (error) {
      console.error('Errore durante la comunicazione API:', error);
      messages = [
        ...messages,
        { role: 'assistant', content: 'Errore: Impossibile contattare il server.' }
      ];
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="flex flex-col h-screen bg-gray-50 text-gray-800">
  <header class="p-4 bg-white shadow-sm border-b border-gray-200">
    <h1 class="text-xl font-bold text-center text-blue-600">Meteo Bot AI</h1>
  </header>

  <div class="flex-1 overflow-y-auto p-4 space-y-4">
    {#if messages.length === 0}
      <div class="text-center text-gray-400 mt-10">
        <p>Benvenuto. Chiedimi informazioni sul meteo.</p>
      </div>
    {/if}

    {#each messages as message}
      <div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
        <div
          class="max-w-[80%] rounded-2xl px-4 py-2 shadow-sm {message.role ===
          'user'
            ? 'bg-blue-600 text-white rounded-tr-none'
            : 'bg-white border border-gray-200 rounded-tl-none'}"
        >
          <p class="whitespace-pre-wrap">{@html parseMarkdown(message.content)}</p>
        </div>
      </div>
    {/each}

    {#if isLoading}
      <div class="flex justify-start">
        <div class="bg-gray-100 rounded-2xl px-4 py-2 text-gray-500 text-sm animate-pulse">
          Elaborazione in corso...
        </div>
      </div>
    {/if}
  </div>

  <form on:submit={handleSubmit} class="p-4 bg-white border-t border-gray-200">
    <div class="flex gap-2 max-w-3xl mx-auto">
      <input
        bind:value={input}
        placeholder="Scrivi una richiesta..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        class="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition disabled:opacity-50"
      >
        Invia
      </button>
    </div>
  </form>
</div>