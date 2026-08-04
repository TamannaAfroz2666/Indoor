export function CircularText() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[118px] top-1/2 hidden h-[250px] w-[250px] -translate-y-1/2 overflow-hidden xl:block"
    >
      <svg
        viewBox="0 0 250 250"
        className="h-full w-full"
      >
        <defs>
          <path
            id="hero-circle-text"
            d="
          M125,125
          m-95,0
          a95,95 0 1,1 190,0
          a95,95 0 1,1 -190,0
        "
          />
        </defs>

        <text
          fill="#2f3c37"
          fontSize="13"
          fontWeight="500"
          letterSpacing="11"
          style={{
            textTransform: "uppercase",
          }}
        >
          <textPath
            href="#hero-circle-text"
            startOffset="73%"
          >
            PLAY • MOVE • CONNECT • REPEAT •
          </textPath>
        </text>
      </svg>
    </div>
  );
}