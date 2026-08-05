import { GameCard } from "./GameCard";
import { games } from "@/utils/data/games";

export function GamesListingPage() {
  return (
    <div className="min-h-screen bg-[#f1f4f2] px-4 py-8 sm:px-7 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8"><p className="text-sm font-bold uppercase tracking-[0.16em] text-[#00af5d]">Play together</p><h1 className="mt-2 text-3xl font-bold text-[#27332d] sm:text-4xl">Discover Games</h1><p className="mt-3 max-w-2xl text-[#718078]">Find an upcoming game near you, meet players, and join a session that matches your level.</p></div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">{games.map((game) => <GameCard key={game.id} game={game} />)}</div>
      </div>
    </div>
  );
}
