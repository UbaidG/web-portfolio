import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { DesignMeta, DesignProps } from "./types";

export interface LabDesign {
  meta: DesignMeta;
  Component: LazyExoticComponent<ComponentType<DesignProps>>;
}

export const LAB_DESIGNS: LabDesign[] = [
  {
    meta: {
      id: "hand",
      name: "The Dealer's Hand",
      tagline: "A real hand rises from below and deals every certificate off the top of the deck.",
      notes: [
        "Scroll: the thumb pushes each card up and flicks it into the spread",
        "Pointer: the hand tilts toward you; dealt cards repel and can be thrown",
      ],
    },
    Component: lazy(() => import("./designs/Design1_Hand")),
  },
  {
    meta: {
      id: "cabinet",
      name: "The Filing Cabinet",
      tagline: "Each drawer slides out and its certificates fly out across the screen, then file back in.",
      notes: [
        "Scroll: drawers open one by one; click a drawer to jump to it",
        "Pointer: the cabinet turns toward you, drawers peek when you hover their handles",
      ],
    },
    Component: lazy(() => import("./designs/Design2_Cabinet")),
  },
  {
    meta: {
      id: "receipt",
      name: "The Receipt Printer",
      tagline: "A thermal printer prints every credential as a line item, ending in a total.",
      notes: [
        "Scroll: paper feeds out line by line and tears off at the end",
        "Pointer: brush the paper to make it swing; hover a line to lift that certificate",
      ],
    },
    Component: lazy(() => import("./designs/Design3_Receipt")),
  },
  {
    meta: {
      id: "split-flap",
      name: "The Departures Board",
      tagline: "A split-flap board clatters every credential into place, letter by letter.",
      notes: [
        "Scroll: rows cascade in and settle",
        "Pointer: flaps riffle as you sweep past; hover a row for its boarding pass",
      ],
    },
    Component: lazy(() => import("./designs/Design4_SplitFlap")),
  },
  {
    meta: {
      id: "darkroom",
      name: "The Darkroom",
      tagline: "Certificates develop in the tray under a safelight, then hang up to dry.",
      notes: [
        "Scroll: each print develops, then gets pegged onto the lines",
        "Pointer: ripple the developer; pluck the lines to swing the prints",
      ],
    },
    Component: lazy(() => import("./designs/Design5_Darkroom")),
  },
  {
    meta: {
      id: "chaos",
      name: "Chaos to Order",
      tagline: "Certificates drop onto a desk in a heap, then sort themselves into a grid.",
      notes: [
        "Scroll: cards rain down, then snap into categories past the midpoint",
        "Pointer: shove, grab and throw cards around the pile",
      ],
    },
    Component: lazy(() => import("./designs/Design6_Chaos")),
  },
];
