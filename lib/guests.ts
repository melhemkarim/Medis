import guests from "@/data/guests.json";

export type Guest = {
  name: string;
  slug: string;
};

export function getAllGuests(): Guest[] {
  return guests as Guest[];
}

export function getGuestBySlug(slug: string): Guest | undefined {
  return (guests as Guest[]).find((g) => g.slug === slug);
}
