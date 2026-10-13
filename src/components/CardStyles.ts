// Plain (non-client) module so both server and client components can import these
// class strings. They key off the `data-lit` attribute that <CardLiving> sets on its
// root (`group/card`) while hovered, focused within, or previewed on touch.

/** Put on each tech-chip <li>; set style `--i` to the chip index for the ~60ms stagger. */
export const CARD_CHIP_LIT =
  "[&>.chip]:transition-[border-color,color,box-shadow] [&>.chip]:duration-300 " +
  "group-data-[lit=true]/card:[&>.chip]:border-accent/60 group-data-[lit=true]/card:[&>.chip]:text-neon " +
  "group-data-[lit=true]/card:[&>.chip]:shadow-[0_0_10px_rgb(52_210_123/0.22)] " +
  "group-data-[lit=true]/card:[&>.chip]:[transition-delay:calc(var(--i,0)*60ms)]";

/** Image depth: zoom + parallax driven by CSS vars written by <CardLiving>. */
export const CARD_IMAGE_DEPTH =
  "[transform:translate3d(var(--img-x,0px),var(--img-y,0px),0)_scale(var(--img-s,1))] " +
  "group-data-[lit=true]/card:will-change-transform";
