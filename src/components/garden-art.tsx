import { useId } from "react";
export function GardenArt({
  variant = "hero",
}: {
  variant?: "hero" | "lake" | "trees";
}) {
  const patternId = useId();
  return (
    <svg
      viewBox="0 0 720 660"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`garden-art art-${variant}`}
    >
      <defs>
        <pattern
          id={patternId}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="2" cy="2" r=".6" fill="#163f35" opacity=".07" />
        </pattern>
      </defs>
      <path d="M92 0H720V660H0V128C0 57 40 0 92 0Z" fill="#DCE9DD" />
      <circle cx="530" cy="114" r="53" fill="#F4E9B9" />
      <path
        d="M-30 366C138 181 217 274 329 199C447 120 597 286 751 169V660H-30Z"
        fill="#B9D0B4"
      />
      <path
        d="M-35 480C51 305 246 349 320 306C442 236 508 439 750 275V660H-35Z"
        fill="#91B8A0"
      />
      <path
        d="M285 660C196 555 313 486 364 449C456 382 468 330 428 287"
        stroke="#F9F8E4"
        strokeWidth="46"
      />
      <path
        d="M414 406C455 364 576 361 632 419C684 472 563 510 508 496C449 481 369 455 414 406Z"
        fill="#85B9C4"
      />
      <path
        d="M470 423C497 410 553 418 579 423M448 445C493 453 558 454 597 445M495 473H546"
        stroke="#DBECEA"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g transform="translate(445 189)">
        <path d="M-13 22L45-6L100 22V30H-13Z" fill="#496F5D" />
        <path d="M0 28H85V133H0Z" fill="#F1E7C9" />
        <path d="M-4 52H89M-4 103H89" stroke="#B9A67D" strokeWidth="5" />
        <path d="M32 133V103C32 86 53 86 53 103V133" fill="#356653" />
        <path d="M17 76V58H29V76M58 76V58H70V76" fill="#668D7B" />
        <path d="M34 22V-53H55V22" fill="#F1E7C9" />
        <path d="M30-53H59L44-70Z" fill="#496F5D" />
        <circle
          cx="44"
          cy="-32"
          r="8"
          fill="#FBFCF8"
          stroke="#496F5D"
          strokeWidth="2"
        />
        <path d="M44-38V-32L48-30" stroke="#496F5D" strokeWidth="1.5" />
      </g>
      <g stroke="#496F5D" strokeWidth="7">
        <path d="M139 374V153M113 238L138 267L175 215M139 193L107 179M573 346V258M547 296L574 318L599 282" />
      </g>
      <g fill="#497C5D">
        <ellipse
          cx="104"
          cy="166"
          rx="42"
          ry="60"
          transform="rotate(-28 104 166)"
        />
        <ellipse
          cx="157"
          cy="143"
          rx="44"
          ry="69"
          transform="rotate(19 157 143)"
        />
        <ellipse
          cx="185"
          cy="209"
          rx="49"
          ry="44"
          transform="rotate(-30 185 209)"
        />
        <ellipse cx="106" cy="236" rx="45" ry="38" />
        <ellipse cx="563" cy="248" rx="34" ry="54" />
        <ellipse cx="600" cy="280" rx="33" ry="35" />
      </g>
      <g fill="#224F40">
        <path d="M-24 640V295C113 294 104 473 18 476C120 408 163 513 95 565C199 490 243 593 178 660Z" />
        <path d="M720 660V318C604 361 613 442 682 442C578 423 568 530 645 526C541 522 518 611 574 660Z" />
      </g>
      <g stroke="#7CA18A" strokeWidth="2">
        <path d="M14 610L9 347M13 541L73 511M13 461L53 386M677 611L700 379M686 508L642 468M680 560L609 572" />
      </g>
      <g
        transform={variant === "hero" ? "translate(0 -100)" : undefined}
        className={variant === "hero" ? "max-[720px]:-translate-y-[180px]" : undefined}
      >
        <g fill="#E4B8CE">
          <ellipse
            cx="223"
            cy="482"
            rx="18"
            ry="28"
            transform="rotate(-33 223 482)"
          />
          <ellipse
            cx="244"
            cy="476"
            rx="15"
            ry="30"
            transform="rotate(10 244 476)"
          />
          <ellipse
            cx="265"
            cy="484"
            rx="17"
            ry="28"
            transform="rotate(36 265 484)"
          />
        </g>
        <path d="M245 507L252 570" stroke="#356653" strokeWidth="4" />
      </g>
      <path d="M0 0H720V660H0Z" fill={`url(#${patternId})`} />
    </svg>
  );
}
