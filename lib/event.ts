export const event = {
  hosts: ["Medispharm", "AWMU"],
  // Short event name — shown big on the first screen.
  title: "OATH",
  // Tagline shown under the event name on the first screen.
  tagline: "One Aim To Accelerate Healing",
  dateLabel: "November 7, 2026",
  // Plain-text address used to build the embedded map + the "Open in Maps" link.
  // Be as specific as you can — exact address works best.
  mapQuery: "Lancaster Eden Bay Hotel, Beirut, Lebanon",
  // ISO string, drives the live countdown on screen 3
  isoDateTime: "2026-11-07T16:00:00+03:00",
  // The vertical timeline on screen 2 (date / location card). Add as many
  // stops as you need — each gets its own row.
  schedule: [
    {
      time: "4:00 PM · Nov 7",
      label: "Welcome Reception",
      venue: "Lancaster Eden Bay Hotel",
      city: "Beirut, Lebanon",
    },
  ],
  // The full program, split across separate screens — one segment per screen.
  // Add/remove segments freely; each becomes its own swipeable slide.
  // Leave "time" empty on an item if it doesn't need one shown, and leave
  // dressCode/note empty ("") to hide those lines on that slide.
  program: [
    {
      eyebrow: "The Program",
      heading: "Celebration",
      date: "Saturday, November 7",
      items: [
        { time: "4:00 PM – 4:30 PM", label: "Welcome Reception" },
        { time: "4:30 PM – 5:00 PM", label: "Certificate Awarding Ceremony" },
        { time: "5:00 PM – 7:00 PM", label: "Seated Lebanese Lunch" },
        { time: "7:00 PM", label: "Cake-Cutting Ceremony" },
      ],
      dressCode: "",
      note: "",
    },
  ],
};
