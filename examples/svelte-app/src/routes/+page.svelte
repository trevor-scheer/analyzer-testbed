<script lang="ts">
  import type { PageData } from "./$types.js";

  // This fragment query inside a .svelte SFC is what the analyzer extracts.
  // It's intentionally a second query (fragment usage) to show the SFC
  // extraction path independently from the load function's query above.
  const _fragment = /* GraphQL */ `
    fragment PokemonCardFields on Pokemon {
      id
      name
      pokedexNumber
      types
    }
  `;

  let { data }: { data: PageData } = $props();
</script>

<main style="font-family: system-ui, sans-serif; max-width: 900px; margin: 0 auto; padding: 24px">
  <h1>Pokédex</h1>
  <p style="color: #888; font-size: 14px">Powered by SvelteKit + houdini — .svelte SFC extraction</p>
  <div
    style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 16px"
  >
    {#each data.pokemon as p (p.id)}
      <div
        style="border: 1px solid #ccc; border-radius: 8px; padding: 12px; text-align: center"
      >
        <p style="margin: 4px 0; font-weight: bold">
          #{String(p.pokedexNumber).padStart(3, "0")} {p.name}
        </p>
        <p style="margin: 0; font-size: 12px; color: #666">{p.types.join(" / ")}</p>
      </div>
    {/each}
  </div>
</main>
