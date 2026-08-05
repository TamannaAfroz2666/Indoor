import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GameDetailsView } from "@/features/game/details/GameDetailsView";
import { games, getGameById } from "@/utils/data/games";

type Props = { params: Promise<{ gameId: string }> };
export function generateStaticParams() {
    return games.map((game) => ({ gameId: game.id }));
}
export async function generateMetadata({ params }: Props):
    Promise<Metadata> {
    const game = getGameById((await params).gameId);
    return { title: game ? `${game.title} | Indoor` : "Game not found" };
}
export default async function GameDetailsPage({ params }: Props) {
    const game = getGameById((await params).gameId); if (!game) notFound();
    return <GameDetailsView game={game} />;
}
