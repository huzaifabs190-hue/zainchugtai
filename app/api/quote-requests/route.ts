import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { quoteRequests } from "../../../db/schema";

const allowedServices = new Set([
  "Auto Insurance", "Business Owners", "Contractors", "Property", "Surety Bonds",
  "Corporate Filing", "Payroll", "Real Estate",
]);

const clean = (value: unknown, limit: number) =>
  typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, limit) : "";

const validEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

async function ensureQuoteTable() {
  const d1 = (env as unknown as { DB: D1Database }).DB;
  await d1.batch([
    d1.prepare(`CREATE TABLE IF NOT EXISTS quote_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      reference TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      service TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'new',
      notification_status TEXT NOT NULL DEFAULT 'pending',
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`),
    d1.prepare("CREATE UNIQUE INDEX IF NOT EXISTS quote_requests_reference_unique ON quote_requests(reference)"),
  ]);
}

async function sendNotifications(input: {
  reference: string; name: string; phone: string; email: string; service: string; message: string;
}) {
  const apiKey = (env as unknown as { RESEND_API_KEY?: string }).RESEND_API_KEY;
  if (!apiKey) return "saved";
  const runtimeEnv = env as unknown as {
    RESEND_FROM_EMAIL?: string;
    QUOTE_NOTIFICATION_EMAIL?: string;
  };
  const from = runtimeEnv.RESEND_FROM_EMAIL || "Insurance & Financial Realty <onboarding@resend.dev>";
  const recipient = runtimeEnv.QUOTE_NOTIFICATION_EMAIL || "insurancefinancialrealty@gmail.com";

  const safe = (value: string) => value.replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[character] ?? character);

  const ownerHtml = `<h2>New website request ${safe(input.reference)}</h2>
    <p><strong>Service:</strong> ${safe(input.service)}</p>
    <p><strong>Name:</strong> ${safe(input.name)}<br><strong>Phone:</strong> ${safe(input.phone)}<br><strong>Email:</strong> ${safe(input.email)}</p>
    <p><strong>Details:</strong><br>${safe(input.message)}</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [recipient],
      reply_to: input.email,
      subject: `New ${input.service} request — ${input.reference}`,
      html: ownerHtml,
    }),
  });

  if (!response.ok) {
    console.error("Resend rejected quote notification", response.status, await response.text());
    return "failed";
  }
  return "sent";
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    if (clean(body.company, 100)) return Response.json({ ok: true }, { status: 202 });

    const name = clean(body.name, 100);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 160).toLowerCase();
    const service = clean(body.service, 80);
    const message = clean(body.message, 2000);

    if (!name || !phone || !validEmail(email) || !allowedServices.has(service) || message.length < 5) {
      return Response.json({ error: "Please check every field and try again." }, { status: 400 });
    }

    const reference = `IFR-${Date.now().toString(36).toUpperCase()}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    await ensureQuoteTable();
    const db = getDb();
    await db.insert(quoteRequests).values({
      reference, name, phone, email, service, message, notificationStatus: "pending",
    });

    let notificationStatus = "saved";
    try {
      notificationStatus = await sendNotifications({ reference, name, phone, email, service, message });
    } catch (notificationError) {
      console.error("Quote notification failed", notificationError);
    }
    await db.update(quoteRequests).set({ notificationStatus }).where(eq(quoteRequests.reference, reference));

    return Response.json({ ok: true, reference, notificationStatus }, { status: 201 });
  } catch (error) {
    console.error("Quote request failed", error);
    return Response.json({ error: "We couldn’t save your request. Please call or text (718) 844-1340." }, { status: 500 });
  }
}
