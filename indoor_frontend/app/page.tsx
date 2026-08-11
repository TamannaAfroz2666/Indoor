import { HomeHero, ListVenueCta } from "@/features/home/components";
import { BookVenuesSection } from "@/features/venue/card/BookVenuesSection";
import { DiscoverGamesSection } from "@/features/game/DiscoverGamesSection";
import { OwnerSection } from "@/features/home/components/OwnerSection";
import { SiteFooter } from "@/components/common/SiteFooter";

export default function Home() {
  return (
  <div>
    <HomeHero/>
     <BookVenuesSection />
     <ListVenueCta />
     <DiscoverGamesSection />
     <OwnerSection />
     <SiteFooter />
 </div>
  );
}
