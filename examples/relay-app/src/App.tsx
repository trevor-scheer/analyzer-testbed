import { PokemonList } from "./PokemonList.js";

export default function App() {
  return (
    <main
      style={{ fontFamily: "system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: 24 }}
    >
      <PokemonList />
    </main>
  );
}
