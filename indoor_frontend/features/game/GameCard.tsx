import Link from "next/link";
import { MapPin, Trophy } from "lucide-react";
import { GameAvatar } from "./GameAvatar";
import type { Game } from "@/utils/data/games";

export function GameCard({ game }: { game: Game }) {
  const remaining = game.capacity - game.players.length;
  const shortDate = game.date.replace("Wednesday, ", "Wed, ").replace("Saturday, ", "Sat, ").replace("Sunday, ", "Sun, ").replace("Monday, ", "Mon, ");
  return (
    <Link href={`/games/${game.id}`} target="_blank" rel="noopener noreferrer" className="group flex min-h-[250px] w-full flex-col rounded-[16px] border border-[#dde3df] bg-white p-5 shadow-[0_8px_18px_rgba(30,45,37,0.13)] transition duration-300 hover:-translate-y-1 hover:border-[#b8d8c7] hover:shadow-[0_12px_24px_rgba(30,45,37,0.18)] sm:w-[320px] sm:shrink-0">
      <p className="text-[14px] font-medium text-[#789087]">{game.format} <span className="text-[#c5ceca]">•</span> {game.level}</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex -space-x-2">{game.players.slice(0, 3).map((player) => <GameAvatar key={player.name} player={player} />)}</div>
        <span className="text-[14px] font-bold text-[#38433e]">{game.players.length}/{game.capacity} Going</span>
        {remaining === 1 ? <span className="ml-auto rounded border border-[#f7c735] bg-[#fffbed] px-1.5 py-1 text-[11px] text-[#6b5420]">Only 1 slot</span> : null}
      </div>
      <p className="mt-2 text-[14px] text-[#71877e]">{game.players[0].name} | {game.karma} Karma</p>
      <p className="mt-4 text-[14px] font-bold text-[#202a25]">{shortDate}</p>
      <p className="mt-1 text-[13px] text-[#202a25]">{game.time.replace(" to ", " - ")}</p>
      <div className="mt-4 flex min-w-0 items-center gap-2 text-[13px] text-[#3d4742]"><MapPin size={17} className="shrink-0" /><span className="truncate">{game.venue}</span><span className="ml-auto shrink-0">~{game.distance.toFixed(2)} Kms</span></div>
      <div className="mt-auto flex items-center gap-2 pt-4"><Trophy size={16} /><span className="flex-1 rounded-lg bg-[#f0f3f1] px-3 py-1 text-center text-[12px]">Beginner - Professional</span>{game.booked ? <span className="rounded bg-[#00af5d] px-2 py-1 text-[12px] font-bold text-white">BOOKED</span> : null}</div>
    </Link>
  );
}
