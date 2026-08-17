import { notFound } from "next/navigation";
import { getGuestBySlug, getAllGuests } from "@/lib/guests";
import InviteCard from "@/components/InviteCard";

// Pre-renders all 80 guest pages at build time — fast, and no database needed.
export function generateStaticParams() {
  return getAllGuests().map((g) => ({ slug: g.slug }));
}

export default function InvitePage({ params }: { params: { slug: string } }) {
  const guest = getGuestBySlug(params.slug);
  if (!guest) return notFound();

  return <InviteCard name={guest.name} slug={guest.slug} />;
}
