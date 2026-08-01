import Link from "next/link";
import { Cormorant_Garamond } from "next/font/google";
const cormorant = Cormorant_Garamond({
    subsets: ["latin"],
    weight: ["700"],
    style: ["italic"],
});
export function Logo() {

    return (
        <Link
            href="/"
            aria-label="Indoor home"
            className="inline-block"
        >
            <div className="whitespace-nowrap text-[24px] leading-[24px] tracking-[-1.3px]">
                <span className="font-extrabold text-[#172033]">
                    I
                    <span
                        className={`${cormorant.className} uppercase text-4xl text-[#172033]`}
                    >
                        N
                    </span></span>
                <span className="font-medium text-[#7a8294]">Door</span>
            </div>

            <p className="mt-[0px] whitespace-nowrap text-[12px] font-normal leading-none text-[#697287] bottom-0.5 relative">
                Book • Request • Confirm
            </p>
        </Link>
    );
}