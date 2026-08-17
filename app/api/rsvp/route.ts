import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Where confirmations should land — set this in your .env.local / Netlify env vars
const ORGANIZER_EMAIL = process.env.ORGANIZER_EMAIL || "you@example.com";
const FROM_EMAIL = process.env.FROM_EMAIL || "invitations@yourdomain.com";

export async function POST(req: NextRequest) {
  try {
    const { name, slug, attending, plusOne } = await req.json();

    if (!name || !slug || (attending !== "yes" && attending !== "no")) {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }
    // plusOne is only meaningful when attending — otherwise it must be null/undefined.
    if (plusOne !== null && plusOne !== undefined && plusOne !== "yes" && plusOne !== "no") {
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
    }

    // Created inside the handler (not at module load time) so a missing key
    // never crashes the build — it only fails the specific request, at runtime.
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set");
      return NextResponse.json({ error: "Email is not configured" }, { status: 500 });
    }
    const resend = new Resend(process.env.RESEND_API_KEY);

    const bringingPlusOne = attending === "yes" && plusOne === "yes";

    const subject =
      attending === "yes"
        ? `✅ ${name} confirmed — attending${bringingPlusOne ? " (+1)" : ""}`
        : `❌ ${name} declined the invitation`;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: ORGANIZER_EMAIL,
      subject,
      html: `
        <div style="font-family: sans-serif; font-size: 15px; color: #24303A;">
          <p><strong>${name}</strong> responded to the Medispharm &amp; AWMU invitation.</p>
          <p>Status: <strong>${attending === "yes" ? "Attending" : "Not attending"}</strong></p>
          ${
            attending === "yes"
              ? `<p>Plus one: <strong>${bringingPlusOne ? "Yes" : "No"}</strong></p>`
              : ""
          }
          <p style="color:#888; font-size:12px;">Invite slug: ${slug}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("RSVP email failed:", err);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}
