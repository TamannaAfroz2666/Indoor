import type { ReactNode } from "react";

import { MainNavbar } from "@/components/common/MainNavbar";
import { SiteFooter } from "@/components/common/SiteFooter";

type MainLayoutProps = {
  children: ReactNode;
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-[#eef2ef]">
      <div className="mx-auto min-h-screen w-full max-w-[1920px] bg-white">
        <MainNavbar />

        <main
          className="
            pt-[70px]
            pb-[68px]
            md:pt-0
            md:pb-0
          "
        >
          {children}
        </main>
        <SiteFooter />
      </div>
    </div>
  );
}
