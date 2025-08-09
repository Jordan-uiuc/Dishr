import "./App.css";
import SwipeDeck from "./components/SwipeDeck";

function App() {
  return (
    <div className="min-h-dvh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 border-b border-white/5 bg-zinc-950/70 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
          <span className="font-semibold">Dishr</span>
          <div className="flex gap-3 text-sm text-zinc-300">
            <button className="hover:text-white">Saved</button>
            <button className="hover:text-white">Filters</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-6">
        <SwipeDeck />
      </main>
    </div>
  );
}

export default App;
