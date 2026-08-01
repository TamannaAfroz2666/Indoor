export function CircularText() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[96px] top-1/2 hidden h-[210px] w-[210px] -translate-y-1/2 xl:block"
    >
      <svg
        viewBox="0 0 220 220"
        className="h-full w-full overflow-visible"
      >
        <defs>
          <path
            id="circular-text-path"
            d="M 110,110
               m -82,0
               a 82,82 0 1,1 164,0
               a 82,82 0 1,1 -164,0"
          />
        </defs>

        <text
          fill="#36423d"
          fontSize="12"
          fontWeight="600"
          letterSpacing="8"
        >
          <textPath
            href="#circular-text-path"
            startOffset="10%"
          >
            PLAY • MOVE • CONNECT • REPEAT •
          </textPath>
        </text>
      </svg>
    </div>
  );
}