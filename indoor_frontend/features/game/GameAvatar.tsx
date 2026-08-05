import type { GamePlayer } from "@/utils/data/games";

export function GameAvatar({ player, className = "h-9 w-9" }: { player: GamePlayer; className?: string }) {
  return <span title={player.name} className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-[#26352e] ${className}`} style={{ backgroundColor: player.color }}>{player.initials}</span>;
}
