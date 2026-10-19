/**
 * Where the loosely placed hero photos sit, around the headline. A photo takes the slot of its
 * position in the folder; the last two are only shown from `md` up. `tilt` is a resting angle in
 * degrees, and each slot has its own size and shape so the group reads as hand-placed.
 */
export const heroPhotoSlots = [
  {
    tilt: -6,
    className: "left-[4%] top-[12%] w-[34vw] aspect-[4/5] md:left-[6%] md:top-[16%] md:w-[16vw]",
  },
  {
    tilt: 5,
    className:
      "right-[4%] bottom-[20%] w-[30vw] aspect-square md:right-[7%] md:top-[14%] md:bottom-auto md:w-[13vw]",
  },
  { tilt: 4, className: "hidden md:block left-[14%] bottom-[16%] w-[12vw] aspect-[3/4]" },
  { tilt: -4, className: "hidden md:block right-[12%] bottom-[18%] w-[15vw] aspect-[4/5]" },
] as const;
