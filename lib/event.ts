export const event = {
  hosts: ["Medispharm", "AWMU"],
  // Short event name — shown big on the first screen.
  title: "OATH",
  // Tagline shown under the event name on the first screen.
  tagline: "One Aim To Accelerate Healing",
  dateLabel: "September 5–6, 2026",
  // Plain-text address used to build the embedded map + the "Open in Maps" link.
  // Be as specific as you can — exact address works best.
  mapQuery: "InterContinental Mzaar Lebanon, Mzaar Kfardebian",
  // ISO string, drives the live countdown on screen 3
  isoDateTime: "2026-09-05T09:30:00+03:00",
  // The vertical timeline on screen 2 (date / location card). Add as many
  // stops as you need — each gets its own row.
  schedule: [
    {
      time: "9:30 AM · Sept 5",
      label: "Arrival",
      venue: "InterContinental Mzaar",
      city: "Mzaar, Lebanon",
    },
  ],
  // The full program, split across separate screens — one segment per screen.
  // Add/remove segments freely; each becomes its own swipeable slide.
  // Leave "time" empty on an item if it doesn't need one shown, and leave
  // dressCode/note empty ("") to hide those lines on that slide.
  program: [
    {
      eyebrow: "Day One",
      heading: "Morning",
      date: "Friday, September 5",
      items: [
        { time: "9:30 AM", label: "Arrival" },
        { time: "9:30 – 10:30 AM", label: "Breakfast" },
        { time: "10:30 AM – 2:00 PM", label: "OATH Standalone" },
        { time: "2:00 PM – 4:00 PM", label: "Lunch" },
      ],
      dressCode: "Sport Chic",
      note: "",
    },
    {
      eyebrow: "Day One",
      heading: "Evening",
      date: "Friday, September 5",
      items: [{ time: "4:30 PM – Late", label: "Buggy Road Trip & Abaya Night" }],
      dressCode: "Comfy Wear",
      note: "Please bring a jacket",
    },
    {
      eyebrow: "Day Two",
      heading: "Ride To The Top",
      date: "Saturday, September 6",
      items: [{ time: "10:00 AM", label: "Breakfast" }],
      dressCode: "Comfy Sport Wear",
      note: "",
    },
  ],
};
