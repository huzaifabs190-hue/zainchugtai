const allowedServices = new Set([
  "Auto Insurance",
  "Business Owners",
  "Contractors",
  "Property",
  "Surety Bonds",
  "Corporate Filing",
  "Payroll",
  "Real Estate",
]);

const clean = (value: unknown, limit: number) =>
  typeof value === "string"
    ? value.trim().replace(/\s+/g, " ").slice(0, limit)
    : "";

const validEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const safe = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (clean(body.company, 100)) {
      return Response.json({ ok: true }, { status: 202 });
    }

    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160).toLowerCase();
    const service = clean(body.service, 80);
    const message = clean(body.message, 2000);

    if (
      !name ||
      !phone ||
      !validEmail(email) ||
      !allowedServices.has(service) ||
      message.length < 5
    ) {
      return Response.json(
        { error: "Please check every field and try again." },
        { status: 400 }
      );
    }

    const reference =
      `IFR-${Date.now().toString(36).toUpperCase()}-` +
      crypto.randomUUID().slice(0, 4).toUpperCase();

    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      console.error("RESEND_API_KEY is not configured.");
      return Response.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const from =
      process.env.RESEND_FROM_EMAIL ||
      "Insurance & Financial Realty <onboarding@resend.dev>";

    const recipient =
      process.env.QUOTE_NOTIFICATION_EMAIL ||
      "insurancefinancialrealty@gmail.com";

    const html = `
      <h2>New website request ${safe(reference)}</h2>
      <p><strong>Service:</strong> ${safe(service)}</p>
      <p>
        <strong>Name:</strong> ${safe(name)}<br>
        <strong>Phone:</strong> ${safe(phone)}<br>
        <strong>Email:</strong> ${safe(email)}
      </p>
      <p><strong>Details:</strong><br>${safe(message)}</p>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [recipient],
        reply_to: email,
        subject: `New ${service} request — ${reference}`,
        html,
      }),
    });

    if (!response.ok) {
      console.error(
        "Resend rejected quote notification",
        response.status,
        await response.text()
      );

      return Response.json(
        { error: "We couldn't send your request." },
        { status: 500 }
      );
    }

    return Response.json(
      {
        ok: true,
        reference,
        notificationStatus: "sent",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Quote request failed", error);

    return Response.json(
      {
        error:
          "We couldn't send your request. Please call or text (718) 844-1340.",
      },
      { status: 500 }
    );
  }
}
