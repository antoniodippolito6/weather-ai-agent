<script lang="ts">
  /**
   * +layout.svelte
   * Layout principale dell'applicazione.
   * Gestisce l'importazione degli stili globali e il rendering dei componenti figli.
   */
  
  // Importazione degli stili globali (Tailwind CSS)
  import '../app.css';

  // Props passate dal router di SvelteKit
  // biome-ignore lint/correctness/noUnusedVariables: 'children' è utilizzato nello snippet @render
  const { children } = $props();
</script>

{@render children()}