import type { Metadata } from "next";
import { GamesListingPage } from "@/features/game/GamesListingPage";

export const metadata: Metadata = { title: "Discover Games | Indoor", description: "Find and join upcoming sports games near you." };
export default function GamesPage() { return <GamesListingPage />; }
