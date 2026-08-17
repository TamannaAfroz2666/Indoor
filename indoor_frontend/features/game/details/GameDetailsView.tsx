import Link from "next/link";
import { ArrowUpRight, ChevronRight, Clock3, MapPin, Medal, Trophy } from "lucide-react";
import { GameAvatar } from "../GameAvatar";
import { GameCard } from "../GameCard";
import { toVenueCard, venueApi } from "@/lib/venue-api";
import { games, type Game } from "@/utils/data/games";

export async function GameDetailsView({ game }: { game: Game }) {
  const similarGames = games.filter((item) => item.id !== game.id).slice(0, 3);
  const nearbyVenues = await venueApi.getAll().then(({ venues }) => venues.slice(0, 3).map(toVenueCard)).catch(() => []);
  return (
    <div className="min-h-screen bg-[#f0f3f1] px-4 py-6 sm:px-7 lg:px-10 lg:py-7">
      <div className="mx-auto grid max-w-[1470px] gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0 space-y-6">
          <section className="rounded-[24px] bg-white p-4 sm:p-6">
            <div className="rounded-[17px] border border-[#dde3df] p-5 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-[#00af5d]">
                    {game.sport} · {game.format}
                  </p>
                  <h1 className="mt-2 text-2xl font-bold text-[#2c3933] sm:text-[28px]">
                    {game.title}
                  </h1>
                  <p className="mt-2 text-[#72877e]">
                    Hosted by {game.players[0].name}
                  </p>
                </div>
                <GameAvatar player={game.players[0]} className="h-16 w-16 text-base" />
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-[32px_1fr]">
                <Clock3 size={26} className="text-[#46534d]" />
                <div>
                  <p className="text-lg font-bold text-[#2d3934]">
                    {game.date}
                  </p>
                  <p className="mt-2 text-[#303c36]">
                    {game.time}
                  </p>
                </div>
                <MapPin size={27} className="text-[#46534d]" />
                <div>
                  <p className="font-medium text-[#303c36]">
                    {game.venue}
                  </p>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(game.venue)}`} target="_blank" rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-3 rounded-xl border border-[#34413b] px-4 py-3 text-sm font-bold hover:bg-[#f2f6f4]">SHOW IN MAP <ArrowUpRight size={19} /></a>
                </div>
              </div>
            </div>
            <div className="mt-5 border-b border-[#dde3df]">
              <span className="inline-block border-b-2 border-[#34413b] px-1 pb-4 font-medium">Game Instructions</span>
            </div>
            <div className="grid gap-5 border-b border-[#dde3df] py-7 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Trophy className="text-[#d8a91a]" />
                <span>{game.equipment}</span>
              </div>
              <div className="flex items-center gap-3">
                <Medal className="text-[#00af5d]" />
                <span>Beginner to Professional</span>
              </div>
            </div>
            <div className="grid gap-3 py-6 sm:grid-cols-[180px_1fr]">
              <h2 className="text-lg font-bold text-[#29362f]">Personal Message<br />by the host</h2>
              <p className="leading-7 text-[#34413b]">“{game.message}”</p>
            </div>
          </section>
          <section className="rounded-[24px] bg-white p-5 sm:p-6"><div className="flex items-center justify-between"><h2 className="text-xl font-bold text-[#29362f]">Similar Games</h2>
            <Link href="/games" className="flex items-center text-sm font-bold uppercase text-[#00af5d]">See all games <ChevronRight size={20} /></Link>
          </div><div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{similarGames.map((item) => <GameCard key={item.id} game={item} />)}
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-[24px] bg-white p-6">
            <h2 className="text-xl font-bold text-[#34413b]">Players ({game.players.length})</h2>
            <div className="mt-5 space-y-4">{game.players.map((player, index) => <div key={player.name}
              className={`flex items-center gap-4 ${index > 0 ? "border-t border-[#e0e5e2] pt-4" : ""}`}>
              <GameAvatar player={player} className="h-12 w-12 text-xs" />
              <div>
                <p className="font-medium text-[#435049]">{player.name}</p>
                {player.role ? <p className="mt-1 text-sm text-[#789087]">{player.role}</p>
                  : null}
              </div>
            </div>
            )}</div>
          </section>
          <section className="rounded-[24px] bg-white p-6">
            <h2 className="text-xl font-bold text-[#34413b]">Venues nearby</h2>
            <div className="mt-5 space-y-5">
              {nearbyVenues.map((venue) =>
                <Link key={venue.id} href={`/venues/${venue.id}`} target="_blank" className="flex items-center gap-3">
                  <span className="h-11 w-11 shrink-0 rounded-full bg-cover bg-center" style={{ backgroundImage: `url(${venue.image})` }} />
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-[#334039]">{venue.name}</span>
                    <span className="mt-1 block truncate text-sm text-[#71877e]">{venue.address || "Address not available"}</span>
                  </span>
                </Link>
              )}
              {!nearbyVenues.length && <p className="text-sm text-[#71877e]">No nearby venues available.</p>}
            </div>
            <Link href="/venues" target="_blank"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl border border-[#dce3df] 
              py-3 text-sm font-bold text-[#27332d] shadow-[0_4px_0_#d6ddda]">SEE ALL VENUES <ChevronRight size={20} />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}
